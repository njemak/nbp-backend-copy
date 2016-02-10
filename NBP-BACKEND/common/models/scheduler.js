module.exports = function(Scheduler) {

	Scheduler.pushContent = function(cb) {
		var ServiceSubscribed = Scheduler.app.models.ServiceSubscribed
		var Services = Scheduler.app.models.Services
		var Revenue = Scheduler.app.models.Revenue
		var Report = Scheduler.app.models.Report
		var Admin = Scheduler.app.models.Admin
			ServiceSubscribed.find({where: {
			status : "ON",
		}, fields: 
		            [
                'service_id',
                'id'
            		]
          }, function (err, instanceSubscribe) {
          	var ServiceNow = instanceSubscribe
          	var serviceSize = ServiceNow.length
          	Array.prototype.getUnique = function(){
			   var u = {}, a = [];
			   for(var i = 0, l = this.length; i < l; ++i){
			      if(u.hasOwnProperty(this[i])) {
			         continue;
			      }
			      a.push(this[i]);
			      u[this[i]] = 1;
			   }
			   return a;
			}
			var service_id_array_unique = ServiceNow.getUnique()

			for (var i = 0;i<service_id_array_unique.length;i++){
			Services.findById(service_id_array_unique[i].service_id, {fields: 
            [
            	'id',
            	'index_push',
            	'index_add',
            	'MSISDN',
            	'price',
            	'cp_admin',
            	'keyword'
            	
            ]
          	}, function (err, instanceService) {
          		console.log(instanceService)

          		var Content = Scheduler.app.models.Content

          		Content.findOne({where: {
          		service_id : instanceService.id,
				push_status : "false",
				index : instanceService.index_push
			}, fields: 
			            [
	                'content',
	                'date_push',
	                'id'
	            		]
	          }, function (err, instanceContent) {
	        	  
	          
	        	if (instanceContent == null){
	        		console.log("gak ada content")
	        		cb(null,"No content")
	        	}else{
	        		
	        	
	        	
	          	console.log(instanceContent)
	          	var dateNow = new Date()
	          	// console.log (datepush)
	          	// console.log(dateNow)
	          	console.log("status push service " + instanceService.id + " : " + dateNow > instanceContent.date_push)

			          var client = require('twilio')('AC25a82de2a3b0ee052e292dbff2841b30', '52837a72c99a968930b2c61295ce5d90');
			          for (var j = 0;j<instanceService.MSISDN.length;j++){
			          	//Use this convenient shorthand to send an SMS:
			          	console.log("masuk ngirim sms")
							client.sendSms({
							    to: instanceService.MSISDN[j],
							    from:'+447481342719',
							    body:instanceContent.content
							}, function(error, message) {
							    if (!error) {
							        console.log('Success! The SID for this SMS message is:');
							        console.log(message.sid);
							        console.log('Message sent on:');
							        console.log(message.dateCreated);
							    } else {
							        console.log('Oops! There was an error.');
							        console.log(error)
							    }
							});
							var dateNow = new Date().getTime()
							var revenuenow = {
								'price':instanceService.price,
								'service_subscription_id':instanceSubscribe.id,
								'date':dateNow,
								'service_id':instanceService.id,
								'cp_admin':instanceService.cp_admin,
								'MSISDN':instanceService.MSISDN[j]
							}
							console.log("Revenue post: " + revenuenow)

							Revenue.create(revenuenow, function(err,instance){
								console.log("Revenue created: ")
								console.log(instance)
			  				});
			          }
			    var index_pushnow = (instanceService.index_push+1)
			    var difference = (instanceService.index_add - index_pushnow)
			    if (index_pushnow == instanceService.index_add){
			    	console.log("masuk last interval")
          			var reportnow = {
          				'type': 'lastinterval',
          				'status': 'notsolved',
          				'service_id': instanceService.id,
          				'date': dateNow,
          				'cp_admin': instanceService.cp_admin
          			}
          			Report.create(reportnow, function(err,instance){
          				console.log("Report created: ")
          				console.log(instance)
		          	});
          			
		          	Admin.findById(instanceService.cp_admin, {fields: 
		            [
	            	'phone',
	            	'email'
	            ]
	          	}, function (err, instanceAdmin) {
	          		var phone = instanceAdmin.phone
	          		var email = instanceAdmin.email
	          		
	          		var client = require('twilio')('AC25a82de2a3b0ee052e292dbff2841b30', '52837a72c99a968930b2c61295ce5d90');
			          for (var j = 0;j<instanceService.MSISDN.length;j++){
			          	//Use this convenient shorthand to send an SMS:
			          	console.log("masuk ngirim sms")
							client.sendSms({
							    to: phone,
							    from:'+447481342719',
							    body:"Content service " + instanceService.keyword + " anda telah habis, mohon untuk diisi"
							}, function(error, message) {
							    if (!error) {
							        console.log('Success! The SID for this SMS message is:');
							        console.log(message.sid);
							        console.log('Message sent on:');
							        console.log(message.dateCreated);
							    } else {
							        console.log('Oops! There was an error.');
							        console.log(error)
							    }
							});
	          		}
			          
							    })
							    
	          	
          			
		          	
          		}else if (difference == 1) {
          			console.log("masuk notify")
          			var dateNow = new Date().getTime()
          			//notify
          			var reportnow = {

          				'type': 'notify',
          				'status': 'notsolved',
          				'service_id': instanceService.id,
          				'date': dateNow,
          				'cp_admin': instanceService.cp_admin
          			}
          			Report.create(reportnow, function(err,instance){
          				console.log("Report created: ")
          				console.log(instance)
		          	});
          			
		          	var pushnow = (instanceService.index_push+1)
					Services.updateAll({id:instanceService.id},{index_push:pushnow}, function(err, instance){
						console.log("Service updated: ")
						console.log(instance)
        			});
					
        			
		          	Admin.findById(instanceService.cp_admin, {fields: 
		            [
	            	'phone',
	            	'email'
	            ]
	          	}, function (err, instanceAdmin) {
	          		var phone = instanceAdmin.phone
	          		var email = instanceAdmin.email
	          		
	          		var client = require('twilio')('AC25a82de2a3b0ee052e292dbff2841b30', '52837a72c99a968930b2c61295ce5d90');
			          for (var j = 0;j<instanceService.MSISDN.length;j++){
			          	//Use this convenient shorthand to send an SMS:
			          	console.log("masuk ngirim sms notify")
							client.sendSms({
							    to: phone,
							    from:'+447481342719',
							    body:"Content service " + instanceService.keyword + " anda tinggal satu konten, mohon untuk diisi"
							}, function(error, message) {
							    if (!error) {
							        console.log('Success! The SID for this SMS message is:');
							        console.log(message.sid);
							        console.log('Message sent on:');
							        console.log(message.dateCreated);
							    } else {
							        console.log('Oops! There was an error.');
							        console.log(error)
							    }
							});
	          		}
							    })
          		}else{
          			
          			console.log("Masuk else")
          			var pushnow = (instanceService.index_push+1)
					Services.updateAll({id:instanceService.id},{index_push:pushnow}, function(err, instance){
						console.log("Service updated: ")
						console.log(instance)
        			});
          		}

          		Content.updateAll({id:instanceContent.id},{push_status:"true"}, function(err, instance){
						console.log("Content updated: ")
						console.log(instance)
        		});
          		

	          	

	          	cb(null, "Success")
	        		
	        	
	        	}
	        	

	          })

        		})

			}


          	
          })
	
	} 

	Scheduler.remoteMethod (
	    'pushContent',
	    {
	      http: {path: '/pushContent', verb: 'get'},
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

};
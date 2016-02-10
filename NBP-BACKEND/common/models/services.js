module.exports = function(Services) {
	
	Services.observe('before save', function updateTimestamp(context, next) {

		var time = (new Date).getTime();
		// console.log(context.instance)
		// check wether using instance or data
		if (context.instance === undefined) {
			console.log('id: ' + context.where.id)
			Services.findById(context.where.id,{fields: ['id']}, function (err, instance) {
				// console.log(body);
		    	// console.log('bodynow: ' + bodynow.rows[0]);
		    	// check if already created or not
		    	if(instance === null) {
		    		context.data.created_at = time;
		    		context.data.updated_at = time;
				    console.log('create new --> cp');
				    // console.log('created_at: ' + context.data.created_at);
				    // console.log('updated_at: ' + context.data.updated_at);
		    	} else {
		    		context.data.updated_at = time;
				    console.log('update existing --> cp');
				    // console.log('updated_at: ' + context.data.updated_at);
		    	}
				next();
			});
		} else {
			console.log('id: ' + context.instance.id)
			Services.findById(context.instance.id,{fields: ['id']}, function (err, instance) {  
		    	// console.log('bodynow: ' + bodynow.rows[0]);
		    	// check if already created or not
		    	console.log(instance);
		    	if(instance === null) {
		    		context.instance.created_at = time;
		    		context.instance.updated_at = time;
				    console.log('create new --> cp');
				    // console.log('created_at: ' + context.instance.created_at);
				    // console.log('updated_at: ' + context.instance.updated_at);
		    	} else {
		    		context.instance.updated_at = time;
				    console.log('update existing --> cp');
				    // console.log('updated_at: ' + context.instance.updated_at);
		    	}
				next();
			});
		}
		});

	





Services.addContentSub = function(id, content,  cb) {
		Services.findById(id,{fields: ['id','services','index_add','hitlimit','hitlimittime','hitlimittimetype','nexthit']}, function (err, instance) {  

		if (instance.services == "Subscription")	{



		//To change next hit in Service	
		var limithit = instance.hitlimit
		var dayhitlimit = instance.hitlimittime
		var dayhitlimittype = instance.hitlimittimetype


        var limit = dayhitlimit



		if (dayhitlimittype == "Day"){
			console.log("Masuk day")
			limit = limit*24*60
		}else if (dayhitlimittype == "Minutes"){
			limit = limit
		}else if (dayhitlimittype == "Hours"){
			limit = limit*60
		}else if (dayhitlimittype == "Month"){
			limit = limit*30*24*60
		}

		var next_hit = limit/limithit
        var newdate = new Date(instance.nexthit)
        console.log(newdate)
        newdate.setMinutes(newdate.getMinutes() + next_hit);
        console.log(newdate)
        var datefinished = new Date(newdate).getTime()

		var contentNow = {
				"service_id": id,
				"content":content,
				"date_created": (new Date).getTime(),
				"index":instance.index_add,
				"push_status": "false",
				"date_push": instance.nexthit
		}
		//console.log(contentNow)
		var Content = Services.app.models.Content

		Content.create(contentNow, function(err,instance){
			console.log(instance);
	  	});

	  	var indexnow = (instance.index_add+1)
	  	console.log(indexnow)
        Services.updateAll({id:id},{index_add:indexnow, nexthit:datefinished}, function(err, instance){
        		  console.log(instance);
        });
        cb(null,"Success")
	}else{
		cb(null,"This is content on demand services")
	}
		});

}
	Services.remoteMethod (
	    'addContentSub',
	    {
	      http: {path: '/addContentSub', verb: 'post'},
	      accepts: [
	                {arg: 'id', type: 'string', required: true, http: { source: 'query' } },
	                {arg: 'content', type: 'string', required: true, http: { source: 'query' } }
	      ],
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);








	Services.createService = function(data, cb) {
		//console.log(data)
		if (data.services == "Subscription"){
			var limithit = data.hitlimit
		var dayhitlimit = data.hitlimittime
		var dayhitlimittype = data.hitlimittimetype


        var limit = dayhitlimit

		if (dayhitlimittype == "Day"){
			console.log("Masuk day")
			limit = limit*24*60
		}else if (dayhitlimittype == "Minutes"){
			limit = limit
		}else if (dayhitlimittype == "Hours"){
			limit = limit*60
		}else if (dayhitlimittype == "Month"){
			limit = limit*30*24*60
		}


		var next_hit = limit/limithit
		var datenow = (new Date).getTime()
        var newdate = new Date(datenow)
        console.log(newdate)
        newdate.setMinutes(newdate.getMinutes() + next_hit);
        console.log(newdate)
        var datefinished = new Date(newdate).getTime()

        data.nexthit = datefinished

        
		Services.create(data, function(err,instance){
			cb(null,instance)
	  	});
		}else{
			Services.create(data, function(err,instance){
			cb(null,instance)
	  	});
		}
		

}
	Services.remoteMethod (
	    'createService',
	    {
	      http: {path: '/createService', verb: 'post'},
	      accepts :  {
		arg : 'data',
		type : 'object',
		http:{source:'body'}
	 },
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);












	Services.addContentCOD = function(id, content, cb) {
		//Initialize a REST client in a single line:
		
		Services.findById(id,{fields: ['id','services']}, function (err, instance) {  

		if(instance.services == "ContentOnDemand"){


		var datenow =  (new Date).getTime()

		Services.updateAll({id:id},{cod_content:content,cod_content_date:datenow}, function(err, instance){
        		  console.log(instance);
        });
				
			   cb(null,"Succes")
		}else{
			cb(null,"This is subscribtion services")
		}	
			});
		}
		
	Services.remoteMethod (
	    'addContentCOD',
	    {
	      http: {path: '/addContentCOD', verb: 'post'},
	      accepts: [
	                {arg: 'id', type: 'string', required: true, http: { source: 'query' } },
	                {arg: 'content', type: 'string', required: true, http: { source: 'query' } }
	      ],
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);



Services.getContentCOD = function(service_id, cb) {

	Services.findById(service_id,{fields: ['cod_content']}, function (err, instance) { 
          		if (instance === undefined){
          		cb(null,"Maaf, service yang anda request tidak terdaftar di database kami")
          		}else{

          		cb(null,instance.cod_content);
          		}	
		})

		

		}
		
	Services.remoteMethod (
	    'getContentCOD',
	    {
	      http: {path: '/getContentCOD', verb: 'get'},
	      accepts: 
	      {arg: 'service_id', type: 'string', required: true, http: { source: 'query' } },
	      
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);







	Services.getRequest = function(MSISDN, keyword,type, servicesS, cb) {
		var RequestSubscribe = Services.app.models.RequestSubscribe
		Services.find({where: {keyword:keyword,services: servicesS}, fields: 
            [
                'id',
                'hitlimit',
                'price',
                'sub_period_day',
                'sub_based',
                'sub_period_hit',
            ]
          }, function (err, instance) {
			var ServicesNow = instance[0]
          		if (ServicesNow === undefined){
          		cb(null,"Maaf, service yang anda request tidak terdaftar di database kami")
          		}else{
          			var reply
          			var contentNow = {
          				"MSISDN":MSISDN,
          				"status":"Pending",
          				"date_request":(new Date).getTime(),
          				"service_id":ServicesNow.id,
          				"type":type
          			}
          			console.log(contentNow)
          			RequestSubscribe.create(contentNow, function(err,instance){
						console.log(instance);
				  	});

          			if (type == "REG"){
          			if (ServicesNow.sub_based == "Hit"){

          			reply = "Anda akan berlanganan Subscription Hit " + keyword + " sebanyak " + ServicesNow.sub_period_hit + " hit dengan harga Rp." + ServicesNow.price + ". Balas YA jika ingin berlangganan. TIDAK jika tidak ingin."
          			
          			}else if (ServicesNow.sub_based == "Time"){

          				reply = "Anda akan berlanganan Subscription TIME " + keyword + " selama " + ServicesNow.sub_period_day + " hari dengan harga Rp." + ServicesNow.price + ". Balas YA jika ingin berlangganan. TIDAK jika tidak ingin."

          			}else if (ServicesNow.sub_based == "HitTime"){
          				reply = "Anda akan berlanganan Subscription HitTime " + keyword + " sebanyak " + ServicesNow.sub_period_hit + " hit dan selama " + ServicesNow.sub_period_day + " hari. Balas YA jika ingin berlangganan. TIDAK jika tidak ingin."
          			}
          		}else if(type == "UNREG"){
          			if (ServicesNow.sub_based == "Hit"){

          			reply = "Anda akan menghentikan langanan Subscription Hit " + keyword + ". Balas YA jika ingin berlangganan. TIDAK jika tidak ingin."
          			
          			}else if (ServicesNow.sub_based == "Time"){

          				reply = "Anda akan berlanganan Subscription TIME " + keyword + ". Balas YA jika ingin berlangganan. TIDAK jika tidak ingin."

          			}else if (ServicesNow.sub_based == "HitTime"){
          				reply = "Anda akan berlanganan Subscription HitTime " + keyword + " hari. Balas YA jika ingin berlangganan. TIDAK jika tidak ingin."
          			}
          		}else if (type == "COD"){

          			reply = "Anda akan mendapatakan Content On Demand " + keyword + " dengan harga " + ServicesNow.price + ". Balas YA jika ingin berlangganan. TIDAK jika tidak ingin."
          		}
          			

          			
          			cb(null,reply);
          		}	
		})

		

		}
		
	Services.remoteMethod (
	    'getRequest',
	    {
	      http: {path: '/getRequest', verb: 'get'},
	      accepts: [
	      {arg: 'MSISDN', type: 'string', required: true, http: { source: 'query' } },
	      {arg: 'keyword', type: 'string', required: true, http: { source: 'query' } },
	      {arg: 'type', type: 'string', required: true, http: { source: 'query' } },
	      {arg: 'services', type: 'string', required: true, http: { source: 'query' } }
	      ],
	      
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);







	Services.deleteServiceandContent = function(id, cb) {
		var client = require('twilio')('AC25a82de2a3b0ee052e292dbff2841b30', '52837a72c99a968930b2c61295ce5d90');
		
		var Content = Services.app.models.Content
		var ServiceSubscribed = Services.app.models.ServiceSubscribed
		
		Content.destroyAll({service_id:id}, function (err, instance) {  
			console.log(instance)
		});

		ServiceSubscribed.destroyAll({service_id:id}, function (err, instance) {  
			console.log(instance)
		});


		Services.findById(id,{fields: ['id','MSISDN','keyword']}, function (err, instance) {  

			if (instance.MSISDN === undefined ){
				console.log("gak punya member")
			}else{
				if (instance.MSISDN.length === undefined){
					console.log("Gak punya member")
				}else{
			console.log(instance.MSISDN)

			var phone = instance.MSISDN

			for (var i = 0;i<phone.length;i++){
			console.log(phone[i])
			client.sendSms({
			    to:phone[i],
			    from:'+447481342719',
			    body:'Maaf, service kami '.concat(instance.keyword).concat(' sudah kami nonaktifkan. Maka kami unreg anda.')
			}, function(error, message) {
			    if (!error) {
			        console.log('Success! The SID for this SMS message is:');
			        console.log(message.sid);
			        console.log('Message sent on:');
			        console.log(message.dateCreated);
			    } else {
			    	console.log(error)
			        console.log('Oops! There was an error.');
			    }
			});

			}
				}
			}	
			

		})

		Services.destroyById(id,function(err, instance){
			console.log(instance)
		})
		cb(null,"Success");

		}
		
	Services.remoteMethod (
	    'deleteServiceandContent',
	    {
	      http: {path: '/deleteServiceandContent', verb: 'delete'},
	      accepts: {arg: 'id', type: 'string', required: true, http: { source: 'query' } },
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

};

module.exports = function(Msisdn) {
	
	Msisdn.observe('before save', function updateTimestamp(context, next) {
	
		var time = (new Date).getTime();
		// console.log(context.instance)
		// check wether using instance or data
		if (context.instance === undefined) {
			console.log('id: ' + context.where.id)
			Msisdn.findById(context.where.id,{fields: ['id']}, function (err, instance) {
				// console.log(body);
		    	// console.log('bodynow: ' + bodynow.rows[0]);
		    	// check if already created or not
		    	if(instance === null) {
		    		context.data.created_at = time;
		    		context.data.updated_at = time;
				    console.log('create new --> Msisdn');
				    // console.log('created_at: ' + context.data.created_at);
				    // console.log('updated_at: ' + context.data.updated_at);
		    	} else {
		    		context.data.updated_at = time;
				    console.log('update existing --> Msisdn');
				    // console.log('updated_at: ' + context.data.updated_at);
		    	}
				next();
			});
		} else {
			console.log('id: ' + context.instance.id)
			Msisdn.findById(context.instance.id,{fields: ['id']}, function (err, instance) {  
		    	// console.log('bodynow: ' + bodynow.rows[0]);
		    	// check if already created or not
		    	console.log(instance);
		    	if(instance === null) {
		    		context.instance.created_at = time;
		    		context.instance.updated_at = time;
				    console.log('create new --> Msisdn');
				    // console.log('created_at: ' + context.instance.created_at);
				    // console.log('updated_at: ' + context.instance.updated_at);
		    	} else {
		    		context.instance.updated_at = time;
				    console.log('update existing --> Msisdn');
				    // console.log('updated_at: ' + context.instance.updated_at);
		    	}
				next();
			});
		}
	});
	






	Msisdn.registerSubsServices = function(id,servicesId, cb) {
		
	var ServiceSubscribed = Msisdn.app.models.ServiceSubscribed

		var Services = Msisdn.app.models.Services;
		Services.findById(servicesId, {fields: 
		            [
                'MSISDN',
                'sub_period_day',
                'price',
                'services',
                'id',
                'hitlimit',
                'keyword',
                'sub_period_hit',
                'sub_based',
                'index_push',
                'index_add',
                'cp_admin'

            ]
          }, function (err, instanceContent) {
          	console.log(instanceContent)

          	if (instanceContent === undefined){
          		cb(null,"No services found")

          	}else{
          	var contentNow = instanceContent;
        	var phoneArray;
			if (contentNow.MSISDN === undefined ){
				contentNow.MSISDN = [];
				contentNow.MSISDN[0] = id;
				phoneArray = contentNow.MSISDN;
			}else{
				if (contentNow.MSISDN.length === undefined){
					contentNow.MSISDN = [];
					contentNow.MSISDN[0] = id;
					phoneArray = contentNow.MSISDN;
				}else{
					phoneArray = contentNow.MSISDN;
			    	phoneArray[(phoneArray.length)] = id;
				}
			}	  

			console.log(phoneArray)
        	  
        	  Services.updateAll({id:contentNow.id},{MSISDN:phoneArray}, function(err, instance){
        		  console.log(instance);
        	  });
        	  var registerSubs
        	  
        	  if (contentNow.sub_based == "Time"){
        	  var datenow = (new Date).getTime()
        	  var newdate = new Date(datenow)
        	  newdate.setDate(newdate.getDate() + contentNow.sub_period_day);
        	  var datefinished = new Date(newdate).getTime()
        		  registerSubs = 
      	        {
      	        		'service_id':contentNow.id,
      	        		'MSISDN':id,
      	        		'date_subscribed':datenow,
      	        		'status':'ON',
		                'date_subscribed_finished_time_based':datefinished,
		                
      	      	};

      	      	var content = 'Selamat anda telah berlangganan layanan Subscription Time Based '.concat(contentNow.keyword).concat(' selama ').concat(contentNow.sub_period_day).concat(' hari.');
      	      	console.log(registerSubs)
	        	  
	        	  ServiceSubscribed.create(registerSubs, function(err,instance){
	        	  	console.log("Service subscribe: " + instance)
		  		  });
      	      	cb(null,content)

        	  }else if (contentNow.sub_based == "Hit"){
        		  registerSubs = 
        	        {
        	        	'service_id':contentNow.id,
      	        		'MSISDN':id,
      	        		'date_subscribed':(new Date).getTime(),
      	        		'status':'ON',
        	        	'hit_subscribed_finished_hit_based': contentNow.sub_period_hit,
        	        	
        	      	};
        	      	var content = "Selamat anda telah berlangganan layanan Subscription Hit Based ".concat(contentNow.keyword).concat(" sebanyak ").concat(contentNow.hitlimit).concat(" hit.");  
        	      	console.log(registerSubs)

		        	  ServiceSubscribed.create(registerSubs, function(err,instance){
		        	  	console.log("Service subscribe: " + instance)
			  		  });
        	      	cb(null,content)

        	  }else if (contentNow.sub_based == "HitTime"){
        	  var datenow = (new Date).getTime()
        	  var newdate = new Date(datenow)
        	  newdate.setDate(newdate.getDate() + contentNow.sub_period_day);
        	  var datefinished = new Date(newdate).getTime()
        	  	registerSubs = 
        	        {
        	        	'service_id':contentNow.id,
      	        		'MSISDN':id,
      	        		'date_subscribed':(new Date).getTime(),
      	        		'status':'ON',
        	        	'hit_subscribed_finished_hit_based': contentNow.sub_period_hit,
        	        	'date_subscribed_finished_time_based':datefinished,

        	      	};
        	      	var content = "Selamat anda telah berlangganan layanan Subscription Hit Time Based ".concat(contentNow.keyword).concat(" sebanyak ").concat(contentNow.hitlimit).concat(" hit dan selama").concat(contentNow.dayleft).concat(" hari.");  
        	      	console.log(registerSubs)

        	  		ServiceSubscribed.create(registerSubs, function(err,instance){
        	  			console.log("Service subscribe: " + instance)
	  		  });
        	      	cb(null,content)
        	  }
        	  

          	}
   
      });


	
	
          
	} 
	
	Msisdn.remoteMethod (
	    'registerSubsServices',
	    {
	      http: {path: '/registerSubsServices', verb: 'post'},
	      accepts: [
	                {arg: 'id', type: 'string', required: true, http: { source: 'query' } },
	                {arg: 'services', type: 'string', required: true, http: { source: 'query' } }
	      ],
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

	Msisdn.unRegisterSubsServices = function(id,servicesid, cb) {
	console.log(id)
	console.log(servicesid)
	var ServiceSubscribed = Msisdn.app.models.ServiceSubscribed
	var Services = Msisdn.app.models.Services
	Services.findById(servicesid, {fields: 
            [
                'MSISDN',
                'id',
                'keyword',
                'sub_based'
            ]
          }, function (err, instanceContent) {


          	console.log(instanceContent)
          	var servicesNow = instanceContent;

          	var datenow = (new Date).getTime()


		 ServiceSubscribed.updateAll({service_id:servicesid},{date_unsuscribed:datenow,status:"OFF"}, function(err, instance){
        		  console.log(instance);
        });
		var phone = servicesNow.MSISDN

		var index = phone.indexOf(id);
		if (index > -1) {
    	phone.splice(index, 1);
		}
		
		Services.updateAll({id:servicesNow.id},{MSISDN:phone}, function(err, instance){
        		  console.log(instance);
        });
		
		var reply = "UNREG anda di layanan Subscription " + servicesNow.sub_based + " " + servicesNow.keyword + " berhasil. Terima kasih telah memakai layanan kami"
		
	
	cb(null,reply)
          
	})

}
	
	Msisdn.remoteMethod (
	    'unRegisterSubsServices',
	    {
	      http: {path: '/unRegisterSubsServices', verb: 'post'},
	      accepts: [
	                {arg: 'id', type: 'string', required: true, http: { source: 'query' } },
	                {arg: 'services', type: 'string', required: true, http: { source: 'query' } }
	      ],
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

};

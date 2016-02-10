module.exports = function(RequestSubscribe) {
	
	RequestSubscribe.getRequestSubscribe = function(id, cb) {

		RequestSubscribe.find({where: {MSISDN:id,status: 'Pending'}, fields: 
            [
                'service_id',
                'id',
                'type'
            ]
          }, function (err, instanceContent) {
		
          		if (instanceContent[0] === undefined){
          		cb(null,"Maaf, ada kesalahan pada sistem kami.")
          		}else{
          		var dateend = (new Date).getTime()
          	    RequestSubscribe.updateAll({id:instanceContent[0].id},{status:'FINISHED',date_request_end:dateend}, function(err, instance){
        		console.log(instance);
        		});
          		cb(null,instanceContent[0]);
          		}	
		})
          
	} 
	
	RequestSubscribe.remoteMethod (
	    'getRequestSubscribe',
	    {
	      http: {path: '/getRequestSubscribe', verb: 'get'},
	      accepts: {arg: 'MSISDN', type: 'string', required: true, http: { source: 'query' } },
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);
	
	RequestSubscribe.getRequestSubscribeCancel = function(id, cb) {

		RequestSubscribe.find({where: {MSISDN:id,status: 'Pending'}, fields: 
            [
                'service_id',
                'id',
                'type'
            ]
          }, function (err, instanceContent) {
		
          		if (instanceContent[0] === undefined){
          		cb(null,"Maaf, ada kesalahan pada sistem kami.")
          		}else{
          		var dateend = (new Date).getTime()
          	    RequestSubscribe.updateAll({id:instanceContent[0].id},{status:'CANCELLED',date_request_end:dateend}, function(err, instance){
        		console.log(instance);
        		});

        		var reply = "Terima kasih telah mencoba layanan kami"
          		cb(null,reply);
          		}	
		})
          
	} 
	
	RequestSubscribe.remoteMethod (
	    'getRequestSubscribeCancel',
	    {
	      http: {path: '/getRequestSubscribeCancel', verb: 'get'},
	      accepts: {arg: 'MSISDN', type: 'string', required: true, http: { source: 'query' } },
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

};

module.exports = function(Revenue) {
	
	Revenue.getAllRevenuesFilters = function(year, month, dateFrom, dateTo, cp_admin, service_id, cb) {
		
		if (cp_admin != undefined){
			console.log("masuk cp_admin")
			
			if (service_id != undefined){
				console.log("ada servicenya")
				
				
				Revenue.find({where: {
					service_id : service_id,
				}, order : 'date desc'
		          }, function (err, instance) {
		        
		          
		        var result = []	
		        if (year != undefined){
		        
		        for (var i = 0;i<instance.length;i++){
		        	
		        if (instance[i].date.getFullYear() == year){
		        		result.push(instance[i])
		        	
		        }
		        	
		        }
		        
				//Year	
				}else if(month != undefined){
					for (var i = 0;i<instance.length;i++){
					if ((instance[i].date.getMonth()+1) == month){
		        		result.push(instance[i])
		        		
					}
		        }
				//Month	
				}else if (dateFrom != undefined){
					if (dateTo == undefined){
					//One Date	
					for (var i = 0;i<instance.length;i++){
						if (instance[i].date.getDate() == dateFrom.getDate() && instance[i].date.getMonth() == dateFrom.getMonth() && instance[i].date.getFullYear() == dateFrom.getFullYear()){
							result.push(instance[i])

						}

					}
					}else{
					//Between
					for (var i = 0;i<instance.length;i++){
						dateTo.setDate(dateTo.getDate() + 1)
						if (instance[i].date >= dateFrom && instance[i].date < dateTo){
							result.push(instance[i])
						}

					}
					}
				}
		        	  cb(null,result)
		          })
				
				
				
				


			}else{
				console.log("gak ada mas")
				Revenue.find({where: {
					cp_admin : cp_admin,
				}, order : 'date desc'
		          }, function (err, instance) {

		        var result = []	
		        if (year != undefined){
		        
		        for (var i = 0;i<instance.length;i++){
		        	
		        if (instance[i].date.getFullYear() == year){
		        		result.push(instance[i])
		        	
		        }
		        	
		        }
		        
				//Year	
				}else if(month != undefined){
					for (var i = 0;i<instance.length;i++){
					if ((instance[i].date.getMonth()+1) == month){
		        		result.push(instance[i])
		        		
					}
		        }
				//Month	
				}else if (dateFrom != undefined){
					if (dateTo == undefined){
					//One Date	
					for (var i = 0;i<instance.length;i++){
						if (instance[i].date.getDate() == dateFrom.getDate() && instance[i].date.getMonth() == dateFrom.getMonth() && instance[i].date.getFullYear() == dateFrom.getFullYear()){
							result.push(instance[i])

						}

					}
					}else{
					//Between
					for (var i = 0;i<instance.length;i++){
						dateTo.setDate(dateTo.getDate() + 1)
						if (instance[i].date >= dateFrom && instance[i].date < dateTo){
							result.push(instance[i])
						}

					}
					}
				}
		        	  cb(null,result)
		          })
				


			}
			
		}else{
			console.log("gak punya cp")
			Revenue.find({ order : 'date desc'
		          }, function (err, instance) {

		        var result = []	
		        if (year != undefined){
		        
		        for (var i = 0;i<instance.length;i++){
		        	
		        if (instance[i].date.getFullYear() == year){
		        		result.push(instance[i])
		        	
		        }
		        	
		        }
		        
				//Year	
				}else if(month != undefined){
					for (var i = 0;i<instance.length;i++){
					if ((instance[i].date.getMonth()+1) == month){
		        		result.push(instance[i])
		        		
					}
		        }
				//Month	
				}else if (dateFrom != undefined){
					if (dateTo == undefined){
					//One Date	
					for (var i = 0;i<instance.length;i++){
						if (instance[i].date.getDate() == dateFrom.getDate() && instance[i].date.getMonth() == dateFrom.getMonth() && instance[i].date.getFullYear() == dateFrom.getFullYear()){
							result.push(instance[i])

						}

					}
					}else{
					//Between
					for (var i = 0;i<instance.length;i++){
						dateTo.setDate(dateTo.getDate() + 1)
						if (instance[i].date >= dateFrom && instance[i].date < dateTo){
							result.push(instance[i])
						}

					}
					}
				}
		        	  cb(null,result)
		          })
			


		}
          
	} 
	
	Revenue.remoteMethod (
	    'getAllRevenuesFilters',
	    {
	      http: {path: '/getAllRevenuesFilters', verb: 'get'},
	      accepts: [
	                {arg: 'year', type: 'number', required: false, http: { source: 'query' } },
	                {arg: 'month', type: 'number', required: false, http: { source: 'query' } },
	                {arg: 'date_from', type: 'date', required: false, http: { source: 'query' } },
	                {arg: 'date_to', type: 'date', required: false, http: { source: 'query' } },
	                {arg: 'cp_admin', type: 'string', required: false, http: { source: 'query' } },
	                {arg: 'service_id', type: 'string', required: false, http: { source: 'query' } }
	      ],
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

	Revenue.getTotalRevenueCP = function(cp_admin, date, cb) {
	  
		Revenue.find({where: {
			cp_admin : cp_admin,
		}}, function (err, instance) {
          	var total = 0
          	if (date != undefined){
          		for (var i = 0;i<instance.length;i++){
				if (instance[i].date.getDate() == date.getDate() && instance[i].date.getMonth() == date.getMonth() && instance[i].date.getFullYear()){
					console.log(instance[i].price)
							total = total + instance[i].price

						}

					}

          	}else{

          		for (var i = 0;i<instance.length;i++){
							total = total + instance[i].price
					}
          	}


        	  cb(null, total)
          })
          
	} 
	
	Revenue.remoteMethod (
	    'getTotalRevenueCP',
	    {
	      http: {path: '/getTotalRevenueCP', verb: 'get'},
	      accepts: [
	                {arg: 'cp_admin_id', type: 'string', required: true, http: { source: 'query' } },
	                {arg: 'date', type: 'date', required: false, http: { source: 'query' } }
	      ],
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

	Revenue.getTotalRevenueService = function(service_id, date, cb) {
	  
		Revenue.find({where: {
			service_id : service_id,
		}}, function (err, instance) {
          	var total = 0
          	if (date != undefined){
          		for (var i = 0;i<instance.length;i++){
				if (instance[i].date.getDate() == date.getDate() && instance[i].date.getMonth() == date.getMonth() && instance[i].date.getFullYear()){
					console.log(instance[i].price)
							total = total + instance[i].price

						}

					}

          	}else{

          		for (var i = 0;i<instance.length;i++){
							total = total + instance[i].price
					}
          	}


        	  cb(null, total)
          })
          
	} 
	
	Revenue.remoteMethod (
	    'getTotalRevenueService',
	    {
	      http: {path: '/getTotalRevenueService', verb: 'get'},
	      accepts: [
	                {arg: 'service_id', type: 'string', required: true, http: { source: 'query' } },
	                {arg: 'date', type: 'date', required: false, http: { source: 'query' } }
	      ],
	      returns: {name: 'result', args: 'response', type: 'string'}
	    }
	);

};

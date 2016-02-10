module.exports = function(Admin) {
	
	Admin.observe('before save', function updateTimestamp(context, next) {

		var time = (new Date).getTime();
		// console.log(context.instance)
		// check wether using instance or data
		if (context.instance === undefined) {
			console.log('id: ' + context.where.id)
			Admin.findById(context.where.id,{fields: ['id']}, function (err, instance) {
				// console.log(body);
		    	// console.log('bodynow: ' + bodynow.rows[0]);
		    	// check if already created or not
		    	if(instance === null) {
		    		context.data.created_at = time;
		    		context.data.updated_at = time;
				    console.log('create new --> admin');
				    // console.log('created_at: ' + context.data.created_at);
				    // console.log('updated_at: ' + context.data.updated_at);
		    	} else {
		    		context.data.updated_at = time;
				    console.log('update existing --> admin');
				    // console.log('updated_at: ' + context.data.updated_at);
		    	}
				next();
			});
		} else {
			console.log('id: ' + context.instance.id)
			Admin.findById(context.instance.id,{fields: ['id']}, function (err, instance) {  
		    	// console.log('bodynow: ' + bodynow.rows[0]);
		    	// check if already created or not
		    	console.log(instance);
		    	if(instance === null) {
		    		context.instance.created_at = time;
		    		context.instance.updated_at = time;
				    console.log('create new --> admin');
				    // console.log('created_at: ' + context.instance.created_at);
				    // console.log('updated_at: ' + context.instance.updated_at);
		    	} else {
		    		context.instance.updated_at = time;
				    console.log('update existing --> admin');
				    // console.log('updated_at: ' + context.instance.updated_at);
		    	}
				next();
			});
		}
		});










/*  
		Author: Zahid Yunus
		Description: Driver ID and password login validation
		Input: NIP driver and password
		Output: Status and token
	*/

	Admin.login = function(cp_id, cp_password, cb) {
		var loginStatus = false

		Admin.find(
						{
							where : {
								id : cp_id
							},
							fields : {
								password : true,
							}
						},
						function(err, Admins) {

				
							if (cp_password ===Admins[0]["password"]) {
								loginStatus = true;
							} else {
								loginStatus = false;
							}
							cb(null, loginStatus);
						
						});
	};
	Admin.remoteMethod('login', {
		http : {
			path : '/login',
			verb : 'post',
			source : 'query'
		},
		description : "User authentification based on user name and Password",
		accepts : [ {
			arg : 'cp_id',
			type : 'string',
			"required" : true,
			"description" : "Content Provider Admin ID"
		}, {
			arg : 'cp_password',
			type : 'string',
			"required" : true,
			"description" : "Content Provider Admin Password"
		} ],

		returns :  {
			arg : 'loginStatus',
			type : 'string'
		}, 
	});

};

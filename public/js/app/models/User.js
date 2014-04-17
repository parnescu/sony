define([
	"backbone"
], function(B){
	return Backbone.Model.extend({
		idAttribute: "userId",
		defaults:{
			"firstName": "",
			"lastName": "",
			"password": "",
			"username": "",
			"phoneNumber": "",

			"genderIsFemale": false,
			"age": 0,
			"notes": ""
		},
		fullname: function(){
			return this.get('firstName')+" "+this.get('lastName');
		},
		validate: function(attr){
			if (attr.firstName.length<3){
				return "A valid first name is necesary";
			}
			if (attr.lastName.length<3){
				return "A valid last name is necesary";
			}
			if (attr.username.length<3){
				return "A valid username must be given";
			}
			if (attr.password.length<3){
				return "A valid password must be given";
			}
		}
	});
})
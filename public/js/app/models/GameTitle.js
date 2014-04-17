define([
	"backbone"
], function(B){
	return Backbone.Model.extend({
		idAttribute: "",
		defaults:{
			"id": null,
	        "name": "",
	        "description": ""
		},
		validate: function(){
			
		}
	});
})
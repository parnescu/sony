define([
	"backbone"
], function(B){
	return Backbone.Model.extend({
		idAttribute: "id",
		defaults:{
			"id": null,
	        "name": "",
	        "description": ""
		},
		validate: function(){}
	});
})
define([
	'backbone',
	'text!/templates/Alert.html'
], function(B, tmp){
	return Backbone.View.extend({
		className: "notify",
		template: _.template(tmp),
		events: {
			"click button": "hide"
		},
		render: function(dataObject){
			this.$el.html(this.template(dataObject));
			this.$el.show();
			return this;
		},
		hide: function(){
			this.$el.hide();
		}
	});
})
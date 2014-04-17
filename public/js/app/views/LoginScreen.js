define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/LoginScreen.html'
], function(B, _g,template){
	return Backbone.View.extend({
		template: _.template(template),
		actionButton: null,
		events: {
			"click .btn": "handleClick"
		},
		initialize: function(){
			_.bindAll(this, "handleUserData");
		},
		render: function(){
			this.$el.html(this.template);
			
			if (!this.actionButton){
				this.actionButton = this.$el.find('button.action');
			}

			this.usr = this.$el.find('input[type=text]');
			this.pass = this.$el.find('input[type=password]');

			this.usr.bind('input', this.handleUserData);
			this.pass.bind('input', this.handleUserData);
			this.handleUserData();
			return this;
		},
		handleUserData: function(){
			if (this.usr.val().length > 2 && this.pass.val().length > 2){
				this.actionButton.removeAttr('disabled');
			}else{ 
				this.actionButton.attr('disabled', 'disabled');
			}
		},
		handleClick: function(e){
			e.preventDefault();
			if (e.target.tagName === "A"){
				Backbone.trigger(_g.events.SIGNAL_REGISTER_PAGE);
			}else{
				if ($(e.target).hasClass('back')){
					Backbone.trigger(_g.events.SIGNAL_GO_BACK, this)
				}else if (this.$el.find('form')[0].checkValidity()){
					Backbone.trigger(_g.events.SEND_LOGIN, this);	
				}
			}
		}
	});
});
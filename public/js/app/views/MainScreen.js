define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/MainScreen.html'
], function(B, _g, template){
	return Backbone.View.extend({
		template: _.template(template),
		className: "page",
		subview: null,
		playButton: null,
		actionButton: null,
		events: {
			"click .btn": "handleClick"
		},
		initialize: function(){
		},
		render: function(){
			this.$el.html(this.template);
			if (!this.playButton){
				this.playButton = this.$el.find('button.action');
				this.actionButton = this.$el.find('button.logger');
			}
			return this;
		},
		handleClick: function(e){
			e.preventDefault();

			if($(e.target).hasClass('action')){
				Backbone.trigger(_g.events.SIGNAL_NEW_GAME)
			}else{
				// if is logged in ...show details page
				// else show login page
				Backbone.trigger(_g.isLogged ? _g.events.SIGNAL_DETAILS_PAGE : _g.events.SIGNAL_LOGIN_PAGE)
			}
		},
		showLogged: function(){
			this.actionButton.text("Profile");
			trace('MAIN_SCREEN:: logged user is:')
			trace(_g.user);
		}
	});
});
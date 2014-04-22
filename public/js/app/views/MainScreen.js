define([
	'backbone'
	,'app/utils/Global'
	,'text!/templates/MainScreen.html'
], function(B, _g, template){
	return Backbone.View.extend({
		template: _.template(template),
		className: "page home",
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
				this.addItems = this.$el.find('button.titles');
				this.quitButton = this.$el.find('button.quit');
			}
			return this;
		},
		handleClick: function(e){
			e.preventDefault();
			var btn = $(e.target)
			if(btn.hasClass('action')){
				Backbone.trigger(_g.events.SIGNAL_NEW_GAME)
			}
			if(btn.hasClass('logger')){
				Backbone.trigger(_g.isLogged ? _g.events.SIGNAL_DETAILS_PAGE : _g.events.SIGNAL_LOGIN_PAGE)
			}

			if(btn.hasClass('titles')){
				Backbone.trigger(_g.events.SIGNAL_CHOOSE_TITLES);
			}
			if(btn.hasClass('quit')){
				Backbone.trigger(_g.events.SIGNAL_QUIT_GAME);	
			}
			btn = null;
		},
		showLogged: function(){
			this.actionButton.text("Profile");
			this.playButton.removeAttr('disabled');
			this.addItems.removeAttr('disabled');
			// trace('MAIN_SCREEN:: logged user is:')
			// trace(_g.user.toJSON());
		},
		showNotLogged: function(){
			this.actionButton.text("Login");
			this.addItems.attr('disabled','disabled');
			this.playButton.attr('disabled','disabled');

			trace('MAIN_SCREEN:: user has logged out');
			if (this.subview){
				this.subview.remove();
				this.subview = null;
			}
		}
	});
});
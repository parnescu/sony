define([
	'backbone'
	,'app/utils/Global'
	,'app/views/List'
	,'text!/templates/ListSelection.html'
], function(B, _g, List, tmp){
	return Backbone.View.extend({
		className: "page availableTitles", 
		template: _.template(tmp),
		events: {
			"click .btn": "handleClick"
		},
		initialize: function(){
			this.list = new List({ collection: this.collection});
			this.list.$el.addClass('allTitles');
		},
		render: function(){
			this.$el.html(this.template);
			this.$el.find('h2').after(this.list.render().el);
			this.actionButton = this.$el.find('.actions button.action');
			return this;
		},
		handleClick: function(e){
			e.preventDefault();
			var btn = $(e.target);

			if (btn.hasClass('back')){
				this.goBack();
			}
			if(btn.hasClass('action')){
				Backbone.trigger(_g.events.SEND_USER_TITLES, this.$el.find('a.selected'));
				this.goBack();		
			}
			btn = null;
		},
		goBack: function(){
			this.$el.find('a.selected').removeClass('selected');
			Backbone.trigger(_g.events.SIGNAL_GO_BACK, this);
		}
	});
})
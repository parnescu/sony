define([
	'backbone'
	,'app/utils/Global'
], function(B, _g){
	return Backbone.View.extend({
		tagName: 'ul',
		className: "list",
		events:{
			"click a": "handleClick"
		},
		initialize: function(data){
			if (data.deletable){
				this.$el.addClass('withDelete');
			}
			this.collection.on('add', this.addElement, this);
			this.collection.on('remove', this.addNotice, this);
		},
		render: function(){
			if (this.collection.length > 0){
				this.collection.each(function(item){ this.addElement(item);},this);	
			}else{
				this.addNotice();
			}
			return this;
		},
		addNotice: function(){
			if (this.collection.length === 0){
				this.$el.append('<li class="noItems">There are no titles added</li>');	
			}
		},
		addElement: function(model){
			if (this.collection.length>0){ this.$el.find('.noItems').remove();}
			var str = "<li data-id='%id'><a class='action' href='#selectItem' title='%n'>%n</a><a href='#deleteItem' title='Delete %n' class='delete'>delete %n</a></li>"
			this.$el.append(str.replace(/\%n/ig, model.get('name')).replace(/\%id/ig, model.get('id')));
		},
		handleClick: function(e){
			e.preventDefault();
			var btn = $(e.target);
			if(btn.hasClass('delete')){
				Backbone.trigger(_g.events.REMOVE_LIST_ITEM, this.collection.get(btn.parent()[0].dataset.id));
				btn.parent().remove();
			}else{
				Backbone.trigger(_g.events.CLICK_LIST_ITEM, this, btn);
			}
		}
	});
})
define([
	"backbone"
	,"app/utils/Global"
	,"text!/templates/GameScreen.html"
], function(B, _g, tmp){
	return Backbone.View.extend({
		id: "gameScreen",
		template: _.template(tmp),
		events: {
			"click a": "handleClick"
		},
		handleClick: function(e){
			e.preventDefault();
			Backbone.trigger(_g.events.TILE_CLICK, e.target.parentElement);
		},
		render: function(){
			this.$el.html(this.template);

			this.score = this.$el.find('p.score');
			this.time = this.$el.find('p.time');
			this.tiles = this.$el.find('p.tiles');
			this.tiles.addClass("game_"+this.collection.length*.5%3)

			_.each(this.collection, function(item){
				this.tiles.append('<a class="card" href="#tileId'+item.id+'" title="click to match tiles" data-id="'+item.id+'"><span class="face">&nbsp;</span><span class="back" style="background:#'+item.color+'">'+item.name+'</span></a>')
			},this);
			return this;
		}
	});
})
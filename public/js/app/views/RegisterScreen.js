define([
	'backbone'
	,'app/utils/Global'
	,'app/models/User'
	,'text!/templates/RegisterScreen.html'
], function(B, _g,User, template){
	return Backbone.View.extend({
		template: _.template(template),
		actionButton: null,
		className: "page register",
		events: {
			"click .btn": "handleClick"
		},
		initialize: function(data){
			_.bindAll(this, 'handleUserData');
			this.model = data ? data.model : new User();
			this.model.url = function(){
				return _g.LINK_BASE+_g.LINK_USER_REGISTER.replace("{username}", this.get('firstName'));
			}
		},
		render: function(){
			this.$el.html(this.template);
			this.actionButton = this.$el.find('button.action');
			this.form = this.$el.find('form')[0];
			this.inputs = this.$el.find("input");

			this.inputs.bind('input', this.handleUserData);
			return this;
		},
		handleUserData: function(){
			var allow = true, i, item;
			for (i=0;i<this.inputs.length;i++){
				item = this.inputs[i].value.toString().replace(/\s/ig,"");
				this.inputs[i].value = item;
				if (item.length < 3){ allow = false; break;}
			}

			if (allow === true){
				this.actionButton.removeAttr('disabled');
			}else{
				this.actionButton.attr('disabled', 'disabled');
			}
			allow = i = item = null;
		},
		handleClick: function(e){
			e.preventDefault();
			
			if ($(e.target).hasClass('back')){
				Backbone.trigger(_g.events.SIGNAL_GO_BACK, this);
			}else{
				_.each(this.inputs, function(el){ this.model.set(el.name, el.value);}, this)
				if (this.model.isValid()){
					Backbone.trigger(_g.events.SEND_REGISTER, this.model);	
				}
			}
		}
	});
});
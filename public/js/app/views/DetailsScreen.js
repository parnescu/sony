define([
	'backbone'
	,'app/models/User'
	,'app/utils/Global'
	,'text!/templates/DetailsScreen.html'
], function(B, User, _g, template){
	return Backbone.View.extend({
		template: _.template(template),
		actionButton: null,
		events: {
			"click .btn": "handleClick"
		},
		initialize: function(data){
			if (!this.model){
				throw new Error("Details view needs a model");
			}
			_.bindAll(this, "handleInputChange", "handleDataBinding");
		},
		render: function(){
			this.$el.html(this.template(this.model));
			this.actionButton = this.$el.find('button.action');
			this.inputs = this.$el.find('input');
			this.form = this.$el.find('form')[0];

			this.inputs.bind('change', this.handleInputChange);
			
			this.model.on('change:firstName', this.handleDataBinding);
			this.model.on('change:lastName', this.handleDataBinding);
			this.model.on('error', this.handleModelError);

			if (this.form.checkValidity()){ this.actionButton.removeAttr('disabled');}
			return this;
		},
		handleDataBinding: function(a){
			this.$el.find('h2').text("Profile "+a.fullname())
		},
		handleInputChange: function(e){
			this.actionButton.removeAttr('disabled');
			this.model.set(e.target.name, e.target.value);
		},
		handleModelError: function(e){
			trace('error');
			trace(e);
		},
		handleClick: function(e){
			e.preventDefault();
			if ($(e.target).hasClass('back')){
				Backbone.trigger(_g.events.SIGNAL_GO_BACK, this);
			}else if (this.model.isValid()){
				Backbone.trigger(_g.events.SEND_DETAILS_UPDATE, this.model);
			}else{
				Backbone.trigger(_g.events.SHOW_USER_WARNING, this.model);
			}
		}
	});
});
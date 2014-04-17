define([
	"backbone"
	,"app/utils/Global"
	,"app/controllers/MainController"	
], function(B, _g, MainController){
	var f = function(){}
	f.prototype.init = function(element){
		element = element || "body";
		element = $(element).size() ? element : document.body;
		_g.stage = $(element);

		// build all the views 
		MainController.init();
		Backbone.trigger(_g.events.BOOT_APP);
	}
	f.prototype.destroy = function(){
		MainController.remove()
		_.each(_g.pageStack, function(view){ view.remove(); view = null;});

		_g.isLogged = false;
		_g.user = null;

		_g.pageStack = [];
		_g.main = null;
		_g.login = null;
		_g.register = null;
		_g.details = null;
	}
	window.sonyTestApp = new f();
	return window.sonyTestApp;
})
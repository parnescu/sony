define([
	"backbone"
	,"app/utils/Global"
	,"app/controllers/MainController"	
], function(B, _g, MainController){
	var f = function(){
	}
	f.prototype.init = function(element){
		element = element || "body";
		element = $(element).size() ? element : document.body;
		_g.stage = $(element);
		MainController.init();
		

		Backbone.trigger(_g.events.BOOT_APP);
	}
	f.prototype.destroy = function(){
		MainController.remove()
	}
	//window.sonyTest = new f();
	return new f();
})
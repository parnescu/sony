"use strict"
window.trace = function(d){console.log(d);}

require.config({
	baseUrl: '/js',
	paths: {
		"jquery": 			"/jquery/dist/jquery.min"
		,"backbone": 		"/backbone/backbone"
		,"underscore": 		"/underscore/underscore"
		,"bootstrap": 		"/bootstrap/dist/js/bootstrap.min"
		,"text": 			"/requirejs-text/text"
	},

	shim:{
		backbone:{
			deps: ['jquery','underscore','text'],
			exports: 'Backbone'
		},
	}
});

require([
	'js/app/main.js'
], function(app){
	app.init();

});
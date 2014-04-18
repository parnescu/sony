'use strict';
window.trace = function(g){console.log(g);}
require.config({
	baseUrl: '../js',
	paths: {
		'jasmine': '/jasmine/lib/jasmine-core/jasmine',
		'jasmine-html': '/jasmine/lib/jasmine-core/jasmine-html',
		'boot': '/jasmine/lib/jasmine-core/boot',
		'jquery': '/jquery/dist/jquery.min',
		'underscore': '/underscore/underscore',
		'backbone': '/backbone/backbone',
		'text': '/requirejs-text/text'
	}
	,shim:{
		'jasmine': {
			exports: 'jasmine'
		},
		'jasmine-html':{
			deps: ['jasmine'],
			exports: 'jasmine'
		},
		'boot':{
			deps: ['jasmine','jasmine-html'],
			exports: 'jasmine'
		},
		backbone:{
			deps: ['jquery','underscore','text'],
			exports: 'Backbone'
		},
		jquery: {
			exports: "$"
		}
	}
});
var specs = ['/js/tests/tests.js'],
	dependencies = [
		'/js/app/models/User.js'
		,'/js/app/models/GameTitle.js'
		,'/js/app/utils/Global.js'
		,'/js/app/views/MainScreen.js'
		,'/js/app/views/LoginScreen.js'
		,'/js/app/views/RegisterScreen.js'
		,'/js/app/views/DetailsScreen.js'
		,'/js/app/views/List.js'
		,'/js/app/controllers/MainController.js'
	];

requirejs(['boot'].concat(dependencies), function(boot
		,User
		,GameTitle
		,_g
		,MainScreen
		,LoginScreen
		,RegisterScreen
		,DetailsScreen
		,List
		,MainController
	){
	// models
	window.User = User;
	window.GameTitle = GameTitle;

	// views 
	window.MainScreen = MainScreen;
	window.LoginScreen = LoginScreen;
	window.RegisterScreen = RegisterScreen;
	window.DetailsScreen = DetailsScreen;
	window.List = List;

	// other
	window._g = _g;
	window.MainController = MainController;
	
	requirejs(specs, function(specs){	
		window.onload();
	});
});
define([
	'app/models/User',
],function(User){
	"use strict";
	if (!window.__g){
		var def, _isLogged = false, obj = {
			LINK_BASE: "http://217.18.25.29:10070"
			,LINK_COLLECTION: "/gametitles/list"
			,LINK_USER_REGISTER: "/register/{username}"
			,LINK_USER_SIGNIN: "/signin/{username}/{password}"
			,LINK_USER_DETAILS: "/profile/{userId}"
			,LINK_USER_TITLES: "/profile/{userId}/titles/{titleId}"
		}
		
		obj.pageStack = [];
		obj.stage = null;			// global reference to where the app is located (default will be document.body)
		obj.user = null;			// response from login

		// screens
		obj.main = null;
		obj.login = null;
		obj.register = null;
		obj.details = null;

		obj.events = {
			BOOT_APP: "bootUpApp"
			,LOADING_ERROR: "failToLoad"
			,LOADING_SUCCESS: "loadSuccess"
			,SIGNAL_NEW_GAME: "prepareGame"
			,SIGNAL_DETAILS_PAGE: "detailsPage"
			,SIGNAL_LOGIN_PAGE: "loginPage"
			,SIGNAL_LOGOUT: "logoutPage"
			,SIGNAL_REGISTER_PAGE: "registerPage"
			,SIGNAL_GO_BACK: "goBack"
			,SEND_LOGIN: "sendLoginData"
			,SEND_REGISTER: "sendRegisterData"
			,SEND_DETAILS_UPDATE: "sendDetailsUpdate"
			,SHOW_USER_WARNING: "showError"
		};

		obj.__defineSetter__('isLogged', function(val){ _isLogged = val;});
		obj.__defineGetter__('isLogged', function(){ return _isLogged;});

		obj.getHeaders = function(sessionId){
			return {
				"Accept" : "application/json",
				"Content-Type" : "application/json",
				"sessionId" : sessionId
			}
		}

		// loader with promises that tells the app when it's loading or is done
		obj.load = function(link, method, data, headers){
			function parseTextResponse(txt){ return txt.split(":")[1].replace(/[^\w\s]/ig,"");}
			
			method = method || "GET";
			data = data || {};
			headers = headers || {}

			def = jQuery.Deferred();
			$.ajax({
				headers: headers,
				dataType: 'json',
				method: method,
				data: data,
				url: link,

				success: function(data){
					Backbone.trigger(obj.events.LOADING_SUCCESS);
					def.resolve(data);
				},
				error: function(xhr,err,type){
					trace(xhr.responseText);
					var reason = { code: xhr.status, reason: parseTextResponse(xhr.responseText)};
					Backbone.trigger(obj.events.LOADING_ERROR, reason);
					def.reject(reason);
				}
			});
			return def.promise();
		};
		window.__g = obj;
	}

	return window.__g;
})
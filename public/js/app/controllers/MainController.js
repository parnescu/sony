define([
	"backbone"
	,"app/utils/Global"
	,"app/models/User"
	,"app/views/MainScreen"
	,"app/views/LoginScreen"
	,"app/views/RegisterScreen"
	,"app/views/DetailsScreen"
], function(B, _g, User, MainScreen, LoginScreen, RegisterScreen, DetailsScreen){
	"use strict"
	if(!window.__smctrl){
		var f = function(){
			var currView,
		/* handlers for data */
			handleLoginData = function(login){
				if (!login) return;

				trace("MAIN_CTRL:: send login data..");
				var link = _g.LINK_BASE+_g.LINK_USER_SIGNIN
					.replace("{username}",login.usr.val())
					.replace("{password}",login.pass.val())
				
				_g.load(link).then(function(data){
					trace("MAIN_CTRL:: ... logged in!");
					
					_g.user = new User(data);
					_g.user.url = function(){ return _g.LINK_BASE+_g.LINK_USER_DETAILS.replace("{userId}", this.id);}
					_g.user.on('change', function(){ trace('item changed') });
					_g.isLogged = true;

					_getDetails(_g.user);
					_goBack(login);
				});
			},
			handleRegisterData = function(model){
				if (!model) return;
			
				_g.load(model.url(), "PUT", JSON.stringify(model.toJSON())).then(
					function(){
						_goBack(_g.register);
					}
				);
			},
			handleDetailsData = function(){
				trace("MAIN_CTRL:: save details");

				var data = _g.user.toJSON();
				delete data.sessionId;
				delete data.expiryTime;

				_g.load(_g.user.url(), "PUT", JSON.stringify(data), _g.getHeaders(_g.user.get('sessionId')))
				 	.then(function(daata){
						_goBack(_g.details)
					});
			},
			_getDetails = function(model){
				var ii;
				trace("MAIN_CTRL:: loading details...");
				_g.load(model.url(), null, null, _g.getHeaders(model.get('sessionId')))
					.then(function(data){
						trace("MAIN_CTRL:: ...details loaded");
						for(ii in data){ _g.user.set(ii, data[ii], {silent: true})}
						_g.main.showLogged();
						ii = null;
					});
			},
			_getTitles = function(){

			},
		/* end - handlers for data */


		/* handlers for screens */
			_success = function(){
				trace("MAIN_CTRL:: ---> communication success");
			},
			_error = function(err){
				if (!err) return;
				alert("ERROR: "+err.code + " " + err.reason);
			},
			_render = function(view){
				if (!view) return;

				if (_g.stage){
					_g.stage.append(view.el);
					_g.pageStack.push(view);
				
					currView = view;
					currView.$el.show();	
				}
			},
			_goBack = function(view){
				if (!view) return;

				if (currView == view){					
					_g.pageStack.pop();
					currView = _g.pageStack[_g.pageStack.length-1];
				}
				view.$el.hide();
			},
			handleLogin = function(){
				trace("MAIN_CTRL:: show login screen");
				if (!_g.login){ _g.login = new LoginScreen().render();}
				_render(_g.login);
			},
			handleInitStep = function(){
				trace("MAIN_CTRL:: boot application")
				if (!_g.main){ _g.main = new MainScreen().render();}
				_render(_g.main);
			},
			handleRegister = function(){
				trace("MAIN_CTRL:: show register screen");
				if (!_g.register){ _g.register = new RegisterScreen().render();}
				_render(_g.register);
			},
			handleDetails = function(){
				trace("MAIN_CTRL:: show details screen");
				if (!_g.details){ _g.details = new DetailsScreen({ model: _g.user}).render();}
				_render(_g.details);
			},
			handleLogout = function(){
				trace("MAIN_CTRL:: ..logout");
				_g.user = null;
				_g.isLogged = false;

				_g.main.showNotLogged();
				_goBack(_g.details);
			},
		/* end - handlers for screens */

			handle = function(){
				trace('def handler')
			},

			_start = function(){
				Backbone.on(_g.events.SHOW_USER_WARNING, handle);
				Backbone.on(_g.events.SIGNAL_NEW_GAME, handle);
				
				Backbone.on(_g.events.LOADING_ERROR, _error);
				Backbone.on(_g.events.LOADING_SUCCESS, _success);
				

				Backbone.on(_g.events.SIGNAL_GO_BACK, _goBack);
				Backbone.on(_g.events.SIGNAL_LOGIN_PAGE, handleLogin);
				Backbone.on(_g.events.SIGNAL_REGISTER_PAGE, handleRegister);
				Backbone.on(_g.events.SIGNAL_DETAILS_PAGE, handleDetails);
				Backbone.on(_g.events.SIGNAL_LOGOUT, handleLogout);
				Backbone.on(_g.events.BOOT_APP, handleInitStep);
				Backbone.on(_g.events.SEND_LOGIN, handleLoginData);
				Backbone.on(_g.events.SEND_REGISTER, handleRegisterData);
				Backbone.on(_g.events.SEND_DETAILS_UPDATE, handleDetailsData);
			},
			_end = function(){
				Backbone.off(_g.events.LOADING_SUCCESS);
				Backbone.off(_g.events.SHOW_USER_WARNING);
				Backbone.off(_g.events.SIGNAL_NEW_GAME);
				
				Backbone.off(_g.events.BOOT_APP);
				Backbone.off(_g.events.LOADING_ERROR);
				Backbone.off(_g.events.SIGNAL_GO_BACK);
				Backbone.off(_g.events.SIGNAL_LOGIN_PAGE);
				Backbone.off(_g.events.SIGNAL_REGISTER_PAGE);
				Backbone.off(_g.events.SIGNAL_DETAILS_PAGE);
				Backbone.off(_g.events.SIGNAL_LOGOUT);

				Backbone.off(_g.events.SEND_LOGIN);
				Backbone.off(_g.events.SEND_REGISTER);
				Backbone.off(_g.events.SEND_DETAILS_UPDATE);
			}

			return{
				init: _start,
				remove: _end
			}
		}
		window.__smctrl = new f();
	}
	return window.__smctrl
})
define([
	"backbone"
	,"app/utils/Global"
	,"app/models/User"
	,"app/models/GameTitle"
	,"app/views/MainScreen"
	,"app/views/LoginScreen"
	,"app/views/RegisterScreen"
	,"app/views/DetailsScreen"
	,"app/views/List"
	,"app/views/ListSelection"
], function(B, _g, User, GameTitle, MainScreen, LoginScreen, RegisterScreen, DetailsScreen, List, Selector){
	"use strict"
	if(!window.__smctrl){
		var f = function(){
			var currView, _c = Backbone.Collection.extend({ model: GameTitle}), collection = new _c(), availableTitles = new _c(),

		/* handlers for data */
			handleLoginData = function(login){
				if (!login) return;

				trace("MAIN_CTRL:: send login data..");
				var link = _g.LINK_BASE+_g.LINK_USER_SIGNIN
					.replace("{username}",login.usr.val())
					.replace("{password}",login.pass.val())
				
				_g.load(link).then(function(data){
					trace("MAIN_CTRL:: ... logged in!\n");
					
					_g.user = new User(data);
					_g.user.url = function(){ return _g.LINK_BASE+_g.LINK_USER_DETAILS.replace("{userId}", this.id);}
					_g.isLogged = true;

					_getDetails(_g.user);
					_getUserTitles(_g.user);
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
				 	.then(function(data){
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
			_getUserTitles = function(model){
				trace("MAIN_CTRL:: loading user titles...");
				var link = _g.LINK_BASE+_g.LINK_USER_TITLES
							.replace("{userId}",model.id)
							.replace("{titleId}","");

				collection.reset();
				collection.off('add');
				collection.off('remove');

				_g.load(link, null, null, _g.getHeaders(model.get('sessionId')))
					.then(function(data){
						trace("MAIN_CTRL:: ...user tittles loaded");
						if (_g.main.subview){ _g.main.subview.remove();}
						_g.main.subview = new List({ deletable: true, collection: collection}).render();
						_g.main.$el.find('section').append(_g.main.subview.el);

						collection.on('add', handleCollectionUpdate);
						collection.on('remove', handleCollectionUpdate);

						if (data.titles.length >0){
							collection.add(data.titles);
							trace("MAIN_CTRL:: "+collection.length+" items available");
						}else{
							trace("MAIN_CTRL:: no items available");
						}
					});
			},
			_getAllTitles = function(){
				if (availableTitles.length == 0){
					trace("MAIN_CTRL:: loading available titles...");
					_g.load(_g.LINK_BASE+_g.LINK_COLLECTION).then(function(data){
						trace("MAIN_CTRL:: done... show selector");
						availableTitles.add(data.titles);
						if (!_g.selector){_g.selector = new Selector({collection: availableTitles}).render();}
						_render(_g.selector);
					})	
				}else{
					trace("MAIN_CTRL:: titles already loaded... show selector");
					_render(_g.selector);
				}
			},
			_saveTitles = function(items){
				if (!_g.user){
					_error(_g.errors.LOGGED_OUT);
					return;
				}
				_.each(items, function(anchor){
					var id = $(anchor).parent()[0].dataset.id,
						model = availableTitles.get(id),
						link = _g.LINK_BASE+_g.LINK_USER_TITLES
							.replace("{userId}",_g.user.id)
							.replace("{titleId}",model.id);
					
					_g.load(link, "PUT", null, _g.getHeaders(_g.user.get('sessionId')))
						.then(function(data){
							trace('\n')
							trace(data)
							collection.add(model);
							
						}
					);
					trace(" -> save: "+model.get('name'));
				});
			},
			_removeTitle = function(model){
				var link = _g.LINK_BASE+_g.LINK_USER_TITLES
						.replace("{userId}",_g.user.id)
						.replace("{titleId}",model.id);


				_g.load(link, "DELETE", null, _g.getHeaders(_g.user.get('sessionId')))
					.then(function(data){
						trace('\n')
						trace(data);
						collection.remove(model);
					}
				);
			},
		/* end - handlers for data */


		/* handlers for screens */
			_success = function(){
				// ajax request successful 
				//trace("MAIN_CTRL:: ---> communication success");
			},
			_error = function(err){
				// ajax request failed 
				if (!err) return;
				alert("ERROR: "+err.code + " " + err.reason);
			},
			_render = function(view){
				// build a view
				if (!view) return;

				if (_g.stage){
					_g.stage.append(view.el);
					_g.pageStack.push(view);
				
					currView = view;
					currView.$el.show();	
				}
			},
			_goBack = function(view){
				// 'close' current view
				if (!view) return;

				if (currView == view){					
					_g.pageStack.pop();
					currView = _g.pageStack[_g.pageStack.length-1];
				}
				view.$el.hide();
			},
			handleCollectionUpdate = function(){
				trace("MAIN_CTRL:: collection updated "+collection.length+" items left");
				if (collection.length == 0){
					_g.main.playButton.attr('disabled','disabled')
				}else{
					_g.main.playButton.removeAttr('disabled')
				}
			},
			handleInitStep = function(){
				trace("MAIN_CTRL:: boot application")
				if (!_g.main){ _g.main = new MainScreen().render();}
				_render(_g.main);
			},
			handleLogin = function(){
				trace("MAIN_CTRL:: show login screen");
				if (!_g.login){ _g.login = new LoginScreen().render();}
				_render(_g.login);
			},
			handleRegister = function(){
				trace("MAIN_CTRL:: show register screen");
				if (!_g.register){ _g.register = new RegisterScreen().render();}
				_render(_g.register);
			},
			handleDetails = function(){
				trace("MAIN_CTRL:: show details screen");
				if (!_g.details || 
					_g.details && _g.user.get('username') != _g.details.model.get('username')){ 
					_g.details = new DetailsScreen({ model: _g.user}).render();
				}
				_render(_g.details);
			},
			handleLogout = function(){
				trace("MAIN_CTRL:: ..logout");
				_g.user = null;
				_g.isLogged = false;
				_g.main.showNotLogged();

				_goBack(_g.details);
			},
			handleListClick = function(view, element){
				if(view.$el.hasClass('allTitles')){
					element.toggleClass('selected');
					
					if(view.$el.find('a.selected').size()){
						_g.selector.actionButton.removeAttr('disabled')
					}else{
						_g.selector.actionButton.attr('disabled','disabled')
					}
				}else{
					trace("MAIN_CTRL:: main list...");
				}
			},
			handleNewGame = function(){
				trace('MAIN_CTRL:: start new game');
				if(collection.length > 3){
					// hide all buttons, show "close game button"
					// enable list items selection, hide delete button

				}else{
					// show error that you need to have at least three items to continue
					_error(_g.errors.MIN_PLAYERS);
				}
				
			},
			handleValidationError = function(){
				trace('baaaaa... ' + _g.user.validationError)
			},
		/* end - handlers for screens */
			

			_start = function(){			
				Backbone.on(_g.events.LOADING_ERROR, _error);
				Backbone.on(_g.events.LOADING_SUCCESS, _success);

				Backbone.on(_g.events.SIGNAL_CHOOSE_TITLES, _getAllTitles);
				Backbone.on(_g.events.SIGNAL_GO_BACK, _goBack);
				Backbone.on(_g.events.SIGNAL_LOGIN_PAGE, handleLogin);
				Backbone.on(_g.events.SIGNAL_REGISTER_PAGE, handleRegister);
				Backbone.on(_g.events.SIGNAL_DETAILS_PAGE, handleDetails);
				Backbone.on(_g.events.SIGNAL_LOGOUT, handleLogout);
				Backbone.on(_g.events.SIGNAL_NEW_GAME, handleNewGame);

				Backbone.on(_g.events.BOOT_APP, handleInitStep);
				Backbone.on(_g.events.CLICK_LIST_ITEM, handleListClick);
				Backbone.on(_g.events.REMOVE_LIST_ITEM, _removeTitle);
				
				Backbone.on(_g.events.SEND_LOGIN, handleLoginData);
				Backbone.on(_g.events.SEND_REGISTER, handleRegisterData);
				Backbone.on(_g.events.SEND_DETAILS_UPDATE, handleDetailsData);
				Backbone.on(_g.events.SHOW_USER_WARNING, handleValidationError);
				Backbone.on(_g.events.SEND_USER_TITLES, _saveTitles);
			},
			_end = function(){
				Backbone.off(_g.events.LOADING_ERROR);
				Backbone.off(_g.events.LOADING_SUCCESS);

				Backbone.off(_g.events.SIGNAL_CHOOSE_TITLES);
				Backbone.off(_g.events.SIGNAL_GO_BACK);
				Backbone.off(_g.events.SIGNAL_LOGIN_PAGE);
				Backbone.off(_g.events.SIGNAL_REGISTER_PAGE);
				Backbone.off(_g.events.SIGNAL_DETAILS_PAGE);
				Backbone.off(_g.events.SIGNAL_LOGOUT);
				Backbone.off(_g.events.SIGNAL_NEW_GAME);

				Backbone.off(_g.events.BOOT_APP);
				Backbone.off(_g.events.CLICK_LIST_ITEM);
				Backbone.off(_g.events.REMOVE_LIST_ITEM);
				
				Backbone.off(_g.events.SEND_LOGIN);
				Backbone.off(_g.events.SEND_REGISTER);
				Backbone.off(_g.events.SEND_DETAILS_UPDATE);
				Backbone.off(_g.events.SHOW_USER_WARNING);
				Backbone.off(_g.events.SEND_USER_TITLES);
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
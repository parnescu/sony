describe("Jasmine TDD test suite", function(){
	var model, collection, view, value, stage = $('#stage');
		bogusPlayer = {
			username: "shisui",
			password: "root",
			firstName: "Don",
			lastName: "Johnson",
			
			genderIsFemale: false,
			age: 18,
			phoneNumber: "0258951",
			notes: "ba dum tiss"
		}

	describe("Views", function(){
		describe("Main screen", function(){
			it("should have a header, subview and two buttons (one for login, the other for play-game)", function(){
				view = new MainScreen().render();
				stage.append(view.el);

				expect(view.el.tagName).toBe('DIV');
				expect(view.$el.hasClass('page')).toBeTruthy();
				expect(view.subview).toBeDefined();
				expect(view.subview).toBeNull();
				expect(view.playButton).not.toBeNull();
				expect(view.playButton[0].tagName).toBe('BUTTON');
				expect(view.actionButton).not.toBeNull();
				expect(view.actionButton[0].tagName).toBe('BUTTON');
			});

			it("clicking the login button should trigger the login view, clicking the play button does nothing", function(){
				value = 1;
				expect(value).toBe(1)
				
				Backbone.on(_g.events.SIGNAL_NEW_GAME, function(){ value = 2});
				Backbone.on(_g.events.SIGNAL_LOGIN_PAGE, function(){ value = 3;});	

				view.actionButton.click();
				expect(value).toBe(3)
				view.playButton.click();
				expect(value).not.toBe(2)

				view.remove();
				view = null;
				value = null;
				Backbone.off(_g.events.SIGNAL_LOGIN_PAGE);
			});
		});
		
		describe("Login screen", function(){
			it("should have user & pass inputs + login and register buttons", function(){
				view = new LoginScreen().render();
				stage.append(view.el);

				expect(view.$el.find('input').length).toBe(2);
				expect(view.actionButton).toBeDefined();
				expect(view.actionButton[0].tagName).toBe('BUTTON');
			});

			it("push button and you login, click the register button & it launches the proper screen", function(){
				value = 1;
				Backbone.on(_g.events.SIGNAL_REGISTER_PAGE, function(){ value = 2});
				Backbone.on(_g.events.SEND_LOGIN, function(){ value = 3});

				// if login is by default populated... empty it
				view.$el.find('input[type=text]').val("");
				view.$el.find('input[type=password]').val("");
				view.actionButton.attr('disabled', 'disabled');

				view.actionButton.click()
				expect(value).toBe(1);

				view.$el.find('input[type=text]').val(bogusPlayer.username);
				view.$el.find('input[type=password]').val(bogusPlayer.password);
				
				// can't emulate actual input from user so we 'rig' the test :)
				view.actionButton.removeAttr('disabled');
				view.actionButton.click();
				expect(value).toBe(3);

				view.$el.find('a.btn').click()
				expect(value).toBe(2);

				view.remove();
				view = null;
				value = null;
				Backbone.off(_g.events.SIGNAL_REGISTER_PAGE);
				Backbone.off(_g.events.SEND_LOGIN);
			});
		});

		describe("Register screen", function(){
			it("should have a model (usr,pass,first and last name inputs) + submit button", function(){
				view = new RegisterScreen().render();
				stage.append(view.el)

				expect(view.model).toBeDefined();
				expect(view.$el.find('input').length).toBe(5);
				expect(view.actionButton).toBeDefined()
			});

			it("populating data enables the button to be clicked and signals register", function(){
				value = 1;
				Backbone.on(_g.events.SEND_REGISTER, function(){ value = 2});
				_.each(view.$el.find('input'), function(item){ item.value = bogusPlayer[item.name]});
				expect(value).toBe(1);
				
				// can't emulate actual input from user so we 'rig' the test :)
				view.actionButton.removeAttr('disabled');
				view.actionButton.click()
				expect(value).toBe(2);

				view.remove();
				view = null;
				value = null;
				Backbone.off(_g.events.SEND_REGISTER);
			});
		});

		describe("Details view", function(){
			it("should display/allow modifications to a user model", function(){
				value = 1;

				var _emulate = function(view){
					_.each(view.inputs, function(item){
						if (item.type != 'radio'){ view.model.set(item.name, item.value);
						}else{ if (item.checked){ view.model.set(item.name, item.value);}}
					});
				}

				Backbone.on(_g.events.SEND_DETAILS_UPDATE, function(){ value++;});
				Backbone.on(_g.events.SHOW_USER_WARNING, function(){ value = 0;});
				
				model = new User(bogusPlayer);
				view = new DetailsScreen({model: model}).render();
				stage.append(view.el);

				expect(view.model.fullname()).toBe('Don Johnson');
				view.$el.find('input[name=firstName]').val('Donovan');
				_emulate(view)
				view.actionButton.click();
				expect(value).toBe(2);

				expect(view.model.fullname()).toBe('Donovan Johnson');
				view.$el.find('input#male').click()
				view.actionButton.click();
				expect(value).toBe(3);

				expect(view.model.get('genderIsFemale')).toBe('false');
				view.$el.find('input[name=firstName]').val('');
				_emulate(view)
				view.actionButton.click();
				expect(value).toBe(0);

				view.remove();
				view = null;
				value = null;
				Backbone.off(_g.events.SEND_DETAILS_UPDATE);
			});
		});

	});
	describe("Async server communication", function(){
		var usrData, profile, items, title;
		beforeEach(function(done){ setTimeout(function() { done();}, 100);});

		it("get game titles collection from API", function(done) {
			Backbone.on(_g.events.LOADING_ERROR, done);

			_g.load(_g.LINK_BASE+_g.LINK_COLLECTION).then(function(data){
				items = data.titles;
				expect(items.length).toBeGreaterThan(0);
				expect(items[2].name).toBe('Ratchet & Clank: All for one');
				done();
			}, function(){
			});
		});
		it("try to login with alex / password", function(done){
			Backbone.on(_g.events.LOADING_ERROR, done);
			var link = _g.LINK_BASE+_g.LINK_USER_SIGNIN
				.replace("{username}","alex")
				.replace("{password}","password");

			_g.load(link).then(function(data){
				expect(data.sessionId).toBeDefined();
				expect(data.sessionId).not.toBeNull();
				expect(data.userId).toBe("3869cb99-d7de-46e0-b9f5-401b4854ec78");
				expect(data.expiryTime).toBeDefined();
				expect(typeof(data.expiryTime)).toBe('number');
				usrData = data;
				done();
			});	
		});
		it("get the user details", function(done){
			Backbone.on(_g.events.LOADING_ERROR, done);
			var link = _g.LINK_BASE+_g.LINK_USER_DETAILS
				.replace("{userId}",usrData.userId);

			_g.load(link, null, null, _g.getHeaders(usrData.sessionId))
				.then(function(data){
					expect(data.phoneNumber).toBe('0777999666')
					expect(data.username).toBe('alex')
					expect(data.lastName).toBe('testuser')
					profile = data;
					done();
				}
			);
		});
		it("change age to 23 and save details", function(done){
			Backbone.on(_g.events.LOADING_ERROR, done);

			var link = _g.LINK_BASE+_g.LINK_USER_DETAILS.replace("{userId}",usrData.userId);

			profile.age = 23;
			_g.load(link, "PUT", JSON.stringify(profile), _g.getHeaders(usrData.sessionId))
				.then(function(data){
					expect(data.status).toEqual("updated");
					expect(data.userId).toBe(profile.userId);
					done();
				}
			);
		});
		it("search for alex's titles", function(done){
			Backbone.on(_g.events.LOADING_ERROR, done);

			var link = _g.LINK_BASE+_g.LINK_USER_TITLES
				.replace("{userId}",usrData.userId)
				.replace("{titleId}","");

			_g.load(link, null, null, _g.getHeaders(usrData.sessionId))
				.then(function(data){
					expect(data.userId).toBe(usrData.userId)

					// this might change and fail, based upon other experiments
					//expect(data.titles.length).toBe(0);
					expect(data.titles.length).toBeGreaterThan(0);
					done();
				}
			);
		});
		it("pick ratchet & clank and add it", function(done){
			Backbone.on(_g.events.LOADING_ERROR, done);

			var link = _g.LINK_BASE+_g.LINK_USER_TITLES
				.replace("{userId}",usrData.userId)
				.replace("{titleId}",items[2].id);

			_g.load(link, "PUT", null, _g.getHeaders(usrData.sessionId))
				.then(function(data){
					title = data;
					expect(data.status).toBe("added");
					done();
				}
			);
		});

		it("remove the added title", function(done){
			Backbone.on(_g.events.LOADING_ERROR, done);

			var link = _g.LINK_BASE+_g.LINK_USER_TITLES
				.replace("{userId}",usrData.userId)
				.replace("{titleId}",title.titleId);

			_g.load(link, "DELETE", null, _g.getHeaders(usrData.sessionId))
				.then(function(data){
					expect(data.status).toBe("deleted");
					done();
				}
			);
		});

		afterEach(function(){
			Backbone.off(_g.events.LOADING_ERROR);
		})
	});
});
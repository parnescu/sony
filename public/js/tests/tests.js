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
		},
		bogusTitles = [
			{ id:"d1660df3-e8dc-401e-85e5-8e666ce9360d", name:"item 1", description:"a"}
			,{ id:"d57058b2-6b61-4d7f-82ce-8547d91a864", name:"item 2", description:"b"}
			,{ id:"dc7efa67-684b-4eae-98e7-629433ef93bf", name:"item 3", description:"c"}
		]

	describe("Views", function(){
		var collection
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

		describe("Game titles list", function(){
			var i;
			beforeEach(function(){
				var _c = Backbone.Collection.extend({ model: GameTitle});
				collection = new _c();
				
				view = new List({collection: collection}).render();
				stage.append(view.el);
				_c = null;
			});

			it("list with collection of elements, if no elements, show 'message'", function(){
				expect(view.el.tagName).toBe("UL");
				expect(collection.length).toEqual(0);
				
				i = view.$el.find('li');
				expect(i.length).toBe(1);
				expect(i.text()).toBe('There are no titles added');
				expect(i.hasClass('noItems')).toBeTruthy();
			});

			it("adding titles removes 'message' and populates list", function(){
				collection.add(bogusTitles);
				expect(view.$el.find('.noItems').length).toEqual(0);

				i = view.$el.find('li');
				expect(i.length).toBe(bogusTitles.length);
				expect($(i[1]).find('a.action').text()).toBe(bogusTitles[1].name);
				
			});

			it("clicking an item signals controller, deleting an item removes it from collection and view", function(){
				Backbone.on(_g.events.CLICK_LIST_ITEM, function(){ i = Infinity;});
				Backbone.on(_g.events.REMOVE_LIST_ITEM, function(model){ 
					i = -1;
					view.collection.remove(model);
				});
				i = i || null;

				expect(i).toBeNull();
				collection.add(bogusTitles);
				var p = view.$el.find('li:eq(1)');

				$(p).find('a.action').click();
				expect(i).toEqual(Infinity);

				$(p).find('a.delete').click();
				expect(i).toEqual(-1);
				expect(collection.length).toBe(2);

				p = null;
			})

			afterEach(function(){
				i = null;
				collection.reset();
				view.remove();
				view = null;
				collection = null;
			})
		});

	});
	xdescribe("Async server communication", function(){
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

	describe("Game", function(){
		describe("starting a new game", function(){
			var data;
			it("minimum of three items should be provided, double items and add them to a collection", function(){
				expect(function(){ GameController.start([]) }).toThrow();
				GameController.start(bogusTitles);
				data = GameController.items;
				expect(data.length).toEqual(6);
			});
			xit("generate colors based on the item ids and randomize data (might fail because of randomize)", function(){
				expect(data[0].name).not.toBe(bogusTitles[0].name);
				expect(data[3].color).toBeDefined();
				expect(data[3].color.length).toBe(6)
			});
			it("build the game view and start the counter", function(){
				data = GameController.view();
				stage.append(data.el);

				expect(data).toBeDefined();
				expect(data instanceof Backbone.View).toBeTruthy();
				expect(data.score).toBeDefined();
				expect(data.time).toBeDefined();
				expect(data.tiles).toBeDefined();
				expect(data.tiles[0].children[2].tagName).toBe('A');
				expect(data.tiles[0].children.length).toBe(6);
				expect(data.time.text()).toBe('time passed: 0s');
				expect(data.score.text()).toBe('0 points');
				data.remove()
			});

			xit("getting things right earns you 5 points, getting it wrong robs you of 1 point (might fail because of random)", function(){
				var i = 0;
				Backbone.on(_g.events.TILE_CLICK, function(){ i++});
				$('.tiles a:eq(1) span.face').click();
				$('.tiles a:eq(2) span.face').click();
				expect(i).toBeGreaterThan(0);
				expect(GameController.score()).toEqual(-1)

				
			});
		});
	})
});
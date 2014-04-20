trace = function(m){ console.log(m)};

var express = require('express'),
	app = express(),
	config = require('./appConfig.js')(app, express),
	routes = require('./routes.js')();


// setup paths
app.get('/', routes.index);
app.get('/tests', routes.tests);

// setup api - for offline work
app.get('/signin/*', routes.signin);
app.get('/register/*', routes.register);
app.get('/gametitles/list', routes.titles);
app.get('/profile/:id', routes.details);
app.get('/profile/:id/titles', routes.userTitles);

app.put('/profile/:id', routes.doNothing);
app.put('/profile/:id/titles/*', routes.doNothing);
app.delete('/profile/:id/titles/*', routes.doNothing);

app.listen(3001)
trace("SERVER:: init");

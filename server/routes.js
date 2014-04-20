module.exports = function(){
	var fs = require('fs'),
		path = require('path'),

	renderPage = function(req, res, next, template){ res.render(template);},
	renderJson = function(req, res, next, template){
		var file = path.join(__dirname+"/json/"+template+".json");
		trace("ROUTE:: read json file: "+file);
		fs.readFile(file, { encoding:'utf-8'}, function(err, data){
			data = JSON.parse(data);
			res.json(data);
		});
	}

	_getIndex = function(req,res, next){ renderPage(req,res,next, "layout")},
	_getTests = function(req,res, next){ renderPage(req,res,next, "tests")},
	
	_apiSignin = function(req, res, next){ renderJson(req, res, next, 'login'); },
	_apiRegister = function(req, res, next){ renderJson(req, res, next, 'register'); },
	_apiTitles = function(req, res, next){ renderJson(req, res, next, 'titles'); },
	_apiDetails = function(req, res, next){ renderJson(req, res, next, 'details'); },
	_apiUsrTitles = function(req, res, next){ renderJson(req, res, next, 'myTitles'); }
	_apiNoAction = function(req, res){ res.json({})}
	return {
		index: _getIndex,
		tests : _getTests,
		signin: _apiSignin,
		register: _apiRegister,
		titles: _apiTitles,
		details: _apiDetails,
		userTitles: _apiUsrTitles,
		doNothing: _apiNoAction
	}
}
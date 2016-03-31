/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var bodyParser = require('body-parser');

// is this needed .... yes absolutely needed
// to get variables from views form to app.js
// if needed , it has to be before app.router
//app.use(express.urlencoded());
app.use(bodyParser.urlencoded({
	extended: true
	})
);
app.use(bodyParser.json());

//var router = express.Router();
//router.get('/', function(req, res) {
//	res.json({message:  "welcome"});
//});
//app.use('/', router);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//Access usermodeling module
var qa = require('./watsonqa');

// render index page
app.get('/', function(req, res){
	res.render('index');
});

// Post question
app.post('/ask', function(req,res) {
	qa.ask(req, function(response) {
		res.send(response);
	});
});


// Access Personality Insights module
var pi = require('./watsonpi');

app.post('/analyzeText',pi.analyzeText);

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

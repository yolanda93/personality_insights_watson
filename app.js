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

var alchemy = require('./alchemy');

// Post question to Watson QA
app.post('/ask', function(req,res) {
	var output = {};
	var qText = (req.body).question;
	var results = [];
			
	
	qa.ask(req, function(qaresponse) {

		//console.log("response: " + qaresponse);
		// If you just want to show QA response, uncomment the following line
		//res.send(qaresponse);

		// collect the answers from evidencelist array in QAAPI response
		var answers = (JSON.parse(qaresponse)).question.evidencelist;
		var qAnswers=[];
		var qtxt = (req.body).question;	
		var tmp = {text:qtxt};
		qAnswers.push(tmp);
		
		// filter our any empty answers from evidencelist
		for(var i=0; i<answers.length; i++) {
			var y = answers[i];
			if(y != null && y != "null" && typeof y != "undefined" && (y instanceof Object && Object.keys(y).length != 0)) {
				qAnswers.push(y);
			}
		}
		
		// call function defined in alchemy.js file to use AlchemyAPI service to collect keywords
		alchemy.getKeywords(qAnswers, function(alchemyresp) {
			//console.log('in alchemy get keywords in app js');
			res.send(alchemyresp);
		});
		
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

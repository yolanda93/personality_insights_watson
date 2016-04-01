// Access AlchemyAPI keyword extraction
//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

// need to add this in package.json
// async is a node package to handle asynchronous calls
var async = require('async');

exports.getKeywords = function(req, res) {
	
	var items = req;
	async.each(items, 
		function(item, callback) {
			getALCHEMYkeywords(item, function() {
			callback();
			});
		}, function(err) {
			//console.log("all answers processed");
			res(items);
		}
	);
}

function getALCHEMYkeywords (item, callback) {
	var output = {};
	var qText = item.text;
	// this function is defined in alchemyapi.js which was obtained from SDK provided by AlchemyAPI
	alchemyapi.keywords('text', qText, { 'sentiment':1 }, function(response) {
		//output['keywords'] = { questionText:qText, response:JSON.stringify(response,null,4), results:response['keywords'] };
		item.keywords = response['keywords'];
		//console.log("item with keywords: " + JSON.stringify(item));
		if(typeof callback === "function") callback();
	});
};
var pi_endpoint = {
    url : '',
    username : '',
    password : ''
};

// Obtain Personality Insights credentials from Bluemix Service
function getPIcredentials() {
  var pi_url = "";
  var pi_username = "";
  var pi_password = "";
  var pi_creds = "";
  var services = "";
  
  var vcapservices = parseVcapServices();
  
  if (vcapservices) {
	 // console.log("vcap services: " +process.env.VCAP_SERVICES);
	  services = JSON.parse(process.env.VCAP_SERVICES);
  } else {
	 // console.log("services defined to testenv: " + testEnvironment);
	  services = testEnvironment;
  }
//  console.log("services: " + JSON.stringify(services["personality_insights"]));
  pi_creds = services["personality_insights"][0].credentials;  
  pi_endpoint.url = pi_creds.url;
  pi_endpoint.username = pi_creds.username;
  pi_endpoint.password = pi_creds.password;
  
  return pi_creds;
}

function parseVcapServices() {
    return process && process.env &&
        process.env.VCAP_SERVICES &&
        JSON.parse(process.env.VCAP_SERVICES);
}

var testEnvironment = {
  "personality_insights": [
    {
      "name": "Personality Insights-co",
      "label": "personality_insights",
      "plan": "standard",
      "credentials": {
        "url": "https://gateway.watsonplatform.net/personality-insights/api",
        "username": "enter_value_from_Bluemix",
        "password": "enter_value_from_Bluemix"
      }
    }
  ]
};

exports.analyzeText = function(req, res) {
	getPIcredentials();
	//console.log('PI url: ' + pi_endpoint.url);
	//console.log('PI user: ' + pi_endpoint.username);
	//console.log('PI password: ' + pi_endpoint.password);
	if (!pi_endpoint.url) {
	  resp.send(404, 'personality insights url is not supplied');
	}
	
	var text = (req.body).content;
	//console.log("text: " + JSON.stringify(text));
	var piEntity = {
        "contentItems": [ 
            { "contenttype":"text\/plain",
              "sourceid":"ibmdwblogs",
              "userid":"dummy",
              "created":1393264847000,
              "language":"en",
              // "content":"Simple cool AQL trick - boolean column for whether a concept exists. I thought I'd share a nice little AQL output example that might be of  help in your Big Insights text analytics programming. Consider that you've created a very complex AQL view, one which extracts a very detailed concept from text.  This might take into account many different text constructs and match a large variety of different  text in documents.  If you want to take that view and use it to simply identify which documents have an occurance of this advanced concept, you can do it like this.  In this case, I've assumed the complex view name is called Division'.  create view DivisionCount as select Count(*) as dc from Division D;  create view DivisionBoolean as select case  when Equals(DC.dc,0) then 'no' else 'yes' as HasDivision from Document R,DivisionCount DC; To test this using the Text Analytics tutorial example, I created a new document called text.txt which doesn't have any matches for Division in it.  When I run it and select to see DivisionBoolean in the output, I get this as a result: image?",
			  "content": JSON.stringify(text),
			  "id":"12ceb145-8602-49f4-8457-de14e1a38711"
			}
		]
	};
	var pi_content = JSON.stringify(piEntity);
	
	var pi_uri = pi_endpoint.url;
	console.log('pi_uri: ' + pi_uri);
	var pi_post_uri = pi_uri + '/v2/profile';
	console.log('pi post url: ' + pi_post_uri);
	var pi_post_url = require('url').parse(pi_post_uri);
	var pi_host = pi_post_url.host.split(":")[0];
	console.log('pi host: ' + pi_host);
	var pi_port = pi_post_url.port;
	console.log('pi port: ' + pi_port);
	var pi_path = pi_post_url.path;
	console.log('pi path: ' + pi_path);
	var pi_protocol = pi_post_url.protocol;
	console.log('pi protocol: ' + pi_protocol);
	var pi_auth = pi_endpoint.username + ":" + pi_endpoint.password;
    console.log('pi auth ' + pi_auth);

	var request_pi_auth = {
		'user': pi_endpoint.username,
		'pass': pi_endpoint.password,
		'sendImmediately': false
	};
		
	var request_post_options = {
		'uri' : pi_post_uri,
		'method' : "POST",
		'port' : pi_port,
		'path' : pi_path,
		'host' : pi_host,
		'auth' : request_pi_auth,
		'headers' : {
			'Content-Type' : 'application/json',
	        'Content-Length' : pi_content.length
	    },
	    'json' : piEntity
	};  

	var request = require('request');
	request(request_post_options, function(error, response, body) {
		if(error) {
			console.log("There was an error:", error);
		} else {
			console.log('response status: ' + response.statusCode);
			//console.log('response: ' + JSON.stringify(body));
			// var data = JSON.parse(body);
			var data = body;
			//var list = flatten(data.tree);
			res.send(data);
			//res.render('piresp', {list:list});
		}
	});
};
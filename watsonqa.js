var qa_endpoint = {
    url : 'https://watson-wdc01.ihost.com/instance/nnn/deepqa/v1/question', // Watson QA endpoint
    username : 'typeYourUserNameHere',
	password : 'typeYourPasswordHere'
};

exports.ask = function(req, res) {
	
	qin = (req.body).question;	
    qText = qin.replace(/[^\x00-\x7F]|"|\n|\r|\n\r/g, "").trim();
	console.log('content for analysis: ' + qText);
		
	var question = "{\"question\" : { \"questionText\" : \"" + qText + "\"}}";
	console.log("question: " + question);
	require("request")({
		uri : qa_endpoint.url,
		method : "POST",
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Accept' : 'application/json',
			'X-SyncTimeout' : '30'
		},
		auth : {
			user : qa_endpoint.username,
			pass : qa_endpoint.password
		},
		rejectUnauthorized: false,
		requestCert: true,
		agent: false,
		body: question
	}, function(error, response, body) {
		//console.log("resp: " +JSON.stringify(body));
		res(body);
	});
};
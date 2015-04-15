var querystring = require("querystring");
var multipart = require('multipart');
var fs = require("fs");
var http = require("http");
var crypto = require("crypto");
var authentication = require("./authentication");
var sharedSecret, query, signature;

function start(response, postData) {
    console.log("Request handler 'start' was called.");

    var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" content="text/html; '+
	'charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/flow" enctype="multipart/form-data" '+
	'method="post">'+
	'<br>Please enter Flow instance URL without "http://": <input type="text" name="flowurl">'+
	'<br>Please enter the Flow resource you are requesting: <input type="text" name="resource">'+
	'<P>Please enter your secret key: <input type="text" name="secret"></P>'+
	'<P>Please enter your access key: <input type="text" name="access_key"></P>'+
	'<P><br><input type="submit" value="Submit" /></P>'+
	'</form>'+
	'</body>'+
	'</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end(); 
}
function flow(response, postData){
	multipart.parse(response).addCallback(function(postData) {
        response.sendHeader(200, {'Content-Type': 'text/plain'});
        response.sendBody(sys.inspect(parts));
        response.finish();
      });
        }

	//var opt = authentication.requestflowapi(response);
	
	//var options = opt(access_key, secret, url, resource);
	/*
	var request = http.request(options, function(response) {
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
		console.log('BODY: ' + JSON.stringify(chunk));
	*/		
		
			//return JSON.stringify(chunk);
	/*	});
	}).on('error', function(e) {
	  console.log("There was an error, please read following message: " + e.message);
	});
	request.end();
	
	//var content = authentication.requestflowapi(response);
	//console.log("content: " + content);
	//response.writeHead(200, {"Content-Type": "text/html"});
    //response.write(content);
    //response.end(); */
//}
function upload(response, postData) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"}); 
    response.write("You have sent: \n" + querystring.parse(postData).secret);
    response.end();
}

function show(response) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("/tmp/test.jpg").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.flow = flow;

var querystring = require("querystring");
var fs = require("fs");
var http = require("http");
var crypto = require("crypto");
var sharedSecret, query, signature;

var exec = require("child_process").exec;

function start(response, postData) {
    console.log("Request handler 'start' was called.");

    /* exec("find /",{ timeout: 10000, maxBuffer: 20000*1024 }, function (error, stdout, stderr) {
       response.writeHead(200, {"Content-Type": "text/plain"});
       response.write(stdout);
       response.end();
       }); 
    */

    var body = '<html>'+
	'<head>'+
	'<meta http-equiv="Content-Type" content="text/html; '+
	'charset=UTF-8" />'+
	'</head>'+
	'<body>'+
	'<form action="/upload" enctype="multipart/form-data" '+
	'method="post">'+
	'<br><textarea name="text" rows="20" cols="60"></textarea>'+
	'<P><input type="file" name="upload"></P>'+
	'<br><input type="submit" value="Submit" />'+
	'</form>'+
	'</body>'+
	'</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();

} 
function authentication(response, postData){

var access_key="jvCO1HsC4h182tNAGvrKNPS9j001Hjx40l4sHbTXTeY=";
var secret="QKSWjDcBd2kzqqQFgT/8r0U4Keb/HoTgjqcGV1bLCEU=";
d=$(date +%s);
sig=$(printf "GET\n${d}\n/api/v1/question_answers" | openssl sha1 -binary -hmac "${secret}" | base64); 
curl -H "Date: ${d}" -H "Authorization: ${access_key}:${sig}" http://training.akvoflow.org/api/v1/question_answers?surveyInstanceId=41996001




    exec("",{ timeout: 10000, maxBuffer: 20000*1024 }, function (error, stdout, stderr) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(stdout);
	response.end();
    }); 
    


    console.log("Authenticating to FLOW");
    response.writeHead(200, {"Content-Type": "text/html"}); 
    response.write("The list of Flow surveys: \n" + querystring.parse(postData).text);
    response.end();
}

function upload(response, postData) {
    console.log("Request handler 'upload' was called.");
    response.writeHead(200, {"Content-Type": "text/plain"}); 
    response.write("You have sent: \n" + querystring.parse(postData).text);
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

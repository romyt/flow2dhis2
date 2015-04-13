var crypto = require('crypto');
var http = require('http');
var access_key = "jvCO1HsC4h182tNAGvrKNPS9j001Hjx40l4sHbTXTeY=";
var secret = "QKSWjDcBd2kzqqQFgT/8r0U4Keb/HoTgjqcGV1bLCEU=";

function generateSignature(string_to_sign, shared_secret) {
	var hmac = crypto.createHmac('sha1', shared_secret);
	return hmac.update(string_to_sign).digest('base64');
};

var d = Math.floor(new Date() / 1000);
var payload = "GET\n" + d + "\n" + "/api/v1/surveys";
var signature = generateSignature(payload, secret);

var options = {
  host: "training.akvoflow.org",
  port: 80,
  path: "/api/v1/surveys",
  method: "GET",
  headers: {
	"Date": d,
	"Authorization" : access_key + ":" + signature
    }
};

var request = http.request(options, function(response) {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
	console.log('BODY: ' + JSON.stringify(chunk));
    });
}).on('error', function(e) {
  console.log("There was an error, please read following message: " + e.message)});
request.end();
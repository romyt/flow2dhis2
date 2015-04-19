var crypto = require('crypto');
var http = require('http');
var qs = require("querystring");
//var access_key = "jvCO1HsC4h182tNAGvrKNPS9j001Hjx40l4sHbTXTeY=";
//var secret = "QKSWjDcBd2kzqqQFgT/8r0U4Keb/HoTgjqcGV1bLCEU=";

function requestflowapi(query, postdata, callback){
	//callback = (callback || noop);
	query = query || '';
	var POST = qs.parse(postdata);
	var access_key = POST.access_key; 
	var secret_key = POST.secret; 
	var url = POST.flow_url;
	var resource = POST.resource;
	var path ='';
	path = "/api/v1/" + resource;
	if(query !==''){
		path = "/api/v1/" + resource + '?' + query;
	}
	console.log("authentication module was called...");
	console.log("access_key: " + access_key + " secret_key: " + secret_key + " url: " + url + " path: " + path);
	function generateSignature(string_to_sign, shared_secret) {
		var hmac = crypto.createHmac('sha1', shared_secret);
		return hmac.update(string_to_sign).digest('base64');
	}

	var d = Math.floor(new Date() / 1000);
	var payload = "GET\n" + d + "\n" + "/api/v1/" + resource;
	var signature = generateSignature(payload, secret_key);

	var options = {
	  host: url,
	  port: 80,
	  path: path,
	  method: "GET",
	  headers: {
		"Date": d,
		"Authorization" : access_key + ":" + signature
		}
	};
	var request = http.request(options, function(response) {
		var body ="";
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			body += chunk;
			//console.log('receiving chunk: ' + JSON.stringify(body));
		});
		
		response.on('end', function(){
			callback(body);
			//return( this );
		});
	}).on('error', function(e) {
	  console.log("There was an error while connecting Flow API, please read following message: " + e.message);
	});
	request.end();
}
exports.requestflowapi = requestflowapi;

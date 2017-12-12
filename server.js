var http = require("http");
var url = require("url");
var qs = require('querystring');
var fs = require('fs');

function start(route, handle){

	function onRequest(request, response) {

	    var pathname = url.parse(request.url).pathname;
		var query = url.parse(request.url).query;
	    var postData ="";

	    request.setEncoding("utf8");

		if(request.method == 'POST'){
			request.addListener("data", function(postDataChunk){
				//console.log("Received POST data chunk '"+ postDataChunk + "'.");
				postData += postDataChunk;
			});
			request.addListener("end", function(){
				console.log("request.method = " + request.method + " pathname: " + pathname );
				route(handle, pathname, query, response, postData);

				fs.writeFile('.credentials', postData, function (err) {
					if (err) throw err;
					console.log('Credential saved for next request: ' + postData);
				});
			});
		}
		else if(pathname !== '/' && pathname !== '/favicon.ico' && request.method == 'GET'){
			console.log("request.method = " + request.method + "Pathname: " + pathname);
			fs.readFile('.credentials', function (err, data) {
			  	if (err) throw err;
			  	postData = data.toString();
				var pathname_without_slash = pathname.replace('/','');
				postData = postData.replace('surveys', pathname_without_slash);
				console.log("PostData value " + postData + " received from file!");
				route(handle, pathname, query, response, postData);
			});
		}
		else{
			request.addListener("data", function(postDataChunk){
			postData += postDataChunk;
			console.log("Received POST data chunk '"+ postDataChunk + "'.");
			});

			request.addListener("end", function(){
			route(handle, pathname, response, postData);
			});
		}
		console.log("Request for " + pathname + " received.");


	}
	http.createServer(onRequest).listen(9998);
	console.log("Server has started.");
}
exports.start = start;

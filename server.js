var http = require("http");
var url = require("url");
var splitter = require('./splitter.js');

function start(route, handle){
	function onRequest(request, response) {
	    var pathname = url.parse(request.url).pathname;
	    var postData ="";
	    request.setEncoding("utf8");

	    request.addListener("data", function(postDataChunk){
		postData += postDataChunk;
		console.log("Received POST data chunk '"+ postDataChunk + "'.");	    
	    });
	    
	    request.addListener("end", function(){
			if (postData !== '')
    		{
        		var hash = splitter.formValues(postData);
 
         		console.log("input1 = " + hash.flowurl);
         		console.log("input2 = " + hash.secret);
 
         	response.writeHead(200);
         	response.write('Romain ' + postData);
         	response.end();
         	return;
    	}	
	    });

	    console.log("Request for " + pathname + " received."); 
	    
  	}
	http.createServer(onRequest).listen(9999);
	console.log("Server has started.");
}
exports.start = start;

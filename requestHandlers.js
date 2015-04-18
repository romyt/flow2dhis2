var fs = require("fs");
var http = require("http");
var authentication = require('./authentication');

function start(response, postData) {
    console.log("Request handler 'start' was called.");
	fs.readFile('./html/form.html',function(error,data){ 
    response.end(data, function(){
		response.write(data);
		});    
	});
}

function getData(response, postData){
	console.log("Request handler 'getData' was called.");
	
	authentication.requestflowapi(postData, function(flowdata) {
  // Here the value of flowdata is set.
		var content = JSON.parse(flowdata);
			var body1 = '<html>'+
						'<head>'+
						'</head>'+
						'<body>'+
							'<table>'+
								'<tr>'+
									'<th>'+
										'Survey name'+
									'</th>'+
									'<th>'+
										'Survey status'+
									'</th>'+
									'<th>'+
										'Survey keyId'+
									'</th>'+
									'<th>'+
										'Survey version'+
									'</th>'+
								'</tr>';
				var body2 ='';
				for(var i=0; i< content.surveys.length; i++){
					if (content.surveys[i].status == 'PUBLISHED'){
						body2 +=		
								'<tr>'+
									'<td>'+
										'<a href="./question_answers?surveyId='+ content.surveys[i].keyId +'">' + content.surveys[i].name + '</a>'+
									'</td>'+
									'<td>'+
										content.surveys[i].status +
									'</td>'+
									'<td>'+
										content.surveys[i].keyId +
									'</td>'+
									'<td>'+
										content.surveys[i].version +
									'</td>'+
								'</tr>';	
					}	
				}
					var body3 =	
							'</table>'+
						'</body>'+
						'</html>';

					var body_complete = body1 + body2 + body3 ;
					
		response.writeHead(200, {"Content-Type": "text/html"}); 
    	response.write(body_complete);
		response.end();
});
}
	
function question_answers(response, postData) {
    console.log("Request handler 'question_answers' was called.");
	
	authentication.requestflowapi(postData, function(flowdata) {
		response.writeHead(200, {"Content-Type": "text/plain"}); 
    	response.write("You have sent: \n" + querystring.parse(postData).secret);
    	response.end();
	});
}

function show(response) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("/tmp/test.jpg").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.getData = getData;

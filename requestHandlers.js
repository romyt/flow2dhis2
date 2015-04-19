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

function getData(query, response, postData){
	console.log("Request handler 'getData' was called.");
	
	authentication.requestflowapi(query, postData, function(flowdata) {
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
										'<a href="./survey_instances?surveyId='+ content.surveys[i].keyId +'">' + content.surveys[i].name + '</a>'+
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
	
function survey_instances(query, response, postData) {
    console.log("Request handler 'survey_instances' was called.");
	//console.log("$$$$$$$$$ Parameters $$$$$$$$ " + query + " / " + postData);
	
	authentication.requestflowapi(query, postData, function(flowdata) {
	console.log("Survey instances received !");
	var content = JSON.parse(flowdata);
			var body1 = '<html>'+
						'<head>'+
						'</head>'+
						'<body>'+
							'<table>'+
								'<tr>'+
									'<th>'+
										'Survey local identifier '+
									'</th>'+
									'<th>'+
										'Survey submitter name '+
									'</th>'+
									'<th>'+
										'Survey device identifier '+
									'</th>'+
									'<th>'+
										'Survey collection date '+
									'</th>'+
									'<th>'+
										'Survey keyId '+
									'</th>'+
								'</tr>';
				var body2 ='';
				for(var i=0; i< content.survey_instances.length; i++){
						body2 +=		
								'<tr>'+
									'<td>'+
										'<a href="./question_answers?surveyInstanceId='+ content.survey_instances[i].keyId +'">' + content.survey_instances[i].surveyedLocaleIdentifier + '</a>'+
									'</td>'+
									'<td>'+
										content.survey_instances[i].submitterName +
									'</td>'+
									'<td>'+
										content.survey_instances[i].deviceIdentifier +
									'</td>'+
									'<td>'+
										content.survey_instances[i].collectionDate +
									'</td>'+
									'<td>'+
										content.survey_instances[i].surveyedLocaleId +
									'</td>'+
								'</tr>';	
				}
					var body3 =	
							'</table>'+
							'<P>'+
							'<div id="dhis2_form">'+
							'<form id="form1" name="form1" method="GET" action="sendData">' +
							'<input type="hidden" name="surveyId" id="surveyId" value='+ content.survey_instances[0].surveyId +'/>' +
							'<input type="submit" value="Send Surveys Answers to DHIS2" />' +
							'</P>'+
							'</div>'+
							'<a href=./sendData?surveyId='+ content.survey_instances[0].surveyId + '> Send data to DHIS2 </a>'+ 
						'</body>'+
						'</html>';

					var body_complete = body1 + body2 + body3 ;
					
		response.writeHead(200, {"Content-Type": "text/html"}); 
    	response.write(body_complete);
		response.end();
	});
}

function question_answers(query, response, postData) {
    console.log("Request handler 'question_answers' was called.");
	console.log("$$$$$$$$$ Parameters $$$$$$$$ " + query + " / " + postData);
	
	authentication.requestflowapi(query, postData, function(flowdata) {
	console.log("Survey questions answers received !");
	var content = JSON.parse(flowdata);
			var body1 = '<html>'+
						'<head>'+
						'</head>'+
						'<body>'+
							'<table>'+
								'<tr>'+
									'<th>'+
										'Question Label'+
									'</th>'+
									'<th>'+
										'Question Answer '+
									'</th>'+
									'<th>'+
										'Question collection date  '+
									'</th>'+
									'<th>'+
										'Question keyId '+
									'</th>'+
									'<th>'+
										'Question survey Instance Id '+ 
									'</th>'+
								'</tr>';
				var body2 ='';
				for(var i=0; i< content.question_answers.length; i++){
						body2 +=		
								'<tr>'+
									'<td>'+
										content.question_answers[i].questionText +
									'</td>'+
									'<td>'+
										content.question_answers[i].value +
									'</td>'+
									'<td>'+
										content.question_answers[i].collectionDate +
									'</td>'+
									'<td>'+
										content.question_answers[i].keyId +
									'</td>'+
									'<td>'+
										'<a href="./survey_instances?surveyId='+ content.question_answers[i].surveyId +'">' + content.question_answers[i].surveyId + '</a>'+
									'</td>'+
								'</tr>';	
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

function sendData(query, response, postData) {
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("/tmp/test.jpg").pipe(response);
}

exports.start = start;
exports.survey_instances = survey_instances;
exports.question_answers = question_answers;
exports.sendData = sendData;
exports.getData = getData;

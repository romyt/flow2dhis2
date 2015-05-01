/*
*This file is part of flow2dhis2. The purpose if the program is to send data collected using Akvo FLOW to a DHIS2 instance
*Copyright (C) 2015 Tohouri.com
*flow2dhis2 is free software: you can redistribute it and modify it under the terms of the GNU Affero General Public License (AGPL) as published by the Free Software Foundation, either version 3 of the License or any later version.
*flow2dhis2 is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License included below for more details.
*ßThe license can also be seen at http://www.gnu.org/licenses/agpl.html.
*/

var fs = require("fs");
var http = require("http");
var qs = require("querystring");
var authentication = require('./authentication');
var exec = require("child_process").exec;
var parseString = require('xml2js').parseString;

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
	//console.log("$$$$$$$$$ Parameters $$$$$$$$ " + query + " / " + postData);
	
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
	var POST = qs.parse(postData);
	var access_key = POST.access_key; 
	var secret_key = POST.secret; 
	var url = POST.flow_url;
	var resource = POST.resource;
    console.log("Request handler 'sendData' was called.");
	postData = postData.replace('sendData', 'survey_instances');
	
	authentication.requestflowapi(query, postData, function(flowdata) {
	console.log("Survey instances received! Begining data gathering for DHIS2 ");
	
	var content = JSON.parse(flowdata);
	var questions = "";	
	var surveyInstanceIdTbl = [];
	var dxfheader ='"dataelement","period","orgunit","categoryoptioncombo","attributeoptioncombo","value"\n';	
	var dxfend = '</wstxns1:dataValueSet>';
	var dxfcontent ='';
	var orgunit ='';
	var period ='';
	var categorycombo ='';
		
	function writeEndXMLTag(){
		fs.appendFile('./flowdata.xml', dxfend, function (err) {
			if (err) throw err;
			console.log('The "closing tag" was appended to file!');
		});
	}

	for (var i=0; i< content.survey_instances.length; i++){
		console.log("contents.length :" + content.survey_instances.length + " keyId: " + content.survey_instances[i].keyId);
		surveyInstanceIdTbl[i] = content.survey_instances[i].keyId;
	}
		
	fs.writeFile('./flowdata.csv', dxfheader, function (err) {
		if (err) throw err;
		console.log('Header of xml data file wrote!');
	});

	postData = postData.replace('survey_instances', 'question_answers');
	var count = surveyInstanceIdTbl.length -1;
	surveyInstanceIdTbl.forEach (function (keyId, index){
		
		query = "surveyInstanceId=" + keyId;
		authentication.requestflowapi(query, postData, function(flowdata) {
			questions = JSON.parse(flowdata);
			var csv = '';
			dxfcontent = '';
			
			// getting period ans orgunit in the instance 
			for(var i in questions.question_answers) {
				if(questions.question_answers[i].type === 'CASCADE') {
					orgunit = questions.question_answers[i].value;
				}
				if(questions.question_answers[i].textualQuestionId === 'period') {
					period = questions.question_answers[i].value;
				}
			}
			
			orgunit = 'bDd1OyowFZT';
			
			// getting values and dataElements
			var nbQ = questions.question_answers.length - 1;
			for (var j in questions.question_answers) {
				if(questions.question_answers[j].textualQuestionId !== 'period' && questions.question_answers[j].type !== 'CASCADE'){
					if(questions.question_answers[j].value === 'Yes'){ questions.question_answers[j].value = true; }
					else if(questions.question_answers[j].value === 'No'){ questions.question_answers[j].value = false; }
					dxfcontent += '"'+ questions.question_answers[j].textualQuestionId + '","'+
									period + '","' + orgunit + '","HNjsQJi1xxW","HNjsQJi1xxW","'  + questions.question_answers[j].value + '"\n';
				}
			}

			addToFile(dxfcontent, function(message) {
				if(index === count){
					sendToDHIS2(function(message) {
						message = JSON.parse(message);
						var conflictitems = message.importSummary.conflicts[0].conflict ;
						var listConflicts = '';
						for(var i in conflictitems){
							listConflicts += '<p>'+ conflictitems[i].$.object +' : \t'+ conflictitems[i].$.value +'</p>';
						} 
						
						var body = '<html>'+
										'<head>'+
										'</head>'+
										'<body>'+
											'<p>'+ message.importSummary.status[0] +' : '+ message.importSummary.description[0] +'</p>' +
											'<br/>'+
											'<p>Imported : \t'+ message.importSummary.dataValueCount[0].$.imported +'</p>'+
											'<p>Updated : \t'+ message.importSummary.dataValueCount[0].$.updated +'</p>'+
											'<p>ignored : \t'+ message.importSummary.dataValueCount[0].$.ignored +'</p>'+
											'<p>Deleted : \t'+ message.importSummary.dataValueCount[0].$.deleted +'</p>'+
											'<br/>'+
											listConflicts +
										'</body>'+
									'</html>';
			
						response.writeHead(200, {"Content-Type": "text/html"});
						response.write(body);
						response.end();
					});
				}
			});

		});
		
		function sendToDHIS2(callback){
			var cmd = 'curl --data-binary @flowdata.csv "https://aftest.dhis2.net/api/dataValueSets" -H "Content-Type:application/csv" '+
					  '-u ldiphoorn:Waterpoint1 -v';
			exec(cmd,{ timeout: 10000, maxBuffer: 20000*1024 }, function (error, stdout, stderr) {
				console.log('stdout: ', stdout);
				console.log('stderr: ', stderr);
				
				if (error !== null) {
					console.log('exec error: ', error);
				} else if(stdout !== null) {
					parseString(stdout, function (err, result) {
						console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@' +  JSON.stringify(result));
						//var dhis2jsonresult = JSON.parse(result);
						//console.log(dhis2jsonresult);
						callback(JSON.stringify(result));
					});
					
				}
			});
		}

		function addToFile(dxfcontent, callback) {
			fs.appendFile('./flowdata.csv', dxfcontent, function (err) {
				if (err) throw err;
				console.log('The "data to append" was appended to file!');
				callback();
			});
		}
	});
}); 
} 

exports.start = start;
exports.survey_instances = survey_instances;
exports.question_answers = question_answers;
exports.sendData = sendData;
exports.getData = getData;

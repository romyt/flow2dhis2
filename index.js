var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/getData"] = requestHandlers.getData;
handle["/survey_instances"] = requestHandlers.survey_instances;
handle["/question_answers"] = requestHandlers.question_answers;
handle["/sendData"] = requestHandlers.sendData;

server.start(router.route, handle);

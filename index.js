var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/getData"] = requestHandlers.getData;
handle["/question_answers"] = requestHandlers.question_answers;
handle["/show"] = requestHandlers.show;

server.start(router.route, handle);

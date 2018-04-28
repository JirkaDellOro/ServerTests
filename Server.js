"use strict";
const Http = require("http");
console.log("Server starting");
let port = process.env.PORT;
if (port == undefined)
    port = 8100;
let server = Http.createServer();
server.addListener("listening", handleListen);
server.addListener("request", handleRequest);
server.listen(port);
function handleListen() {
    console.log("Listening on port: " + port);
}
function handleRequest(_request, _response) {
    let message = "event: test\n"; // send test as the type of event
    message += "retry: 1000\n"; // send every 1000 milliseconds
    message += "data: Hallo\n";
    message += "id: idTest\n\n";
    respond(_response, message);
}
function respond(_response, _text) {
    console.log("Preparing response: " + _text);
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.setHeader("content-Type", "text/event-stream");
    //      'Cache-Control': 'no-cache',
    //      'Connection': 'keep-alive',
    _response.write(_text);
    _response.end();
}
//# sourceMappingURL=Server.js.map
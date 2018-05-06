"use strict";
const Http = require("http");
const Url = require("url");
console.log("Server starting");
let connections = [];
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
    let query = Url.parse(_request.url, true).query;
    console.log(query);
    let command = query["command"];
    switch (command) {
        case "connect":
            setupServerSentEvents(_response);
            let log = logConnections();
            sendEvent("Connect user | " + log);
            break;
        default:
            sendEvent(JSON.stringify(query));
            respond(_response, JSON.stringify(query));
            break;
    }
}
function logConnections() {
    let log = "Connections: " + connections.length;
    console.log(log);
    return log;
}
function setupServerSentEvents(_connection) {
    setHeaders(_connection);
    connections.push(_connection);
}
function setHeaders(_connection) {
    _connection.setHeader("Access-Control-Allow-Origin", "*");
    _connection.setHeader("content-Type", "text/event-stream");
    _connection.setHeader("Connection", "keep-alive");
    _connection.setHeader("Cache-Control", "no-cache");
}
function sendEvent(_text) {
    let message = createMessage(_text);
    for (let connection of connections) {
        connection.write(message);
    }
}
function createMessage(_text) {
    let message = "event: receive\n"; // send test as the type of event
    //message += "retry: 1000\n"; // send every 1000 milliseconds
    message += "data: " + _text + "\n";
    message += "id: receive\n\n";
    return message;
}
function respond(_response, _text) {
    console.log("Preparing response: " + _text);
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.write(_text);
    _response.end();
}
//# sourceMappingURL=Server.js.map
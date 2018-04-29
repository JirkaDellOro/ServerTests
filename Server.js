"use strict";
const Http = require("http");
const Url = require("url");
console.log("Server starting");
let connections = {};
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
    let room = query["room"];
    let name = query["name"];
    if (!room || !name) {
        console.log("Room or name not defined. Room=" + room + " | Name=" + name);
        return;
    }
    let command = query["command"];
    switch (command) {
        case "connect":
            setupServerSentEvents(room, name, _response);
            sendEvent(room, "Connected user " + name + "to room " + room);
            logConnections(room);
            break;
        default:
            sendEvent(room, JSON.stringify(query));
            respond(_response, JSON.stringify(query));
            break;
    }
}
function logConnections(_room) {
    let log = "connected to room " + _room + ": ";
    for (let name in connections[_room])
        log += name + ", ";
    console.log(log);
}
function setupServerSentEvents(_room, _name, _connection) {
    _connection.setHeader("Access-Control-Allow-Origin", "*");
    _connection.setHeader("content-Type", "text/event-stream");
    _connection.setHeader("Connection", "keep-alive");
    _connection.setHeader("Cache-Control", "no-cache");
    if (!connections[_room])
        connections[_room] = {};
    connections[_room][_name] = _connection;
    _connection.addListener("close", function () {
        handleDisconnect(_room, _name);
    });
}
function sendEvent(_room, _text) {
    if (!connections[_room])
        return;
    for (let name in connections[_room]) {
        let message = "event: receive\n"; // send test as the type of event
        // message += "retry: 1000\n"; // send every 1000 milliseconds
        message += "data: " + _text + "\n";
        message += "id: receive\n\n";
        connections[_room][name].write(message);
    }
}
function respond(_response, _text) {
    console.log("Preparing response: " + _text);
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.write(_text);
    _response.end();
}
function handleDisconnect(_room, _name) {
    console.log("Disconnect " + _name + " from room " + _room);
}
//# sourceMappingURL=Server.js.map
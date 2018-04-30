import * as Http from "http";
import * as Url from "url";
console.log("Server starting");

interface Connections {
    [room: string]: {
        [name: string]: Http.ServerResponse;
    };
}
let connections: Connections = {};

let port: number = process.env.PORT;
if (port == undefined)
    port = 8100;

let server: Http.Server = Http.createServer();
server.addListener("listening", handleListen);
server.addListener("request", handleRequest);
server.listen(port);

function handleListen(): void {
    console.log("Listening on port: " + port);
}

// TODO: Client should first check for rooms and usernames via regular connections before SSE is established
function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    let query: Url.Url = Url.parse(_request.url, true).query;
    console.log(query);

    let room: string = query["room"];
    let name: string = query["name"];
    if (!room || !name) {
        console.log("Room or name not defined. Room=" + room + " | Name=" + name);
        // TODO: handle response, otherwise it's kept open...
        return;
    }

    let command: string = query["command"];
    switch (command) {
        case "connect":
            if (stopUserNameTaken(room, name, _response)) {
                return;
            }
            setupServerSentEvents(room, name, _response);
            sendEvent(room, "Connected user " + name + " to room " + room);
            logConnections(room);
            break;
        default:
            sendEvent(room, JSON.stringify(query));
            respond(_response, JSON.stringify(query));
            break;
    }
}

function stopUserNameTaken(_room: string, _name: string, _connection: Http.ServerResponse): boolean {
    if ((_room in connections) && (_name in connections[_room])) {
        setHeaders(_connection);
        let message: string = createMessage("Username already taken");
        _connection.write(message);
        _connection.end();
        return true;
    }
    return false;
}

function logConnections(_room: string): void {
    let log: string = "Connected to room " + _room + ": ";
    for (let name in connections[_room])
        log += name + ", ";
    console.log(log);
}

function setupServerSentEvents(_room: string, _name: string, _connection: Http.ServerResponse): void {
    setHeaders(_connection);

    if (!connections[_room])
        connections[_room] = {};
    connections[_room][_name] = _connection;

    _connection.addListener("close", function(): void {
        handleDisconnect(_room, _name);
    });
}

function setHeaders(_connection: Http.ServerResponse): void {
    _connection.setHeader("Access-Control-Allow-Origin", "*");
    _connection.setHeader("content-Type", "text/event-stream");
    _connection.setHeader("Connection", "keep-alive");
    _connection.setHeader("Cache-Control", "no-cache");
}

function sendEvent(_room: string, _text: string): void {
    if (!connections[_room])
        return;
    let message: string = createMessage(_text);
    for (let name in connections[_room]) {
        connections[_room][name].write(message);
        //connections[_room][name].end(); // don't end to keep connection open
    }
}

function createMessage(_text: string): string {
    let message: string = "event: receive\n"; // send test as the type of event
    //message += "retry: 1000\n"; // send every 1000 milliseconds
    message += "data: " + _text + "\n";
    message += "id: receive\n\n";
    return message;
}

function respond(_response: Http.ServerResponse, _text: string): void {
    console.log("Preparing response: " + _text);
    _response.setHeader("Access-Control-Allow-Origin", "*");
    _response.write(_text);
    _response.end();
}

function handleDisconnect(_room: string, _name: string): void {
    let log: string = "Disconnect " + _name + " from room " + _room;

    if (!connections[_room])
        return;

    delete (connections[_room][_name]);
    console.log(log);
    logConnections(_room);
    sendEvent(_room, log);
}
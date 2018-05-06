import * as Http from "http";
import * as Url from "url";
console.log("Server starting");

let connections: Http.ServerResponse[] = [];

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

function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    let query: Url.Url = Url.parse(_request.url, true).query;
    console.log(query);

    let command: string = query["command"];
    switch (command) {
        case "connect":
            setupServerSentEvents(_response);
            let log: string = logConnections();
            sendEvent("Connect user | " + log);
            break;
        default:
            sendEvent(JSON.stringify(query));
            respond(_response, JSON.stringify(query));
            break;
    }
}

function logConnections(): string {
    let log: string = "Connections: " + connections.length;
    console.log(log);
    return log;
}

function setupServerSentEvents(_connection: Http.ServerResponse): void {
    setHeaders(_connection);
    connections.push(_connection);
}

function setHeaders(_connection: Http.ServerResponse): void {
    _connection.setHeader("Access-Control-Allow-Origin", "*");
    _connection.setHeader("content-Type", "text/event-stream");
    _connection.setHeader("Connection", "keep-alive");
    _connection.setHeader("Cache-Control", "no-cache");
}

function sendEvent(_text: string): void {
    let message: string = createMessage(_text);
    for (let connection of connections) {
        connection.write(message);
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

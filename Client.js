var ServerSentEventsTest;
(function (ServerSentEventsTest) {
    window.addEventListener("load", init);
    let server = "http://localhost:8100";
    server = "https://serversentevents.herokuapp.com/";
    function init(_event) {
        var eventSource = new EventSource(server);
        console.log("connect to: " + server);
        eventSource.addEventListener("test", handleServerSentEvent);
    }
    function handleServerSentEvent(_event) {
        console.log(event);
    }
    ;
})(ServerSentEventsTest || (ServerSentEventsTest = {}));
//# sourceMappingURL=Client.js.map
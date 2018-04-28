var ServerSentEventsTest;
(function (ServerSentEventsTest) {
    window.addEventListener("load", init);
    function init(_event) {
        var eventSource = new EventSource("http://localhost:8100");
        eventSource.addEventListener("test", handleServerSentEvent);
    }
    function handleServerSentEvent(_event) {
        console.log(event);
    }
    ;
})(ServerSentEventsTest || (ServerSentEventsTest = {}));
//# sourceMappingURL=Client.js.map
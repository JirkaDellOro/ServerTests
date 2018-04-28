namespace ServerSentEventsTest {
    window.addEventListener("load", init);
    let server: string = "http://localhost:8100";
    server = "https://serversentevents.herokuapp.com/";

    function init(_event: Event): void {
        var eventSource: EventSource = new EventSource(server);
        console.log("connect to: " + server);
        eventSource.addEventListener("test", handleServerSentEvent);
    }

    function handleServerSentEvent(_event: Event): void {
        console.log(event);
    };
} 
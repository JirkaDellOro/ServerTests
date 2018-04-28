namespace ServerSentEventsTest {
    window.addEventListener("load", init);

    function init(_event: Event): void {
        var eventSource: EventSource = new EventSource("http://localhost:8100");
        eventSource.addEventListener("test", handleServerSentEvent);
    }

    function handleServerSentEvent(_event: Event): void {
        console.log(event);
    };
} 
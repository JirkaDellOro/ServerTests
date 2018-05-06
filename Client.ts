namespace ServerSentEventsTest {
    window.addEventListener("load", init);
    let server: string = "http://localhost:8100";
    //server = "https://serversentbroadcast.herokuapp.com/";
    let sendButton: HTMLButtonElement;

    function init(_event: Event): void {
        sendButton = <HTMLButtonElement>document.getElementById("send");
        sendButton.addEventListener("click", sendMessage);
        connect();
    }

    function handleServerSentEvent(_event: MessageEvent): void {
        console.log(_event);
        let chat: HTMLTextAreaElement = document.getElementsByTagName("textarea")[1];
        chat.value += _event.data + "\n";
    };

    function connect(): void {
        let url: string = server + "/?command=connect";
        var eventSource: EventSource = new EventSource(url);
        eventSource.addEventListener("receive", handleServerSentEvent);
    }

    function sendMessage(_event: Event): void {
        let message: HTMLTextAreaElement = document.getElementsByTagName("textarea")[0];
        let query: string = "command=send";
        query += "&message=" + message.value;
        console.log(query);
        sendRequest(query);
    }

    function sendRequest(_query: string): void {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("GET", server + "/?" + _query);
        xhr.send();
    }
} 
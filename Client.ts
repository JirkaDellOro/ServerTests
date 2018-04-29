namespace ServerSentEventsTest {
    window.addEventListener("load", init);
    let server: string = "http://localhost:8100";
    //server = "https://serversentevents.herokuapp.com/";
    let room: string;
    let name: string;
    let connectButton: HTMLButtonElement;
    let sendButton: HTMLButtonElement;

    function init(_event: Event): void {
        connectButton = <HTMLButtonElement>document.getElementById("connect");
        sendButton = <HTMLButtonElement>document.getElementById("send");
        connectButton.addEventListener("click", connectRoom);
        sendButton.addEventListener("click", sendMessage);
        sendButton.disabled = true;
    }

    function handleServerSentEvent(_event: MessageEvent): void {
        console.log(_event);
        let chat: HTMLTextAreaElement = document.getElementsByTagName("textarea")[1];
        chat.value += _event.data + "\n";
    };

    function connectRoom(_event: Event): void {
        console.log("connect to: " + server);
        let inputRoom: HTMLInputElement = <HTMLInputElement>document.getElementById("room");
        let inputName: HTMLInputElement = <HTMLInputElement>document.getElementById("name");
        name = inputName.value;
        room = inputRoom.value;
        inputRoom.disabled = true;
        inputName.disabled = true;
        connectButton.disabled = true;
        sendButton.disabled = false;
        let url: string = server + "/?command=connect&room=" + room + "&name=" + name;
        var eventSource: EventSource = new EventSource(url);
        eventSource.addEventListener("receive", handleServerSentEvent);
    }

    function sendMessage(_event: Event): void {
        let message: HTMLTextAreaElement = document.getElementsByTagName("textarea")[0];
        let query: string = "command=send";
        query += "&room=" + room;
        query += "&name=" + name;
        query += "&message=" + message.value;
        console.log(query);
        sendRequest(query);
    }

    function sendRequest(_query: string): void {//, _callback: EventListener): void {
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.open("GET", server + "/?" + _query);
        xhr.send();
    }
} 
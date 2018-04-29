var ServerSentEventsTest;
(function (ServerSentEventsTest) {
    window.addEventListener("load", init);
    let server = "http://localhost:8100";
    //server = "https://serversentevents.herokuapp.com/";
    let room;
    let name;
    let connectButton;
    let sendButton;
    function init(_event) {
        connectButton = document.getElementById("connect");
        sendButton = document.getElementById("send");
        connectButton.addEventListener("click", connectRoom);
        sendButton.addEventListener("click", sendMessage);
        sendButton.disabled = true;
    }
    function handleServerSentEvent(_event) {
        console.log(_event);
        let chat = document.getElementsByTagName("textarea")[1];
        chat.value += _event.data + "\n";
    }
    ;
    function connectRoom(_event) {
        console.log("connect to: " + server);
        let inputRoom = document.getElementById("room");
        let inputName = document.getElementById("name");
        name = inputName.value;
        room = inputRoom.value;
        inputRoom.disabled = true;
        inputName.disabled = true;
        connectButton.disabled = true;
        sendButton.disabled = false;
        let url = server + "/?command=connect&room=" + room + "&name=" + name;
        var eventSource = new EventSource(url);
        eventSource.addEventListener("receive", handleServerSentEvent);
    }
    function sendMessage(_event) {
        let message = document.getElementsByTagName("textarea")[0];
        let query = "command=send";
        query += "&room=" + room;
        query += "&name=" + name;
        query += "&message=" + message.value;
        console.log(query);
        sendRequest(query);
    }
    function sendRequest(_query) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", server + "/?" + _query);
        xhr.send();
    }
})(ServerSentEventsTest || (ServerSentEventsTest = {}));
//# sourceMappingURL=Client.js.map
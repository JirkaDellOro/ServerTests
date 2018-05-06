var ServerSentEventsTest;
(function (ServerSentEventsTest) {
    window.addEventListener("load", init);
    let server = "http://localhost:8100";
    //server = "https://serversentbroadcast.herokuapp.com/";
    let sendButton;
    function init(_event) {
        sendButton = document.getElementById("send");
        sendButton.addEventListener("click", sendMessage);
        connect();
    }
    function handleServerSentEvent(_event) {
        console.log(_event);
        let chat = document.getElementsByTagName("textarea")[1];
        chat.value += _event.data + "\n";
    }
    ;
    function connect() {
        let url = server + "/?command=connect";
        var eventSource = new EventSource(url);
        eventSource.addEventListener("receive", handleServerSentEvent);
    }
    function sendMessage(_event) {
        let message = document.getElementsByTagName("textarea")[0];
        let query = "command=send";
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
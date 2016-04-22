const body_parser = require("body-parser");
const json_print = require("printable-json");
const express = require("express");

const MessageSender = require("./core/message_sender");


var app = express();

app.set("port", (process.env.PORT));
app.use(body_parser.json());

app.get("/", (request, response) => {
    response.send("Just a Facebook messeger bot webhook, nothing here yet :D.");
});

app.get("/webhook", (request, response) => {
    if (request.query["hub.verify_token"] === process.env.SECRET)
        response.send(request.query["hub.challenge"]);

    response.send("Error, wrong validation token");
});

app.post('/webhook', (request, response) => {
    var messaging_events = request.body.entry[0].messaging;
    console.log(json_print.toString(request.body));

    for (var i = 0; i < messaging_events.length; i++) {
        var event = messaging_events[i];
        var sender_id = event.sender.id;
        var text = "";

        if (event.message && event.message.text)
            text = event.message.text;

        MessageSender.simple_message(sender_id, text);
    }

    response.sendStatus(200);
});

app.listen(app.get("port"), () => {
    console.log("Smough is now running at port: ", app.get("port"));
});

const body_parser = require("body-parser");
const express = require("express");

const MessageIterator = require("./core/message_iterator");
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
    var iterator = new MessageIterator.Iterator(request.body.entry[0].messaging);

    iterator.each_message((sender, message) => {
        if (message && message.text)
            MessageSender.simple_message(sender.id, message.text);
    });

    response.sendStatus(200);
});

app.listen(app.get("port"), () => {
    console.log("Smough is now running at port: ", app.get("port"));
});

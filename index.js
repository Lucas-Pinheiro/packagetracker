var express = require("express");
var body_parser = require("body-parser");


var app = express();

app.set("port", (process.env.PORT));
app.use(bodyParser.json());

app.get("/", (request, response) => {
    response.send("Just a Facebook messeger bot webhook, nothing here yet :D.");
});

app.get("/webhook", (request, response) => {
    if (request.query["hub.verify_token"] === process.env.SECRET)
        response.send(request.query["hub.challenge"]);

    response.send("Error, wrong validation token");
});

app.post('/webhook', (request, response) => {
    messaging_events = request.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {
        event = request.body.entry[0].messaging[i];
        sender = event.sender.id;
        if (event.message && event.message.text)
            text = event.message.text;

            console.log("=================================================");
            console.log(text);
    }

    response.sendStatus(200);
});

app.listen(app.get("port"), () => {
    console.log("Smough is now running at port: ", app.get("port"));
});

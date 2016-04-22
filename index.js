var body_parser = require("body-parser");
var express = require("express");
var request = require("request");


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

    for (var i = 0; i < messaging_events.length; i++) {
        var event = request.body.entry[0].messaging[i];
        var sender = event.sender.id;
        var text = "";

        if (event.message && event.message.text)
            text = event.message.text;

        console.log(text);
    }
    response.sendStatus({
        "recipient": {
            "id": "USER_ID"
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "What do you want to do next?",
                    "buttons": [
                        {
                            "type": "web_url",
                            "url": "https://petersapparel.parseapp.com",
                            "title": "Show Website"
                        },
                        {
                            "type": "postback",
                            "title": "Start Chatting",
                            "payload": "USER_DEFINED_PAYLOAD"
                        }
                    ]
                }
            }
        }
    });

});

app.listen(app.get("port"), () => {
    console.log("Smough is now running at port: ", app.get("port"));
});

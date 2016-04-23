const body_parser = require("body-parser");
const express = require("express");

const CommandParser = require("./core/command_parser");
const MessageIterator = require("./core/message_iterator");
const MessageSender = require("./core/message_sender");
const MessageTextBuilder = require("./core/message_text_builder");
const PostmonMediator = require("./core/postmon_mediator");
const json_print = require("printable-json");


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
    var promise = {};

    iterator.each_message((sender, message) => {
        if (message && message.text) {
            promise = new CommandParser.CommandPromise(message.text);

            promise
                .on_help(() => {
                    MessageSender.simple_message(sender.id, MessageTextBuilder.build_help());
                })
                .on_cep_address((cep) => {
                    PostmonMediator.get_cep_info(cep, (body) => {
                        if (body) {
                            MessageSender.simple_message(sender.id, MessageTextBuilder.build_cep(body));
                        } else
                            promise.fail(CommandParser.CommandError.ERROR_CODES.unknown_cep);
                    });
                })
                .on_package_status((package_code) => {
                    PostmonMediator.get_package_info(package_code, (body) => {
                        if (body) {
                            MessageSender.simple_message(sender.id, MessageTextBuilder.build_package(body));
                        } else
                            promise.fail(CommandParser.CommandError.ERROR_CODES.unknown_package);
                    });
                })
                .on_error((error) => {
                    MessageSender.simple_message(sender.id, MessageTextBuilder.build_error(error));
                })
                .resolve();
        }
    });

    response.sendStatus(200);
});

app.listen(app.get("port"), () => {
    console.log("Smough is now running at port: ", app.get("port"));
});

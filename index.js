"use strict";
var body_parser = require("body-parser");
var express = require("express");
var message_iterator_1 = require("./core/message_iterator");
var command_parser_1 = require("./core/command_parser");
var MessageSender = require("./core/message_sender");
var MessageTextBuilder = require("./core/message_text_builder");
var PostmonMediator = require("./core/postmon_mediator");
var app = express();
app.set("port", (process.env.PORT));
app.use(body_parser.json());
app.get("/", function (request, response) {
    response.send("Just a Facebook messeger bot webhook, nothing here yet :D.");
});
app.get("/webhook", function (request, response) {
    if (request.query["hub.verify_token"] === process.env.SECRET)
        response.send(request.query["hub.challenge"]);
    response.send("Error, wrong validation token");
});
app.post('/webhook', function (request, response) {
    var iterator = new message_iterator_1.Iterator(request.body.entry[0].messaging);
    var promise;
    iterator.each_message(function (sender, message) {
        if (message && message.text) {
            promise = new command_parser_1.CommandPromise(message.text);
            promise
                .on_help(function () {
                MessageSender.simple_message(sender.id, MessageTextBuilder.build_help());
            })
                .on_cep_address(function (cep) {
                PostmonMediator.get_cep_info(cep, function (body) {
                    if (body) {
                        MessageSender.simple_message(sender.id, MessageTextBuilder.build_cep(body));
                    }
                    else
                        promise.fail(command_parser_1.CommandError.ERROR_CODES.unknown_cep);
                });
            })
                .on_package_status(function (package_code) {
                PostmonMediator.get_package_info(package_code, function (body) {
                    if (body) {
                        MessageSender.ordered_messages(sender.id, MessageTextBuilder.build_package(body));
                    }
                    else
                        promise.fail(command_parser_1.CommandError.ERROR_CODES.unknown_package);
                });
            })
                .on_error(function (error) {
                MessageSender.simple_message(sender.id, MessageTextBuilder.build_error(error));
            })
                .resolve();
        }
    });
    response.sendStatus(200);
});
app.listen(app.get("port"), function () {
    console.log("Smough is now running at port: ", app.get("port"));
});

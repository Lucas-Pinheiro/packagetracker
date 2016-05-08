/// <reference path="../typings/main/ambient/body-parser/index.d.ts" />
/// <reference path="../typings/main/ambient/express/index.d.ts" />
/// <reference path="../typings/main/ambient/express-serve-static-core/index.d.ts" />
/// <reference path="../typings/main/ambient/node/index.d.ts" />
/// <reference path="../typings/main/ambient/request/index.d.ts" />
/// <reference path="./core/printable_json.d.ts" />

import * as body_parser from "body-parser";
import * as express from "express";

import {
    FBMessage,
    FBSender,
    Iterator
} from "./core/message_iterator";
import {
    CommandError,
    CommandPromise,
    SmoughError
} from "./core/command_parser";
import * as MessageSender from "./core/message_sender";
import * as MessageTextBuilder from "./core/message_text_builder";
import * as PostmonMediator from "./core/postmon_mediator";


var app = express();

app.set("port", (process.env.PORT));
app.use(body_parser.json());

app.get("/", (request: express.Request, response: express.Response) => {
    response.send("Just a Facebook messeger bot webhook, nothing here yet :D.");
});

app.get("/webhook", (request: express.Request, response: express.Response) => {
    if (request.query["hub.verify_token"] === process.env.SECRET)
        response.send(request.query["hub.challenge"]);

    response.send("Error, wrong validation token");
});

app.post('/webhook', (request: express.Request, response: express.Response) => {
    let iterator: Iterator = new Iterator(request.body.entry[0].messaging);
    let promise: CommandPromise;

    iterator.each_message((sender: FBSender, message: FBMessage) => {
        if (message && message.text) {
            promise = new CommandPromise(message.text);

            promise
                .on_help(() => {
                    MessageSender.simple_message(sender.id, MessageTextBuilder.build_help());
                })
                .on_cep_address((cep: string) => {
                    PostmonMediator.get_cep_info(cep, (body: PostmonMediator.PostmonCEP) => {
                        if (body) {
                            MessageSender.simple_message(sender.id, MessageTextBuilder.build_cep(body));
                        } else
                            promise.fail(CommandError.ERROR_CODES.unknown_cep);
                    });
                })
                .on_package_status((package_code: string) => {
                    PostmonMediator.get_package_info(package_code, (body: PostmonMediator.PostmonPackage) => {
                        if (body) {
                            MessageSender.ordered_messages(sender.id, MessageTextBuilder.build_package(body));
                        } else
                            promise.fail(CommandError.ERROR_CODES.unknown_package);
                    });
                })
                .on_error((error: SmoughError) => {
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

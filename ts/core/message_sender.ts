import * as request from "request";
import * as json_print from "printable-json";
import {IncomingMessage} from "http";

import {FBMessage} from "./message_iterator";


export function ordered_messages(recipient_id: number, messages: string[]) {
    if (!messages.length)
        return;

    request(
        {
            "method": "POST",
            "url": "https://graph.facebook.com/v2.6/me/messages",
            "qs": {
                "access_token": process.env.PAGE_TOKEN
            },
            "json": {
                "recipient": {
                    "id": recipient_id
                },
                "message": {
                    "text": messages[0]
                }
            }
        },
        (error: Error, response: IncomingMessage, body: any) => {
            if (error)
                console.log(`Simple message error: ${json_print.toString(error)}`);
            else {
                messages.shift();
                ordered_messages(recipient_id, messages);
            }
        }
    );
}

export function simple_message(recipient_id: number, text: string) {
    request(
        {
            "method": "POST",
            "url": "https://graph.facebook.com/v2.6/me/messages",
            "qs": {
                "access_token": process.env.PAGE_TOKEN
            },
            "json": {
                "recipient": {
                    "id": recipient_id
                },
                "message": {
                    "text": text
                }
            }
        },
        (error: Error, response: IncomingMessage, body: any) => {
            if (error)
                console.log(`Simple message error: ${json_print.toString(error)}`);
        }
    );
}

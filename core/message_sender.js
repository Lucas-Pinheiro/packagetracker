"use strict";
var request = require("request");
var json_print = require("printable-json");
function ordered_messages(recipient_id, messages) {
    if (!messages.length)
        return;
    request({
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
    }, function (error, response, body) {
        if (error)
            console.log("Simple message error: " + json_print.toString(error));
        else {
            messages.shift();
            ordered_messages(recipient_id, messages);
        }
    });
}
exports.ordered_messages = ordered_messages;
function simple_message(recipient_id, text) {
    request({
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
    }, function (error, response, body) {
        if (error)
            console.log("Simple message error: " + json_print.toString(error));
    });
}
exports.simple_message = simple_message;

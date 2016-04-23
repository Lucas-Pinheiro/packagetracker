const json_print = require("printable-json");
const request = require("request");


function ordered_messages(recipient_id, messages) {
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
        (error, response, body) => {
            if (error)
                console.log(`Simple message error: ${json_print.toString(error)}`);
            else if (response.body.error)
                console.log(`Simple message error: ${json_print.toString(response.body.error)}`);
            else {
                messages.shift();
                ordered_messages(recipient_id, messages);
            }
        }
    );
}

function simple_message(recipient_id, text) {
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
        (error, response, body) => {
            if (error)
                console.log(`Simple message error: ${json_print.toString(error)}`);
            else if (response.body.error)
                console.log(`Simple message error: ${json_print.toString(response.body.error)}`);
        }
    );
}


exports.ordered_messages = ordered_messages;
exports.simple_message = simple_message;

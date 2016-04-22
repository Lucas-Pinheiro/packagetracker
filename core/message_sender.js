const request = require("request");
const json_print = require("printable-json");


exports.simple_message = (recipient_id, text) => {
    request(
        {
            "method": "POST",
            "url": "https://graph.facebook.com/v2.6/me/messages",
            "qs": {
                "access_token": process.env.PAGE_TOKEN
            },
            "json": {
                "recipient":{
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
};

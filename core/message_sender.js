const request = require("request");


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
                console.log(`Simple message error: ${error}`);
            else if (response.body.error)
                console.log(`Simple message error: ${response.body.error}`);
        }
    );
};

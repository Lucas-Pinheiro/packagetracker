export class Iterator {
    private _messages: FBMessage[];

    constructor(messages: FBMessage[]) {
        this._messages = messages;
    }

    public each_message(callback: (sender: FBSender, message: FBMessage, recipient?: FBRecipient) => void) {
        for (var i = 0; i < this._messages.length; i++) {
            callback(
                this._messages[i].sender,
                this._messages[i].message,
                this._messages[i].recipient
            );
        }
    };
}

export interface FBMessage {
    sender: FBSender;
    message: FBMessage;
    recipient: FBRecipient;
}

export interface FBSender {
    id: number;
}

export interface FBMessage {
    mid: string;
    seq: number;
    text: string;
}

export interface FBRecipient {
    id: number;
}

exports.Iterator = Iterator;

function Iterator(messages) {
    var self = this;

    self._messages = messages;

    self.each_message = (callback) => {
        for (var i = 0; i < self._messages.length; i++) {
            callback(
                self._messages[i].sender,
                self._messages[i].message,
                self._messages[i].recipient
            );
        }
    };
}

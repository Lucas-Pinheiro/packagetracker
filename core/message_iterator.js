"use strict";
var Iterator = (function () {
    function Iterator(messages) {
        this._messages = messages;
    }
    Iterator.prototype.each_message = function (callback) {
        for (var i = 0; i < this._messages.length; i++) {
            callback(this._messages[i].sender, this._messages[i].message, this._messages[i].recipient);
        }
    };
    ;
    return Iterator;
}());
exports.Iterator = Iterator;

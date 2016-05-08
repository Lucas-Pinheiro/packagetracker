"use strict";
var CommandPromise = (function () {
    function CommandPromise(command) {
        this._actions = {
            "cep_address": function (cep) {
                console.log(Command.COMMANDS.cep_address + " command executed");
            },
            "package_status": function (package_code) {
                console.log(Command.COMMANDS.package_status + " command executed");
            },
            "help": function () {
                console.log(Command.COMMANDS.help + " command executed");
            },
            "error": function (error) {
                console.log("code: " + error.code + "; message: " + error.message);
            }
        };
        this._command = new Command(command);
    }
    CommandPromise.prototype.on_help = function (help_callback) {
        if (help_callback instanceof Function)
            this._actions.help = help_callback;
        return this;
    };
    CommandPromise.prototype.on_cep_address = function (cep_address_callback) {
        if (cep_address_callback instanceof Function)
            this._actions.cep_address = cep_address_callback;
        return this;
    };
    CommandPromise.prototype.on_package_status = function (package_status_callback) {
        if (package_status_callback instanceof Function)
            this._actions.package_status = package_status_callback;
        return this;
    };
    ;
    CommandPromise.prototype.on_error = function (error_callback) {
        if (error_callback instanceof Function)
            this._actions.error = error_callback;
        return this;
    };
    ;
    CommandPromise.prototype.fail = function (error) {
        this._actions.error(error);
    };
    ;
    CommandPromise.prototype.resolve = function () {
        if (this._command.error) {
            this._actions.error(this._command.error);
            return;
        }
        switch (this._command.command) {
            case Command.COMMANDS.cep_address:
                this._actions.cep_address(this._command.args.cep);
                break;
            case Command.COMMANDS.help:
                this._actions.help();
                break;
            case Command.COMMANDS.package_status:
                this._actions.package_status(this._command.args.package_code);
                break;
        }
    };
    ;
    return CommandPromise;
}());
exports.CommandPromise = CommandPromise;
var Command = (function () {
    function Command(command_chunk) {
        var splitted_command = command_chunk.split(" ");
        this.command = splitted_command[0];
        switch (this.command) {
            case Command.COMMANDS.cep_address:
                if (!splitted_command[1]) {
                    var error_aux_1 = CommandError.ERROR_CODES.no_cep_args;
                    this.error = new CommandError(error_aux_1.code, error_aux_1.message);
                    break;
                }
                else if (!Command.ARGS_REGEX.cep.test(splitted_command[1])) {
                    var error_aux_2 = CommandError.ERROR_CODES.unknown_cep_format;
                    this.error = new CommandError(error_aux_2.code, error_aux_2.message);
                    break;
                }
                this.args = {
                    "cep": splitted_command[1]
                };
                break;
            case Command.COMMANDS.help:
                break;
            case Command.COMMANDS.package_status:
                if (!splitted_command[1]) {
                    var error_aux_3 = CommandError.ERROR_CODES.no_package_args;
                    this.error = new CommandError(error_aux_3.code, error_aux_3.message);
                    break;
                }
                else if (!Command.ARGS_REGEX.package.test(splitted_command[1].toUpperCase())) {
                    var error_aux_4 = CommandError.ERROR_CODES.unknown_package_format;
                    this.error = new CommandError(error_aux_4.code, error_aux_4.message);
                    break;
                }
                this.args = {
                    "package_code": splitted_command[1].toUpperCase()
                };
                break;
            default:
                var error_aux = CommandError.ERROR_CODES.unknown_command;
                this.error = new CommandError(error_aux.code, error_aux.message);
        }
    }
    Command.COMMANDS = {
        "cep_address": "/cep",
        "help": "/help",
        "package_status": "/rastrear"
    };
    Command.ARGS_REGEX = {
        "cep": /^[0-9]{8}$/,
        "package": /^[0-9A-Z]{13}$/
    };
    return Command;
}());
var CommandError = (function () {
    function CommandError(code, message) {
        this.code = code;
        this.message = message;
    }
    CommandError.ERROR_CODES = {
        "unknown_command": {
            "code": "1",
            "message": "O comando digitado não foi reconhecido"
        },
        "unknown_cep_format": {
            "code": "2",
            "message": "O CEP inserido não está no formato correto"
        },
        "unknown_cep": {
            "code": "3",
            "message": "O CEP inserido não existe"
        },
        "unknown_package_format": {
            "code": "4",
            "message": "O código de rastreamento inserido não está no formato correto"
        },
        "unknown_package": {
            "code": "5",
            "message": "O pacote informado não existe"
        },
        "no_cep_args": {
            "code": "6",
            "message": "Voc\u00EA enviou o comando '" + Command.COMMANDS.cep_address + "' sem o n\u00FAmero do CEP"
        },
        "no_package_args": {
            "code": "7",
            "message": "Voc\u00EA enviou o comando '" + Command.COMMANDS.package_status + "' sem o c\u00F3digo de rastreamento"
        }
    };
    return CommandError;
}());
exports.CommandError = CommandError;

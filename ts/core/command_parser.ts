export class CommandPromise {
    private _command: Command;

    private _actions = {
        "cep_address": (cep: string) => {
            console.log(`${Command.COMMANDS.cep_address} command executed`);
        },
        "package_status": (package_code: string) => {
            console.log(`${Command.COMMANDS.package_status} command executed`);
        },
        "help": () => {
            console.log(`${Command.COMMANDS.help} command executed`);
        },
        "error": (error: SmoughError) => {
            console.log(`code: ${error.code}; message: ${error.message}`);
        }
    };

    constructor(command: string) {
        this._command = new Command(command);
    }

   public on_help(help_callback: () => void): CommandPromise {
        if (help_callback instanceof Function)
            this._actions.help = help_callback;

        return this;
    }

    public on_cep_address(cep_address_callback: (cep: string) => void): CommandPromise {
        if (cep_address_callback instanceof Function)
            this._actions.cep_address = cep_address_callback;

        return this;
    }

    public on_package_status(package_status_callback: (package_code: string) => void): CommandPromise {
        if (package_status_callback instanceof Function)
            this._actions.package_status = package_status_callback;

        return this;
    };

    public on_error(error_callback: (error: SmoughError) => void): CommandPromise {
        if (error_callback instanceof Function)
            this._actions.error = error_callback;

        return this;
    };

    public fail(error: CommandError): void {
        this._actions.error(error);
    };

    public resolve(): void {
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
}

class Command {
    public command: string;
    public error: SmoughError;
    public args: ArgsList;

    public static COMMANDS = {
        "cep_address": "/cep",
        "help": "/help",
        "package_status": "/rastrear"
    };

    public static ARGS_REGEX = {
        "cep": /^[0-9]{8}$/,
        "package": /^[0-9A-Z]{13}$/
    };

    constructor(command_chunk: string) {
        let splitted_command: string[] = command_chunk.split(" ");
        this.command = splitted_command[0];

        switch (this.command) {
            case Command.COMMANDS.cep_address:
                if (!splitted_command[1]) {
                    let error_aux: SmoughError = CommandError.ERROR_CODES.no_cep_args;
                    this.error = new CommandError(error_aux.code, error_aux.message);
                    break;
                } else if (!Command.ARGS_REGEX.cep.test(splitted_command[1])) {
                    let error_aux: SmoughError = CommandError.ERROR_CODES.unknown_cep_format;
                    this.error = new CommandError(error_aux.code, error_aux.message);
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
                    let error_aux: SmoughError = CommandError.ERROR_CODES.no_package_args;
                    this.error = new CommandError(error_aux.code, error_aux.message);
                    break;
                } else if (!Command.ARGS_REGEX.package.test(splitted_command[1].toUpperCase())) {
                    let error_aux: SmoughError = CommandError.ERROR_CODES.unknown_package_format;
                    this.error = new CommandError(error_aux.code, error_aux.message);
                    break;
                }

                this.args = {
                    "package_code": splitted_command[1].toUpperCase()
                };
                break;
            default:
                let error_aux: SmoughError = CommandError.ERROR_CODES.unknown_command;
                this.error = new CommandError(error_aux.code, error_aux.message);
        }
    }
}

export class CommandError implements SmoughError {
    public code: string;
    public message: string;
    public static ERROR_CODES = {
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
            "message": `Você enviou o comando '${Command.COMMANDS.cep_address}' sem o número do CEP`
        },
        "no_package_args": {
            "code": "7",
            "message": `Você enviou o comando '${Command.COMMANDS.package_status}' sem o código de rastreamento`
        }
    };

    constructor(code: string, message: string) {
        this.code = code;
        this.message = message;
    }
}

export interface SmoughError {
    code: string;
    message: string;
}

interface SmoughCommand {
    command: string;
    error: SmoughError;
    args: ArgsList;
}

interface ArgsList {
    cep?: string;
    package_code?: string;
}

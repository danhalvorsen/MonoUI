import { ICommandLineParser } from "./ICommandLineParser.js";
import { ApplicationArgs } from "../../models/ApplicationArgs.js";

export class StandardCommandLineParser implements ICommandLineParser {
    private readonly args: string[];

    constructor(args: string[]) {
        this.args = args;
    }

    parse(): ApplicationArgs {
        const result: ApplicationArgs = {
            command: "",
            options: {},
            positionals: [],
        };

        for (let i = 0; i < this.args.length; i++) {
            const arg = this.args[i];

            if (arg.startsWith("--")) {
                const name = arg.substring(2);
                if (i + 1 < this.args.length && !this.args[i + 1].startsWith("-")) {
                    result.options[name] = this.args[i + 1];
                    i++;
                } else {
                    result.options[name] = true;
                }
            } else if (arg.startsWith("-")) {
                result.options[arg.substring(1)] = true;
            } else {
                if (!result.command) {
                    result.command = arg;
                } else {
                    result.positionals.push(arg);
                }
            }
        }

        return result;
    }
}

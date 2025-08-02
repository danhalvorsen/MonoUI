import { ApplicationArgs } from "../../models/ApplicationArgs.js";

export interface ICommandLineParser {
    parse(): ApplicationArgs;
}
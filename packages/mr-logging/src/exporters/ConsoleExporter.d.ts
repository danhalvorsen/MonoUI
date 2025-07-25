import { ILogExporter } from "../interfaces/ILogExporter";
export declare class ConsoleExporter implements ILogExporter {
    exportLog(level: string, message: string, attributes?: Record<string, any>): void;
}

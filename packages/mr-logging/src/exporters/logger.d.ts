import { ILogExporter } from "../interfaces/ILogExporter";
export declare class Logger {
    private exporters;
    constructor(exporters: ILogExporter[]);
    log(level: string, message: string, attributes?: Record<string, any>): void;
    info(message: string, attributes?: Record<string, any>): void;
    warn(message: string, attributes?: Record<string, any>): void;
    error(message: string, attributes?: Record<string, any>): void;
}

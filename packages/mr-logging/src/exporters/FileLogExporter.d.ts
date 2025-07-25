import { ILogExporter } from "../interfaces/ILogExporter";
export declare class FileLogExporter implements ILogExporter {
    private filePath;
    constructor(filePath?: string);
    exportLog(level: string, message: string, attributes?: Record<string, any>): Promise<void>;
}

export interface ILogExporter {
    exportLog(level: string, message: string, attributes?: Record<string, any>): void;
}

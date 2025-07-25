import { ILogExporter } from "../interfaces/ILogExporter";
export interface OtelConfig {
    endpoint: string;
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
}
export declare class OtelGrpcExporter implements ILogExporter {
    private provider;
    constructor(config: OtelConfig);
    exportLog(level: string, message: string, attributes?: Record<string, any>): void;
}

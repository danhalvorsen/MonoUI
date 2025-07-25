export interface LoggingConfig {
    endpoint: string;
    serviceName: string;
    logLevel: string;
    batchSize: number;
}
export declare class LoggingConfigLoader {
    static load(): LoggingConfig;
}

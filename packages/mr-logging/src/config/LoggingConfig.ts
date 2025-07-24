// File: src/config/LoggingConfig.ts
export interface LoggingConfig {
    endpoint: string;
    serviceName: string;
    logLevel: string;
    batchSize: number;
  }
  
  export class LoggingConfigLoader {
    static load(): LoggingConfig {
      const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4317";
      const serviceName = process.env.OTEL_SERVICE_NAME ?? "mr-service";
      const logLevel = process.env.OTEL_LOG_LEVEL ?? "INFO";
      const batchSize = parseInt(process.env.OTEL_BATCH_SIZE ?? "512", 10);
  
      if (!endpoint) throw new Error("LoggingConfig: OTEL_EXPORTER_OTLP_ENDPOINT is required");
      if (!serviceName) throw new Error("LoggingConfig: OTEL_SERVICE_NAME is required");
  
      return { endpoint, serviceName, logLevel, batchSize };
    }
  }
  
// src/exporters/OtelGrpcExporter.ts
import { ILogExporter } from "../interfaces/ILogExporter";
import { LoggerProvider, BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-grpc";
import { Resource } from "@opentelemetry/resources";

export interface OtelConfig {
  endpoint: string;
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
}

export class OtelGrpcExporter implements ILogExporter {
  private provider: LoggerProvider;

  constructor(config: OtelConfig) {
    this.provider = new LoggerProvider({
      resource: new Resource({
        ["service.name"]: config.serviceName,
        ["service.version"]: config.serviceVersion ?? "1.0.0",
        ["deployment.environment"]: config.environment ?? "development",
        ["service.instance.id"]: crypto.randomUUID?.() ?? `${Date.now()}`
      }),
    });

    const exporter = new OTLPLogExporter({ url: config.endpoint });
    this.provider.addLogRecordProcessor(new BatchLogRecordProcessor(exporter));
  }

  exportLog(level: string, message: string, attributes?: Record<string, any>): void {
    const logger = this.provider.getLogger("mr-logger");
    logger.emit({
      severityText: level.toUpperCase(),
      body: message,
      attributes: attributes || {},
    });
  }
}

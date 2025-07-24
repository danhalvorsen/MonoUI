// src/index.ts
import { ConsoleExporter } from "./exporters/ConsoleExporter";
import { OtelGrpcExporter } from "./exporters/OtelGrpcExporter";
import { Logger } from "./exporters/logger";

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4317";
const serviceName = process.env.SERVICE_NAME || "mr-service";
const serviceVersion = process.env.SERVICE_VERSION || "1.0.0";
const environment = process.env.DEPLOYMENT_ENVIRONMENT || "development";

// Exporters (configurable)
const exporters = [
  new ConsoleExporter(),
  new OtelGrpcExporter({ endpoint, serviceName, serviceVersion, environment })
];

// Shared logger instance
export const log = new Logger(exporters);

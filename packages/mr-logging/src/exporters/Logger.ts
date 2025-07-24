// src/Logger.ts
import { ILogExporter } from "../interfaces/ILogExporter";

export class Logger {
  private exporters: ILogExporter[];

  constructor(exporters: ILogExporter[]) {
    this.exporters = exporters;
  }

  log(level: string, message: string, attributes?: Record<string, any>): void {
    this.exporters.forEach(exporter => exporter.exportLog(level, message, attributes));
  }

  info(message: string, attributes?: Record<string, any>) {
    this.log("INFO", message, attributes);
  }

  warn(message: string, attributes?: Record<string, any>) {
    this.log("WARN", message, attributes);
  }

  error(message: string, attributes?: Record<string, any>) {
    this.log("ERROR", message, attributes);
  }
}

import { ILogExporter } from "../interfaces/ILogExporter";

export class Logger {
  private exporters: ILogExporter[];

  constructor(exporters: ILogExporter[]) {
    if (!exporters || exporters.length === 0) {
      throw new Error("Logger: at least one exporter is required");
    }
    this.exporters = exporters;
  }

  log(level: string, message: string, attributes?: Record<string, any>): void {
    if (message == null || (typeof message === "string" && message.trim() === "")) {
      throw new Error("Logger: message cannot be null or empty");
    }

    this.exporters.forEach(exporter =>
      exporter.exportLog(level, message, attributes)
    );
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

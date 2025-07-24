// src/exporters/ConsoleExporter.ts
import { ILogExporter } from "../interfaces/ILogExporter";

export class ConsoleExporter implements ILogExporter {
  exportLog(level: string, message: string, attributes: Record<string, any> = {}): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, attributes);
  }
}

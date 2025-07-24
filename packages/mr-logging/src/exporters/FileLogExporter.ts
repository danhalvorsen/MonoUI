// src/exporters/FileLogExporter.ts
import { promises as fs } from "fs";
import { ILogExporter } from "../interfaces/ILogExporter";
import path from "path";

export class FileLogExporter implements ILogExporter {
  private filePath: string;

  constructor(filePath: string = "buildlog") {
    this.filePath = path.resolve(filePath);
  }

  async exportLog(level: string, message: string, attributes: Record<string, any> = {}): Promise<void> {
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...attributes,
    }) + "\n";

    await fs.appendFile(this.filePath, logEntry, { encoding: "utf-8" });
  }
}

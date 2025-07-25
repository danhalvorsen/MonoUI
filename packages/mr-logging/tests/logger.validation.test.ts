import { describe, it, expect } from "vitest";
import { Logger } from "../src/exporters/logger";
import type { ILogExporter } from "../src/interfaces/ILogExporter";

// A mock exporter to track calls
class MockExporter implements ILogExporter {
  public calls: Array<{ level: string; message: string; attributes?: Record<string, any> }> = [];
  exportLog(level: string, message: string, attributes?: Record<string, any>): void {
    this.calls.push({ level, message, attributes });
  }
}

describe("Logger Validation", () => {
  it("should throw if created with no exporters", () => {
    expect(() => new Logger([])).toThrow("Logger: at least one exporter is required");
  });

  it("should throw if message is null", () => {
    const logger = new Logger([new MockExporter()]);
    expect(() => logger.info(null as any)).toThrow("Logger: message cannot be null or empty");
  });

  it("should throw if message is undefined", () => {
    const logger = new Logger([new MockExporter()]);
    expect(() => logger.info(undefined as any)).toThrow("Logger: message cannot be null or empty");
  });

  it("should throw if message is an empty string", () => {
    const logger = new Logger([new MockExporter()]);
    expect(() => logger.info("")).toThrow("Logger: message cannot be null or empty");
  });

  it("should log a valid message successfully", () => {
    const mock = new MockExporter();
    const logger = new Logger([mock]);
    logger.info("Valid message");
    expect(mock.calls.length).toBe(1);
    expect(mock.calls[0].message).toBe("Valid message");
    expect(mock.calls[0].level).toBe("INFO");
  });
});

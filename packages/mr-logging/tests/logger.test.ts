import { describe, it, expect } from "vitest";
import { Logger } from "../src/exporters/logger";
import { ConsoleExporter } from "../src/exporters/ConsoleExporter";

describe("Logger (unit)", () => {
  const logger = new Logger([new ConsoleExporter()]);

  it("should log info messages (positive)", () => {
    expect(() => logger.info("Hello")).not.toThrow();
  });

  it("should log error messages (positive)", () => {
    expect(() => logger.error("Error!")).not.toThrow();
  });

  it("should throw if logging null (negative)", () => {
    expect(() => logger.info(null as any)).toThrow();
  });

  it("should log with attributes (positive)", () => {
    expect(() => logger.info("With attributes", { foo: "bar" })).not.toThrow();
  });
});

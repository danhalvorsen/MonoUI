import { describe, it, expect } from "vitest";
import { IFormatter } from "../dist";
 

describe("IFormatter", () => {
  it("should format values using custom formatter", () => {
    const formatter: IFormatter = {
      format: (key: string, value: any, format: string) => {
        if (key === "Price" && format === "currency") return `$${Number(value).toFixed(2)}`;
        return String(value);
      }
    };

    const formatted = formatter.format("Price", 123.456, "currency");
    expect(formatted).toBe("$123.46");
  });
});

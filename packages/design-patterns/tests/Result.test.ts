import { describe, it, expect } from "vitest";
import { Result } from "../src/result/Result";

describe("Result Pattern", () => {
  it("should create a success result", () => {
    const res = Result.ok(42);
    expect(res.isSuccess).toBe(true);
    expect(res.value).toBe(42);
    expect(res.errors).toBeUndefined();
  });

  it("should create a failure result", () => {
    const res = Result.fail("Error occurred");
    expect(res.isSuccess).toBe(false);
    expect(res.value).toBeUndefined();
    expect(res.errors).toEqual(["Error occurred"]);
  });

  it("should map a value if success", () => {
    const res = Result.ok(5).map(x => x * 2);
    expect(res.isSuccess).toBe(true);
    expect(res.value).toBe(10);
  });

  it("should fail map if original result failed", () => {
    const res = Result.fail<number>("Nope").map(x => x * 2);
    expect(res.isSuccess).toBe(false);
    expect(res.errors).toContain("Nope");
  });

  it("should flatMap results for chaining", () => {
    const res = Result.ok(2).flatMap(x => Result.ok(x * 5));
    expect(res.isSuccess).toBe(true);
    expect(res.value).toBe(10);
  });

  it("should combine multiple results", () => {
    const res1 = Result.ok(1);
    const res2 = Result.fail("Error A");
    const res3 = Result.fail("Error B");
    const combined = Result.combine([res1, res2, res3]);
    expect(combined.isSuccess).toBe(false);
    expect(combined.errors).toEqual(["Error A", "Error B"]);
  });
});

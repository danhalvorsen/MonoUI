import { describe, it, expect } from "vitest";
import { IResult, Result, ResultFactory } from "../src/result";

describe("Result Pattern", () => {
  describe("Result Class Implementation", () => {
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
      const res = Result.ok(5).map((x: number) => x * 2);
      expect(res.isSuccess).toBe(true);
      expect(res.value).toBe(10);
    });

    it("should fail map if original result failed", () => {
      const res = Result.fail<number>("Nope").map((x: number) => x * 2);
      expect(res.isSuccess).toBe(false);
      expect(res.errors).toContain("Nope");
    });

    it("should flatMap results for chaining", () => {
      const res = Result.ok(2).flatMap((x: number) => Result.ok(x * 5));
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

  describe("ResultFactory", () => {
    it("should create a success result via factory", () => {
      const res = ResultFactory.ok(42);
      expect(res.isSuccess).toBe(true);
      expect(res.value).toBe(42);
      expect(res.errors).toBeUndefined();
    });

    it("should create a failure result via factory", () => {
      const res = ResultFactory.fail("Error occurred");
      expect(res.isSuccess).toBe(false);
      expect(res.value).toBeUndefined();
      expect(res.errors).toEqual(["Error occurred"]);
    });

    it("should combine multiple results via factory", () => {
      const res1 = ResultFactory.ok(1);
      const res2 = ResultFactory.fail("Error A");
      const combined = ResultFactory.combine([res1, res2]);
      expect(combined.isSuccess).toBe(false);
      expect(combined.errors).toEqual(["Error A"]);
    });
  });

  describe("Interface Compliance", () => {
    // Test to ensure factory creates objects that correctly implement the interface
    it("should create objects implementing IResult", () => {
      const successResult: IResult<number> = ResultFactory.ok(42);
      const failureResult: IResult<string> = ResultFactory.fail("Error");
      
      // Verify interface contract is fulfilled
      expect(typeof successResult.isSuccess).toBe("boolean");
      expect(successResult.map).toBeInstanceOf(Function);
      expect(successResult.flatMap).toBeInstanceOf(Function);
      
      expect(typeof failureResult.isSuccess).toBe("boolean");
      expect(failureResult.map).toBeInstanceOf(Function);
      expect(failureResult.flatMap).toBeInstanceOf(Function);
    });
    
    it("should correctly implement map through interface", () => {
      const result: IResult<number> = ResultFactory.ok(5);
      const mapped = result.map((x: { toString: () => any; }) => x.toString());
      
      expect(mapped.isSuccess).toBe(true);
      expect(mapped.value).toBe("5");
    });
    
    it("should correctly implement flatMap through interface", () => {
      const result: IResult<number> = ResultFactory.ok(5);
      const flatMapped = result.flatMap((x: number) => ResultFactory.ok(x * 2));
      
      expect(flatMapped.isSuccess).toBe(true);
      expect(flatMapped.value).toBe(10);
    });
  });
  
  describe("Practical Usage", () => {
    function divide(a: number, b: number): IResult<number> {
      if (b === 0) {
        return ResultFactory.fail("Division by zero");
      }
      return ResultFactory.ok(a / b);
    }
    
    it("should handle successful operations", () => {
      const result = divide(10, 2);
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(5);
    });
    
    it("should handle failed operations", () => {
      const result = divide(10, 0);
      expect(result.isSuccess).toBe(false);
      expect(result.errors).toContain("Division by zero");
    });
    
    it("should support operation chaining", () => {
      // Attempt to divide 10 by 2, then multiply by 3
      const result = divide(10, 2)
        .flatMap((result: number) => ResultFactory.ok(result * 3));
      
      expect(result.isSuccess).toBe(true);
      expect(result.value).toBe(15);
    });
    
    it("should short-circuit on failure", () => {
      // This should fail at the division step and never execute the multiplication
      const result = divide(10, 0)
        .flatMap((result: number) => ResultFactory.ok(result * 3));
      
      expect(result.isSuccess).toBe(false);
      expect(result.errors).toContain("Division by zero");
      expect(result.value).toBeUndefined();
    });
  });
});
import { describe, it, expect } from "vitest";
import { Pipeline } from "../src/core/Pipeline";
import { CalculatorData, SumPipe, MultiplyPipe } from "../src/pipes/CalculatorPipes";

describe("Calculator Pipeline", () => {
  it("should correctly sum numbers and multiply the result (positive test)", async () => {
    const pipeline = new Pipeline<CalculatorData>()
      .addPipe(new SumPipe())          // sums the numbers
      .addPipe(new MultiplyPipe(3));   // multiplies by 3

    const input: CalculatorData = { context: { numbers: [2, 4, 6] } };
    const result = await pipeline.run(input);

    expect(result.context.sum).toBe(36); // (2+4+6)=12 *3 = 36
    expect(result.context.steps).toEqual([
      "Summed to 12",
      "Multiplied by 3 → 36"
    ]);
  });

  it("should handle empty numbers array (negative test)", async () => {
    const pipeline = new Pipeline<CalculatorData>()
      .addPipe(new SumPipe())
      .addPipe(new MultiplyPipe(2));

    const input: CalculatorData = { context: { numbers: [] } };
    const result = await pipeline.run(input);

    expect(result.context.sum).toBe(0);
    expect(result.context.steps).toEqual([
      "Summed to 0",
      "Multiplied by 2 → 0"
    ]);
  });

  it("should handle negative numbers correctly", async () => {
    const pipeline = new Pipeline<CalculatorData>()
      .addPipe(new SumPipe())
      .addPipe(new MultiplyPipe(2));

    const input: CalculatorData = { context: { numbers: [-1, -2, -3] } };
    const result = await pipeline.run(input);

    expect(result.context.sum).toBe(-12); // (-1 + -2 + -3) = -6 * 2 = -12
    expect(result.context.steps).toEqual([
      "Summed to -6",
      "Multiplied by 2 → -12"
    ]);
  });

  it("should throw if numbers context is missing (negative test)", async () => {
    const pipeline = new Pipeline<CalculatorData>()
      .addPipe(new SumPipe())
      .addPipe(new MultiplyPipe(2));

    const input: CalculatorData = { context: {} as any }; // intentionally broken

    await expect(pipeline.run(input)).rejects.toThrow("numbers is required");
  });
});

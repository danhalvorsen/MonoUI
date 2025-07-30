import { IData } from "../../core/IData";
import { Pipe } from "../../core/Pipe";

export interface CalculatorData extends IData {
  context: {
    numbers: number[];
    sum?: number;
    steps?: string[];
  };
}

export class SumPipe extends Pipe<CalculatorData> {
  constructor() {
    super("SumPipe", async (data: CalculatorData) => {
      const numbers = data.context.numbers;
      if (!numbers) throw new Error("numbers is required");
      if (!Array.isArray(numbers)) throw new Error("context.numbers must be an array");

      const sum = numbers.reduce((acc, n) => acc + n, 0);
      data.context.sum = sum;
      data.context.steps = [...(data.context.steps ?? []), `Summed to ${sum}`];
      return data;
    });
  }
}

export class MultiplyPipe extends Pipe<CalculatorData> {
  constructor(private multiplier: number) {
    super("MultiplyPipe", async (data: CalculatorData) => {
      const result = (data.context.sum ?? 0) * this.multiplier;
      data.context.sum = result;
      data.context.steps = [...(data.context.steps || []), `Multiplied by ${this.multiplier} → ${result}`];
      return data;
    });
  }
}

export class SubtractPipe extends Pipe<CalculatorData> {
  constructor(private subtractor: number) {
    super("SubtractPipe", async (data: CalculatorData) => {
      const result = (data.context.sum ?? 0) - this.subtractor;
      data.context.sum = result;
      data.context.steps = [...(data.context.steps || []), `Subtracted ${this.subtractor} → ${result}`];
      return data;
    });
  }
}

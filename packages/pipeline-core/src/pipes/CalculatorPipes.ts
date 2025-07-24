// src/pipes/CalculatorPipes.ts
import { Pipe } from "../core/Pipe";
import { IData } from "../core/IData";

export interface CalculatorData extends IData {
  context: {
    numbers: number[];
    sum?: number;
    steps?: string[];
  };
}

export class SumPipe extends Pipe<CalculatorData> {
  constructor() {
    super("SumPipe", async (data) => {
      const sum = data.context.numbers.reduce((a, b) => a + b, 0);
      data.context.sum = sum;
      data.context.steps = [...(data.context.steps || []), `Summed to ${sum}`];
      return data;
    });
  }
}

export class MultiplyPipe extends Pipe<CalculatorData> {
  constructor(private multiplier: number) {
    super("MultiplyPipe", async (data) => {
      const result = (data.context.sum ?? 0) * this.multiplier;
      data.context.sum = result;
      data.context.steps = [...(data.context.steps || []), `Multiplied by ${this.multiplier} → ${result}`];
      return data;
    });
  }
}

export class SubtractPipe extends Pipe<CalculatorData> {
  constructor(private subtractor: number) {
    super("SubtractPipe", async (data) => {
      const result = (data.context.sum ?? 0) - this.subtractor;
      data.context.sum = result;
      data.context.steps = [...(data.context.steps || []), `Subtracted ${this.subtractor} → ${result}`];
      return data;
    });
  }
}

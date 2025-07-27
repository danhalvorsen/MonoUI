// File: src/index.ts
export class Calculator {
  add(a: number, b: number): number { return a + b; }
  sub(a: number, b: number): number { return a - b; }
  mul(a: number, b: number): number { return a * b; }
  div(a: number, b: number): number {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  }
}

export const calculator = new Calculator();
export default Calculator;

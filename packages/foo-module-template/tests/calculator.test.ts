import { describe, it, expect } from 'vitest';
import Calculator from '../src/index';

describe('Calculator', () => {
  const calc = new Calculator();

  it('should add two numbers', () => {
    expect(calc.add(2, 3)).toBe(5);
  });

  it('should subtract two numbers', () => {
    expect(calc.sub(5, 3)).toBe(2);
  });

  it('should multiply two numbers', () => {
    expect(calc.mul(4, 3)).toBe(12);
  });

  it('should divide two numbers', () => {
    expect(calc.div(10, 2)).toBe(5);
  });

  it('should throw when dividing by zero', () => {
    expect(() => calc.div(10, 0)).toThrowError('Division by zero');
  });
});

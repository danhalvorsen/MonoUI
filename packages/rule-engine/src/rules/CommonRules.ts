import { Rule } from "./Rule.js";
import { RuleResult } from "./RuleResult.js";

function compare(a: any, b: any): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
  throw new Error("Unsupported type for comparison");
}

// Comparison rules
export class GreaterThanRule<T> extends Rule<T> {
  constructor(private min: T) { super("GreaterThan"); }
  validate(value: T, path: string): RuleResult {
    const ok = compare(value, this.min) > 0;
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must be greater than ${this.min}` };
  }
}

export class LessThanOrEqualRule<T> extends Rule<T> {
  constructor(private max: T) { super("LessThanOrEqual"); }
  validate(value: T, path: string): RuleResult {
    const ok = compare(value, this.max) <= 0;
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must be <= ${this.max}` };
  }
}

export class BetweenRule<T> extends Rule<T> {
  constructor(private min: T, private max: T) { super("Between"); }
  validate(value: T, path: string): RuleResult {
    const ok = compare(value, this.min) >= 0 && compare(value, this.max) <= 0;
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must be between ${this.min} and ${this.max}` };
  }
}

// String rules
export class NotEmptyRule extends Rule<any> {
  constructor() { super("NotEmpty"); }
  validate(value: any, path: string): RuleResult {
    const ok = value != null && value.length !== 0;
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? "Must not be empty" };
  }
}

export class LengthRule extends Rule<any> {
  constructor(private min?: number, private max?: number) { super("Length"); }
  validate(value: any, path: string): RuleResult {
    const len = value?.length ?? 0;
    const ok = (this.min == null || len >= this.min) && (this.max == null || len <= this.max);
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Length must be between ${this.min} and ${this.max}` };
  }
}

export class MatchesRule extends Rule<string> {
  constructor(private regex: RegExp) { super("Matches"); }
  validate(value: string, path: string): RuleResult {
    const ok = this.regex.test(value);
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must match ${this.regex}` };
  }
}

export class StartsWithRule extends Rule<string> {
  constructor(private prefix: string) { super("StartsWith"); }
  validate(value: string, path: string): RuleResult {
    const ok = typeof value === "string" && value.startsWith(this.prefix);
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must start with '${this.prefix}'` };
  }
}

export class EndsWithRule extends Rule<string> {
  constructor(private suffix: string) { super("EndsWith"); }
  validate(value: string, path: string): RuleResult {
    const ok = typeof value === "string" && value.endsWith(this.suffix);
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must end with '${this.suffix}'` };
  }
}

export class ContainsRule extends Rule<string> {
  constructor(private substring: string) { super("Contains"); }
  validate(value: string, path: string): RuleResult {
    const ok = typeof value === "string" && value.includes(this.substring);
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must contain '${this.substring}'` };
  }
}

// Date rules
export class AfterDateRule extends Rule<Date> {
  message: string;
  constructor(private minDate: Date) { super("AfterDate"); }
  validate(value: Date, path: string): RuleResult {
    const ok = value instanceof Date && value.getTime() > this.minDate.getTime();
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must be after ${this.minDate.toISOString()}` };
  }
}

export class BeforeDateRule extends Rule<Date> {
  message: string;
  constructor(private maxDate: Date) { super("BeforeDate"); }
  validate(value: Date, path: string): RuleResult {
    const ok = value instanceof Date && value.getTime() < this.maxDate.getTime();
    return { isValid: ok, ruleName: this.name, path, message: this.message ?? `Must be before ${this.maxDate.toISOString()}` };
  }
}

import "reflect-metadata";
import { injectable } from "tsyringe";
 
import { ITemplate, ITemplateEngine } from "abstract-template";
import { ComparisonRule } from "./ComparisonRule.js";
import { IComparer, DefaultComparer } from "./IComparer.js";
import { RuleResult } from "./RuleResult.js";
import { Specification } from "../Patterns/Specification.js";

// Comparison rules
@injectable()
export class GreaterThanRule<T> extends ComparisonRule<T> implements Specification<T> {
  constructor(
    private min: T,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T> = new DefaultComparer()
  ) {
    super("GreaterThan", template, engine, comparer);
  }

  predicate: (candidate: T) => boolean = (candidate: T) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T): boolean {
    return this.comparer.compare(candidate, this.min) > 0;
  }

  validate(value: T, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, this.min, { Min: this.min })
    };
  }

  buildMessage(path: string, value: T, compareTo?: T, extra?: Record<string, any>): string {
    return `Value at '${path}' must be greater than ${extra?.Min}, but got ${value}.`;
  }
}

@injectable()
export class LessThanOrEqualRule<T> extends ComparisonRule<T> implements Specification<T> {
  constructor(
    private max: T,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T> = new DefaultComparer()
  ) {
    super("LessThanOrEqual", template, engine, comparer);
  }

  predicate: (candidate: T) => boolean = (candidate: T) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T): boolean {
    return this.comparer.compare(candidate, this.max) <= 0;
  }

  validate(value: T, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, this.max, { Max: this.max })
    };
  }

  buildMessage(path: string, value: T, compareTo?: T, extra?: Record<string, any>): string {
    return `Value at '${path}' must be less than or equal to ${extra?.Max}, but got ${value}.`;
  }
}

@injectable()
export class BetweenRule<T> extends ComparisonRule<T> implements Specification<T> {
  constructor(
    private min: T,
    private max: T,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T> = new DefaultComparer()
  ) {
    super("Between", template, engine, comparer);
  }

  predicate: (candidate: T) => boolean = (candidate: T) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T): boolean {
    const low = this.comparer.compare(candidate, this.min) >= 0;
    const high = this.comparer.compare(candidate, this.max) <= 0;
    return low && high;
  }

  validate(value: T, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Min: this.min, Max: this.max })
    };
  }

  buildMessage(path: string, value: T, compareTo?: T, extra?: Record<string, any>): string {
    return `Value at '${path}' must be between ${extra?.Min} and ${extra?.Max}, but got ${value}.`;
  }
}

// String rules
@injectable()
export class NotEmptyRule extends ComparisonRule<any> implements Specification<any> {
  constructor(
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<any> = new DefaultComparer()
  ) {
    super("NotEmpty", template, engine, comparer);
  }

  predicate: (candidate: any) => boolean = (candidate: any) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: any): boolean {
    return candidate != null && candidate.length !== 0;
  }

  validate(value: any, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value)
    };
  }

  buildMessage(path: string, value: any, compareTo?: any, extra?: Record<string, any>): string {
    return `Value at '${path}' must not be empty, but got ${value}.`;
  }
}

@injectable()
export class LengthRule extends ComparisonRule<any> implements Specification<any> {
  constructor(
    template: ITemplate,
    engine: ITemplateEngine,
    private min?: number,
    private max?: number,
    comparer: IComparer<any> = new DefaultComparer()
  ) {
    super("Length", template, engine, comparer);
  }

  predicate: (candidate: any) => boolean = (candidate: any) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: any): boolean {
    const len = candidate?.length ?? 0;
    return (this.min == null || len >= this.min) && (this.max == null || len <= this.max);
  }

  validate(value: any, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Min: this.min, Max: this.max })
    };
  }

  buildMessage(path: string, value: any, compareTo?: any, extra?: Record<string, any>): string {
    return `Length at '${path}' must be between ${extra?.Min} and ${extra?.Max}, but got ${value?.length ?? 0}.`;
  }
}

@injectable()
export class MatchesRule extends ComparisonRule<string> implements Specification<string> {
  constructor(
    private regex: RegExp,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<string> = new DefaultComparer()
  ) {
    super("Matches", template, engine, comparer);
  }

  predicate: (candidate: string) => boolean = (candidate: string) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: string): boolean {
    return this.regex.test(candidate);
  }

  validate(value: string, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Regex: this.regex })
    };
  }

  buildMessage(path: string, value: string, compareTo?: string, extra?: Record<string, any>): string {
    return `Value at '${path}' must match ${extra?.Regex}, but got '${value}'.`;
  }
}

@injectable()
export class StartsWithRule extends ComparisonRule<string> implements Specification<string> {
  constructor(
    private prefix: string,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<string> = new DefaultComparer()
  ) {
    super("StartsWith", template, engine, comparer);
  }

  predicate: (candidate: string) => boolean = (candidate: string) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: string): boolean {
    return typeof candidate === "string" && candidate.startsWith(this.prefix);
  }

  validate(value: string, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Prefix: this.prefix })
    };
  }

  buildMessage(path: string, value: string, compareTo?: string, extra?: Record<string, any>): string {
    return `Value at '${path}' must start with '${extra?.Prefix}', but got '${value}'.`;
  }
}

@injectable()
export class EndsWithRule extends ComparisonRule<string> implements Specification<string> {
  constructor(
    private suffix: string,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<string> = new DefaultComparer()
  ) {
    super("EndsWith", template, engine, comparer);
  }

  predicate: (candidate: string) => boolean = (candidate: string) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: string): boolean {
    return typeof candidate === "string" && candidate.endsWith(this.suffix);
  }

  validate(value: string, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Suffix: this.suffix })
    };
  }

  buildMessage(path: string, value: string, compareTo?: string, extra?: Record<string, any>): string {
    return `Value at '${path}' must end with '${extra?.Suffix}', but got '${value}'.`;
  }
}

@injectable()
export class ContainsRule extends ComparisonRule<string> implements Specification<string> {
  constructor(
    private substring: string,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<string> = new DefaultComparer()
  ) {
    super("Contains", template, engine, comparer);
  }

  predicate: (candidate: string) => boolean = (candidate: string) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: string): boolean {
    return typeof candidate === "string" && candidate.includes(this.substring);
  }

  validate(value: string, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Substring: this.substring })
    };
  }

  buildMessage(path: string, value: string, compareTo?: string, extra?: Record<string, any>): string {
    return `Value at '${path}' must contain '${extra?.Substring}', but got '${value}'.`;
  }
}

// Date rules
@injectable()
export class AfterDateRule extends ComparisonRule<Date> implements Specification<Date> {
  constructor(
    private minDate: Date,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<Date> = new DefaultComparer()
  ) {
    super("AfterDate", template, engine, comparer);
  }

  predicate: (candidate: Date) => boolean = (candidate: Date) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: Date): boolean {
    return candidate instanceof Date && candidate.getTime() > this.minDate.getTime();
  }

  validate(value: Date, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, this.minDate, { MinDate: this.minDate })
    };
  }

  buildMessage(path: string, value: Date, compareTo?: Date, extra?: Record<string, any>): string {
    return `Value at '${path}' must be after ${extra?.MinDate?.toISOString()}, but got ${value?.toISOString()}.`;
  }
}

@injectable()
export class BeforeDateRule extends ComparisonRule<Date> implements Specification<Date> {
  constructor(
    private maxDate: Date,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<Date> = new DefaultComparer()
  ) {
    super("BeforeDate", template, engine, comparer);
  }

  predicate: (candidate: Date) => boolean = (candidate: Date) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: Date): boolean {
    return candidate instanceof Date && candidate.getTime() < this.maxDate.getTime();
  }

  validate(value: Date, path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, this.maxDate, { MaxDate: this.maxDate })
    };
  }

  buildMessage(path: string, value: Date, compareTo?: Date, extra?: Record<string, any>): string {
    return `Value at '${path}' must be before ${extra?.MaxDate?.toISOString()}, but got ${value?.toISOString()}.`;
  }
}

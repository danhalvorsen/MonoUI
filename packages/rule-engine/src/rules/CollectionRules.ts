import "reflect-metadata";
 
import { ITemplate, ITemplateEngine } from "abstract-template";
import { injectable } from "tsyringe";
import { ComparisonRule } from "./ComparisonRule.js";
import { IComparer, DefaultComparer } from "./IComparer.js";
import { RuleResult } from "./RuleResult.js";
import { Specification } from "../Patterns/Specification.js";

// Collection rules for arrays and collections
@injectable()
export class CollectionNotEmptyRule<T> extends ComparisonRule<T[]> implements Specification<T[]> {
  constructor(
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T[]> = new DefaultComparer()
  ) {
    super("CollectionNotEmpty", template, engine, comparer);
  }

  predicate: (candidate: T[]) => boolean = (candidate: T[]) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T[]): boolean {
    return Array.isArray(candidate) && candidate.length > 0;
  }

  validate(value: T[], path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value)
    };
  }

  buildMessage(path: string, value: T[], compareTo?: T[], extra?: Record<string, any>): string {
    return `Collection at '${path}' must not be empty, but got ${value?.length ?? 0} items.`;
  }
}

@injectable()
export class CountBetweenRule<T> extends ComparisonRule<T[]> implements Specification<T[]> {
  constructor(
    private min: number,
    private max: number,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T[]> = new DefaultComparer()
  ) {
    super("CountBetween", template, engine, comparer);
  }

  predicate: (candidate: T[]) => boolean = (candidate: T[]) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T[]): boolean {
    if (!Array.isArray(candidate)) return false;
    const count = candidate.length;
    return count >= this.min && count <= this.max;
  }

  validate(value: T[], path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Min: this.min, Max: this.max })
    };
  }

  buildMessage(path: string, value: T[], compareTo?: T[], extra?: Record<string, any>): string {
    const count = value?.length ?? 0;
    return `Collection at '${path}' must have between ${extra?.Min} and ${extra?.Max} items, but got ${count}.`;
  }
}

@injectable()
export class AllRule<T> extends ComparisonRule<T[]> implements Specification<T[]> {
  constructor(
    private itemPredicate: (item: T) => boolean,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T[]> = new DefaultComparer()
  ) {
    super("All", template, engine, comparer);
  }

  predicate: (candidate: T[]) => boolean = (candidate: T[]) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T[]): boolean {
    if (!Array.isArray(candidate)) return false;
    return candidate.every(this.itemPredicate);
  }

  validate(value: T[], path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value)
    };
  }

  buildMessage(path: string, value: T[], compareTo?: T[], extra?: Record<string, any>): string {
    const count = value?.length ?? 0;
    const validCount = value?.filter(this.itemPredicate).length ?? 0;
    return `All items in collection at '${path}' must satisfy the condition, but ${count - validCount} of ${count} items failed.`;
  }
}

@injectable()
export class AnyRule<T> extends ComparisonRule<T[]> implements Specification<T[]> {
  constructor(
    private itemPredicate: (item: T) => boolean,
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T[]> = new DefaultComparer()
  ) {
    super("Any", template, engine, comparer);
  }

  predicate: (candidate: T[]) => boolean = (candidate: T[]) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T[]): boolean {
    if (!Array.isArray(candidate)) return false;
    return candidate.some(this.itemPredicate);
  }

  validate(value: T[], path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value)
    };
  }

  buildMessage(path: string, value: T[], compareTo?: T[], extra?: Record<string, any>): string {
    const count = value?.length ?? 0;
    return `At least one item in collection at '${path}' must satisfy the condition, but none of ${count} items passed.`;
  }
}

@injectable()
export class UniqueRule<T> extends ComparisonRule<T[]> implements Specification<T[]> {
  constructor(
    template: ITemplate,
    engine: ITemplateEngine,
    comparer: IComparer<T[]> = new DefaultComparer(),
    private keySelector?: (item: T) => any
  ) {
    super("Unique", template, engine, comparer);
  }

  predicate: (candidate: T[]) => boolean = (candidate: T[]) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T[]): boolean {
    if (!Array.isArray(candidate)) return false;
    
    const keys = this.keySelector 
      ? candidate.map(this.keySelector)
      : candidate;
    
    const uniqueKeys = new Set(keys);
    return uniqueKeys.size === candidate.length;
  }

  validate(value: T[], path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value)
    };
  }

  buildMessage(path: string, value: T[], compareTo?: T[], extra?: Record<string, any>): string {
    const count = value?.length ?? 0;
    const keys = this.keySelector 
      ? value?.map(this.keySelector) ?? []
      : value ?? [];
    const uniqueCount = new Set(keys).size;
    const duplicateCount = count - uniqueCount;
    
    return `Collection at '${path}' must contain unique items, but found ${duplicateCount} duplicate(s) among ${count} items.`;
  }
}

// Convenience rule that combines NotEmpty and CountBetween
@injectable()
export class CountRule<T> extends ComparisonRule<T[]> implements Specification<T[]> {
  constructor(
    private min: number,
    template: ITemplate,
    engine: ITemplateEngine,
    private max?: number,
    comparer: IComparer<T[]> = new DefaultComparer()
  ) {
    super("Count", template, engine, comparer);
  }

  predicate: (candidate: T[]) => boolean = (candidate: T[]) => this.isSatisfiedBy(candidate);

  isSatisfiedBy(candidate: T[]): boolean {
    if (!Array.isArray(candidate)) return false;
    const count = candidate.length;
    return count >= this.min && (this.max === undefined || count <= this.max);
  }

  validate(value: T[], path: string): RuleResult {
    const ok = this.isSatisfiedBy(value);
    return {
      isValid: ok,
      ruleName: this.name,
      path,
      message: this.buildMessage(path, value, undefined, { Min: this.min, Max: this.max })
    };
  }

  buildMessage(path: string, value: T[], compareTo?: T[], extra?: Record<string, any>): string {
    const count = value?.length ?? 0;
    if (extra?.Max === undefined) {
      return `Collection at '${path}' must have at least ${extra?.Min} items, but got ${count}.`;
    }
    return `Collection at '${path}' must have between ${extra?.Min} and ${extra?.Max} items, but got ${count}.`;
  }
}

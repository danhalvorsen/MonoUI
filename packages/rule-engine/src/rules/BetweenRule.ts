import "reflect-metadata";
import { ITemplate, ITemplateEngine } from "abstract-template";
import { injectable } from "tsyringe";
import { IComparer, DefaultComparer } from "./IComparer.js";
import { RuleResult } from "./RuleResult.js";
import { ComparisonRule } from "./ComparisonRule.js";
export interface Specification<T> {
  predicate: (candidate: T) => boolean;
  isSatisfiedBy(candidate: T): boolean;
  and(other: Specification<T>): Specification<T>;
  or(other: Specification<T>): Specification<T>;
  not(): Specification<T>;
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

and(other: Specification<T>): Specification<T> {
  return {
    predicate: (candidate: T) => this.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate),
    isSatisfiedBy: (candidate: T) => this.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate),
    and: (another: Specification<T>) => this.and(another),
    or: (another: Specification<T>) => this.or(another),
    not: () => this.not()
  };
}
or(other: Specification<T>): Specification<T> {
  return {
    predicate: (candidate: T) => this.isSatisfiedBy(candidate) || other.isSatisfiedBy(candidate),
    isSatisfiedBy: (candidate: T) => this.isSatisfiedBy(candidate) || other.isSatisfiedBy(candidate),
    and: (another: Specification<T>) => this.and(another),
    or: (another: Specification<T>) => this.or(another),
    not: () => this.not()
  };
}
not(): Specification<T> {
  return {
    predicate: (candidate: T) => !this.isSatisfiedBy(candidate),
    isSatisfiedBy: (candidate: T) => !this.isSatisfiedBy(candidate),
    and: (another: Specification<T>) => this.and(another),
    or: (another: Specification<T>) => this.or(another),
    not: () => this.not()
  };
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

  buildMessage(
    path: string,
    value: T,
    compareTo?: T,
    extra?: Record<string, any>
  ): string {
    return `Value at '${path}' must be between ${extra?.Min} and ${extra?.Max}, but got ${value}.`;
  }
}

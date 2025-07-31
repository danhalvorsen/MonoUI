import { ITemplateEngine, ITemplate } from "abstract-template";
import { RuleResult } from "../rules/RuleResult.js";
import { Specification } from "../Patterns/Specification.js";
 
export abstract class AbstractValidator<T> {
  protected rules: ((obj: T) => RuleResult)[] = [];
  constructor(protected engine: ITemplateEngine) { }

  RuleFor<K extends T>(selector: (x: T) => K, spec: Specification<K>, path: string, template: ITemplate, ruleName: string, extra?: Record<string, any>): this {
    this.rules.push((obj: T) => this.validate(spec as unknown as Specification<T>, selector(obj) as unknown as T, path, template, ruleName, extra));
    return this;
  }

  addRule(rule: (obj: T) => RuleResult): void {
    this.rules.push(rule);
  }

  validateAll(obj: T): RuleResult[] {
    return this.rules.map(r => r(obj));
  }

  abstract validate(rule: Specification<T>, value: T, path: string, template: ITemplate, ruleName: string, extra?: Record<string, any>): RuleResult;
}

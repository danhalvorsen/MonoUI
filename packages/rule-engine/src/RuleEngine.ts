import "reflect-metadata";

import { RuleResult } from "./rules/RuleResult.js";
import { Rule } from "./rules/Rule.js";
import { RuleBuilder } from "./builder-and-factory/RuleBuilder.js";
import { ValidationResult } from "./validation/validationResult.js";

export class RuleEngine<T> {
  private rules: ((obj: T) => RuleResult[])[] = [];

  RuleFor<K>(selector: (x: T) => K, path?: string): RuleBuilder<T, K> {
    const rules: Rule<K>[] = [];
    this.rules.push(obj => rules.map(r => r.validate(selector(obj), path ?? this.getPath(selector))));
    return new RuleBuilder<T, K>(this as any, selector, path ?? this.getPath(selector));
  }

  When(predicate: (obj: T) => boolean, builderFn: (b: RuleEngine<T>) => void): this {
    const subEngine = new RuleEngine<T>();
    builderFn(subEngine);
    this.rules.push(obj => predicate(obj) ? subEngine.validate(obj).results : []);
    return this;
  }

  validate(obj: T): ValidationResult {
    const results = this.rules.flatMap(fn => fn(obj));
    return new ValidationResult(results);
  }

  private getPath(selector: Function): string {
    return selector.toString().match(/=>\s*.*\.(\w+)/)?.[1] ?? "unknown";
  }
}
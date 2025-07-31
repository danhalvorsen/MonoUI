import { RuleBuilder } from "../builder-and-factory/RuleBuilder.js";
import { RuleResult } from "../rules/RuleResult.js";
import { AbstractValidator } from "../validation/AbstractValidator.js";

// Declaration for DI usage
export interface IRuleValidator<T> {
  RuleFor<K>(selector: (x: T) => K, path: string): RuleBuilder<T, K>;
  When(predicate: (x: T) => boolean, configure: (v: this) => void): this;
  SetValidator<K>(selector: (x: T) => K, validator: AbstractValidator<K>, path: string): this;
  validateAll(obj: T): RuleResult[];
}

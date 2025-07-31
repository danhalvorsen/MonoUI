
import "reflect-metadata";

import { ITemplate, ITemplateEngine } from "abstract-template";
import { Specification } from "../Patterns/Specification.js";
import { RuleResult } from "./RuleResult.js";

/**
 * A composite rule that combines a specification with a template and template engine
 */
export class CompositeRule<T> implements Specification<T> {
  constructor(
    private spec: Specification<T>,
    private template: ITemplate,
    private engine: ITemplateEngine,
    private ruleName: string = "CompositeRule"
  ) {}

  isSatisfiedBy(value: T): boolean {
    return this.spec.isSatisfiedBy(value);
  }

  and(other: Specification<T>): Specification<T> {
    return this.spec.and(other);
  }

  or(other: Specification<T>): Specification<T> {
    return this.spec.or(other);
  }

  not(): Specification<T> {
    return this.spec.not();
  }

  validate(value: T, path: string): RuleResult {
    const isValid = this.isSatisfiedBy(value);
    return {
      isValid,
      ruleName: this.ruleName,
      path,
      message: isValid ? undefined : this.engine.render(this.template, { data: { value, path } })
    };
  }
}

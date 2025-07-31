import { ITemplateEngine, ITemplate } from "abstract-template";
import { injectable } from "tsyringe";
import { RuleResult } from "../rules/RuleResult.js";
import { Specification } from "../Patterns/Specification.js";
import { AbstractValidator } from "./AbstractValidator.js";
// RuleValidator for rendering messages and applying rules
@injectable()
export class RuleValidator<T> extends AbstractValidator<T> {
  constructor(engine: ITemplateEngine) {
    super(engine);
  }

  validate(rule: Specification<T>, value: T, path: string, template: ITemplate, ruleName: string, extra?: Record<string, any>): RuleResult {
    const isValid = value !== null && value !== undefined && rule.isSatisfiedBy(value);
    const message = this.engine.render(template, {
      data: { PropertyName: path, Value: value, ...extra }
    });
    return { isValid, ruleName, path, message };
  }
}
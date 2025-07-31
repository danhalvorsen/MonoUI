import { ITemplate, TemplateType } from "abstract-template";
import { Specification } from "../Patterns/Specification.js";
import { AbstractValidator } from "../validation/AbstractValidator.js";
import { CompositeRule } from "../rules/CompositeRule.js";

export class RuleBuilder<T, K> {
  constructor(
    private parent: AbstractValidator<T>,
    private selector: (x: T) => K,
    private path: string
  ) {}

  Must(spec: Specification<K>, message: string, ruleName: string, extra?: Record<string, any>): AbstractValidator<T> {
    const template: ITemplate = { content: message, type: TemplateType.Text };
    const composite = new CompositeRule(spec, template, (this.parent as any).engine, ruleName);
    (this.parent as AbstractValidator<T>).addRule((obj: T) =>
      this.parent.validate(composite as unknown as Specification<T>, this.selector(obj) as unknown as T, this.path, template, ruleName, extra)
    );
    return this.parent;
  }
}
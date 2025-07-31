import "reflect-metadata";
import "reflect-metadata";
import { ITemplateEngine, ITemplate } from "abstract-template";
import { IComparer, DefaultComparer } from "./IComparer.js";
import { RuleResult } from "./RuleResult.js";
import { Specification } from "../Patterns/Specification.js";

// Abstract reusable base for all comparison rules, now implementing Specification

export abstract class ComparisonRule<T> implements Specification<T> {
    protected readonly engine: ITemplateEngine;
    protected readonly comparer: IComparer<T>;

    constructor(
        protected readonly name: string,
        protected readonly template: ITemplate,
        engine?: ITemplateEngine,
        comparer: IComparer<T> = new DefaultComparer()
    ) {
        this.engine = engine ?? { render: () => "" } as ITemplateEngine;
        this.comparer = comparer;
    }

    protected buildMessage(
        path: string,
        value: T,
        compareTo?: T,
        extra?: Record<string, any>
    ): string {
        return this.engine.render(this.template, {
            data: { PropertyName: path, Value: value, CompareTo: compareTo, ...extra }
        });
    }

    abstract validate(value: T, path: string): RuleResult;
    abstract isSatisfiedBy(candidate: T): boolean;

    // Specification pattern methods
    and(other: Specification<T>): Specification<T> {
        const self = this;
        return {
            isSatisfiedBy(x: T): boolean { return self.isSatisfiedBy(x) && other.isSatisfiedBy(x); },
            and: this.and.bind(this),
            or: this.or.bind(this),
            not: this.not.bind(this)
        };
    }
    or(other: Specification<T>): Specification<T> {
        const self = this;
        return {
            isSatisfiedBy(x: T): boolean { return self.isSatisfiedBy(x) || other.isSatisfiedBy(x); },
            and: this.and.bind(this),
            or: this.or.bind(this),
            not: this.not.bind(this)
        };
    }
    not(): Specification<T> {
        const self = this;
        return {
            isSatisfiedBy(x: T): boolean { return !self.isSatisfiedBy(x); },
            and: this.and.bind(this),
            or: this.or.bind(this),
            not: this.not.bind(this)
        };
    }
}

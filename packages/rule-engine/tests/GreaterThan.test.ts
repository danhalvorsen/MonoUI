
import "reflect-metadata";
import { describe, it, expect } from "vitest";
import { BetweenRule } from "../src/rules/BetweenRule.js";
import { RuleValidator } from "../src//validation/RuleValidator.js";
import { FakeTemplateEngine } from "./FakeTemplateEngine.js";
import { ITemplate, TemplateType } from "@packages/abstract-template";
 
describe("RuleValidator with RuleFor", () => {
  it("should validate multiple rules using RuleFor", () => {
    const engine = new FakeTemplateEngine();
    const validator = new RuleValidator<any>(engine);

    const template: ITemplate = { content: "", type: TemplateType.Text };

    const betweenAge = new BetweenRule<number>(18, 65, template, engine);
    const betweenScore = new BetweenRule<number>(0, 100, template, engine);

    validator
      .RuleFor((x: any) => x.age, betweenAge, "age", template, "BetweenAge")
      .RuleFor((x: any) => x.score, betweenScore, "score", template, "BetweenScore");

    const resultValid = validator.validateAll({ age: 30, score: 90 });
    const resultInvalid = validator.validateAll({ age: 15, score: 110 });

    expect(resultValid.every(r => r.isValid)).toBe(true);
    expect(resultInvalid.some(r => !r.isValid)).toBe(true);
    expect(resultInvalid[0].message).toContain("Rendered");
  });
});

describe("Specification combinators", () => {
  it("should combine rules with AND, OR, and NOT", () => {
    const engine = new FakeTemplateEngine();
    const template: ITemplate = { content: "", type: "text" };

    // Test AND combinator: both age and score rules applied to same value
    const ageRule = new BetweenRule<number>(18, 65, template, engine);
    const scoreRule = new BetweenRule<number>(50, 100, template, engine);
    const andSpec = ageRule.and(scoreRule);

    // Test OR combinator 
    const orSpec = ageRule.or(scoreRule);

    // Test NOT combinator
    const notSpec = ageRule.not();

    // AND: value must satisfy both rules (18-65 AND 50-100)
    expect(andSpec.isSatisfiedBy(60)).toBe(true);  // 60 is in both ranges
    expect(andSpec.isSatisfiedBy(30)).toBe(false); // 30 is in age range but not score range
    expect(andSpec.isSatisfiedBy(10)).toBe(false); // 10 is in neither range

    // OR: value must satisfy at least one rule (18-65 OR 50-100)
    expect(orSpec.isSatisfiedBy(60)).toBe(true);   // 60 satisfies both
    expect(orSpec.isSatisfiedBy(30)).toBe(true);   // 30 satisfies age rule
    expect(orSpec.isSatisfiedBy(80)).toBe(true);   // 80 satisfies score rule
    expect(orSpec.isSatisfiedBy(10)).toBe(false);  // 10 satisfies neither

    // NOT: value must NOT satisfy the age rule (NOT 18-65)
    expect(notSpec.isSatisfiedBy(10)).toBe(true);  // 10 is outside 18-65
    expect(notSpec.isSatisfiedBy(70)).toBe(true);  // 70 is outside 18-65
    expect(notSpec.isSatisfiedBy(30)).toBe(false); // 30 is inside 18-65
  });
});

describe("RuleValidator with individual rules", () => {
  it("should validate multiple separate rules", () => {
    const engine = new FakeTemplateEngine();
    const template: ITemplate = { content: "", type: "text" };
    const validator = new RuleValidator<any>(engine);

    const ageRule = new BetweenRule<number>(18, 65, template, engine);
    const scoreRule = new BetweenRule<number>(0, 100, template, engine);
    const notAgeRule = ageRule.not();

    validator
      .RuleFor((x: any) => x.age, ageRule, "age", template, "AgeRule")
      .RuleFor((x: any) => x.score, scoreRule, "score", template, "ScoreRule");

    // Test valid case: age=30 (18-65), score=90 (0-100)
    const validResults = validator.validateAll({ age: 30, score: 90 });
    expect(validResults.every(r => r.isValid)).toBe(true);
    expect(validResults).toHaveLength(2);

    // Test invalid case: age=10 (outside 18-65), score=200 (outside 0-100)
    const invalidResults = validator.validateAll({ age: 10, score: 200 });
    expect(invalidResults.every(r => !r.isValid)).toBe(true);
    expect(invalidResults).toHaveLength(2);

    // Test mixed case: age=30 (valid), score=200 (invalid)
    const mixedResults = validator.validateAll({ age: 30, score: 200 });
    expect(mixedResults.some(r => r.isValid)).toBe(true);   // age rule passes
    expect(mixedResults.some(r => !r.isValid)).toBe(true);  // score rule fails
    expect(mixedResults).toHaveLength(2);
  });

  it("should validate NOT specification correctly", () => {
    const engine = new FakeTemplateEngine();
    const template: ITemplate = { content: "", type: "text" };
    const validator = new RuleValidator<any>(engine);

    const ageRule = new BetweenRule<number>(18, 65, template, engine);
    const notAgeRule = ageRule.not();

    validator.RuleFor((x: any) => x.age, notAgeRule, "age", template, "NotAgeRule");

    // Age 10 is outside 18-65, so NOT rule should pass
    const youngResults = validator.validateAll({ age: 10 });
    expect(youngResults[0].isValid).toBe(true);

    // Age 30 is inside 18-65, so NOT rule should fail
    const adultResults = validator.validateAll({ age: 30 });
    expect(adultResults[0].isValid).toBe(false);

    // Age 70 is outside 18-65, so NOT rule should pass
    const oldResults = validator.validateAll({ age: 70 });
    expect(oldResults[0].isValid).toBe(true);
  });
});

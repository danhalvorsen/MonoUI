import "reflect-metadata"
import { describe, it, expect } from "vitest";
import { BaseSpecification } from "../src/Patterns/Specification.js";

interface User { age: number; name: string; }

describe("BaseSpecification", () => {
  it("should combine with AND/OR/NOT", () => {
    const isAdult = new BaseSpecification<User>((u: User) => u.age >= 18);
    const hasName = new BaseSpecification<User>((u: User) => u.name.length > 0);

    const spec = isAdult.and(hasName.not());
    expect(spec.isSatisfiedBy({ age: 20, name: "" })).toBe(true);
    expect(spec.isSatisfiedBy({ age: 20, name: "Dan" })).toBe(false);
  });
});
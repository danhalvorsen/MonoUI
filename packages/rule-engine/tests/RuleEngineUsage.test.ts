import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AbstractValidator } from "../src/validation/AbstractValidator.js";
import { Specification, BaseSpecification } from "../src/Patterns/Specification.js";
import { RuleResult } from "../src/rules/RuleResult.js";

// Mock implementations for testing
class MockTemplateEngine {
  render(template: any, context: any): string {
    return `Validation for ${context.data?.PropertyName || 'unknown'}: ${context.data?.Value}`;
  }
}

// Sample template
const mockTemplate = { content: "", type: "text" };

// A concrete implementation of AbstractValidator for testing
class TestValidator extends AbstractValidator<TestData> {
  constructor(engine: any) {
    super(engine);
  }
  
  validate(rule: Specification<any>, value: any, path: string, template: any, ruleName: string, extra?: Record<string, any>): RuleResult {
    const isValid = rule.isSatisfiedBy(value);
    
    return {
      isValid,
      ruleName,
      path,
      message: isValid ? undefined : this.engine.render(template, {
        data: { PropertyName: path, Value: value, ...extra }
      })
    };
  }
}

// Test data model
interface TestData {
  name: string;
  age: number;
  email: string;
}

describe('FluentValidation with AbstractValidator', () => {
  let engine: MockTemplateEngine;
  let validator: TestValidator;
  
  beforeEach(() => {
    engine = new MockTemplateEngine();
    validator = new TestValidator(engine);
  });
  
  it('should support adding rules with RuleFor method', () => {
    // Arrange - Create specifications
    const nameNotEmpty = new BaseSpecification<string>(name => 
      name !== undefined && name !== null && name.trim().length > 0
    );
    
    const ageAbove18 = new BaseSpecification<number>(age => age >= 18);
    
    // Act - Add rules to validator
    validator
      .RuleFor(d => d.name, nameNotEmpty, "name", mockTemplate, "NameNotEmpty")
      .RuleFor(d => d.age, ageAbove18, "age", mockTemplate, "AgeAbove18");
    
    // Assert - Test with valid data
    const validData: TestData = { 
      name: "John", 
      age: 25,
      email: "john@example.com"
    };
    const validResults = validator.validateAll(validData);
    
    // All rules should pass
    expect(validResults.every(r => r.isValid)).toBe(true);
    expect(validResults.length).toBe(2);
    
    // Test with invalid data
    const invalidData: TestData = { 
      name: "", 
      age: 16,
      email: "invalid" 
    };
    const invalidResults = validator.validateAll(invalidData);
    
    // Rules should fail
    expect(invalidResults.every(r => !r.isValid)).toBe(true);
    expect(invalidResults.length).toBe(2);
  });
  
  it('should support custom rules through addRule', () => {
    // Arrange - Create a custom rule
    validator.addRule((data: TestData) => {
      const isValid = data.email.includes('@');
      return {
        isValid,
        ruleName: 'ValidEmail',
        path: 'email',
        message: isValid ? undefined : `Email ${data.email} must contain @`
      };
    });
    
    // Act & Assert - Test valid email
    const validData = { name: "Test", age: 20, email: "test@example.com" };
    const validResults = validator.validateAll(validData);
    expect(validResults[0].isValid).toBe(true);
    
    // Act & Assert - Test invalid email
    const invalidData = { name: "Test", age: 20, email: "invalid-email" };
    const invalidResults = validator.validateAll(invalidData);
    expect(invalidResults[0].isValid).toBe(false);
    expect(invalidResults[0].message).toContain('must contain @');
  });
  
  it('should support complex rules with AND composition', () => {
    // Arrange - Create composite specification
    const minLength = new BaseSpecification<string>(s => s.length >= 3);
    const maxLength = new BaseSpecification<string>(s => s.length <= 10);
    const nameValidLength = minLength.and(maxLength);
    
    // Act - Add composite rule
    validator.RuleFor(d => d.name, nameValidLength, "name", mockTemplate, "NameValidLength");
    
    // Assert - Test valid name
    const validData = { name: "John", age: 20, email: "test@example.com" };
    const validResults = validator.validateAll(validData);
    expect(validResults[0].isValid).toBe(true);
    
    // Test too short name
    const tooShortData = { name: "Jo", age: 20, email: "test@example.com" };
    const shortResults = validator.validateAll(tooShortData);
    expect(shortResults[0].isValid).toBe(false);
    
    // Test too long name
    const tooLongData = { name: "JohnDoeWithVeryLongName", age: 20, email: "test@example.com" };
    const longResults = validator.validateAll(tooLongData);
    expect(longResults[0].isValid).toBe(false);
  });
  
  it('should support complex rules with OR composition', () => {
    // Arrange - Create composite specification for email domains
    const gmailDomain = new BaseSpecification<string>(email => email.endsWith('@gmail.com'));
    const outlookDomain = new BaseSpecification<string>(email => email.endsWith('@outlook.com'));
    const validDomains = gmailDomain.or(outlookDomain);
    
    // Act - Add composite rule
    validator.RuleFor(d => d.email, validDomains, "email", mockTemplate, "ValidDomain");
    
    // Assert - Test gmail domain (valid)
    const gmailData = { name: "Test", age: 20, email: "test@gmail.com" };
    const gmailResults = validator.validateAll(gmailData);
    expect(gmailResults[0].isValid).toBe(true);
    
    // Test outlook domain (valid)
    const outlookData = { name: "Test", age: 20, email: "test@outlook.com" };
    const outlookResults = validator.validateAll(outlookData);
    expect(outlookResults[0].isValid).toBe(true);
    
    // Test other domain (invalid)
    const otherData = { name: "Test", age: 20, email: "test@example.com" };
    const otherResults = validator.validateAll(otherData);
    expect(otherResults[0].isValid).toBe(false);
  });
  
  it('should support negation with NOT composition', () => {
    // Arrange - Create negated specification (not a teenager)
    const teenager = new BaseSpecification<number>(age => age >= 13 && age <= 19);
    const notTeenager = teenager.not();
    
    // Act - Add rule using NOT specification
    validator.RuleFor(d => d.age, notTeenager, "age", mockTemplate, "NotTeenager");
    
    // Assert - Test adult (valid - not a teenager)
    const adultData = { name: "Adult", age: 30, email: "test@example.com" };
    const adultResults = validator.validateAll(adultData);
    expect(adultResults[0].isValid).toBe(true);
    
    // Test child (valid - not a teenager)
    const childData = { name: "Child", age: 10, email: "test@example.com" };
    const childResults = validator.validateAll(childData);
    expect(childResults[0].isValid).toBe(true);
    
    // Test teenager (invalid)
    const teenData = { name: "Teen", age: 16, email: "test@example.com" };
    const teenResults = validator.validateAll(teenData);
    expect(teenResults[0].isValid).toBe(false);
  });
  
  it('should support chained validation rules', () => {
    // Arrange - Create a series of chained rules
    validator
      .RuleFor(
        (d: TestData) => d.name,
        new BaseSpecification<string>(name => name.length > 0),
        "name", mockTemplate, "NameNotEmpty"
      )
      .RuleFor(
        (d: TestData) => d.age,
        new BaseSpecification<number>(age => age >= 18),
        "age", mockTemplate, "AgeAbove18"
      )
      .RuleFor(
        (d: TestData) => d.email,
        new BaseSpecification<string>(email => email.includes('@')),
        "email", mockTemplate, "EmailValid"
      );
    // No additional chained rules are needed here, as the previous RuleFor calls are already chained.
    // This demonstrates the fluent API usage. If you want to make it more readable, you can split the chains:
    // Example:
    // validator.RuleFor(...);
    // validator.RuleFor(...);
    // validator.RuleFor(...);
    // But chaining as above is idiomatic for fluent APIs.

    // To avoid repeating similar RuleFor calls for each property, you can create reusable helper functions,
    // or use a generic validator class for different data types.

    // Example: GenericValidator for reuse
    // class GenericValidator<T> extends AbstractValidator<T> {
    //   // Implement generic validation logic here
    // }
    // Act
    const invalidData = { 
      name: "", 
      age: 16, 
      email: "invalid-email" 
    };
    const results = validator.validateAll(invalidData);
    
    // Assert - All validations should run
    expect(results.length).toBe(3);
    expect(results.filter(r => !r.isValid).length).toBe(3);
    
    // Check specific error paths
    const nameError = results.find(r => r.path === "name");
    const ageError = results.find(r => r.path === "age");
    const emailError = results.find(r => r.path === "email");
    
    expect(nameError).toBeDefined();
    expect(ageError).toBeDefined();
    expect(emailError).toBeDefined();
    expect(nameError?.isValid).toBe(false);
    expect(ageError?.isValid).toBe(false);
    expect(emailError?.isValid).toBe(false);
  });
});
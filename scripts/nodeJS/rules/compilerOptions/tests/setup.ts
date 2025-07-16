// tests/setup.ts
import chai from 'chai';

// Enable should-style assertions globally
chai.should();

// Add should to Object prototype for chaining
Object.defineProperty(Object.prototype, 'should', {
  set(value) {},
  get() {
    return chai.should();
  },
  configurable: true
});

// Add global types for TypeScript
declare global {
  interface Object {
    should: Chai.Assertion;
  }
}

export {}; // This file is a module

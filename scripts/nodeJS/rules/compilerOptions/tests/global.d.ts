// Global type declarations for tests
import { Assertion } from 'chai';

declare global {
  const should: Chai.AssertionStatic;
  interface Window {
    should: Chai.AssertionStatic;
  }
  interface Object {
    should: Chai.AssertionStatic;
  }
}

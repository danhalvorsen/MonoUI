// tests/setup.ts
import { chai } from 'vitest';
import chaiAsPromised from 'chai-as-promised';

// Add chai plugins
chai.use(chaiAsPromised);

// Enable should-style assertions globally
// Note: In ES modules, we don't modify Object.prototype
// Instead, we'll use chai.should() in each test file where needed

declare global {
  // This extends the global Chai namespace
  namespace Chai {
    interface Assertion {
      // Add any custom assertions here if needed
    }
  }
}

export { chai };

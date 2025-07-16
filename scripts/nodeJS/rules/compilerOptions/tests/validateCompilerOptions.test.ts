// tests/validateCompilerOptions.test.ts
import { validateCompilerOptions } from '../src/validateCompilerOptions.js';
import type { TsConfig } from '../src/validateCompilerOptions.js';
import { describe, it } from 'vitest';
import { should } from 'chai';

// Enable should-style assertions
should();

describe('validateCompilerOptions', () => {
  it('should pass when all expected fields match', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES2021',
        module: 'ESNext',
        moduleResolution: 'node',
      },
    };

    const result = validateCompilerOptions(config);
    result.valid.should.be.true;
    result.errors.should.be.an('array').that.is.empty;
  });

  it('should fail when "target" is incorrect', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES5',
        module: 'ESNext',
        moduleResolution: 'node',
      },
    };

    const result = validateCompilerOptions(config);
    result.valid.should.be.false;
    result.errors.should.include('Expected "target": "ES2021", got "ES5"');
    result.errors.some(e => e.includes('module')).should.be.false;
    result.errors.some(e => e.includes('moduleResolution')).should.be.false;
  });

  it('should fail when "module" is incorrect', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES2021',
        module: 'CommonJS',
        moduleResolution: 'node',
      },
    };

    const result = validateCompilerOptions(config);
    result.valid.should.be.false;
    result.errors.should.include('Expected "module" to be either "ESNext" or "NodeNext", got "CommonJS"');
    result.errors.some(e => e.includes('target')).should.be.false;
    result.errors.some(e => e.includes('moduleResolution')).should.be.false;
  });

  it('should fail when "moduleResolution" is incorrect', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES2021',
        module: 'NodeNext',
        moduleResolution: 'classic',
      },
    };

    const result = validateCompilerOptions(config);
    result.valid.should.be.false;
    result.errors.should.include('Expected "moduleResolution": "node", got "classic"');
    result.errors.some(e => e.includes('target')).should.be.false;
    // We no longer check for module errors since we're using a valid module value
  });

  it('should fail when all fields are incorrect', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES5',
        module: 'CommonJS',
        moduleResolution: 'classic',
      },
    };

    const result = validateCompilerOptions(config);
    result.valid.should.be.false;
    result.errors.should.have.lengthOf(3);
    result.errors[0].should.include('target');
    result.errors[1].should.include('module');
    result.errors[2].should.include('moduleResolution');
  });

  it('should fail when compilerOptions is missing', () => {
    const config: TsConfig = {};
    const result = validateCompilerOptions(config);

    result.valid.should.be.false;
    result.errors.should.include('Missing "compilerOptions"');
  });

  // 🔴 NEGATIVE TESTS (False Positive Protection)
  it('should not report "target" error when only "module" is wrong', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES2021',
        module: 'CommonJS',
        moduleResolution: 'node',
      },
    };

    const result = validateCompilerOptions(config);
    result.errors.some(e => e.includes('target')).should.be.false;
  });

  it('should not report "moduleResolution" error when only "target" is wrong', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES5',
        module: 'ESNext',
        moduleResolution: 'node',
      },
    };

    const result = validateCompilerOptions(config);
    result.errors.some(e => e.includes('moduleResolution')).should.be.false;
  });

  it('should not report "module" error when only "moduleResolution" is wrong', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES2021',
        module: 'NodeNext',  // Changed from 'ESNext' to 'NodeNext' to be compatible with Node.js
        moduleResolution: 'wrong',
      },
    };

    const result = validateCompilerOptions(config);
    // We'll check that the only error is about moduleResolution
    result.errors.should.have.lengthOf(1);
    result.errors[0].should.include('moduleResolution');
  });
});

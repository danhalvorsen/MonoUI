// tests/validateCompilerOptions.test.ts
import { validateCompilerOptions } from '../src/validateCompilerOptions.js';
import type { TsConfig } from '../src/validateCompilerOptions.js';
import { describe, it, expect } from 'vitest';

describe('validateCompilerOptions', () => {
  it('should pass when all expected fields match (case insensitive)', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'es2021', // Test with lowercase to ensure case insensitivity
        module: 'ESNext',
        moduleResolution: 'node',
      },
    };

    const result = validateCompilerOptions(config);
    expect(result.valid).toBe(true);
    expect(Array.isArray(result.errors) && result.errors.length === 0).toBe(true);
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
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Expected "target": "ES2021" (case-insensitive), got "ES5"');
    expect(result.errors.some(e => e.includes('module'))).toBe(false);
    expect(result.errors.some(e => e.includes('moduleResolution'))).toBe(false);
  });

  it('should pass with different cases for target', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'es2021', // lowercase
        module: 'ESNext',
        moduleResolution: 'node',
      },
    };

    const result = validateCompilerOptions(config);
    expect(result.valid).toBe(true);
    expect(Array.isArray(result.errors) && result.errors.length === 0).toBe(true);
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
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(`Expected "module" to be either "ESNext" or "NodeNext", got "${config.compilerOptions.module}"`);
    expect(result.errors.some(e => e.includes('target'))).toBe(false);
    expect(result.errors.some(e => e.includes('moduleResolution'))).toBe(false);
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
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Expected "moduleResolution": "node", got "classic"');
    expect(result.errors.some(e => e.includes('target'))).toBe(false);
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
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
    expect(result.errors[0]).toContain('target');
    expect(result.errors[1]).toContain('module');
    expect(result.errors[2]).toContain('moduleResolution');
  });

  it('should fail when compilerOptions is missing', () => {
    const config = {} as TsConfig;
    const result = validateCompilerOptions(config);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing "compilerOptions"');
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
    expect(result.errors.some(e => e.includes('target'))).toBe(false);
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
    expect(result.errors.some(e => e.includes('moduleResolution'))).toBe(false);
  });

  it('should only report moduleResolution error when other fields are correct', () => {
    const config: TsConfig = {
      compilerOptions: {
        target: 'ES2021',
        module: 'ESNext',
        moduleResolution: 'classic',
      },
    };

    const result = validateCompilerOptions(config);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('moduleResolution');
    expect(result.errors[0]).toContain('classic');
  });

  it('should not validate if compilerOptions is missing', () => {
    const config = {} as TsConfig;
    const result = validateCompilerOptions(config);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing "compilerOptions"');
  });
});

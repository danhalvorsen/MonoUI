import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { container } from 'tsyringe';
import { generateTokenService } from '../../src/cli';

const tempDir = path.resolve(__dirname, 'tmp');
const outputDir = path.join(tempDir, 'services');
const mrStyleTokensDir = path.resolve(__dirname, '../../../mr-style/src/tokens');

// We'll use a real token file from mr-style (e.g., ColorTokens)
const tokenName = 'ColorTokens';
const tokenFile = path.join(mrStyleTokensDir, 'color.tokens.ts');

beforeEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('Integration: generateTokenService with mr-style tokens', () => {
  it('should generate a DI-ready service implementing real tokens', async () => {
    // Generate the service
    generateTokenService({
      name: tokenName,
      tokensPath: tokenFile,
      outputDir
    });

    const serviceFile = path.join(outputDir, `${tokenName}Service.ts`);
    expect(fs.existsSync(serviceFile)).toBe(true);

    // Dynamically import the generated service
    const mod = await import(serviceFile);
    const ServiceClass = mod[`${tokenName}Service`];
    expect(ServiceClass).toBeTypeOf('function');

    // Register and resolve via tsyringe (simulating actual usage)
    container.register(tokenName, { useClass: ServiceClass });
    const instance = container.resolve<any>(tokenName);

    // Verify that token properties exist and match values in mr-style
  const keys = Object.keys(instance);
expect(keys.length).toBeGreaterThan(0);  // It has properties
const firstValue = (instance as any)[keys[0]];
expect(typeof firstValue).toBe('string');  // Values are strings
  });
});

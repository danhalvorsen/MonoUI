import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateTokenService } from '../../src/cli';

const tempDir = path.resolve(__dirname, 'tmp-rectangle');
const outputDir = path.join(tempDir, 'services');
const mrStyleTokensDir = path.resolve(__dirname, '../../../mr-style/src/tokens/components');

// Test visual rectangle tokens generation
const rectangleTokenName = 'VisualRectangleTokens';
const rectangleTokenFile = path.join(mrStyleTokensDir, 'visual-rectangle.tokens.ts');

beforeEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('Integration: generateTokenService for VisualRectangle tokens', () => {
  it('should generate VisualRectangleTokenService from visual-rectangle.tokens.ts', async () => {
    // Verify the token file exists
    expect(fs.existsSync(rectangleTokenFile)).toBe(true);

    // Generate the service
    generateTokenService({
      name: rectangleTokenName,
      tokensPath: rectangleTokenFile,
      outputDir
    });

    const serviceFile = path.join(outputDir, `${rectangleTokenName}Service.ts`);
    expect(fs.existsSync(serviceFile)).toBe(true);

    // Read the generated service file
    const serviceContent = fs.readFileSync(serviceFile, 'utf-8');
    
    // Verify it contains expected rectangle token properties
    expect(serviceContent).toContain('fillPrimary');
    expect(serviceContent).toContain('fillSecondary');
    expect(serviceContent).toContain('fillAccent');
    expect(serviceContent).toContain('borderDefault');
    expect(serviceContent).toContain('borderRadius');
    expect(serviceContent).toContain('shadowDefault');
    expect(serviceContent).toContain('class VisualRectangleTokensService');
    expect(serviceContent).toContain('@injectable()');

    // Verify it imports from tsyringe
    expect(serviceContent).toContain("import { injectable } from 'tsyringe'");
  });

  it('should generate service with proper rectangle token values', async () => {
    generateTokenService({
      name: rectangleTokenName,
      tokensPath: rectangleTokenFile,
      outputDir
    });

    const serviceFile = path.join(outputDir, `${rectangleTokenName}Service.ts`);
    const serviceContent = fs.readFileSync(serviceFile, 'utf-8');

    // Verify specific token values are present
    expect(serviceContent).toContain('#3b82f6'); // fillPrimary blue
    expect(serviceContent).toContain('#10b981'); // fillSecondary green
    expect(serviceContent).toContain('#f59e0b'); // fillAccent amber
    expect(serviceContent).toContain('#4b5563'); // borderDefault
    expect(serviceContent).toContain('4'); // borderRadius
    expect(serviceContent).toContain('rgba(0, 0, 0, 0.1)'); // shadowDefault
  });

  it('should generate service that can be used for Canvas rendering', async () => {
    generateTokenService({
      name: rectangleTokenName,
      tokensPath: rectangleTokenFile,
      outputDir
    });

    const serviceFile = path.join(outputDir, `${rectangleTokenName}Service.ts`);
    
    // Dynamically import the generated service
    const mod = await import(serviceFile);
    const ServiceClass = mod[`${rectangleTokenName}Service`];
    expect(ServiceClass).toBeTypeOf('function');

    // Create an instance and verify it has the expected properties
    const instance = new ServiceClass();
    
    // Verify Canvas-ready properties exist
    expect(instance.fillPrimary).toBeTypeOf('string');
    expect(instance.borderWidth).toBeTypeOf('number');
    expect(instance.borderRadius).toBeTypeOf('number');
    expect(instance.shadowDefault).toBeTypeOf('string');
    
    // Verify values are suitable for Canvas API
    expect(instance.fillPrimary).toMatch(/^#[0-9a-fA-F]{6}$/); // Valid hex color
    expect(instance.borderWidth).toBeGreaterThan(0); // Valid border width
    expect(instance.borderRadius).toBeGreaterThanOrEqual(0); // Valid border radius
  });
});

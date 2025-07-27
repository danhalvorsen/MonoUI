import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateTokenService } from '../src/cli';

const tempDir = path.resolve(__dirname, 'tmp');
const tokenFile = path.join(tempDir, 'color.tokens.ts');
const outputDir = path.join(tempDir, 'output');

beforeEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  // Create a fake token file for testing
  fs.writeFileSync(
    tokenFile,
    `
      export const ColorTokens = {
        primary: '#123456',
        secondary: '#654321'
      };
    `,
    'utf-8'
  );
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('generateTokenService', () => {
  it('should generate a valid service class file from tokens', () => {
    generateTokenService({
      name: 'ColorTokens',
      tokensPath: tokenFile,
      outputDir
    });

    const generatedFile = path.join(outputDir, 'ColorTokensService.ts');
    expect(fs.existsSync(generatedFile)).toBe(true);

    const content = fs.readFileSync(generatedFile, 'utf-8');
    expect(content).toContain('export class ColorTokensService');
    expect(content).toContain('primary = \'#123456\'');
    expect(content).toContain('secondary = \'#654321\'');
  });

  it('should overwrite existing files when generating', () => {
    fs.mkdirSync(outputDir, { recursive: true });
    const targetFile = path.join(outputDir, 'ColorTokensService.ts');
    fs.writeFileSync(targetFile, 'OldContent');

    generateTokenService({
      name: 'ColorTokens',
      tokensPath: tokenFile,
      outputDir
    });

    const content = fs.readFileSync(targetFile, 'utf-8');
    expect(content).not.toContain('OldContent');
    expect(content).toContain('ColorTokensService');
  });

  it('should fail when token file does not exist', () => {
    const badFile = path.join(tempDir, 'notfound.tokens.ts');

    expect(() =>
      generateTokenService({
        name: 'BadTokens',
        tokensPath: badFile,
        outputDir
      })
    ).toThrow();
  });

  it('should skip unsupported property kinds gracefully', () => {
    const spreadTokenFile = path.join(tempDir, 'spread.tokens.ts');
    fs.writeFileSync(
      spreadTokenFile,
      `
        const extra = { tertiary: '#ffffff' };
        export const ColorTokens = {
          primary: '#000000',
          ...extra
        };
      `,
      'utf-8'
    );

    generateTokenService({
      name: 'ColorTokens',
      tokensPath: spreadTokenFile,
      outputDir
    });

    const content = fs.readFileSync(path.join(outputDir, 'ColorTokensService.ts'), 'utf-8');
    expect(content).toContain('primary = \'#000000\'');
    // Spread assignments should be skipped
    expect(content).not.toContain('tertiary');
  });
});

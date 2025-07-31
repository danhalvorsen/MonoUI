import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateTokenService } from '../../src/cli';

const tempDir = path.resolve(__dirname, 'tmp-connector');
const outputDir = path.join(tempDir, 'services');
const mrStyleTokensDir = path.resolve(__dirname, '../../../mr-style/src/tokens/components');

// Test connector tokens generation
const connectorTokenName = 'ConnectorTokens';
const connectorTokenFile = path.join(mrStyleTokensDir, 'connector.tokens.ts');

beforeEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });
});

afterEach(() => {
  fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('Integration: generateTokenService for Connector tokens', () => {
  it('should generate ConnectorTokenService from connector.tokens.ts', async () => {
    // Verify the token file exists
    expect(fs.existsSync(connectorTokenFile)).toBe(true);

    // Generate the service
    generateTokenService({
      name: connectorTokenName,
      tokensPath: connectorTokenFile,
      outputDir
    });

    const serviceFile = path.join(outputDir, `${connectorTokenName}Service.ts`);
    expect(fs.existsSync(serviceFile)).toBe(true);

    // Read the generated service file
    const serviceContent = fs.readFileSync(serviceFile, 'utf-8');
    
    // Verify it contains expected connector token properties
    expect(serviceContent).toContain('fillDefault');
    expect(serviceContent).toContain('fillActive');
    expect(serviceContent).toContain('fillConnected');
    expect(serviceContent).toContain('sizeDefault');
    expect(serviceContent).toContain('borderRadius');
    expect(serviceContent).toContain('class ConnectorTokensService');
    expect(serviceContent).toContain('@injectable()');

    // Verify it imports from tsyringe
    expect(serviceContent).toContain("import { injectable } from 'tsyringe'");
  });

  it('should generate service with proper token values', async () => {
    generateTokenService({
      name: connectorTokenName,
      tokensPath: connectorTokenFile,
      outputDir
    });

    const serviceFile = path.join(outputDir, `${connectorTokenName}Service.ts`);
    const serviceContent = fs.readFileSync(serviceFile, 'utf-8');

    // Verify specific token values are present
    expect(serviceContent).toContain('#6366f1'); // fillDefault indigo
    expect(serviceContent).toContain('#3b82f6'); // fillActive blue
    expect(serviceContent).toContain('#10b981'); // fillConnected green
    expect(serviceContent).toContain('12'); // sizeDefault
    expect(serviceContent).toContain('2'); // borderRadius
  });
});

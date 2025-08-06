import { describe, it, expect } from 'vitest';
import { Container } from 'styrilng';
import { registerConfiguration } from './Configuration.js';

// Example config interface
interface MyConfig {
  rootDir: string;
  dryRun: boolean;
  contentGenerator: { exportStyle: string };
}

const CONFIG_TOKEN = Symbol('MyConfig');

// Create a sample config file (in-memory for test)
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'testconfig.json');
fs.writeFileSync(configPath, JSON.stringify({
  rootDir: 'src',
  dryRun: true,
  contentGenerator: { exportStyle: 'star' }
}));

describe('ConfigurationProvider & registerConfiguration', () => {
  it('should load config from JSON and resolve via IoC', () => {
    const container = new Container();
    registerConfiguration<MyConfig>(container, configPath, CONFIG_TOKEN);
    const provider = container.resolve(CONFIG_TOKEN);
    expect(provider.value.rootDir).toBe('src');
    expect(provider.value.dryRun).toBe(true);
    expect(provider.value.contentGenerator.exportStyle).toBe('star');
  });
});

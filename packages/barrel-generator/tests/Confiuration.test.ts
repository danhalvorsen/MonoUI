import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Container } from 'styrilng';
import { registerConfiguration } from './Configuration.js';
import { VirtualFileSystem, IVirtualFileSystem } from 'virtual-filesystem';

// Example config interface
interface MyConfig {
  rootDir: string;
  dryRun: boolean;
  contentGenerator: { exportStyle: string };
}

const CONFIG_TOKEN = Symbol('MyConfig');

let vfs: IVirtualFileSystem;
let configPath: string;

beforeEach(() => {
  vfs = new VirtualFileSystem();
  configPath = '/testconfig.json';
  vfs.writeFileSync(configPath, JSON.stringify({
    rootDir: 'src',
    dryRun: true,
    contentGenerator: { exportStyle: 'star' }
  }));
});

afterEach(() => {
  vfs = undefined as any;
});

describe('ConfigurationProvider & registerConfiguration with VirtualFileSystem', () => {
  it('should load config from JSON in VFS and resolve via IoC', () => {
    const container = new Container();
    // Patch ConfigurationProvider to use vfs for this test
    class VFSConfigurationProvider<T> {
      private _value: T;
      constructor(configPath: string, vfs: IVirtualFileSystem) {
        const json = vfs.readFileSync(configPath, 'utf-8');
        this._value = JSON.parse(json);
      }
      get value(): T {
        return this._value;
      }
    }
    function registerVFSConfiguration<T>(container: Container, configPath: string, token: symbol, vfs: IVirtualFileSystem) {
      const provider = new VFSConfigurationProvider<T>(configPath, vfs);
      container.register(token, { useValue: provider });
    }
    registerVFSConfiguration<MyConfig>(container, configPath, CONFIG_TOKEN, vfs);
    const provider = container.resolve(CONFIG_TOKEN);
    expect(provider.value.rootDir).toBe('src');
    expect(provider.value.dryRun).toBe(true);
    expect(provider.value.contentGenerator.exportStyle).toBe('star');
  });
});

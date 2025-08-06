import { ConfigurationProvider } from './ConfigurationProvider.js';
import type { Container } from 'styrilng';
import type { IVirtualFileSystem } from 'virtual-filesystem';

export function registerConfiguration<T>(
  container: Container,
  configPath: string,
  token: symbol,
  vfs?: IVirtualFileSystem
) {
  const provider = new ConfigurationProvider<T>(configPath, vfs);
  container.register(token, { useValue: provider });
}
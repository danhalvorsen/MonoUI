import { Container } from 'styrilng';
import { ConfigurationProvider } from './ConfigurationProvider.js';

export function registerConfiguration<T>(container: Container, configPath: string, token: symbol) {
  const provider = new ConfigurationProvider<T>(configPath);
  container.register(token, { useValue: provider });
}
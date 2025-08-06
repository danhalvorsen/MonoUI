import type { IOptions } from './IOptions.js';
import type { IVirtualFileSystem } from 'virtual-filesystem';
import fs from 'fs';

export class ConfigurationProvider<T> implements IOptions<T> {
  private _value: T;
  constructor(configPath: string, vfs?: IVirtualFileSystem) {
    let json: string;
    if (vfs) {
      json = vfs.readFileSync(configPath, 'utf-8');
    } else {
      json = fs.readFileSync(configPath, 'utf-8');
    }
    this._value = JSON.parse(json);
  }
  get value(): T {
    return this._value;
  }
}
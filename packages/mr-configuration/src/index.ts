export interface IOptions<T> {
  value: T;
}import fs from 'fs';

export class ConfigurationProvider<T> {
  private _value: T;

  constructor(configPath: string) {
    const json = fs.readFileSync(configPath, 'utf-8');
    this._value = JSON.parse(json);
  }

  get value(): T {
    return this._value;
  }
}
import { PianoKey } from './keys.js';
import { KeyTypes, KeyName } from './keyTypes.js';
import type { IKey } from './interfaces.js';

export class KeyBuilder {
  static build(name: KeyName, x: number, y: number): IKey {
    const key = new PianoKey(KeyTypes[name], x, y);
    return {
      ...key,
      vertices: key.vertices.map(([vx, vy]) => [vx, vy]) as [number, number][],
      edges: key.edges.map(([a, b]) => [a, b]) as [number, number][],
    };
  }
}

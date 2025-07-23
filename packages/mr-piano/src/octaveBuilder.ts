// src/octaveBuilder.ts
import type { IKey } from './interfaces.js';
import { KeyBuilder } from './keyBuilder.js';

export class OctaveBuilder {
  whiteWidth = 23.5;
  gap = 1;

  buildOctave(startX = 0, startY = 200): IKey[] {
    const keys: IKey[] = [];
    const whites = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
    const blacks = [
      { name: 'C#', offset: 0.65 },
      { name: 'D#', offset: 1.65 },
      { name: 'F#', offset: 3.65 },
      { name: 'G#', offset: 4.65 },
      { name: 'A#', offset: 5.65 },
    ] as const;

    whites.forEach((note, i) => {
      const x = startX + i * (this.whiteWidth + this.gap);
      keys.push(KeyBuilder.build(note, x, startY));
    });

    blacks.forEach((b) => {
      const x = startX + b.offset * (this.whiteWidth + this.gap);
      keys.push(KeyBuilder.build(b.name as any, x, startY));
    });

    return keys;
  }
}

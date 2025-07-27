// src/core/BlackKey.ts

import { BaseKey } from './basekey.js';
import { Point } from './interfaces.js';
 
export class BlackKey extends BaseKey {
  readonly name: string;
  readonly fillStyle = '#000';
  constructor(note: 'C#'|'D#'|'F#'|'G#'|'A#') { super(); this.name = note; }
  protected outline(): readonly Point[] {
    return [
      [0, 0], [13.7, 0], [13.7, -88], [6.85, -90], [0, -88]
    ];
  }
}
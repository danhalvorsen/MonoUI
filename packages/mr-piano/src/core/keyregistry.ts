// src/core/KeyRegistry.ts
import { WhiteKey } from './whiteKey.js';
import { BlackKey } from './blackKey.js';
import { IKeyTemplate } from './interfaces.js';

export const KeyRegistry: Record<string, IKeyTemplate> = {
  C : new WhiteKey('C',  false, true ),
  D : new WhiteKey('D',  true,  true ),
  E : new WhiteKey('E',  true,  false),
  F : new WhiteKey('F',  false, true ),
  G : new WhiteKey('G',  true,  true ),
  A : new WhiteKey('A',  true,  true ),
  B : new WhiteKey('B',  true,  false),
  'C#': new BlackKey('C#'),
  'D#': new BlackKey('D#'),
  'F#': new BlackKey('F#'),
  'G#': new BlackKey('G#'),
  'A#': new BlackKey('A#')
};
export type KeyName = keyof typeof KeyRegistry;

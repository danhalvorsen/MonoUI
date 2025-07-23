
import { describe, it, expect } from 'vitest';
import { OctaveBuilder } from '../src/octaveBuilder.js';

describe('octave builder', ()=>{
  it('produces 12 keys (7 white + 5 black)', ()=>{
    const keys = new OctaveBuilder().buildOctave();
    expect(keys.length).toBe(12);
  });

  it('all edges match vertices length', ()=>{
    const keys = new OctaveBuilder().buildOctave();
    keys.forEach(k=>{
      expect(k.edges.length).toBe(k.vertices.length);
    });
  });
});

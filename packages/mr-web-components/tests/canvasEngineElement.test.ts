import { describe, it, expect } from 'vitest';
import { HtmlCanvas } from '../src/engine/HtmlCanvas.js';

describe('HtmlCanvas', () => {
  it('should initialize canvas context', async () => {
    const el = new HtmlCanvas();
    document.body.appendChild(el);
    await el.updateComplete; // ensure Lit updates
    expect(el.context).not.toBeUndefined();
  });
});
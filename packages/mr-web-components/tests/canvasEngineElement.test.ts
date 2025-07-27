import { describe, it, expect } from 'vitest';
import { CanvasEngineElement } from '../src/engine/CanvasEngineElement';

describe('CanvasEngineElement', () => {
  it('should initialize canvas context', async () => {
    const el = new CanvasEngineElement();
    document.body.appendChild(el);
    await el.updateComplete; // ensure Lit updates
    expect(el.context).not.toBeUndefined();
  });
});

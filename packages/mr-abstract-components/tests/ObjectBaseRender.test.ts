import { describe, it, expect, vi } from 'vitest';
import { ObjectBase } from './../src/index.js';

class TestObject extends ObjectBase {
    drawCalled = false;
    children: TestObject[] = [];
    draw(ctx: CanvasRenderingContext2D) {
        this.drawCalled = true;
        ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}

describe('ObjectBase lifecycle', () => {
    it('should call draw on parent and children', () => {
        const ctx = { fillRect: vi.fn() } as unknown as CanvasRenderingContext2D;
        const parent = new TestObject('parent');
        const child = new TestObject('child');
        parent.children = [child];

        parent.render(ctx);

        expect(parent.drawCalled).toBe(true);
        expect(child.drawCalled).toBe(true);
        expect(ctx.fillRect).toHaveBeenCalledTimes(2);
    });

    it('should trigger willUpdate and updated lifecycle hooks in order', () => {
        const ctx = { fillRect: vi.fn() } as unknown as CanvasRenderingContext2D;

        const parent = new TestObject('parent');
        const willUpdateSpy = vi.fn();
        const updatedSpy = vi.fn();

        parent.willUpdate = willUpdateSpy;
        parent.updated = updatedSpy;

        parent.render(ctx);

        expect(willUpdateSpy).toHaveBeenCalledTimes(1);
        expect(updatedSpy).toHaveBeenCalledTimes(1);

        // Ensure willUpdate is called before updated
        const willUpdateCall = willUpdateSpy.mock.invocationCallOrder[0];
        const updatedCall = updatedSpy.mock.invocationCallOrder[0];
        expect(willUpdateCall).toBeLessThan(updatedCall);
    });

    it('should trigger firstUpdated only on first render', () => {
        const ctx = { fillRect: vi.fn() } as unknown as CanvasRenderingContext2D;

        const parent = new TestObject('parent');
        const firstUpdatedSpy = vi.fn();
        parent.firstUpdated = firstUpdatedSpy;

        parent.render(ctx);
        parent.render(ctx); // render again

        expect(firstUpdatedSpy).toHaveBeenCalledTimes(1); // only first time
    });

    it('should skip rendering when shouldUpdate returns false', () => {
        const ctx = { fillRect: vi.fn() } as unknown as CanvasRenderingContext2D;

        const parent = new TestObject('parent');
        const shouldUpdateSpy = vi.fn(() => false);
        parent.shouldUpdate = shouldUpdateSpy;

        parent.render(ctx);

        expect(shouldUpdateSpy).toHaveBeenCalledTimes(1);
        expect(ctx.fillRect).not.toHaveBeenCalled(); // draw() not executed
    });
});

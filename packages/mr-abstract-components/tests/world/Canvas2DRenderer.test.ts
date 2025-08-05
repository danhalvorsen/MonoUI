import { describe, it, expect, vi, beforeEach } from 'vitest';
 
import { Canvas2DRenderer ,IRenderType, ObjectBase  } from '../../src//index.js';

class TestObject extends ObjectBase {
    draw(ctx: IRenderType): void {}
}

describe('Canvas2DRenderer', () => {
    let canvas: any;
    let ctx: any;

    beforeEach(() => {
        // Mocked canvas + 2D context
        ctx = {
            setTransform: vi.fn(),
            fillRect: vi.fn(),
            strokeRect: vi.fn(),
            clearRect: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
        };

        canvas = {
            width: 800,
            height: 600,
            getContext: vi.fn().mockReturnValue(ctx)
        };
    });

    it('should initialize and clear the canvas', () => {
        const renderer = new Canvas2DRenderer(canvas);
        renderer.initialize();
        expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should render an object using its world matrix', () => {
        const renderer = new Canvas2DRenderer(canvas);
        const obj = new TestObject('obj1');
        obj.size = { width: 50, height: 100 };
        obj.position.x = 10;
        obj.position.y = 20;
        obj.configuration = {
            id: 'obj1',
            visual: { style: { fill: '#ff0000', stroke: '#000000', strokeWidth: 2 } },
            interaction: { draggable: false, selected: false },
            connectors: [],
        } as any;

        obj.updateWorldMatrix();
        renderer.renderObject(obj);

        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.setTransform).toHaveBeenCalled(); 
        expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 50, 100);
        expect(ctx.strokeRect).toHaveBeenCalledWith(0, 0, 50, 100);
        expect(ctx.restore).toHaveBeenCalled();
    });

    it('should resize the canvas', () => {
        const renderer = new Canvas2DRenderer(canvas);
        renderer.resize(1024, 768);
        expect(canvas.width).toBe(1024);
        expect(canvas.height).toBe(768);
    });
});

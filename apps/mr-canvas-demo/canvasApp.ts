// packages/mr-canvas-demo/src/canvasApp.ts
import { RenderVisitor } from 'mr-abstract-components';
import { RectangleObject } from './objects/RectangleObject.js';

export function createApp(ctx: CanvasRenderingContext2D) {
    const root = new RectangleObject('root');
    root.position = { x: 50, y: 50 };
    root.size = { width: 200, height: 100 };
    root.color = 'blue';

    const child = new RectangleObject('child');
    child.position = { x: 30, y: 30 };
    child.size = { width: 100, height: 50 };
    child.color = 'green';

    root.children = [child];

    return {
        root,
        render: () => root.accept(new RenderVisitor(ctx))
    };
}

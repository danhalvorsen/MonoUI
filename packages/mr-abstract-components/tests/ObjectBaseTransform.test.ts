// tests/ObjectBaseTransform.test.ts
import { describe, it, expect } from 'vitest';
import { ObjectBase, IRenderType} from '../src/index.js';

class TestObject extends ObjectBase {
    draw(ctx: IRenderType): void {
        // no-op for testing
    }
}

describe('ObjectBase transform system', () => {
    it('should compute world matrix as identity for root', () => {
        const obj = new TestObject('root');
        obj.position.x = 10;
        obj.position.y = 20;
        obj.rotation = Math.PI / 4;
        obj.scale.x = 2;
        obj.scale.y = 2;
        obj.updateWorldMatrix();
        const m = obj.worldMatrix.toFloat32Array();
        expect(m[2]).toBeCloseTo(10); // tx
        expect(m[5]).toBeCloseTo(20); // ty
    });

    it('should update child world matrix when parent transforms', () => {
        const parent = new TestObject('parent');
        const child = new TestObject('child');
        parent.addChild(child);

        parent.position.x = 50;
        parent.position.y = 50;
        child.position.x = 10;
        child.position.y = 0;

        parent.updateWorldMatrix();

        const childWorld = child.worldMatrix.toFloat32Array();
        expect(childWorld[2]).toBeCloseTo(60); // parent's 50 + child's 10
        expect(childWorld[5]).toBeCloseTo(50);
    });

    it('should propagate scale and rotation to child', () => {
        const parent = new TestObject('parent');
        const child = new TestObject('child');
        parent.addChild(child);

        parent.scale.x = 2;
        parent.scale.y = 2;
        child.position.x = 5;

        parent.updateWorldMatrix();
        const childWorld = child.worldMatrix.toFloat32Array();
        expect(childWorld[2]).toBeCloseTo(10); // scaled by parent
    });
});

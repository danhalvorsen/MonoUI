import { describe, it, expect } from 'vitest';
import { Matrix3 } from '../src/implementations/Matrix3.js';

describe('Matrix3', () => {
    it('should create identity by default', () => {
        const m = new Matrix3();
        expect(m.toFloat32Array()).toEqual(new Float32Array([1,0,0, 0,1,0, 0,0,1]));
    });

    it('should create from transform', () => {
        const m = Matrix3.fromTransform(10, 20, 2, 3, Math.PI / 2);
        const arr = m.toFloat32Array();
        expect(arr[2]).toBeCloseTo(10); // translation x
        expect(arr[5]).toBeCloseTo(20); // translation y
    });

    it('should multiply two matrices correctly', () => {
        const a = new Matrix3([1,2,3, 4,5,6, 7,8,9]);
        const b = new Matrix3([9,8,7, 6,5,4, 3,2,1]);
        const c = a.multiply(b) as Matrix3;
        expect(c.toFloat32Array()).toEqual(
            new Float32Array([
                30, 24, 18,
                84, 69, 54,
                138, 114, 90
            ])
        );
    });

    it('should transpose correctly', () => {
        const a = new Matrix3([1,2,3, 4,5,6, 7,8,9]);
        const t = a.transpose() as Matrix3;
        expect(t.toFloat32Array()).toEqual(new Float32Array([1,4,7, 2,5,8, 3,6,9]));
    });

    it('should compute determinant', () => {
        const m = new Matrix3([1,2,3, 0,1,4, 5,6,0]);
        expect(m.determinant()).toBeCloseTo(1*(1*0 - 4*6) - 2*(0*0 - 4*5) + 3*(0*6 - 1*5));
    });

    it('should invert correctly', () => {
        const m = new Matrix3([4,7,2, 3,6,1, 2,5,1]);
        const inv = m.inverse() as Matrix3;
        expect(inv).not.toBeNull();
        const id = (m.multiply(inv) as Matrix3).toFloat32Array();
        // Should approximate identity
        expect(id[0]).toBeCloseTo(1, 4);
        expect(id[4]).toBeCloseTo(1, 4);
        expect(id[8]).toBeCloseTo(1, 4);
    });

    it('should add and subtract matrices', () => {
        const a = new Matrix3([1,1,1,1,1,1,1,1,1]);
        const b = new Matrix3([2,2,2,2,2,2,2,2,2]);
        const sum = a.add(b) as Matrix3;
        const diff = b.subtract(a) as Matrix3;
        expect(sum.toFloat32Array()).toEqual(new Float32Array(Array(9).fill(3)));
        expect(diff.toFloat32Array()).toEqual(new Float32Array(Array(9).fill(1)));
    });

    it('should scale by scalar', () => {
        const a = new Matrix3([1,2,3,4,5,6,7,8,9]);
        const scaled = a.scale(2) as Matrix3;
        expect(scaled.toFloat32Array()).toEqual(new Float32Array([2,4,6,8,10,12,14,16,18]));
    });

    it('should apply to vector', () => {
        const m = Matrix3.fromTransform(10, 20, 2, 3, 0);
        const v = m.applyToVector([1,1,1]);
        expect(v[0]).toBeCloseTo(2*1 + 0*1 + 10);
        expect(v[1]).toBeCloseTo(0*1 + 3*1 + 20);
    });

    it('should clone and compare for equality', () => {
        const m1 = new Matrix3([1,2,3,4,5,6,7,8,9]);
        const m2 = m1.clone();
        expect(m1.equals(m2)).toBe(true);
    });

    it('should setFrom another matrix', () => {
        const m1 = new Matrix3([9,8,7,6,5,4,3,2,1]);
        const m2 = new Matrix3();
        m2.setFrom(m1);
        expect(m2.equals(m1)).toBe(true);
    });
});

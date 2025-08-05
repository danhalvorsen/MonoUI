// File: packages/my-graphics-math/src/Matrix3.ts
import { IMatrix } from '../interfaces/IMatrix.js';

export class Matrix3 implements IMatrix {
    private m: number[];

    constructor(values?: number[]) {
        this.m = values ?? [1,0,0, 0,1,0, 0,0,1];
    }

    static identity(): Matrix3 {
        return new Matrix3();
    }

    static fromTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number): Matrix3 {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        return new Matrix3([
            cos * scaleX, -sin * scaleY, x,
            sin * scaleX,  cos * scaleY, y,
            0, 0, 1
        ]);
    }

    multiply(mat: IMatrix): IMatrix {
        const a = this.m, b = (mat as Matrix3).m;
        return new Matrix3([
            a[0]*b[0] + a[1]*b[3] + a[2]*b[6],
            a[0]*b[1] + a[1]*b[4] + a[2]*b[7],
            a[0]*b[2] + a[1]*b[5] + a[2]*b[8],

            a[3]*b[0] + a[4]*b[3] + a[5]*b[6],
            a[3]*b[1] + a[4]*b[4] + a[5]*b[7],
            a[3]*b[2] + a[4]*b[5] + a[5]*b[8],

            a[6]*b[0] + a[7]*b[3] + a[8]*b[6],
            a[6]*b[1] + a[7]*b[4] + a[8]*b[7],
            a[6]*b[2] + a[7]*b[5] + a[8]*b[8],
        ]);
    }

    setIdentity(): void {
        this.m = [1,0,0, 0,1,0, 0,0,1];
    }

    transpose(): IMatrix {
        return new Matrix3([
            this.m[0], this.m[3], this.m[6],
            this.m[1], this.m[4], this.m[7],
            this.m[2], this.m[5], this.m[8]
        ]);
    }

    determinant(): number {
        const m = this.m;
        return m[0]*(m[4]*m[8]-m[5]*m[7]) - m[1]*(m[3]*m[8]-m[5]*m[6]) + m[2]*(m[3]*m[7]-m[4]*m[6]);
    }

    inverse(): IMatrix | null {
        const det = this.determinant();
        if (Math.abs(det) < 1e-10) return null;
        const m = this.m;
        const inv = [
            (m[4]*m[8] - m[5]*m[7])/det,
            (m[2]*m[7] - m[1]*m[8])/det,
            (m[1]*m[5] - m[2]*m[4])/det,

            (m[5]*m[6] - m[3]*m[8])/det,
            (m[0]*m[8] - m[2]*m[6])/det,
            (m[2]*m[3] - m[0]*m[5])/det,

            (m[3]*m[7] - m[4]*m[6])/det,
            (m[1]*m[6] - m[0]*m[7])/det,
            (m[0]*m[4] - m[1]*m[3])/det
        ];
        return new Matrix3(inv);
    }

    add(mat: IMatrix): IMatrix {
        const b = (mat as Matrix3).m;
        return new Matrix3(this.m.map((v, i) => v + b[i]));
    }

    subtract(mat: IMatrix): IMatrix {
        const b = (mat as Matrix3).m;
        return new Matrix3(this.m.map((v, i) => v - b[i]));
    }

    scale(scalar: number): IMatrix {
        return new Matrix3(this.m.map(v => v * scalar));
    }

    applyToVector(vec: number[]): number[] {
        const [x, y, z=1] = vec;
        return [
            this.m[0]*x + this.m[1]*y + this.m[2]*z,
            this.m[3]*x + this.m[4]*y + this.m[5]*z,
            this.m[6]*x + this.m[7]*y + this.m[8]*z,
        ];
    }

    toFloat32Array(): Float32Array {
        return new Float32Array(this.m);
    }

    clone(): IMatrix {
        return new Matrix3([...this.m]);
    }

    equals(mat: IMatrix, epsilon = 1e-6): boolean {
        const b = (mat as Matrix3).m;
        return this.m.every((v, i) => Math.abs(v - b[i]) < epsilon);
    }

    setFrom(mat: IMatrix): IMatrix {
        this.m = [...(mat as Matrix3).m];
        return this;
    }
}
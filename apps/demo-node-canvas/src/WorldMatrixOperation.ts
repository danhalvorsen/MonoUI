export class WorldMatrix {
  private matrix: number[][];

  constructor() {
    this.matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  }

  identity(): this {
    this.matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    return this;
  }

  translate(x: number, y: number): this {
    this.matrix[0][2] += x;
    this.matrix[1][2] += y;
    return this;
  }

  rotate(angle: number): this {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const m = this.matrix;
    const a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
    const a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];

    m[0][0] = a00 * cos + a10 * sin;
    m[0][1] = a01 * cos + a11 * sin;
    m[0][2] = a02 * cos + a12 * sin;
    m[1][0] = a10 * cos - a00 * sin;
    m[1][1] = a11 * cos - a01 * sin;
    m[1][2] = a12 * cos - a02 * sin;

    return this;
  }

  scale(sx: number, sy: number): this {
    this.matrix[0][0] *= sx;
    this.matrix[1][1] *= sy;
    return this;
  }

  // Optionally, add a method to get the raw matrix
  getMatrix(): number[][] {
    return this.matrix;
  }
}
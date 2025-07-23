// src/core/WhiteKey.ts
import { BaseKey } from "./basekey";
import { Point } from "./interfaces";

const W = 23.5, BOD = 90, BACK = 150, CUT = 8;

export class WhiteKey extends BaseKey {
  constructor(
    public readonly name: string,
    public readonly leftCut: boolean,
    public readonly rightCut: boolean,
    public readonly fillStyle = '#fff'
  ) { super(); }

  protected outline(): readonly Point[] {
    const v: Point[] = [
      [0, 0],
      [W, 0],
      ...(this.rightCut
        ? [[W, -BOD] as Point, [W - CUT, -BOD] as Point]
        : [[W, -BACK] as Point]),
      [(this.leftCut ? CUT : 0), -BACK] as Point,
      ...(this.leftCut
        ? [[CUT, -BOD] as Point, [0, -BOD] as Point]
        : [[0, -BACK] as Point])
    ];
    return v;
  }
}
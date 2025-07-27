// src/core/BaseKey.ts

import { buildEdges } from '../geometryUtils.js';
import { IKeyTemplate, Point } from './interfaces.js';

export abstract class BaseKey implements IKeyTemplate {
  abstract readonly name: string;
  abstract readonly fillStyle: string;

  /** subclasses implement their local outline */
  protected abstract outline(): readonly Point[];

  makeVertices(): readonly Point[] {
    return this.outline();
  }

  makeEdges(): readonly [number, number][] {
    return buildEdges(this.makeVertices());
  }
}

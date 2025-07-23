// src/interfaces.ts
export type Point = readonly [number, number];
export interface IKey {
  name: string;
  vertices: [number, number][];
  edges: [number, number][];
  fillStyle: string;
}

export interface IKeyTemplate {
  readonly name: string;
  readonly fillStyle: string;
  makeVertices(): readonly Point[];
  makeEdges(): readonly [number, number][];
}

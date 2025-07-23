import { Point } from "./core/interfaces";

export function translate(
  vertices: readonly Point[],
  dx: number,
  dy: number
): [number, number][] {
  return vertices.map(([x, y]) => [x + dx, y + dy]);
}

export function buildEdges(
  vertices: readonly Point[]
): [number, number][] {
  return vertices.map((_, i) => [i, (i + 1) % vertices.length]);

}
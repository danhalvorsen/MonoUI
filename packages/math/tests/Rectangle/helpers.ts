// File: packages/math/tests/Rectangle/helpers.ts
import { Vector2 } from '../../src/implementations/Vector2';
import { Line    } from '../../src/implementations/Line';
import { Mesh    } from '../../src/implementations/Mesh';
import {
  IRectangle,
  ILine,
} from '../../src/types/interfaces';
// Make sure the file exists and exports IRectangle and ILine.

export const DEFAULT_TOL = 1e-10;

/** Build an IRectangle quickly (no extra allocations inside tests). */
export function makeRect(
  x: number,
  y: number,
  w: number,
  h: number,
): IRectangle<Vector2> {
  const v0 = new Vector2(x,     y);
  const v1 = new Vector2(x + w, y);
  const v2 = new Vector2(x + w, y + h);
  const v3 = new Vector2(x,     y + h);

  const edges: [ILine<Vector2>, ILine<Vector2>, ILine<Vector2>, ILine<Vector2>] =
    [new Line(v0, v1), new Line(v1, v2), new Line(v2, v3), new Line(v3, v0)];

  return {
    vertices: [v0, v1, v2, v3],
    edges,
    contains: p =>
      p.x >= x && p.x <= x + w &&
      p.y >= y && p.y <= y + h,

    intersects: other => !(
      other.vertices[2].x < x ||
      other.vertices[0].x > x + w ||
      other.vertices[2].y < y ||
      other.vertices[0].y > y + h
    ),

    union: other => makeRect(
      Math.min(x, other.vertices[0].x),
      Math.min(y, other.vertices[0].y),
      Math.max(x + w, other.vertices[2].x) -
        Math.min(x, other.vertices[0].x),
      Math.max(y + h, other.vertices[2].y) -
        Math.min(y, other.vertices[0].y),
    ),

    intersectionRect: other => {
      const nx1 = Math.max(x,         other.vertices[0].x);
      const ny1 = Math.max(y,         other.vertices[0].y);
      const nx2 = Math.min(x + w,     other.vertices[2].x);
      const ny2 = Math.min(y + h,     other.vertices[2].y);
      return (nx2 <= nx1 || ny2 <= ny1)
        ? null
        : makeRect(nx1, ny1, nx2 - nx1, ny2 - ny1);
    },

    subtract: _other => new Mesh<Vector2>([]), // placeholder
  };
}

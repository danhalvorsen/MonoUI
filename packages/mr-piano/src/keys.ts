
import { Point } from "./core/interfaces";
import { buildEdges, translate } from "./geometryUtils";

// Add the KeyType type definition with fillStyle property
type KeyType = {
  name: string;
  baseVertices: readonly Point[];
  fillStyle: string;
};

export class PianoKey {
  name: string;
  vertices: readonly Point[];
  edges: readonly [number, number][];
  fillStyle: string;

  constructor(type: KeyType, dx: number, dy: number) {
    this.name = type.name;
    this.vertices = translate([...type.baseVertices], dx, dy);
    this.edges = buildEdges([...this.vertices]);
    this.fillStyle = type.fillStyle;
  }
}
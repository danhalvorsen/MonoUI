
import { translate } from './geometryUtils';
import { buildEdges } from './geometryUtils';
import { KeyName, KeyRegistry } from './core/keyRegistry';
import { IKey } from './core/interfaces';

export class KeyBuilder {
  static build(name: KeyName, dx = 0, dy = 0): IKey {
    const tmpl = KeyRegistry[name];
    const verts = translate(tmpl.makeVertices(), dx, dy).map(([x,y]) => [x, y]) as [number, number][];
    return {
      name : tmpl.name,
      fillStyle: tmpl.fillStyle,
      vertices : verts,
      edges    : buildEdges(verts)
    };
  }
}

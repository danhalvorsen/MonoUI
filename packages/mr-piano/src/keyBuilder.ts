
import { translate } from './geometryUtils.js';
import { buildEdges } from './geometryUtils.js';
import { IKey } from './core/interfaces.js';
import { KeyName, KeyRegistry } from './core/keyregistry.js';
 
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

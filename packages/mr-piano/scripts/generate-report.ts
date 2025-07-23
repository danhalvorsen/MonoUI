import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { KeyBuilder } from '../src/keyBuilder.js';
import { KeyTypes, KeyName } from '../src/keyTypes.js';
import { buildEdges } from '../src/geometryUtils.js';

const OUT = 'C:/temp/piano-keys-report.json';
mkdirSync('C:/temp', { recursive: true });

const DATA: Record<KeyName, any> = {} as any;

(Object.keys(KeyTypes) as KeyName[]).forEach((name) => {
  const key = KeyBuilder.build(name, 0, 0); // local coords
  DATA[name] = {
    position: [0, 0],
    vertices: key.vertices,
    edges:    buildEdges(key.vertices),
  };
});

writeFileSync(OUT, JSON.stringify(DATA, null, 2));
console.log(`✓ JSON report written to ${OUT}`);

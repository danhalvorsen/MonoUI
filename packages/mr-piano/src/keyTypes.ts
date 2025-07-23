export type Point = readonly [number, number];

export interface KeyType {
  name: string;
  baseVertices: readonly Point[]; // local XY
  fillStyle: string;
}

const BOD = 90;
const BACK = 150;
const CUT = 8;
const W = 23.5;

/* helper to build white shapes */
function white(
  leftCut = false,
  rightCut = false
): readonly Point[] {
  const pts: [number, number][] = [
    [0, 0], // front-left
    [W, 0], // front-right
  ];

  if (rightCut) {
    pts.push([W, -BOD], [W - CUT, -BOD]);
  } else {
    pts.push([W, -BACK]);
  }

  // back-right (or center)
  pts.push([leftCut ? CUT : 0, -BACK]);

  if (leftCut) {
    pts.push([CUT, -BOD], [0, -BOD]);
  }

  // ALWAYS add back-left to close
  if (!leftCut) {
    pts.push([0, -BACK]);
  }

  return pts;
}

/* tapered black shape (5 vertices) */
const blk: readonly Point[] = [
  [0, 0],
  [13.7, 0],
  [13.7, -88],
  [6.85, -90],
  [0, -88],
];

export const KeyTypes = {
  C:  { name: 'C',  baseVertices: white(false, true),  fillStyle: '#fff' },
  D:  { name: 'D',  baseVertices: white(true,  true),  fillStyle: '#fff' },
  E:  { name: 'E',  baseVertices: white(true,  false), fillStyle: '#fff' },
  F:  { name: 'F',  baseVertices: white(false, true),  fillStyle: '#fff' },
  G:  { name: 'G',  baseVertices: white(true,  true),  fillStyle: '#fff' },
  A:  { name: 'A',  baseVertices: white(true,  true),  fillStyle: '#fff' },
  B:  { name: 'B',  baseVertices: white(true,  false), fillStyle: '#fff' },

  'C#': { name: 'C#', baseVertices: blk, fillStyle: '#000' },
  'D#': { name: 'D#', baseVertices: blk, fillStyle: '#000' },
  'F#': { name: 'F#', baseVertices: blk, fillStyle: '#000' },
  'G#': { name: 'G#', baseVertices: blk, fillStyle: '#000' },
  'A#': { name: 'A#', baseVertices: blk, fillStyle: '#000' },
} as const;

export type KeyName = keyof typeof KeyTypes;

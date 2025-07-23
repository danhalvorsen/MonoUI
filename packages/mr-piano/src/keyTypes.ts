
export type Point = readonly [number, number];
export interface KeyType {
  name: string;
  baseVertices: readonly Point[];
  fillStyle: string;
}
const W = 23.5;
const L = 150;
const LIP = 140;
const N = 8; // notch width for sharps

// Individual white key polygons (simplified stepped shape)
const white = {
  C:  [
    [0,0],[W,0],
    [W,-LIP],[W-N,-LIP],[W-N,-L],[0,-L]
  ],
  D: [
    [0,0],[W,0],
    [W,-LIP],[N,-LIP],[N,-L],[0,-L]
  ],
  E: [
    [0,0],[W,0],[W,-L],[0,-L]
  ],
  F: [
    [0,0],[W,0],
    [W,-LIP],[W-N,-LIP],[W-N,-L],[0,-L]
  ],
  G: [
    [0,0],[W,0],
    [W,-LIP],[N,-LIP],[N,-L],[0,-L]
  ],
  A: [
    [0,0],[W,0],
    [W,-LIP],[N,-LIP],[N,-L],[0,-L]
  ],
  B: [
    [0,0],[W,0],[W,-L],[0,-L]
  ]
} as const;

const blackVertices: Point[] = [
  [0,0],[13.7,0],[13.7,-90],[0,-90]
];

export const KeyTypes = {
  C:  { name:'C',  baseVertices:white.C, fillStyle:'#fff'},
  D:  { name:'D',  baseVertices:white.D, fillStyle:'#fff'},
  E:  { name:'E',  baseVertices:white.E, fillStyle:'#fff'},
  F:  { name:'F',  baseVertices:white.F, fillStyle:'#fff'},
  G:  { name:'G',  baseVertices:white.G, fillStyle:'#fff'},
  A:  { name:'A',  baseVertices:white.A, fillStyle:'#fff'},
  B:  { name:'B',  baseVertices:white.B, fillStyle:'#fff'},
  'C#':{ name:'C#', baseVertices:blackVertices, fillStyle:'#000'},
  'D#':{ name:'D#', baseVertices:blackVertices, fillStyle:'#000'},
  'F#':{ name:'F#', baseVertices:blackVertices, fillStyle:'#000'},
  'G#':{ name:'G#', baseVertices:blackVertices, fillStyle:'#000'},
  'A#':{ name:'A#', baseVertices:blackVertices, fillStyle:'#000'}
} as const;

export type KeyName = keyof typeof KeyTypes;

export const snap = (v: number, g: number) => Math.round(v / g) * g;
export const snapVec2 = (x: number, y: number, g: number) => ({ x: snap(x, g), y: snap(y, g) });

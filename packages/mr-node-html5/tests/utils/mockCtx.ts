export function makeMockCtx() {
  const calls: string[] = [];
  const ctx: Partial<CanvasRenderingContext2D> = {
    save: () => { calls.push("save"); },
    restore: () => { calls.push("restore"); },
    translate: (x: number, y: number) => { calls.push(`translate(${x},${y})`); },
    rotate: (a: number) => { calls.push(`rotate(${a})`); },
    scale: (x: number, y: number) => { calls.push(`scale(${x},${y})`); },
    fillRect: (x: number, y: number, w: number, h: number) => { calls.push(`fillRect(${x},${y},${w},${h})`); },
    strokeRect: (x: number, y: number, w: number, h: number) => { calls.push(`strokeRect(${x},${y},${w},${h})`); },
    beginPath: () => { calls.push("beginPath"); },
    arc: (x: number, y: number, r: number) => { calls.push(`arc(${x},${y},${r})`); },
    fill: () => { calls.push("fill"); },
    stroke: () => { calls.push("stroke"); },
    set fillStyle(v: any) { calls.push(`fillStyle=${String(v)}`); }, get fillStyle() { return "" as any; },
    set strokeStyle(v: any) { calls.push(`strokeStyle=${String(v)}`); }, get strokeStyle() { return "" as any; },
    set lineWidth(v: number) { calls.push(`lineWidth=${v}`); }, get lineWidth() { return 1 as any; },
    set globalAlpha(v: number) { calls.push(`globalAlpha=${v}`); }, get globalAlpha() { return 1 as any; },
  } as CanvasRenderingContext2D;
  return { ctx: ctx as CanvasRenderingContext2D, calls };
}

// DemoObject.ts
import "reflect-metadata";

// File: apps/demo-node-canvas/src/main.ts
import { Canvas2DRenderer } from "./Canvas2DRenderer.js";
import { DemoObject } from "./DemoObject.js";

const canvas = document.getElementById("app") as HTMLCanvasElement;
const renderer = new Canvas2DRenderer(canvas);

const obj = new DemoObject("rect1", "#00ff00");

let lastTime = performance.now();
function loop(time: number) {
    const dt = time - lastTime;
    lastTime = time;

    obj.update(dt);

    renderer.clear();
    renderer.renderObject(obj);

    requestAnimationFrame(loop);
}
loop(lastTime);

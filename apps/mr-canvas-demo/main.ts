// packages/mr-canvas-demo/src/main.ts
import { createApp } from './canvasApp.js';

const canvas = document.getElementById('appCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const { render } = createApp(ctx);

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    requestAnimationFrame(loop);
}

loop();

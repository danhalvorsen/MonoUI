// packages/mr-canvas-html5/src/Html5MouseService.ts
import type { IMouseService } from 'mr-abstract-components';

export class Html5MouseService implements IMouseService {
    constructor(private canvas: HTMLCanvasElement) {}

    onClick(callback: (x: number, y: number) => void): void {
        this.canvas.addEventListener('click', (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            callback(e.clientX - rect.left, e.clientY - rect.top);
        });
    }

    onMove(callback: (x: number, y: number) => void): void {
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            callback(e.clientX - rect.left, e.clientY - rect.top);
        });
    }
}

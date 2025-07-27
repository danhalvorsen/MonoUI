import { SelectedTokens } from 'mr-style/src/tokens/selectedTokens.js';
import type { ISelectionBehavior } from 'mr-abstract-components';

import { injectable } from 'tsyringe';

@injectable()
export class CanvasSelectionBehavior implements ISelectionBehavior<CanvasRenderingContext2D> {
    selected = false;
    onAction?: (action: string, args: any) => void;

    onClick(event: MouseEvent, rect: { x: number, y: number, width: number, height: number }): void {
        console.log('CanvasSelectionBehavior.onClick called');
        const { x, y, width, height } = rect;
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        console.log(`Mouse at (${mouseX}, ${mouseY}), rect bounds: (${x}, ${y}) to (${x + width}, ${y + height})`);
        
        if (
            mouseX >= x &&
            mouseX <= x + width &&
            mouseY >= y &&
            mouseY <= y + height
        ) {
            console.log('Click is within bounds, toggling selection');
            this.selected = !this.selected;
            console.log('New selection state:', this.selected);
            this.onAction?.('select', { selected: this.selected });
        } else {
            console.log('Click is outside bounds');
        }
    }

    drawSelection(ctx: CanvasRenderingContext2D, rect: { x: number, y: number, width: number, height: number }) {
        if (!this.selected) return;
        ctx.save();
        ctx.strokeStyle = SelectedTokens.boundingBoxStroke;
        ctx.lineWidth = SelectedTokens.boundingBoxStrokeWidth;
        ctx.setLineDash(SelectedTokens.boundingBoxDash);
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.setLineDash([]);
        // Draw handles
        const handles = [
            [rect.x, rect.y],
            [rect.x + rect.width, rect.y],
            [rect.x, rect.y + rect.height],
            [rect.x + rect.width, rect.y + rect.height],
        ];
        for (const [cx, cy] of handles) {
            ctx.beginPath();
            ctx.arc(cx, cy, SelectedTokens.handleRadius, 0, 2 * Math.PI);
            ctx.fillStyle = SelectedTokens.handleFill;
            ctx.fill();
            ctx.strokeStyle = SelectedTokens.handleStroke;
            ctx.stroke();
        }
        ctx.restore();
    }
    containsPoint?(x: number, y: number, rect: { x: number, y: number, width: number, height: number }): boolean {
        // Default rectangle hit-test
        return (
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        );
    }
}

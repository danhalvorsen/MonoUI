// packages/mr-canvas-html5/src/Html5DraggableService.ts
import type { IDraggable } from 'mr-abstract-components';
import { Html5MouseService } from './Html5MouseService.js';

export class Html5DraggableService {
    private selected: IDraggable | null = null;

    constructor(private mouseService: Html5MouseService) {
        this.init();
    }

    private init() {
        this.mouseService.onClick((x, y) => {
            // Simple selection logic
            // (In real impl: check if point hits any draggable object)
            this.selected = null;
        });

        this.mouseService.onMove((x, y) => {
            if (this.selected) {
                this.selected.position = { x, y };
            }
        });
    }
}

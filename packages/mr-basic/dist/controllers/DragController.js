var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from 'tsyringe';
import { MouseController } from './MouseController';
let DragController = class DragController {
    mouse;
    host;
    dragging = false;
    startX = 0;
    startY = 0;
    constructor(mouse) {
        this.mouse = mouse;
    }
    setHost(host) {
        if (!(host instanceof HTMLElement)) {
            throw new Error('DragController host must be an HTMLElement');
        }
        this.host = host;
    }
    hostConnected() {
        if (!this.host.style.position || this.host.style.position === 'static') {
            this.host.style.position = 'absolute';
        }
        this.host.addEventListener('pointerdown', this.onDown, { passive: false });
        window.addEventListener('pointerup', this.onUp, { passive: true });
        window.addEventListener('pointermove', this.onMove, { passive: true });
    }
    hostDisconnected() {
        this.host.removeEventListener('pointerdown', this.onDown);
        window.removeEventListener('pointerup', this.onUp);
        window.removeEventListener('pointermove', this.onMove);
    }
    onDown = (e) => {
        e.preventDefault(); // prevent text selection
        this.dragging = true;
        this.startX = e.clientX - this.host.offsetLeft;
        this.startY = e.clientY - this.host.offsetTop;
    };
    onUp = () => {
        this.dragging = false;
    };
    onMove = () => {
        if (!this.dragging)
            return;
        if (this.mouse?.x == null || this.mouse?.y == null)
            return;
        const x = this.mouse.x - this.startX;
        const y = this.mouse.y - this.startY;
        this.host.style.left = `${x}px`;
        this.host.style.top = `${y}px`;
    };
};
DragController = __decorate([
    injectable(),
    __param(0, inject(MouseController)),
    __metadata("design:paramtypes", [MouseController])
], DragController);
export { DragController };

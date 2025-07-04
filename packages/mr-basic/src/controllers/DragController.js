var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from 'tsyringe';
import { MouseController } from './MouseController';
let DragController = class DragController {
    constructor(mouse) {
        Object.defineProperty(this, "mouse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: mouse
        });
        Object.defineProperty(this, "host", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dragging", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "startX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "startY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "onDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (e) => {
                this.dragging = true;
                this.startX = e.clientX - this.host.offsetLeft;
                this.startY = e.clientY - this.host.offsetTop;
            }
        });
        Object.defineProperty(this, "onUp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.dragging = false;
            }
        });
        Object.defineProperty(this, "onMove", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (!this.dragging)
                    return;
                const x = this.mouse.x - this.startX;
                const y = this.mouse.y - this.startY;
                this.host.style.left = `${x}px`;
                this.host.style.top = `${y}px`;
            }
        });
    }
    setHost(host) {
        this.host = host;
    }
    hostConnected() {
        this.host.style.position = 'absolute';
        this.host.addEventListener('pointerdown', this.onDown);
        window.addEventListener('pointerup', this.onUp);
        window.addEventListener('pointermove', this.onMove);
    }
    hostDisconnected() {
        this.host.removeEventListener('pointerdown', this.onDown);
        window.removeEventListener('pointerup', this.onUp);
        window.removeEventListener('pointermove', this.onMove);
    }
};
DragController = __decorate([
    injectable(),
    __param(0, inject(MouseController))
], DragController);
export { DragController };

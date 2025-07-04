var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'tsyringe';
let ScaleController = class ScaleController {
    constructor() {
        this.scale = 1;
        this.onWheel = (e) => {
            e.preventDefault();
            this.scale += e.deltaY > 0 ? -0.1 : 0.1;
            if (this.scale < 0.1)
                this.scale = 0.1;
            this.applyScale();
            this.host.requestUpdate();
        };
    }
    setHost(host) {
        this.host = host;
    }
    hostConnected() {
        this.host.addEventListener('wheel', this.onWheel);
        this.applyScale();
    }
    hostDisconnected() {
        this.host.removeEventListener('wheel', this.onWheel);
    }
    applyScale() {
        this.host.style.transform = `scale(${this.scale})`;
        this.host.style.transformOrigin = 'top left';
    }
};
ScaleController = __decorate([
    injectable()
], ScaleController);
export { ScaleController };

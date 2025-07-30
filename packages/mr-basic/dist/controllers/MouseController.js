var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { injectable } from 'tsyringe';
let MouseController = class MouseController {
    x = 0;
    y = 0;
    host;
    setHost(host) {
        this.host = host;
    }
    hostConnected() {
        this.host.addEventListener('pointermove', this.onMove);
    }
    hostDisconnected() {
        this.host.removeEventListener('pointermove', this.onMove);
    }
    onMove = (e) => {
        this.x = e.clientX;
        this.y = e.clientY;
        this.host.requestUpdate();
    };
};
MouseController = __decorate([
    injectable()
], MouseController);
export { MouseController };

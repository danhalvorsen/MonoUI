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
import 'reflect-metadata';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { autoInjectable, inject } from 'tsyringe';
import { ScaleController } from './controllers/ScaleController';
import { MouseController } from './controllers/MouseController';
import { DragController } from './controllers/DragController';
let MrBasic = class MrBasic extends LitElement {
    constructor(scaleController, mouseController, dragController) {
        super();
        this.scaleController = scaleController;
        this.mouseController = mouseController;
        this.dragController = dragController;
        this.scaleController?.setHost(this);
        this.mouseController?.setHost(this);
        this.dragController?.setHost(this);
        this.addController(this.scaleController);
        this.addController(this.mouseController);
        this.addController(this.dragController);
    }
    render() {
        return html `<slot></slot>`;
    }
};
MrBasic.styles = css `
    :host {
      display: block;
      width: 150px;
      height: 150px;
      background: lightgray;
      user-select: none;
      touch-action: none;
    }
  `;
MrBasic = __decorate([
    customElement('mr-basic'),
    autoInjectable(),
    __param(0, inject(ScaleController)),
    __param(1, inject(MouseController)),
    __param(2, inject(DragController)),
    __metadata("design:paramtypes", [ScaleController,
        MouseController,
        DragController])
], MrBasic);
export { MrBasic };
export { ScaleController, MouseController, DragController };

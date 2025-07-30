var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// File: packages/mr-basic/src/mr-basic.ts
import 'reflect-metadata';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { container } from 'tsyringe';
import { ScaleController } from './controllers/ScaleController.js';
import { MouseController } from './controllers/MouseController.js';
import { DragController } from './controllers/DragController.js';
let MrBasic = class MrBasic extends LitElement {
    static styles = css `
    :host {
      display: block;
      width: 150px;
      height: 150px;
      background: lightgray;
      user-select: none;
      touch-action: none;
    }
  `;
    scaleController;
    mouseController;
    dragController;
    constructor() {
        super();
        // Resolve dependencies from the container
        this.scaleController = container.resolve(ScaleController);
        this.mouseController = container.resolve(MouseController);
        this.dragController = container.resolve(DragController);
        // Bind host after resolution
        this.scaleController.setHost(this);
        this.mouseController.setHost(this);
        this.dragController.setHost(this);
        // Add controllers to Lit lifecycle
        this.addController(this.scaleController);
        this.addController(this.mouseController);
        this.addController(this.dragController);
    }
    render() {
        return html `<slot></slot>`;
    }
};
MrBasic = __decorate([
    customElement('mr-basic'),
    __metadata("design:paramtypes", [])
], MrBasic);
export { MrBasic };

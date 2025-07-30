// File: packages/mr-basic/src/mr-basic.ts
import 'reflect-metadata';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { container, inject } from 'tsyringe';
import { ScaleController } from './controllers/ScaleController.js';
import { MouseController } from './controllers/MouseController.js';
import { DragController } from './controllers/DragController.js';

@customElement('mr-basic')
export class MrBasic extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 150px;
      height: 150px;
      background: lightgray;
      user-select: none;
      touch-action: none;
    }
  `;

  private scaleController!: ScaleController;
  private mouseController!: MouseController;
  private dragController!: DragController;

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
    return html`<slot></slot>`;
  }
}

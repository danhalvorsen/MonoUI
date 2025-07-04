import 'reflect-metadata';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { autoInjectable, inject } from 'tsyringe';
import { ScaleController } from './controllers/ScaleController';
import { MouseController } from './controllers/MouseController';
import { DragController } from './controllers/DragController';

@customElement('mr-basic')
@autoInjectable()
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

  constructor(
    @inject(ScaleController) private scaleController?: ScaleController,
    @inject(MouseController) private mouseController?: MouseController,
    @inject(DragController) private dragController?: DragController
  ) {
    super();
    this.scaleController?.setHost(this);
    this.mouseController?.setHost(this);
    this.dragController?.setHost(this);

    this.addController(this.scaleController!);
    this.addController(this.mouseController!);
    this.addController(this.dragController!);
  }

  render() {
    return html`<slot></slot>`;
  }
}

export { ScaleController, MouseController, DragController };

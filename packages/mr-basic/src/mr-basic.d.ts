import 'reflect-metadata';
import { LitElement } from 'lit';
import { ScaleController } from './controllers/ScaleController';
import { MouseController } from './controllers/MouseController';
import { DragController } from './controllers/DragController';
export declare class MrBasic extends LitElement {
    private scaleController?;
    private mouseController?;
    private dragController?;
    static styles: import("lit").CSSResult;
    constructor(scaleController?: ScaleController | undefined, mouseController?: MouseController | undefined, dragController?: DragController | undefined);
    render(): import("lit-html").TemplateResult<1>;
}
export { ScaleController, MouseController, DragController };

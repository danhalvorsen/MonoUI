import { LitElement } from "lit";
import { CanvasEngine, IVisualObject } from "mr-abstract-components";
export declare class CanvasEngineElement extends LitElement implements CanvasEngine<CanvasRenderingContext2D> {
    static styles: import("lit").CSSResult;
    width: number;
    height: number;
    private _canvas;
    private _ctx;
    private _objects;
    private _loop;
    get context(): CanvasRenderingContext2D;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    add(obj: IVisualObject<CanvasRenderingContext2D>): void;
    remove(): void;
    remove(obj: IVisualObject<CanvasRenderingContext2D>): void;
    clear(): void;
    private _tick;
    render(): import("lit-html").TemplateResult<1>;
}
export type Canvas2DEngine = CanvasEngineElement;

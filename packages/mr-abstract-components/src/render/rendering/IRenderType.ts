import { IVisualObject } from "../../core/IVisualObject.js";

export interface IRenderType {
    /** Initialize rendering context (e.g., set up WebGL state, clear buffers) */
    initialize(): void;

    /** Clear the scene before rendering */
    clear(): void;

    /** Render a single object */
    renderObject(obj: IVisualObject): void;

    /** Resize the rendering viewport */
    resize(width: number, height: number): void;
}
import { IVisualObject } from "./IVisualObject.js";


export interface ICanvasEngine<C> {
  readonly context: C;
  add(obj: IVisualObject): void;
  remove(obj: IVisualObject): void;
  clear(): void;
}

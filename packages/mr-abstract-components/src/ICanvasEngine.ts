import { IVisualObject } from "./IVisualObject.js";


export interface ICanvasEngine<C> {
  readonly context: C;
  add(obj: IVisualObject<C>): void;
  remove(obj: IVisualObject<C>): void;
  clear(): void;
}

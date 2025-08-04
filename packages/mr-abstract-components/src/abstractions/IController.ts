import { IVisualObject, IObject } from "src/index.js";

export interface IController{
    update(time: number, delta: number): void;
    objects: IVisualObject[];
}

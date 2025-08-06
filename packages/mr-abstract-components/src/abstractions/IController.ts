import { IVisualObject } from "./IVisualObject.js";


export interface IController{
    update(time: number, delta: number): void;
    objects: IVisualObject[];
}

import { IVisualObject } from "./canvas/IVisualObject.js";

export interface IControllerConfiguration {
  
}

export interface IController {
    configuration: IControllerConfiguration;
    update(time: number, delta: number): void;
    visualObjects: IVisualObject[];    
}
export interface Params$Type {
    
}
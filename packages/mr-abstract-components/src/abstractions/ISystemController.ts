import { IControllerConfiguration } from "src/index.js";

export interface ISystemController {
    configuration: IControllerConfiguration;
    update(time: number, delta: number): void;
    features: ISystemController[];    
}
export interface Params$Type {
    
}
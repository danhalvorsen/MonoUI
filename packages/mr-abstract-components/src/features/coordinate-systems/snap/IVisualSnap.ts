import { IVisualObject } from "./features/abstractions/IVisualObject.js";

export interface ISnapFeature extends IVisualObject {
    snapToGrid: boolean;
    snapToOrigin: boolean;
    snapToAxis: boolean;
    snapToCenter: boolean;
    snapToConnector: boolean;
    snapToSnapFeature: boolean;
}
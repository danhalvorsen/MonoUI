import { IVisualObject } from "src/index.js";

export interface ISnapFeature extends IVisualObject {
    snapToGrid: boolean;
    snapToOrigin: boolean;
    snapToAxis: boolean;
    snapToCenter: boolean;
    snapToConnector: boolean;
    snapToSnapFeature: boolean;
}
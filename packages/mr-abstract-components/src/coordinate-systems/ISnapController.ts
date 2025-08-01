import { IController } from "../IController.js";
import { ISnapFeature } from "./IVisualSnap.js";
import { Vector2 } from "@my-graphics/math";

export interface ISnapController extends IController {
    snapFeature: ISnapFeature;
    enabled: boolean;
    tolerance: number;
    
    /** Enable/disable snap functionality */
    setEnabled(enabled: boolean): void;
    
    /** Set snap tolerance in pixels */
    setTolerance(tolerance: number): void;
    
    /** Update snap configuration */
    updateSnapConfiguration(config: Partial<ISnapFeature>): void;
    
    /** Find nearest snap point for given coordinates */
    findSnapPoint(position: Vector2): Vector2 | null;
    
    /** Check if position should snap to any target */
    shouldSnap(position: Vector2): boolean;
}

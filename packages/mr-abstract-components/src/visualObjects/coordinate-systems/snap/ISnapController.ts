import { Vector2 } from "@my-graphics/math";
import {  IVisualObjectConfiguration, ISystemController, ISnapFeature} from "src/index.js";

export interface ISnapController extends ISystemController {
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

import { IGridFeature, ISystemController } from "src/index.js";

export interface IGridController extends ISystemController {
    gridFeature: IGridFeature;
    enabled: boolean;
    
    /** Enable/disable grid functionality */
    setEnabled(enabled: boolean): void;
    
    /** Update grid configuration */
    updateGridConfiguration(config: Partial<IGridFeature>): void;
    
    /** Check if point snaps to grid */
    snapToGrid(x: number, y: number): { x: number; y: number } | null;
}

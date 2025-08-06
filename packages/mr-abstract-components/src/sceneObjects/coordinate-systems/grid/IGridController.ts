import { IReactiveController } from "../../controllers/IReactiveController.js";
import { ISystemController } from "../../abstractions/ISystemController.js";
    
export interface IGridController extends ISystemController {
    gridFeature: IReactiveController;
    enabled: boolean;
    
    /** Enable/disable grid functionality */
    setEnabled(enabled: boolean): void;
    
    /** Update grid configuration */
    updateGridConfiguration(config: Partial<IReactiveController>): void;
    
    /** Check if point snaps to grid */
    snapToGrid(x: number, y: number): { x: number; y: number } | null;
}

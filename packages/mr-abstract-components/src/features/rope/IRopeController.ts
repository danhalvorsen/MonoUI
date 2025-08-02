import { IRopeController } from "./IRopeVisual";
import { ISystemController } from '../features/abstractions/ISystemController.js';

export interface IRopeControllerConfiguration {}
export interface IRopeController extends ISystemController {
    configuration: IRopeControllerConfiguration
}

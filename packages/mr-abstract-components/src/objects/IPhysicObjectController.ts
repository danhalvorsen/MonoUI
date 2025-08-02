import { IPhysicalControllerConfiguration } from "../features/abstractions/IPhysicalControllerConfiguration.js";
import { ISystemController } from "../features/abstractions/ISystemController.js";


export interface IPhysicObjectController extends ISystemController {
  configuration: IPhysicalControllerConfiguration;
}

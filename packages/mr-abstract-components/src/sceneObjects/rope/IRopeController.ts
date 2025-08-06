import { ISystemController } from "../abstractions/ISystemController.js";
import { IControllerConfiguration } from "../../abstractions/core/configuration/IControllerConfiguration.js";
 
 
export interface IRopeControllerConfiguration  {
    id: string;
    configValues?: Record<string, unknown>;
    c1: IControllerConfiguration;
}
export interface IRopeController extends ISystemController{
    
    configuration: IRopeControllerConfiguration;
    
    c1: IRopeControllerConfiguration;
}

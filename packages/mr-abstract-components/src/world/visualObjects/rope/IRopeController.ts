import { IReactiveController } from "../../../controllers/IReactiveController.js";


export interface IRopeControllerConfiguration  {
    id: string;
    configValues?: Record<string, unknown>;
    c1: IRopeControllerConfiguration;
}
export interface IRopeController extends IReactiveController{
    configuration: IRopeControllerConfiguration;
    c1: IRopeControllerConfiguration;
}

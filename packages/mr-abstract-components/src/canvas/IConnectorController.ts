import { IVisualConnector } from "./IVisualConnector.js";
import { IController } from "../IController.js";


export interface IConnectorControllerConfiguration {
    connectors: IVisualConnector[];
}
export interface IConnectorController extends IController {
    configuration: IConnectorControllerConfiguration;
}

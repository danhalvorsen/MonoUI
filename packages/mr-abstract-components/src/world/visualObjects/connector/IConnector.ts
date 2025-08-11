/** Interface for connector objects */
import { IConfiguration } from "../../../IConfiguration.js";
import { IVisualObject } from "../../../core/IVisualObject.js";

export interface IConnector extends IVisualObject {
  physical: IConfiguration;
  SetConnectedObject(obj: IVisualObject): void;
  GetConnectedObject(): IVisualObject | undefined;
  RemoveConnectedObject(): void;
  IsConnected(): boolean;
}

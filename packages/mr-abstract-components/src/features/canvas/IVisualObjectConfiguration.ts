import type { IVisualStyle } from "../../style/IVisualStyle.js";
import type { IPhysicsConfiguration } from "./IPhysicsConfiguration.js";
import type { IInteractionConfiguration } from "./IInteractionConfiguration.js";
import { IConnector } from "../connector/IConnector.js";
 
export interface IVisualObjectConfiguration {
  id: string;
  physics: IPhysicsConfiguration;
  visual: IVisualStyle;
  interaction: IInteractionConfiguration;
  connectors: IConnector[];
}

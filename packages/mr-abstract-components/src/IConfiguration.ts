import { IInteractionConfiguration } from "./canvas/IInteractionConfiguration.js";
import { IVisualStyle } from "./style/IStyle.js";
import { IConnector } from "./world/visualObjects/connector/IConnector.js";

export interface IConfiguration {
    id: string;
    configValues?: Record<string, unknown>; // Flexible configuration storage
      
  visual: IVisualStyle;
  interaction: IInteractionConfiguration;
  connectors: IConnector[];
}

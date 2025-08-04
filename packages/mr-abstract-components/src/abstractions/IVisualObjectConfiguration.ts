import {
  IInteractionConfiguration,
  IConnector,
  IVisualStyle,
} from "src/index.js";

export interface IVisualObjectConfiguration {
  id: string;
  visual: IVisualStyle;
  interaction: IInteractionConfiguration;
  connectors: IConnector[];
}

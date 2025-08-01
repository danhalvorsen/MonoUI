import type { IVisualStyle } from "./IVisualStyle.js";
import type { IPhysicsConfiguration } from "./IPhysicsConfiguration.js";
import type { IInteractionConfiguration } from "./IInteractionConfiguration.js";
import type { IConnectorsConfiguration } from "./IConnectorsConfiguration.js";

export interface IVisualObjectConfiguration {
  id: string;
  physics: IPhysicsConfiguration;
  visual: IVisualStyle;
  interaction: IInteractionConfiguration;
  connectors: IConnectorsConfiguration;
}

import { Vector2 } from "@my-graphics/math";
import { IVisualConnector } from "../world/visualObjects/connector/IVisualConnector.js";
import { IConfiguration } from "../IConfiguration.js";
 import {IChangedProperties} from "../events/PropertyChange/ChangedProperties.js"
 import {IObject} from "./IObject.js"
export interface IVisualObject extends IObject {
  onRemoved(): unknown;
  configuration: IConfiguration[];
  id: string;
  selected?: boolean;
  enabled?: boolean;
  position: Vector2;
  children: Set<IObject>;
  connectors?: IVisualConnector[];
  isDraggable?: boolean;
  
  connectedCallback?(): void;
  disconnectedCallback?(): void;
  shouldUpdate?(changedProperties: IChangedProperties): boolean;
  willUpdate?(changedProperties: IChangedProperties): void;
  firstUpdated?(changedProperties: IChangedProperties): void;
  updated?(changedProperties: IChangedProperties): void;
}

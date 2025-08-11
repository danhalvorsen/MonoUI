import { IVisualConnector } from "../connector/IVisualConnector.js";
import { IVisualObject } from "../../../core/IVisualObject.js";
import { Vector2 } from "@my-graphics/math";
 
export interface IRopeVisual extends IVisualObject {
  id: string;
  startObject: IVisualConnector;
  endObject: IVisualConnector;
  state: 'default' | 'active' | 'selected' | 'disabled';
  lineVariant: 'thin' | 'medium' | 'thick';
  lineStyle: 'solid' | 'dotted' | 'dashed';
  getLength(): number;
  getStartPoint(): Vector2;
  getEndPoint(): Vector2;
  setRopeStyle(lineVariant?: 'thin' | 'medium' | 'thick', lineStyle?: 'solid' | 'dotted' | 'dashed', state?: 'default' | 'active' | 'selected' | 'disabled'): void;
  getConnectionInfo(): { isConnected: boolean; startObject: string; endObject: string; length: number; };
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
}

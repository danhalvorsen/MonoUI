import { Vector2 } from "@my-graphics/math";
import { IVisualConnector } from "../connector/IVisualConnector.js";
import { IVisualObjectConfiguration } from "./IVisualObjectConfiguration.js";
import { ChangedProperties } from "./ChangedProperties.js";

export interface IVisualObject {
  /** Configuration object that encapsulates all data and parameters */
  configuration: IVisualObjectConfiguration;
  
  // Legacy properties for backward compatibility (these should be accessed via configuration)
  id: string;
  selected?: boolean;
  enabled?: boolean;
  position: Vector2;

  // Connectors (0 to many anchor points)
  connectors?: IVisualConnector[];

  // Dragging support
  isDraggable?: boolean;
  onDragStart?: (event: MouseEvent) => void;
  onDrag?: (event: MouseEvent, dx: number, dy: number) => void;
  onDragEnd?: (event: MouseEvent) => void;

  // Core render/update methods
  update(dt: number): void;
  render(ctx: unknown): void;

  // Lifecycle methods (inspired by Lit3)
  
  /**
   * Called when the visual object is added to the canvas/scene.
   * Use this to set up event listeners, initialize resources, or perform
   * one-time setup that should only occur when the object is active.
   */
  connectedCallback?(): void;

  /**
   * Called when the visual object is removed from the canvas/scene.
   * Use this to clean up resources, remove event listeners, or perform
   * cleanup to prevent memory leaks.
   */
  disconnectedCallback?(): void;

  /**
   * Called to determine whether an update cycle should proceed.
   * Return false to skip the update/render cycle for performance optimization.
   * 
   * @param changedProperties Map of properties that have changed
   * @returns true if the object should update, false to skip
   */
  shouldUpdate?(changedProperties: ChangedProperties): boolean;

  /**
   * Called before update() to compute values needed during the update.
   * Use this to calculate derived properties or prepare state based on
   * changed properties.
   * 
   * @param changedProperties Map of properties that have changed
   */
  willUpdate?(changedProperties: ChangedProperties): void;

  /**
   * Called after the object's first update cycle completes.
   * Use this for one-time initialization that requires the object
   * to be fully set up (e.g., focusing elements, setting up observers).
   * 
   * @param changedProperties Map of properties that changed in first update
   */
  firstUpdated?(changedProperties: ChangedProperties): void;

  /**
   * Called after every update cycle completes.
   * Use this to perform tasks that depend on the object's current state
   * after rendering (e.g., DOM measurements, animations).
   * 
   * @param changedProperties Map of properties that changed in this update
   */
  updated?(changedProperties: ChangedProperties): void;
}

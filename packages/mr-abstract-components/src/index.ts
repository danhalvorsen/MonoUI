// Core Interfaces and Types
export * from "./canvas/AnimationLoop.js";
export * from "./canvas/IAxisController.js";
export * from "./canvas/ICanvasController.js";
export * from "./canvas/IVisualConnector.js";
export * from "./interfaces.js";
export * from "./canvas/IConnectorConfiguration.js";
export * from "./canvas/IConnectorsConfiguration.js";
export * from "./canvas/IConnectorController.js";
export * from "./canvas/IInteractionConfiguration.js";
export * from "./canvas/IPhysicsConfiguration.js";
export * from "./canvas/IVisualObject.js";
export * from "./canvas/IVisualObjectConfiguration.js";
export * from "./canvas/IVisualStyle.js";

// Object Interfaces
export * from "./objects/IPhysicObject.js";
export * from "./objects/IRopeVisual.js";
export * from "./objects/IStyle.js";

// Coordinate System Interfaces
export * from "./coordinate-systems/ICartesianCoordinateController.js";
export * from "./coordinate-systems/ICartesianCoordinateControllerConfiguration.js";
export * from "./coordinate-systems/IVisualAxis.js";

export * from "./coordinate-systems/IVisualGrid.js";
export * from "./coordinate-systems/IVisualSnap.js";
export * from "./coordinate-systems/IGridController.js";
export * from "./coordinate-systems/ISnapController.js";

// Configuration Interfaces
export * from "./coordinate-systems/IAxisConfiguration.js";
export * from "./coordinate-systems/IGridConfiguration.js";
export * from "./coordinate-systems/ISnapConfiguration.js";

// Controller Interfaces
export * from "./controllers/IReactiveController.js";
export * from "./controllers/ReactiveControllerHost.js";

// Behavior Interfaces
export * from "./IDragBehavior.js";
export * from "./SelectionBehavior.js";

// Shape and Utility Interfaces
export * from "./IBoundingShape.js";
export * from "./BoundingRectangle.js";

// Utility Functions
export * from "./utils/snap.js";

// Common Interfaces and Types
// Note: IGridFeature is exported from ./coordinate-systems/IVisualGrid.js to avoid conflicts 
// Re-export specific types for convenience
export type { IStyle, ChangedProperties } from "./canvas/IVisualObject.js";
export type { ConnectorTokens } from "./coordinate-systems/IVisualConnector.js";

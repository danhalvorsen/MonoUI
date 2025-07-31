import { CanvasEngine } from './CanvasEngine.js';
import { Vector2 } from '@my-graphics/math';

import { DragHostService } from './services/DragHostService.js';
import { DemoConfig } from './config/DemoConfig.js';
import { CartesianDragController } from './controllers/CartesianDragController.js';
import { ScreenCoordinateSystem } from './coordinates/ScreenCoordinateSystem.js';
import { SelectionService } from './services/SelectionService.js';
import { Connector } from 'mr-web-components';
import type { IVisualObject } from 'mr-abstract-components';

/**
 * Main application class for the draggable demo
 * Follows Single Responsibility Principle - orchestrates the demo setup
 * Uses Dependency Injection for better testability and flexibility
 */
export class DemoApplication {
  private engine: CanvasEngine;
  private dragHostService!: DragHostService;
  private dragController!: CartesianDragController;
  private draggableObjects: IVisualObject[] = [];
  private coordinateSystem: ScreenCoordinateSystem;
  private selectionService: SelectionService;

  constructor(canvasId: string) {
    this.engine = new CanvasEngine(canvasId);
    
    // Initialize screen coordinate system with canvas dimensions
    this.coordinateSystem = new ScreenCoordinateSystem(this.engine.canvasWidth, this.engine.canvasHeight);
    
    this.selectionService = new SelectionService();
    this.setupDemo();
  }

  /**
   * Sets up the complete demo with all objects and controllers
   */
  private setupDemo(): void {
    this.createObjects();
    // Setup drag functionality AFTER all objects (including connectors) are created
    this.setupDragFunctionality();
    this.setupSelectionFunctionality();
    this.startEngine();
  }

  /**
   * Creates all visual objects for the demo
   */
  private createObjects(): void {
    // Create rectangles directly using library code
    const config = DemoConfig.createAllRectangles();
    
    // Get drop zone and draggable rectangles
    const dropZone = config.dropZone;
    const draggableRectangles = config.draggableRectangles;
    this.engine.addObject(dropZone);
    this.draggableObjects = draggableRectangles;
    this.draggableObjects.forEach(obj => this.engine.addObject(obj));
    
    // Add all connectors to draggable objects for hit testing
    // VisualRectangle automatically creates center connectors in constructor
    this.addConnectorsToHitTesting([dropZone, ...draggableRectangles]);
  }
  
  /**
   * Adds all connectors from visual objects to draggable objects for hit testing
   */
  private addConnectorsToHitTesting(visualObjects: IVisualObject[]): void {
    visualObjects.forEach(obj => {
      if (obj.connectors) {
        obj.connectors.forEach(connector => {
          // Add connector to engine for rendering
          this.engine.addObject(connector);
          // Add connector to draggable objects for hit testing
          this.draggableObjects.push(connector);
          // Setup click handler (cast to Connector type)
          this.setupConnectorClickHandler(connector as Connector);
          
          console.log('✅ CONNECTOR ADDED:', {
            id: connector.id,
            position: connector.position,
            hostPosition: obj.position
          });
        });
      }
    });
  }
  
  /**
   * Adds a single connection point to the center of the drop zone
   */
  private addConnectorToDropZone(dropZone: IVisualObject): void {
    // Create a single connector at the center of the drop zone
    const centerConnector = new Connector(`${dropZone.id}-center`, dropZone, 0, 0);
    
    // Set up click handler for the center connector
    this.setupConnectorClickHandler(centerConnector);
    
    // Add the connector to the engine for rendering
    this.engine.addObject(centerConnector);
    
    // Add the connector to draggable objects so it can be hit tested
    this.draggableObjects.push(centerConnector);
    
    console.log('✅ CONNECTOR ADDED:', {
      id: centerConnector.id,
      position: centerConnector.position,
      hostPosition: dropZone.position
    });
  }
  
  /**
   * Sets up click handler for connector with offset behavior
   */
  private setupConnectorClickHandler(connector: Connector): void {
    connector.onDragStart = (event: MouseEvent) => {
      console.log('🔗 CONNECTOR CLICKED:', {
        connectorId: connector.id,
        position: connector.position,
        offset: { x: connector.position.x, y: connector.position.y }
      });
      
      // Implement offset behavior - could start a connection line here
      // For now, just highlight the connector
      connector.selected = true;
      this.engine.requestRender();
    };
    
    connector.onDragEnd = (event: MouseEvent) => {
      console.log('🔗 CONNECTOR RELEASED:', {
        connectorId: connector.id,
        finalPosition: connector.position
      });
      
      // Reset connector selection
      connector.selected = false;
      this.engine.requestRender();
    };
  }

  /**
   * Sets up drag functionality with proper service injection
   */
  private setupDragFunctionality(): void {
    this.dragHostService = new DragHostService(
      this.engine.getCanvas(),
      this.draggableObjects,
      this.coordinateSystem
    );
    
    this.dragController = new CartesianDragController(this.dragHostService);
  }

  /**
   * Sets up selection functionality for VisualRectangles
   */
  private setupSelectionFunctionality(): void {
    const canvas = this.engine.canvasElement;
    
    // Add click event listener for selection
    canvas.addEventListener('click', (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / canvas.clientWidth;
      const scaleY = canvas.height / canvas.clientHeight;
      const mouseX = (event.clientX - rect.left) * scaleX;
      const mouseY = (event.clientY - rect.top) * scaleY;
      
      // Convert screen coordinates to canonical coordinates
      const canonicalPoint = this.coordinateSystem.toCanonical({ x: mouseX, y: mouseY });
      
      // Find clicked object using DragHostService hit testing
      const dragHost = this.dragHostService;
      const clickedObject = dragHost.getObjectAt(canonicalPoint.x, canonicalPoint.y);
      
      if (clickedObject && 'color' in clickedObject) {
        // Handle selection with Ctrl/Cmd for multi-select
        const multiSelect = event.ctrlKey || event.metaKey;
        this.selectionService.handleClick(clickedObject as any, multiSelect);
        
        // Request a re-render by updating the engine
        this.engine.requestRender();
      } else {
        // Click on empty space - clear selection
        this.selectionService.clearSelection();
        this.engine.requestRender();
      }
    });
  }

  /**
   * Starts the canvas engine rendering loop
   */
  private startEngine(): void {
    this.engine.start();
  }

  /**
   * Gets the canvas engine instance (for testing or external access)
   */
  getEngine(): CanvasEngine {
    return this.engine;
  }

  /**
   * Gets the drag controller instance (for testing or external access)
   */
  getDragController(): CartesianDragController {
    return this.dragController;
  }

  /**
   * Gets all draggable objects (for testing or external access)
   */
  getDraggableObjects(): IVisualObject[] {
    return [...this.draggableObjects]; // Return copy to prevent external mutation
  }

  /**
   * Adds a new draggable object to the demo
   * Follows Open/Closed Principle - allows extension without modification
   */
  addDraggableObject(object: IVisualObject): void {
    this.draggableObjects.push(object);
    this.engine.addObject(object);
    this.dragHostService.updateDraggableObjects(this.draggableObjects);
  }

  /**
   * Removes a draggable object from the demo
   */
  removeDraggableObject(objectId: string): boolean {
    const index = this.draggableObjects.findIndex(obj => obj.id === objectId);
    if (index !== -1) {
      this.draggableObjects.splice(index, 1);
      this.dragHostService.updateDraggableObjects(this.draggableObjects);
      return true;
    }
    return false;
  }

  /**
   * Cleans up resources when the demo is destroyed
   */
  destroy(): void {
    // Clean up drag controller
    if (this.dragController && this.dragHostService) {
      this.dragHostService.removeController(this.dragController);
    }
    
    // Additional cleanup can be added here
  }
}

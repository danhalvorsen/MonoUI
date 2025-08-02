import { CanvasEngine } from './canvas/CanvasEngine.js';
import { Vector2 } from '@my-graphics/math';

import { DragHostService } from './dragging/DragHostService.js';
import { CartesianDragController } from './dragging/CartesianDragController.js';
import { CartesianCoordinateSystem } from 'mr-web-components';
import { SelectionService } from './services/SelectionService.js';
import { Connector, VisualRectangle } from 'mr-web-components';
import { CanvasDarkTheme } from 'mr-style';
import type { IVisualObject } from 'mr-abstract-components';
import { MapScreenCoordinateSystem } from './coordinateSystems/systems/MapScreenCoordinateSystem.js';

/**
 * Main application class for the draggable demo
 * Follows Single Responsibility Principle - orchestrates the demo setup
 * Uses Dependency Injection for better testability and flexibility
 */
export class DemoApplication {
  private engine: CanvasEngine;
  private dragHostService!: DragHostService;
  private dragController!: CartesianDragController;
  private visualObjects: IVisualObject[] = [];
  private coordinateSystem: MapScreenCoordinateSystem;
  private selectionService: SelectionService;

  constructor(canvasId: string) {
    // Initialize core engine and coordinate system
    this.engine = new CanvasEngine(canvasId);
    this.coordinateSystem = new MapScreenCoordinateSystem(this.engine.canvasWidth, this.engine.canvasHeight);
    
    // Initialize services
    this.selectionService = new SelectionService();
    
    // Create and setup visual objects (VisualObject -> IDraggableVisualObject -> IPhysicObject)
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
    this.setupConnectionRendering();
    this.startEngine();
  }

  /**
   * Creates all visual objects for the demo
   */
  private createObjects(): void {
    // Create drop zone directly
    const dropZone = new VisualRectangle(
      'drop-zone',
      { 
        color: CanvasDarkTheme.dropZoneDefault,
        borderColor: CanvasDarkTheme.borderDefault,
        borderWidth: CanvasDarkTheme.borderMedium
      },
      CanvasDarkTheme.dropZoneWidth,
      CanvasDarkTheme.dropZoneHeight
    );
    dropZone.position.x = -CanvasDarkTheme.dropZoneWidth / 2;
    dropZone.position.y = -CanvasDarkTheme.dropZoneHeight / 2;
    dropZone.isDraggable = false;
    dropZone.connectors = []; // No connectors for drop zone
    
    // Create draggable rectangles directly
    const size = CanvasDarkTheme.objectSizeMedium;
    const yPosition = 200; // Position above center (positive Y is up)
    
    const rect1 = new VisualRectangle(
      'test-rect-1',
      { color: CanvasDarkTheme.objectPrimary },
      size, size
    );
    rect1.position.x = -150;
    rect1.position.y = yPosition;
    
    const rect2 = new VisualRectangle(
      'test-rect-2', 
      { color: CanvasDarkTheme.objectSecondary },
      size, size
    );
    rect2.position.x = 0;
    rect2.position.y = yPosition;
    
    const rect3 = new VisualRectangle(
      'test-rect-3',
      { color: CanvasDarkTheme.objectAccent },
      size, size
    );
    rect3.position.x = 150;
    rect3.position.y = yPosition;
    
    const draggableRectangles = [rect1, rect2, rect3];
    
    // Add objects to engine and visualObjects array
    this.engine.addObject(dropZone);
    this.visualObjects = draggableRectangles;
    this.visualObjects.forEach((obj: IVisualObject) => this.engine.addObject(obj));
    
    // Add all connectors to visual objects for hit testing
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
          this.visualObjects.push(connector);
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
    this.visualObjects.push(centerConnector);
    
    console.log('✅ CONNECTOR ADDED:', {
      id: centerConnector.id,
      position: centerConnector.position,
      hostPosition: dropZone.position
    });
  }
  
  /**
   * Sets up click handler for connector with simple line connection behavior
   */
  private setupConnectorClickHandler(connector: Connector): void {
    connector.onDragStart = (event: MouseEvent) => {
      console.log('🔗 CONNECTOR CLICKED:', {
        connectorId: connector.id,
        position: connector.position
      });
      
      const activeConnector = this.getActiveConnector();
      
      if (!activeConnector) {
        // First click - start connection
        (connector as any).isActive = true;
        connector.selected = true;
        console.log('🎯 Starting connection from:', connector.id);
      } else if (activeConnector !== connector) {
        // Second click - complete connection
        this.createConnection(activeConnector, connector);
        activeConnector.selected = false;
        (activeConnector as any).isActive = false;
        console.log('✅ Connection completed to:', connector.id);
      } else {
        // Same connector clicked - cancel connection
        activeConnector.selected = false;
        (activeConnector as any).isActive = false;
        console.log('❌ Connection cancelled');
      }
      
      this.engine.requestRender();
    };
  }

  /**
   * Gets the currently active connector (if any)
   */
  private getActiveConnector(): Connector | null {
    const connectors = this.visualObjects.filter((obj): obj is Connector => 
      obj.id.includes('connector') && (obj as any).isActive === true
    );
    return connectors.length > 0 ? connectors[0] as Connector : null;
  }

  /**
   * Creates a simple line connection between two connectors
   */
  private createConnection(fromConnector: Connector, toConnector: Connector): void {
    // Check if connection already exists by checking if they're already connected
    if (fromConnector.IsConnected() && fromConnector.GetConnectedObject() === toConnector) {
      console.log('⚠️ Connection already exists between these connectors');
      return;
    }
    
    // Mark connectors as connected
    fromConnector.SetConnectedObject(toConnector as any);
    toConnector.SetConnectedObject(fromConnector as any);
    
    console.log('🔗 Created connection:', {
      from: fromConnector.id,
      to: toConnector.id
    });
  }

  /**
   * Renders all connection lines between connectors
   */
  public renderConnections(ctx: CanvasRenderingContext2D): void {
    // Get all connected connectors from visualObjects
    const connectors = this.visualObjects.filter((obj): obj is Connector => 
      obj.id.includes('connector') && (obj as any).IsConnected?.()
    ) as Connector[];
    
    if (connectors.length === 0) return;
    
    // Set line style for connections
    ctx.strokeStyle = '#8b5cf6'; // Purple color
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.setLineDash([]); // Solid line
    
    // Draw connections between connected connectors
    const drawnConnections = new Set<string>();
    connectors.forEach(connector => {
      if (connector.IsConnected()) {
        const connectedObj = connector.GetConnectedObject();
        if (connectedObj && connectedObj.id.includes('connector')) {
          const connectionKey = [connector.id, connectedObj.id].sort().join('-');
          if (!drawnConnections.has(connectionKey)) {
            drawnConnections.add(connectionKey);
            
            ctx.beginPath();
            ctx.moveTo(connector.position.x, connector.position.y);
            ctx.lineTo(connectedObj.position.x, connectedObj.position.y);
            ctx.stroke();
          }
        }
      }
    });
    
    // Draw active connection preview if starting a connection
    const activeConnector = this.getActiveConnector();
    if (activeConnector) {
      ctx.strokeStyle = '#f59e0b'; // Amber color for preview
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]); // Dashed line for preview
      
      // Draw a small indicator around the active connector
      const pos = activeConnector.position;
       ctx.beginPath();
      ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  /**
   * Sets up connection rendering by registering the render callback with the engine
   */
  private setupConnectionRendering(): void {
    this.engine.setCustomRenderCallback((ctx: CanvasRenderingContext2D) => {
      this.renderConnections(ctx);
    });
  }

  /**
   * Sets up drag functionality with proper service injection
   */
  private setupDragFunctionality(): void {
    this.dragHostService = new DragHostService(
      this.engine.getCanvas(),
      this.visualObjects,
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
    return [...this.visualObjects]; // Return copy to prevent external mutation
  }

  /**
   * Adds a new draggable object to the demo
   * Follows Open/Closed Principle - allows extension without modification
   */
  addDraggableObject(object: IVisualObject): void {
    this.visualObjects.push(object);
    this.engine.addObject(object);
    this.dragHostService.updateDraggableObjects(this.visualObjects);
  }

  /**
   * Removes a draggable object from the demo
   */
  removeDraggableObject(objectId: string): boolean {
    const index = this.visualObjects.findIndex((obj: IVisualObject) => obj.id === objectId);
    if (index !== -1) {
      this.visualObjects.splice(index, 1);
      this.dragHostService.updateDraggableObjects(this.visualObjects);
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

import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import { DragController, type DragCapableHost } from '../src/controllers/DragController.js';
import { type IVisualObject } from 'mr-abstract-components';

// Mock HTML elements
class MockCanvas extends EventTarget {
  width = 800;
  height = 600;
  clientWidth = 800;
  clientHeight = 600;
  style = { cursor: 'default' };

  getBoundingClientRect() {
    return {
      left: 0,
      top: 0,
      width: this.clientWidth,
      height: this.clientHeight,
      right: this.clientWidth,
      bottom: this.clientHeight,
      x: 0,
      y: 0,
      toJSON: () => ({})
    };
  }

  addEventListener = vi.fn();
  removeEventListener = vi.fn();
}

// Mock DragCapableHost
class MockHost implements DragCapableHost {
  canvas = new MockCanvas() as unknown as HTMLCanvasElement;
  controllers = new Set();

  // ReactiveControllerHost methods
  addController = vi.fn((controller) => {
    this.controllers.add(controller);
  });

  removeController = vi.fn((controller) => {
    this.controllers.delete(controller);
  });

  requestUpdate = vi.fn();
  updateComplete = Promise.resolve(true);

  // DragCapableHost optional method
  getObjectAt = vi.fn();
}


class MockDraggableObject implements IVisualObject {
  size: { width: number; height: number; } = { width: 100, height: 100 };
  onDragEnter?: ((event: MouseEvent) => void) | undefined;
  onDragOver?: ((event: MouseEvent) => void) | undefined;
  onDragLeave?: ((event: MouseEvent) => void) | undefined;
  onDrop?: ((event: MouseEvent) => void) | undefined;
  id: string = 'mock-id';
  selected?: boolean | undefined;
  position: { x: number; y: number; } = { x: 0, y: 0 };
  update(dt: number): void {
    throw new Error('Method not implemented.');
  }
  render(ctx: unknown): void {
    throw new Error('Method not implemented.');
  }
  x = 100;
  y = 100;
  width = 50;
  height = 50;
  isDraggable = true;
  onDragStart = vi.fn();
  onDrag = vi.fn();
  onDragEnd = vi.fn();
}

describe('DragController', () => {
  let dragController: DragController;
  let mockHost: MockHost;
  let mockObject: MockDraggableObject;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create fresh instances
    mockHost = new MockHost();
    mockObject = new MockDraggableObject();
    dragController = new DragController();

    // Set up the host
    dragController.setHost(mockHost);
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      expect(dragController.isCurrentlyDragging).toBe(false);
      expect(dragController.currentDragTarget).toBe(null);
    });

    it('should add controller to host when setHost is called', () => {
      expect(mockHost.addController).toHaveBeenCalledWith(dragController);
    });
  });

  describe('Host Connection', () => {
    it('should add event listeners when host connects', () => {
      dragController.hostConnected();

      expect(mockHost.canvas.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(mockHost.canvas.addEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(mockHost.canvas.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(mockHost.canvas.addEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    });

    it('should remove event listeners when host disconnects', () => {
      dragController.hostConnected();
      dragController.hostDisconnected();

      expect(mockHost.canvas.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(mockHost.canvas.removeEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(mockHost.canvas.removeEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
      expect(mockHost.canvas.removeEventListener).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    });
  });

  describe('Drag Operations', () => {
    beforeEach(() => {
      dragController.hostConnected();
      mockHost.getObjectAt.mockReturnValue(mockObject);
    });

    it('should start drag when clicking on draggable object', () => {
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: 125, // Within object bounds (100-150)
        clientY: 125  // Within object bounds (100-150)
      });

      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 130, // Move 5 pixels (exceeds 3-pixel threshold)
        clientY: 130  // Move 5 pixels (exceeds 3-pixel threshold)
      });

      // Get event handlers
      const addEventListenerMock = mockHost.canvas.addEventListener as any;
      const mouseDownHandler = addEventListenerMock.mock.calls
        .find((call: any) => call[0] === 'mousedown')?.[1];
      const mouseMoveHandler = addEventListenerMock.mock.calls
        .find((call: any) => call[0] === 'mousemove')?.[1];

      // Simulate mouse down then move
      if (mouseDownHandler) {
        mouseDownHandler(mouseDownEvent);
      }
      if (mouseMoveHandler) {
        mouseMoveHandler(mouseMoveEvent);
      }

      expect(dragController.isCurrentlyDragging).toBe(true);
      expect(dragController.currentDragTarget).toBe(mockObject);
      expect(mockObject.onDragStart).toHaveBeenCalledWith(mouseMoveEvent);
      expect(mockHost.canvas.style.cursor).toBe('grabbing');
    });

    it('should not start drag when clicking outside object', () => {
      mockHost.getObjectAt.mockReturnValue(null);

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 50,  // Outside object bounds
        clientY: 50   // Outside object bounds
      });

      const mouseDownHandler = (mockHost.canvas.addEventListener as MockedFunction<any>).mock.calls
        .find(call => call[0] === 'mousedown')?.[1];

      if (typeof mouseDownHandler === 'function') {
        mouseDownHandler(mouseEvent);

        expect(dragController.isCurrentlyDragging).toBe(false);
        expect(dragController.currentDragTarget).toBe(null);
      }
    });

    it('should not start drag when object is not draggable', () => {
      mockObject.isDraggable = false;

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 125,
        clientY: 125
      });

      const mouseDownHandler = (mockHost.canvas.addEventListener as MockedFunction<any>).mock.calls
        .find(call => call[0] === 'mousedown')?.[1];

      if (typeof mouseDownHandler === 'function') {
        mouseDownHandler(mouseEvent);

        expect(dragController.isCurrentlyDragging).toBe(false);
        expect(dragController.currentDragTarget).toBe(null);
      }
    });

    it('should update object position during drag', () => {
      const initialX = mockObject.position.x;
      const initialY = mockObject.position.y;

      // Simulate proper drag sequence: mousedown → mousemove
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: 125,
        clientY: 125
      });

      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 135, // Move 10 pixels right
        clientY: 135  // Move 10 pixels down
      });

      // Get event handlers
      const addEventListenerMock = mockHost.canvas.addEventListener as any;
      const mouseDownHandler = addEventListenerMock.mock.calls
        .find((call: any) => call[0] === 'mousedown')?.[1];
      const mouseMoveHandler = addEventListenerMock.mock.calls
        .find((call: any) => call[0] === 'mousemove')?.[1];

      // Simulate the drag sequence
      if (mouseDownHandler) {
        mouseDownHandler(mouseDownEvent);
      }
      if (mouseMoveHandler) {
        mouseMoveHandler(mouseMoveEvent);
      }

      expect(mockObject.position.x).toBe(initialX + 10);
      expect(mockObject.position.y).toBe(initialY + 10);
      expect(mockObject.onDrag).toHaveBeenCalledWith(mouseMoveEvent, 10, 10);
      expect(mockHost.requestUpdate).toHaveBeenCalled();
    });

    it('should end drag on mouse up', () => {
      // Simulate proper drag sequence: mousedown → mousemove → mouseup
      const mouseDownEvent = new MouseEvent('mousedown', {
        clientX: 125,
        clientY: 125
      });

      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: 130, // Move 5 pixels (exceeds 3-pixel threshold)
        clientY: 130
      });

      const mouseUpEvent = new MouseEvent('mouseup');

      // Get event handlers
      const addEventListenerMock = mockHost.canvas.addEventListener as any;
      const mouseDownHandler = addEventListenerMock.mock.calls
        .find((call: any) => call[0] === 'mousedown')?.[1];
      const mouseMoveHandler = addEventListenerMock.mock.calls
        .find((call: any) => call[0] === 'mousemove')?.[1];
      const mouseUpHandler = addEventListenerMock.mock.calls
        .find((call: any) => call[0] === 'mouseup')?.[1];

      // Simulate the complete drag sequence
      if (mouseDownHandler) {
        mouseDownHandler(mouseDownEvent);
      }
      if (mouseMoveHandler) {
        mouseMoveHandler(mouseMoveEvent);
      }
      if (mouseUpHandler) {
        mouseUpHandler(mouseUpEvent);

        expect(dragController.isCurrentlyDragging).toBe(false);
        expect(dragController.currentDragTarget).toBe(null);
        expect(mockObject.onDragEnd).toHaveBeenCalledWith(mouseUpEvent);
        expect(mockHost.canvas.style.cursor).toBe('default');
      }
    });
  });

  describe('Public API', () => {
    it('should allow programmatic drag start', () => {
      dragController.startDrag(mockObject, 100, 100);
      expect(dragController.isCurrentlyDragging).toBe(true);
      expect(dragController.currentDragTarget).toBe(mockObject);
    });

    it('should allow programmatic drag stop', () => {
      dragController.startDrag(mockObject, 100, 100);
      dragController.stopDrag();

      expect(dragController.isCurrentlyDragging).toBe(false);
      expect(dragController.currentDragTarget).toBe(null);
    });

    it('should not start drag programmatically if object is not draggable', () => {
      mockObject.isDraggable = false;

      dragController.startDrag(mockObject, 100, 100);

      expect(dragController.isCurrentlyDragging).toBe(false);
      expect(dragController.currentDragTarget).toBe(null);
    });
  });

  describe('Coordinate Scaling', () => {
    it('should handle canvas scaling correctly', () => {
      // Connect the drag controller to attach event listeners
      dragController.hostConnected();
      
      // Set up scaled canvas
      mockHost.canvas.width = 1600;  // 2x scale
      mockHost.canvas.height = 1200; // 2x scale
      (mockHost.canvas as any).clientWidth = 800;
      (mockHost.canvas as any).clientHeight = 600;

      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 100, // Screen coordinates
        clientY: 100
      });

      const mouseDownHandler = (mockHost.canvas.addEventListener as MockedFunction<any>).mock.calls
        .find(call => call[0] === 'mousedown')?.[1];

      if (typeof mouseDownHandler === 'function') {
        mouseDownHandler(mouseEvent);
      }

      // Should call getObjectAt with scaled coordinates (200, 200)
      expect(mockHost.getObjectAt).toHaveBeenCalledWith(200, 200);
    });
  });
});


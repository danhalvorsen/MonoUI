import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DragController } from '../src/controllers/DragController.js';
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
class MockHost {
    canvas = new MockCanvas();
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
class MockDraggableObject {
    size = { width: 100, height: 100 };
    onDragEnter;
    onDragOver;
    onDragLeave;
    onDrop;
    id = 'mock-id';
    selected;
    position = { x: 0, y: 0 };
    update(dt) {
        throw new Error('Method not implemented.');
    }
    render(ctx) {
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
    let dragController;
    let mockHost;
    let mockObject;
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
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: 125, // Within object bounds (100-150)
                clientY: 125 // Within object bounds (100-150)
            });
            // Simulate mouse down
            const addEventListenerMock = mockHost.canvas.addEventListener;
            const mouseDownHandler = addEventListenerMock.mock.calls
                .find((call) => call[0] === 'mousedown')?.[1];
            if (mouseDownHandler) {
                mouseDownHandler(mouseEvent);
            }
            expect(dragController.isCurrentlyDragging).toBe(true);
            expect(dragController.currentDragTarget).toBe(mockObject);
            expect(mockObject.onDragStart).toHaveBeenCalledWith(mouseEvent);
            expect(mockHost.canvas.style.cursor).toBe('grabbing');
        });
        it('should not start drag when clicking outside object', () => {
            mockHost.getObjectAt.mockReturnValue(null);
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: 50, // Outside object bounds
                clientY: 50 // Outside object bounds
            });
            const mouseDownHandler = mockHost.canvas.addEventListener.mock.calls
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
            const mouseDownHandler = mockHost.canvas.addEventListener.mock.calls
                .find(call => call[0] === 'mousedown')?.[1];
            if (typeof mouseDownHandler === 'function') {
                mouseDownHandler(mouseEvent);
                expect(dragController.isCurrentlyDragging).toBe(false);
                expect(dragController.currentDragTarget).toBe(null);
            }
            it('should update object position during drag', () => {
                // Start drag
                dragController.startDrag(mockObject, 125, 125);
                const initialX = mockObject.x;
                const initialY = mockObject.y;
                // Simulate mouse move
                const mouseMoveEvent = new MouseEvent('mousemove', {
                    clientX: 135, // Move 10 pixels right
                    clientY: 135 // Move 10 pixels down
                });
                const addEventListenerMock = mockHost.canvas.addEventListener;
                const mouseMoveHandler = addEventListenerMock.mock.calls
                    .find((call) => call[0] === 'mousemove')?.[1];
                if (mouseMoveHandler) {
                    mouseMoveHandler(mouseMoveEvent);
                }
                expect(mockObject.x).toBe(initialX + 10);
                expect(mockObject.y).toBe(initialY + 10);
                expect(mockObject.onDrag).toHaveBeenCalledWith(mouseMoveEvent, 10, 10);
                expect(mockHost.requestUpdate).toHaveBeenCalled();
            });
            it('should end drag on mouse up', () => {
                // Start drag
                dragController.startDrag(mockObject, 125, 125);
                const mouseUpEvent = new MouseEvent('mouseup');
                const mouseUpHandler = mockHost.canvas.addEventListener.mock.calls
                    .find(call => call[0] === 'mouseup')?.[1];
                if (typeof mouseUpHandler === 'function') {
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
                // Set up scaled canvas
                mockHost.canvas.width = 1600; // 2x scale
                mockHost.canvas.height = 1200; // 2x scale
                mockHost.canvas.clientWidth = 800;
                mockHost.canvas.clientHeight = 600;
                const mouseEvent = new MouseEvent('mousedown', {
                    clientX: 100, // Screen coordinates
                    clientY: 100
                });
                const mouseDownHandler = mockHost.canvas.addEventListener.mock.calls
                    .find(call => call[0] === 'mousedown')?.[1];
                if (typeof mouseDownHandler === 'function') {
                    mouseDownHandler(mouseEvent);
                }
                // Should call getObjectAt with scaled coordinates (200, 200)
                expect(mockHost.getObjectAt).toHaveBeenCalledWith(200, 200);
            });
        });
    });
});

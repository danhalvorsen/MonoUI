import { ReactiveController, ReactiveControllerHost } from 'lit';
import { IDraggableVisualObject } from 'mr-abstract-components';

// Type for hosts that can work with DragController
export type DragCapableHost = ReactiveControllerHost & {
  canvas?: HTMLCanvasElement;
  getObjectAt?(x: number, y: number): IDraggableVisualObject | null;
};

export class DragController implements ReactiveController {
  private host?: DragCapableHost;
  private isDragging = false;
  private dragTarget: IDraggableVisualObject | null = null;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private mouseDownX = 0;
  private mouseDownY = 0;
  private hasSignificantMovement = false;
  private static readonly DRAG_THRESHOLD = 3; // pixels

  constructor(host?: DragCapableHost) {
    if (host) this.setHost(host);
  }

  setHost(host: DragCapableHost) {
    this.host = host;
    if (this.host) {
      this.host.addController(this);
    }
  }

  hostConnected() {
    this.addEventListeners();
  }

  hostDisconnected() {
    this.removeEventListeners();
  }

  private addEventListeners() {
    if (!this.host?.canvas) return;

    this.host.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.host.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.host.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.host.canvas.addEventListener('mouseleave', this.handleMouseUp);
  }

  private removeEventListeners() {
    if (!this.host?.canvas) return;

    this.host.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.host.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.host.canvas.removeEventListener('mouseup', this.handleMouseUp);
    this.host.canvas.removeEventListener('mouseleave', this.handleMouseUp);
  }

  private handleMouseDown = (event: MouseEvent) => {
    console.log('🖱️ DragController: Mouse down event');
    
    if (!this.host?.getObjectAt) {
      console.log('❌ DragController: No getObjectAt method available');
      return;
    }

    const rect = this.host.canvas!.getBoundingClientRect();
    const scaleX = this.host.canvas!.width / this.host.canvas!.clientWidth;
    const scaleY = this.host.canvas!.height / this.host.canvas!.clientHeight;
    
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    
    console.log(`📍 DragController: Mouse position - raw(${event.clientX}, ${event.clientY}) -> canvas(${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`);
    console.log(`📏 DragController: Scale factors - X: ${scaleX.toFixed(2)}, Y: ${scaleY.toFixed(2)}`);

    const target = this.host.getObjectAt(mouseX, mouseY);
    
    if (target) {
      console.log(`🎯 DragController: Found target at (${target.position.x}, ${target.position.y}) size(${target.size.width}x${target.size.height})`);
      console.log(`🔧 DragController: Target isDraggable: ${target.isDraggable}`);
    } else {
      console.log('❌ DragController: No target found at mouse position');
    }
    
    if (target) {
      // Always track the target for potential drag or selection
      this.dragTarget = target;
      this.lastMouseX = mouseX;
      this.lastMouseY = mouseY;
      this.mouseDownX = mouseX;
      this.mouseDownY = mouseY;
      this.dragStartX = target.position.x;
      this.dragStartY = target.position.y;
      this.hasSignificantMovement = false;
      
      console.log(`🎯 DragController: Target acquired for potential drag/selection`);
      console.log(`📌 DragController: Initial mouse position (${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`);
      console.log(`📌 DragController: Initial object position (${this.dragStartX}, ${this.dragStartY})`);
      
      // Prevent default to avoid text selection
      event.preventDefault();
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    if (!this.dragTarget || !this.host?.canvas) {
      return;
    }

    const rect = this.host.canvas.getBoundingClientRect();
    const scaleX = this.host.canvas.width / this.host.canvas.clientWidth;
    const scaleY = this.host.canvas.height / this.host.canvas.clientHeight;
    
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    // Check if we've moved enough to start dragging
    const totalDeltaX = mouseX - this.mouseDownX;
    const totalDeltaY = mouseY - this.mouseDownY;
    const totalDistance = Math.sqrt(totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY);
    
    if (!this.hasSignificantMovement && totalDistance > DragController.DRAG_THRESHOLD) {
      // Start dragging - we've moved beyond the threshold
      this.hasSignificantMovement = true;
      this.isDragging = true;
      
      console.log(`🚀 DragController: Starting drag operation (moved ${totalDistance.toFixed(1)}px)`);
      
      // Call drag start callback
      if (this.dragTarget.onDragStart && this.dragTarget.isDraggable !== false) {
        console.log('📞 DragController: Calling onDragStart callback');
        this.dragTarget.onDragStart(event);
      }
      
      // Change cursor to indicate dragging
      this.host.canvas!.style.cursor = 'grabbing';
    }
    
    if (this.isDragging && this.dragTarget.isDraggable !== false) {
      // Continue dragging
      const deltaX = mouseX - this.lastMouseX;
      const deltaY = mouseY - this.lastMouseY;
      
      // Only log significant movements to avoid spam
      if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
        console.log(`🔄 DragController: Dragging - delta(${deltaX.toFixed(1)}, ${deltaY.toFixed(1)}) new pos(${(this.dragTarget.position.x + deltaX).toFixed(1)}, ${(this.dragTarget.position.y + deltaY).toFixed(1)})`);
      }

      // Update object position
      this.dragTarget.position.x += deltaX;
      this.dragTarget.position.y += deltaY;

      // Call drag callback
      if (this.dragTarget.onDrag) {
        this.dragTarget.onDrag(event, deltaX, deltaY);
      }

      // Request host update
      this.host.requestUpdate();
    }
    
    // Update last mouse position
    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
  };

  private handleMouseUp = (event: MouseEvent) => {
    console.log('🔴 DragController: Mouse up event');
    
    if (!this.dragTarget) {
      console.log('ℹ️ DragController: Mouse up but no target');
      return;
    }
    
    if (this.isDragging && this.hasSignificantMovement) {
      // Complete drag operation
      const finalX = this.dragTarget.position.x;
      const finalY = this.dragTarget.position.y;
      const totalDeltaX = finalX - this.dragStartX;
      const totalDeltaY = finalY - this.dragStartY;
      
      console.log(`🏁 DragController: Ending drag operation`);
      console.log(`📊 DragController: Total movement - delta(${totalDeltaX.toFixed(1)}, ${totalDeltaY.toFixed(1)})`);
      console.log(`📍 DragController: Final position (${finalX.toFixed(1)}, ${finalY.toFixed(1)})`);

      // Call drag end callback
      if (this.dragTarget.onDragEnd) {
        console.log('📞 DragController: Calling onDragEnd callback');
        this.dragTarget.onDragEnd(event);
      }
    } else {
      // Handle as click/selection - no significant movement occurred
      console.log('👆 DragController: Handling as click/selection (no significant movement)');
      
      // Toggle selection if the object has selection behavior
      if ('selected' in this.dragTarget) {
        const selectable = this.dragTarget as any;
        selectable.selected = !selectable.selected;
        console.log(`🎯 DragController: Selection toggled to ${selectable.selected} for ${this.dragTarget.constructor?.name || 'Object'}`);
      }
    }

    // Reset cursor
    if (this.host?.canvas) {
      this.host.canvas.style.cursor = 'default';
      console.log('👆 DragController: Cursor reset to default');
    }

    // Reset all state
    const targetInfo = `${this.dragTarget.constructor?.name || 'Object'}`;
    this.isDragging = false;
    this.dragTarget = null;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.hasSignificantMovement = false;
    
    console.log(`✅ DragController: State reset for ${targetInfo}`);

    // Request host update
    this.host?.requestUpdate();
  };

  // Public methods for external control
  public startDrag(target: IDraggableVisualObject, mouseX: number, mouseY: number) {
    if (target.isDraggable === false) return;
    
    this.isDragging = true;
    this.dragTarget = target;
    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
    this.dragStartX = target.position.x;
    this.dragStartY = target.position.y;
  }

  public stopDrag() {
    this.isDragging = false;
    this.dragTarget = null;
    
    if (this.host?.canvas) {
      this.host.canvas.style.cursor = 'default';
    }
  }

  public get isCurrentlyDragging() {
    return this.isDragging;
  }

  public get currentDragTarget() {
    return this.dragTarget;
  }
}
export type { IDraggableVisualObject };

import 'reflect-metadata';
import { container } from 'tsyringe';
import { CanvasSelectionBehavior, Rectangle, HtmlCanvas } from 'mr-web-components';
import 'mr-web-components';

// Register selection behavior
container.register('ISelectionBehavior', { useClass: CanvasSelectionBehavior });

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('myCanvas') as HtmlCanvas;
  
  if (canvas) {
    console.log('HtmlCanvas component found!');
    
    // Example 1: Draggable Rectangles with Callbacks
    const rect1 = new Rectangle(100, 80, '#3498db', 150, 100, { x: 0, y: 0 }, undefined, 'DraggableRect1');
    const rect2 = new Rectangle(100, 80, '#e74c3c', 300, 150, { x: 0, y: 0 }, undefined, 'DraggableRect2');
    
    // Add drag event callbacks to demonstrate functionality
    rect1.onDragStart = (event) => {
      console.log(`Started dragging ${rect1.id}`);
      rect1.color = '#2980b9'; // Darker blue when dragging
    };
    
    rect1.onDrag = (event, deltaX, deltaY) => {
      console.log(`Dragging ${rect1.id}: delta(${deltaX.toFixed(1)}, ${deltaY.toFixed(1)})`);
    };
    
    rect1.onDragEnd = (event) => {
      console.log(`Finished dragging ${rect1.id} at position (${rect1.x}, ${rect1.y})`);
      rect1.color = '#3498db'; // Back to original color
    };
    
    rect2.onDragStart = (event) => {
      console.log(`Started dragging ${rect2.id}`);
      rect2.color = '#c0392b'; // Darker red when dragging
    };
    
    rect2.onDragEnd = (event) => {
      console.log(`Finished dragging ${rect2.id}`);
      rect2.color = '#e74c3c'; // Back to original color
    };
    
    canvas.add(rect1);
    canvas.add(rect2);
    
    // Example 2: Property API - Set objects via the objects property
    setTimeout(() => {
      const rect3 = new Rectangle(80, 60, '#2ecc71', 200, 250, { x: 0, y: 0 }, undefined, 'PropertyRect3');
      const rect4 = new Rectangle(120, 90, '#f39c12', 400, 200, { x: 0, y: 0 }, undefined, 'PropertyRect4');
      
      // This will replace all current objects with the new array
      canvas.objects = [rect1, rect2, rect3, rect4];
      
      console.log('Objects updated via property API');
    }, 2000);
    
    // Example 3: Add multiple objects at once
    setTimeout(() => {
      const rect5 = new Rectangle(60, 60, '#9b59b6', 50, 300, { x: 0, y: 0 }, undefined, 'BatchRect5');
      const rect6 = new Rectangle(60, 60, '#1abc9c', 500, 50, { x: 0, y: 0 }, undefined, 'BatchRect6');
      
      canvas.addObjects([rect5, rect6]);
      
      console.log('Multiple objects added via addObjects() method');
    }, 4000);
    
    // Example 4: Clear all objects
    setTimeout(() => {
      console.log('Clearing all objects...');
      canvas.clear();
    }, 6000);
    
    // Example 5: Add objects back after clearing
    setTimeout(() => {
      const finalRect = new Rectangle(200, 150, '#34495e', 220, 125, { x: 0, y: 0 }, undefined, 'FinalRect');
      canvas.add(finalRect);
      console.log('Added final rectangle after clearing');
    }, 7000);
  } else {
    console.error('HtmlCanvas component not found!');
  }
});

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
    const rect1 = new Rectangle(100, 80, '#3498db', 150, 100, 'DraggableRect1');
    const rect2 = new Rectangle(100, 80, '#e74c3c', 300, 150, 'DraggableRect2');
    
    // Add drag event callbacks to demonstrate functionality
    rect1.onDragStart = (event) => {
      console.log('🎯 Rect1 drag started at:', event.offsetX, event.offsetY);
      rect1.color = '#2980b9'; // Darker blue when dragging
    };
    
    rect1.onDrag = (event, deltaX, deltaY) => {
      console.log('🔄 Rect1 dragging - delta:', deltaX, deltaY);
    };
    
    rect1.onDragEnd = (event) => {
      console.log('✅ Rect1 drag ended');
      rect1.color = '#3498db'; // Back to original color
    };
    
    rect2.onDragStart = (event) => {
      console.log('🎯 Rect2 drag started at:', event.offsetX, event.offsetY);
      rect2.color = '#c0392b'; // Darker red when dragging
    };
    
    rect2.onDragEnd = (event) => {
      console.log('✅ Rect2 drag ended');
      rect2.color = '#e74c3c'; // Back to original color
    };
    
    canvas.add(rect1);
    canvas.add(rect2);   
  } else {
    console.error('HtmlCanvas component not found!');
  }
});

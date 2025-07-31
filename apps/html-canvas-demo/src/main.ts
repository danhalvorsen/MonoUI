import 'reflect-metadata';
import { VisualRectangle, HtmlCanvas } from 'mr-web-components';
import { Vector2 } from '@my-graphics/math';
import 'mr-web-components';

  
// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('myCanvas') as HtmlCanvas;
  
  if (canvas) {
    console.log('HtmlCanvas component found!');
    
    // Example 1: Draggable Rectangles with Callbacks
    const rect1 = new VisualRectangle('DraggableRect1', { color: '#3498db' }, new Vector2(150, 100), 100, 80);
    const rect2 = new VisualRectangle('DraggableRect2', { color: '#e74c3c' }, new Vector2(300, 150), 100, 80);
    
    // Add drag event callbacks to demonstrate functionality
    rect1.onDragStart = (event: { offsetX: any; offsetY: any; }) => {
      console.log('🎯 Rect1 drag started at:', event.offsetX, event.offsetY);
      rect1.color = '#2980b9'; // Darker blue when dragging
    };
    
    rect1.onDrag = (event: any, deltaX: any, deltaY: any) => {
      console.log('🔄 Rect1 dragging - delta:', deltaX, deltaY);
    };
    
    rect1.onDragEnd = (event: any) => {
      console.log('✅ Rect1 drag ended');
      rect1.color = '#3498db'; // Back to original color
    };
    
    rect2.onDragStart = (event: { offsetX: any; offsetY: any; }) => {
      console.log('🎯 Rect2 drag started at:', event.offsetX, event.offsetY);
      rect2.color = '#c0392b'; // Darker red when dragging
    };
    
    rect2.onDragEnd = (event: any) => {
      console.log('✅ Rect2 drag ended');
      rect2.color = '#e74c3c'; // Back to original color
    };
    
    canvas.add(rect1);
    canvas.add(rect2);   
  } else {
    console.error('HtmlCanvas component not found!');
  }
});

import { test, expect, type Page, type Locator } from '@playwright/test';

test.describe('DragController E2E Tests', () => {
  let page: Page;
  let canvas: Locator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Navigate to the demo app
    await page.goto('http://localhost:5174');
    
    // Wait for the canvas to be ready
    canvas = page.locator('html-canvas');
    await expect(canvas).toBeVisible();
    
    // Wait for rectangles to be loaded
    await page.waitForTimeout(1000);
  });

  test.describe('Basic Drag Functionality', () => {
    test('should display draggable rectangles', async () => {
      // Check that the canvas is rendered
      await expect(canvas).toBeVisible();
      
      // Check console for successful initialization
      const consoleMessages = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      await page.reload();
      await page.waitForTimeout(500);
      
      expect(consoleMessages.some(msg => 
        msg.includes('HtmlCanvas component found!')
      )).toBeTruthy();
    });

    test('should start drag operation on mouse down', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      // Get canvas bounding box
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Click on the first rectangle (should be around 150, 100)
      await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
      await page.mouse.down();
      
      // Wait for drag start logging
      await page.waitForTimeout(100);
      
      // Check for drag start console messages
      expect(consoleMessages.some(msg => 
        msg.includes('🖱️ DragController: Mouse down event')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('🚀 DragController: Starting drag operation')
      )).toBeTruthy();
      
      await page.mouse.up();
    });

    test('should move rectangle during drag operation', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Start drag on first rectangle
      const startX = canvasBox!.x + 150;
      const startY = canvasBox!.y + 100;
      
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Drag to new position
      const endX = startX + 50;
      const endY = startY + 30;
      
      await page.mouse.move(endX, endY, { steps: 5 });
      
      // Wait for drag logging
      await page.waitForTimeout(100);
      
      // Check for drag movement logging
      expect(consoleMessages.some(msg => 
        msg.includes('🔄 DragController: Dragging')
      )).toBeTruthy();
      
      await page.mouse.up();
      
      // Check for drag end logging
      expect(consoleMessages.some(msg => 
        msg.includes('🏁 DragController: Ending drag operation')
      )).toBeTruthy();
    });

    test('should complete drag operation on mouse up', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Perform complete drag operation
      await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox!.x + 200, canvasBox!.y + 150, { steps: 3 });
      await page.mouse.up();
      
      // Wait for all logging to complete
      await page.waitForTimeout(200);
      
      // Check for complete drag cycle
      expect(consoleMessages.some(msg => 
        msg.includes('🚀 DragController: Starting drag operation')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('🔄 DragController: Dragging')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('🏁 DragController: Ending drag operation')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('✅ DragController: Drag state reset')
      )).toBeTruthy();
    });
  });

  test.describe('Visual Feedback', () => {
    test('should change cursor during drag', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Move to rectangle position
      await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
      
      // Start drag
      await page.mouse.down();
      
      // Check cursor style (this might be challenging to test directly)
      // We'll rely on console logging for cursor changes
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      await page.waitForTimeout(100);
      
      await page.mouse.up();
      
      await page.waitForTimeout(100);
      
      // Check for cursor change logging
      expect(consoleMessages.some(msg => 
        msg.includes('👆 DragController: Cursor changed to grabbing')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('👆 DragController: Cursor reset to default')
      )).toBeTruthy();
    });

    test('should trigger color changes during drag', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Drag first rectangle (blue one)
      await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
      await page.mouse.down();
      
      await page.waitForTimeout(100);
      
      // Check for drag start callback (which changes color)
      expect(consoleMessages.some(msg => 
        msg.includes('Started dragging DraggableRect1')
      )).toBeTruthy();
      
      await page.mouse.up();
      
      await page.waitForTimeout(100);
      
      // Check for drag end callback (which resets color)
      expect(consoleMessages.some(msg => 
        msg.includes('Finished dragging DraggableRect1')
      )).toBeTruthy();
    });
  });

  test.describe('Multiple Objects', () => {
    test('should handle dragging different rectangles', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Drag first rectangle (blue)
      await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
      await page.mouse.down();
      await page.mouse.move(canvasBox!.x + 180, canvasBox!.y + 130);
      await page.mouse.up();
      
      await page.waitForTimeout(200);
      
      // Drag second rectangle (red)
      await page.mouse.move(canvasBox!.x + 300, canvasBox!.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox!.x + 330, canvasBox!.y + 180);
      await page.mouse.up();
      
      await page.waitForTimeout(200);
      
      // Check that both rectangles were dragged
      expect(consoleMessages.some(msg => 
        msg.includes('Started dragging DraggableRect1')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('Started dragging DraggableRect2')
      )).toBeTruthy();
    });

    test('should not start drag when clicking empty area', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Click on empty area (far from any rectangle)
      await page.mouse.move(canvasBox!.x + 50, canvasBox!.y + 50);
      await page.mouse.down();
      await page.mouse.up();
      
      await page.waitForTimeout(100);
      
      // Should see mouse down but no drag start
      expect(consoleMessages.some(msg => 
        msg.includes('🖱️ DragController: Mouse down event')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('❌ DragController: No target found at mouse position')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('🚀 DragController: Starting drag operation')
      )).toBeFalsy();
    });
  });

  test.describe('Coordinate Mapping', () => {
    test('should handle coordinate scaling correctly', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Click on rectangle
      await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
      await page.mouse.down();
      
      await page.waitForTimeout(100);
      
      // Check for coordinate logging
      expect(consoleMessages.some(msg => 
        msg.includes('📍 DragController: Mouse position - raw')
      )).toBeTruthy();
      
      expect(consoleMessages.some(msg => 
        msg.includes('📏 DragController: Scale factors')
      )).toBeTruthy();
      
      await page.mouse.up();
    });
  });

  test.describe('Performance', () => {
    test('should handle rapid mouse movements efficiently', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      const startTime = Date.now();
      
      // Start drag
      await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
      await page.mouse.down();
      
      // Perform rapid movements
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(
          canvasBox!.x + 150 + (i * 10), 
          canvasBox!.y + 100 + (i * 5),
          { steps: 1 }
        );
      }
      
      await page.mouse.up();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 2 seconds)
      expect(duration).toBeLessThan(2000);
    });
  });
});

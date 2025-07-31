import { test, expect, type Page, type Locator } from '@playwright/test';

test.describe('VisualRectangle Origin Drag Test', () => {
  let page: Page;
  let canvas: Locator;

  test.beforeEach(async ({ page: testPage }: { page: Page }) => {
    page = testPage;
    
    // Navigate to the draggable demo app
    await page.goto('/');
    
    // Wait for the canvas to be ready
    canvas = page.locator('html-canvas');
    await expect(canvas).toBeVisible();
    
    // Wait for demo to fully load
    await page.waitForTimeout(2000);
  });

  test('should drag VisualRectangle with Connector from origin (0,0) to (200,200)', async () => {
    const consoleMessages: string[] = [];
    page.on('console', (msg: any) => consoleMessages.push(msg.text()));
    
    // Inject test code to create a VisualRectangle at origin with connector
    await page.evaluate(() => {
      // Access the global demo application
      const demo = (window as any).demoApp;
      if (!demo) {
        console.error('Demo application not found');
        return;
      }

      // Import required classes
      const { VisualRectangle } = (window as any);
      const { Vector2 } = (window as any);
      
      if (!VisualRectangle || !Vector2) {
        console.error('Required classes not available');
        return;
      }

      // Create a new VisualRectangle at origin (0,0)
      const testRect = new VisualRectangle(
        'TestRect',
        { color: '#ff0000' }, // Red color for visibility
        80,  // width
        60,  // height
      );
      
      // Set position to origin (0,0) in Cartesian coordinates
      testRect.position = new Vector2(0, 0);
      
      // Add to the demo's visual objects
      demo.visualObjects = demo.visualObjects || [];
      demo.visualObjects.push(testRect);
      
      // Make it draggable
      testRect.isDraggable = true;
      
      // Store reference for testing
      (window as any).testRect = testRect;
      
      console.log('🔴 TEST RECT CREATED at origin (0,0) with connector');
      console.log('Position:', testRect.position.x, testRect.position.y);
      console.log('Has connectors:', testRect.connectors?.length || 0);
    });

    await page.waitForTimeout(500);
    
    // Verify test rectangle was created
    expect(consoleMessages.some(msg => 
      msg.includes('🔴 TEST RECT CREATED at origin (0,0)')
    )).toBeTruthy();

    // Get canvas dimensions and calculate screen coordinates
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).toBeTruthy();
    
    if (!canvasBox) return;

    // Calculate screen coordinates for Cartesian origin (0,0)
    // In Cartesian system, origin is at canvas center
    const canvasCenterX = canvasBox.x + canvasBox.width / 2;
    const canvasCenterY = canvasBox.y + canvasBox.height / 2;
    
    // Calculate target screen coordinates for Cartesian (200,200)
    // In Cartesian: +X is right, +Y is up
    const targetScreenX = canvasCenterX + 200;
    const targetScreenY = canvasCenterY - 200; // Subtract because screen Y is inverted
    
    console.log(`Canvas center: (${canvasCenterX}, ${canvasCenterY})`);
    console.log(`Target screen coords: (${targetScreenX}, ${targetScreenY})`);

    // Take screenshot of initial state
    await expect(canvas).toHaveScreenshot('test-rect-at-origin.png');

    // Perform drag operation from origin to (200,200)
    await page.mouse.move(canvasCenterX, canvasCenterY);
    await page.mouse.down();
    
    // Drag to target position with smooth movement
    await page.mouse.move(targetScreenX, targetScreenY, { steps: 10 });
    await page.mouse.up();
    
    // Wait for position update
    await page.waitForTimeout(500);

    // Verify final position in Cartesian coordinates
    const finalPosition = await page.evaluate(() => {
      const testRect = (window as any).testRect;
      if (!testRect) return null;
      
      return {
        x: testRect.position.x,
        y: testRect.position.y,
        connectorCount: testRect.connectors?.length || 0
      };
    });

    // Assert final position is approximately (200, 200)
    expect(finalPosition).toBeTruthy();
    expect(finalPosition!.x).toBeCloseTo(200, 10); // Within 10 pixels
    expect(finalPosition!.y).toBeCloseTo(200, 10); // Within 10 pixels
    expect(finalPosition!.connectorCount).toBeGreaterThan(0); // Has connectors

    // Take screenshot of final state
    await expect(canvas).toHaveScreenshot('test-rect-at-200-200.png');

    // Verify connector followed the rectangle
    const connectorPosition = await page.evaluate(() => {
      const testRect = (window as any).testRect;
      if (!testRect || !testRect.connectors || testRect.connectors.length === 0) {
        return null;
      }
      
      const connector = testRect.connectors[0];
      return {
        x: connector.position.x,
        y: connector.position.y,
        isConnected: connector.IsConnected ? connector.IsConnected() : false
      };
    });

    // Connector should be at rectangle's center position
    expect(connectorPosition).toBeTruthy();
    expect(connectorPosition!.x).toBeCloseTo(200, 10); // Connector follows rectangle
    expect(connectorPosition!.y).toBeCloseTo(200, 10); // Connector follows rectangle

    // Log final state for verification
    console.log('Final rectangle position:', finalPosition);
    console.log('Final connector position:', connectorPosition);
  });

  test('should maintain connector relative position during drag', async () => {
    // Create test rectangle with connector
    await page.evaluate(() => {
      const demo = (window as any).demoApp;
      const { VisualRectangle, Vector2 } = (window as any);
      
      if (!demo || !VisualRectangle || !Vector2) return;

      const testRect = new VisualRectangle(
        'RelativeTestRect',
        { color: '#00ff00' }, // Green color
        100, 100
      );
      
      testRect.position = new Vector2(0, 0);
      testRect.isDraggable = true;
      
      demo.visualObjects = demo.visualObjects || [];
      demo.visualObjects.push(testRect);
      
      (window as any).relativeTestRect = testRect;
      
      console.log('🟢 RELATIVE TEST RECT CREATED');
    });

    await page.waitForTimeout(500);

    // Get initial connector relative position
    const initialRelativePosition = await page.evaluate(() => {
      const testRect = (window as any).relativeTestRect;
      if (!testRect || !testRect.connectors || testRect.connectors.length === 0) {
        return null;
      }
      
      const connector = testRect.connectors[0];
      return {
        rectX: testRect.position.x,
        rectY: testRect.position.y,
        connectorX: connector.position.x,
        connectorY: connector.position.y,
        relativeX: connector.position.x - testRect.position.x,
        relativeY: connector.position.y - testRect.position.y
      };
    });

    expect(initialRelativePosition).toBeTruthy();

    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) return;

    const canvasCenterX = canvasBox.x + canvasBox.width / 2;
    const canvasCenterY = canvasBox.y + canvasBox.height / 2;
    
    // Drag to new position
    await page.mouse.move(canvasCenterX, canvasCenterY);
    await page.mouse.down();
    await page.mouse.move(canvasCenterX + 150, canvasCenterY - 100, { steps: 8 });
    await page.mouse.up();
    
    await page.waitForTimeout(500);

    // Get final positions
    const finalRelativePosition = await page.evaluate(() => {
      const testRect = (window as any).relativeTestRect;
      if (!testRect || !testRect.connectors || testRect.connectors.length === 0) {
        return null;
      }
      
      const connector = testRect.connectors[0];
      return {
        rectX: testRect.position.x,
        rectY: testRect.position.y,
        connectorX: connector.position.x,
        connectorY: connector.position.y,
        relativeX: connector.position.x - testRect.position.x,
        relativeY: connector.position.y - testRect.position.y
      };
    });

    expect(finalRelativePosition).toBeTruthy();

    // Verify relative position remained the same
    expect(finalRelativePosition!.relativeX).toBeCloseTo(initialRelativePosition!.relativeX, 5);
    expect(finalRelativePosition!.relativeY).toBeCloseTo(initialRelativePosition!.relativeY, 5);

    // Verify both rectangle and connector moved
    expect(finalRelativePosition!.rectX).not.toBeCloseTo(initialRelativePosition!.rectX, 10);
    expect(finalRelativePosition!.rectY).not.toBeCloseTo(initialRelativePosition!.rectY, 10);
    expect(finalRelativePosition!.connectorX).not.toBeCloseTo(initialRelativePosition!.connectorX, 10);
    expect(finalRelativePosition!.connectorY).not.toBeCloseTo(initialRelativePosition!.connectorY, 10);

    console.log('Initial relative position:', initialRelativePosition);
    console.log('Final relative position:', finalRelativePosition);
  });

  test('should handle dragging with visual feedback and styling', async () => {
    // Create test rectangle
    await page.evaluate(() => {
      const demo = (window as any).demoApp;
      const { VisualRectangle, Vector2 } = (window as any);
      
      if (!demo || !VisualRectangle || !Vector2) return;

      const testRect = new VisualRectangle(
        'StyleTestRect',
        { color: '#0000ff' }, // Blue color
        120, 80
      );
      
      testRect.position = new Vector2(0, 0);
      testRect.isDraggable = true;
      
      demo.visualObjects = demo.visualObjects || [];
      demo.visualObjects.push(testRect);
      
      (window as any).styleTestRect = testRect;
      
      console.log('🔵 STYLE TEST RECT CREATED');
    });

    await page.waitForTimeout(500);

    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) return;

    const canvasCenterX = canvasBox.x + canvasBox.width / 2;
    const canvasCenterY = canvasBox.y + canvasBox.height / 2;

    // Initial state
    await expect(canvas).toHaveScreenshot('style-test-initial.png');

    // Start drag and capture dragging state
    await page.mouse.move(canvasCenterX, canvasCenterY);
    await page.mouse.down();
    
    // Capture dragging visual state
    await page.waitForTimeout(100);
    await expect(canvas).toHaveScreenshot('style-test-dragging.png');

    // Complete drag
    await page.mouse.move(canvasCenterX + 200, canvasCenterY - 200, { steps: 8 });
    await page.mouse.up();
    
    await page.waitForTimeout(300);

    // Final state
    await expect(canvas).toHaveScreenshot('style-test-final.png');

    // Verify dragging state was applied
    const dragState = await page.evaluate(() => {
      const testRect = (window as any).styleTestRect;
      return {
        isDragging: testRect?.isDragging || false,
        position: testRect ? { x: testRect.position.x, y: testRect.position.y } : null
      };
    });

    expect(dragState.isDragging).toBeFalsy(); // Should not be dragging after mouse up
    expect(dragState.position).toBeTruthy();
    expect(dragState.position!.x).toBeCloseTo(200, 10);
    expect(dragState.position!.y).toBeCloseTo(200, 10);
  });
});

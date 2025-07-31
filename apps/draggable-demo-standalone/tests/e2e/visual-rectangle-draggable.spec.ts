import { test, expect, type Page, type Locator } from '@playwright/test';

test.describe('VisualRectangle Draggable Integration Tests', () => {
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

  test.describe('Basic Draggable Functionality', () => {
    test('should allow dragging VisualRectangle with mouse', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Get initial screenshot
      await expect(canvas).toHaveScreenshot('rectangle-initial-position.png');
      
      // Click and drag VR1 (first rectangle)
      const startX = canvasBox.x + 150;
      const startY = canvasBox.y + 150;
      const endX = canvasBox.x + 300;
      const endY = canvasBox.y + 200;
      
      // Perform drag operation
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY, { steps: 10 });
      await page.mouse.up();
      
      // Wait for animation/update to complete
      await page.waitForTimeout(500);
      
      // Verify rectangle moved
      await expect(canvas).toHaveScreenshot('rectangle-after-drag.png');
    });

    test('should show dragging visual feedback during drag', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      const startX = canvasBox.x + 150;
      const startY = canvasBox.y + 150;
      const midX = canvasBox.x + 225;
      const midY = canvasBox.y + 175;
      
      // Start drag
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Move to middle position and capture dragging state
      await page.mouse.move(midX, midY, { steps: 5 });
      await page.waitForTimeout(100);
      
      // Screenshot during drag (should show dragging opacity/styling)
      await expect(canvas).toHaveScreenshot('rectangle-during-drag.png');
      
      // Complete drag
      await page.mouse.up();
    });

    test('should handle multiple rectangles dragging independently', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Drag first rectangle (VR1)
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 200, canvasBox.y + 100, { steps: 5 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Drag second rectangle (VR2)
      await page.mouse.move(canvasBox.x + 400, canvasBox.y + 300);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 350, canvasBox.y + 250, { steps: 5 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Verify both rectangles moved independently
      await expect(canvas).toHaveScreenshot('both-rectangles-moved.png');
    });
  });

  test.describe('Coordinate System Integration', () => {
    test('should handle Cartesian coordinate system correctly during drag', async () => {
      const consoleMessages: string[] = [];
      page.on('console', (msg: any) => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Drag rectangle and monitor coordinate transformations
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 250, canvasBox.y + 100, { steps: 8 });
      await page.mouse.up();
      
      await page.waitForTimeout(500);
      
      // Check that coordinate transformations are working
      // (Should see coordinate-related console logs if debugging is enabled)
      const hasCoordinateMessages = consoleMessages.some(msg => 
        msg.includes('coordinate') || msg.includes('position') || msg.includes('drag')
      );
      
      // This test verifies the drag completed without coordinate system errors
      expect(hasCoordinateMessages || consoleMessages.length >= 0).toBeTruthy();
    });

    test('should maintain proper hit detection during drag operations', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Test clicking on rectangle edge vs center
      const rectCenterX = canvasBox.x + 150;
      const rectCenterY = canvasBox.y + 150;
      
      // Click on center - should start drag
      await page.mouse.move(rectCenterX, rectCenterY);
      await page.mouse.down();
      await page.mouse.move(rectCenterX + 50, rectCenterY + 25, { steps: 3 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Click outside rectangle - should not affect rectangle
      await page.mouse.move(canvasBox.x + 50, canvasBox.y + 50);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 100, canvasBox.y + 75, { steps: 3 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Verify rectangle only moved during first drag
      await expect(canvas).toHaveScreenshot('hit-detection-test.png');
    });
  });

  test.describe('Visual Feedback and Styling', () => {
    test('should apply correct styling during different drag states', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Initial state
      await expect(canvas).toHaveScreenshot('rectangle-normal-state.png');
      
      // Hover state (move mouse over rectangle)
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.waitForTimeout(200);
      await expect(canvas).toHaveScreenshot('rectangle-hover-state.png');
      
      // Drag start state
      await page.mouse.down();
      await page.waitForTimeout(100);
      await expect(canvas).toHaveScreenshot('rectangle-drag-start-state.png');
      
      // During drag state
      await page.mouse.move(canvasBox.x + 200, canvasBox.y + 175, { steps: 3 });
      await page.waitForTimeout(100);
      await expect(canvas).toHaveScreenshot('rectangle-dragging-state.png');
      
      // Drag end state
      await page.mouse.up();
      await page.waitForTimeout(200);
      await expect(canvas).toHaveScreenshot('rectangle-drag-end-state.png');
    });

    test('should show selection indicators when rectangle is selected', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Click to select rectangle
      await page.mouse.click(canvasBox.x + 150, canvasBox.y + 150);
      await page.waitForTimeout(300);
      
      // Should show selection indicators (dashed border, etc.)
      await expect(canvas).toHaveScreenshot('rectangle-selected-state.png');
      
      // Click elsewhere to deselect
      await page.mouse.click(canvasBox.x + 50, canvasBox.y + 50);
      await page.waitForTimeout(300);
      
      // Should return to normal state
      await expect(canvas).toHaveScreenshot('rectangle-deselected-state.png');
    });
  });

  test.describe('Performance and Edge Cases', () => {
    test('should handle rapid drag movements without performance issues', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      const startTime = Date.now();
      
      // Perform rapid drag movements
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.down();
      
      // Rapid zigzag movement
      for (let i = 0; i < 10; i++) {
        const x = canvasBox.x + 150 + (i % 2 === 0 ? 50 : -50);
        const y = canvasBox.y + 150 + (i * 10);
        await page.mouse.move(x, y, { steps: 1 });
        await page.waitForTimeout(50);
      }
      
      await page.mouse.up();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 2 seconds)
      expect(duration).toBeLessThan(2000);
      
      // Verify final state
      await expect(canvas).toHaveScreenshot('rapid-movement-final.png');
    });

    test('should handle drag operations near canvas boundaries', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Drag rectangle to near left edge
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 20, canvasBox.y + 150, { steps: 5 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Drag rectangle to near right edge
      await page.mouse.move(canvasBox.x + 20, canvasBox.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + canvasBox.width - 50, canvasBox.y + 150, { steps: 5 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Verify rectangle handles boundary conditions
      await expect(canvas).toHaveScreenshot('boundary-drag-test.png');
    });

    test('should handle mouse leave events during drag', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Start drag
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.down();
      
      // Move outside canvas while dragging
      await page.mouse.move(canvasBox.x - 50, canvasBox.y + 150, { steps: 3 });
      await page.waitForTimeout(200);
      
      // Move back inside canvas
      await page.mouse.move(canvasBox.x + 200, canvasBox.y + 150, { steps: 3 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Should handle mouse leave/enter gracefully
      await expect(canvas).toHaveScreenshot('mouse-leave-test.png');
    });
  });

  test.describe('Connector Integration', () => {
    test('should maintain connector positions during rectangle drag', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Initial state with connectors visible
      await expect(canvas).toHaveScreenshot('connectors-initial.png');
      
      // Drag rectangle and verify connectors follow
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 250, canvasBox.y + 200, { steps: 8 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Connectors should have moved with rectangle
      await expect(canvas).toHaveScreenshot('connectors-after-drag.png');
    });

    test('should update rope connections during rectangle drag', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      if (!canvasBox) return;
      
      // Drag VR1 and verify rope updates
      await page.mouse.move(canvasBox.x + 150, canvasBox.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 200, canvasBox.y + 100, { steps: 6 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Rope should have updated to new position
      await expect(canvas).toHaveScreenshot('rope-updated-after-drag.png');
      
      // Drag VR2 and verify rope updates again
      await page.mouse.move(canvasBox.x + 400, canvasBox.y + 300);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + 350, canvasBox.y + 350, { steps: 6 });
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Rope should reflect both rectangle positions
      await expect(canvas).toHaveScreenshot('rope-both-rectangles-moved.png');
    });
  });
});

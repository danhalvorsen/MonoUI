import { test, expect, type Page, type Locator } from '@playwright/test';

test.describe('Rope Integration E2E Tests', () => {
  let page: Page;
  let canvas: Locator;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Navigate to the draggable demo app
    await page.goto('http://localhost:5173'); // Draggable demo port
    
    // Wait for the canvas to be ready
    canvas = page.locator('html-canvas');
    await expect(canvas).toBeVisible();
    
    // Wait for rectangles and rope to be loaded
    await page.waitForTimeout(2000);
  });

  test.describe('Rope Rendering and Initialization', () => {
    test('should display rope connecting two VisualRectangles', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      // Reload to capture initialization logs
      await page.reload();
      await page.waitForTimeout(1500);
      
      // Check that rope was created successfully
      expect(consoleMessages.some(msg => 
        msg.includes('🔗 ROPE CREATED:')
      )).toBeTruthy();
      
      // Verify rope connection info is logged
      expect(consoleMessages.some(msg => 
        msg.includes('rope-vr1-vr2')
      )).toBeTruthy();
    });

    test('should render rope with design tokens styling', async () => {
      // Check that the canvas is rendered
      await expect(canvas).toBeVisible();
      
      // Take a screenshot to verify visual rendering
      await expect(canvas).toHaveScreenshot('rope-initial-render.png');
    });

    test('should display rope connection info correctly', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      await page.reload();
      await page.waitForTimeout(1000);
      
      // Look for rope connection information in console
      const ropeCreationLog = consoleMessages.find(msg => 
        msg.includes('🔗 ROPE CREATED:')
      );
      
      expect(ropeCreationLog).toBeTruthy();
      
      // Verify the log contains expected rope properties
      if (ropeCreationLog) {
        expect(ropeCreationLog).toMatch(/startRect.*VR1/);
        expect(ropeCreationLog).toMatch(/endRect.*VR2/);
      }
    });
  });

  test.describe('Rope Dynamic Behavior', () => {
    test('should update rope position when rectangles are dragged', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      // Get canvas bounding box
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Take initial screenshot
      await expect(canvas).toHaveScreenshot('rope-before-drag.png');
      
      // Drag the first rectangle (VR1) - should be around center
      const startX = canvasBox!.x + canvasBox!.width / 2;
      const startY = canvasBox!.y + canvasBox!.height / 2;
      
      // Start drag
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      
      // Drag to new position
      await page.mouse.move(startX + 100, startY + 50);
      await page.mouse.up();
      
      // Wait for rope to update
      await page.waitForTimeout(500);
      
      // Take screenshot after drag to verify rope followed
      await expect(canvas).toHaveScreenshot('rope-after-drag.png');
      
      // Verify drag operation was logged
      expect(consoleMessages.some(msg => 
        msg.includes('🎯 DRAG START')
      )).toBeTruthy();
    });

    test('should maintain rope connection during multiple drags', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Perform multiple drag operations
      for (let i = 0; i < 3; i++) {
        const startX = canvasBox!.x + 200 + (i * 30);
        const startY = canvasBox!.y + 150 + (i * 20);
        
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + 50, startY + 30);
        await page.mouse.up();
        
        await page.waitForTimeout(300);
      }
      
      // Take final screenshot to verify rope integrity
      await expect(canvas).toHaveScreenshot('rope-after-multiple-drags.png');
      
      // Verify multiple drag operations were logged
      const dragStartLogs = consoleMessages.filter(msg => 
        msg.includes('🎯 DRAG START')
      );
      expect(dragStartLogs.length).toBeGreaterThan(0);
    });

    test('should update rope length dynamically', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Drag rectangles apart to increase rope length
      await page.mouse.move(canvasBox!.x + 200, canvasBox!.y + 150);
      await page.mouse.down();
      await page.mouse.move(canvasBox!.x + 400, canvasBox!.y + 300);
      await page.mouse.up();
      
      await page.waitForTimeout(500);
      
      // Take screenshot showing extended rope
      await expect(canvas).toHaveScreenshot('rope-extended-length.png');
    });
  });

  test.describe('Rope Visual Properties', () => {
    test('should display rope endpoints correctly', async () => {
      // Take detailed screenshot focusing on rope endpoints
      await expect(canvas).toHaveScreenshot('rope-endpoints-detail.png');
    });

    test('should show rope length information', async () => {
      // The rope should display length at midpoint
      await expect(canvas).toHaveScreenshot('rope-length-display.png');
    });

    test('should maintain visual consistency with design tokens', async () => {
      // Verify rope uses consistent purple color from design tokens
      await expect(canvas).toHaveScreenshot('rope-design-tokens.png');
    });
  });

  test.describe('Rope Error Handling', () => {
    test('should handle missing connectors gracefully', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      // Check for any error messages in console
      await page.reload();
      await page.waitForTimeout(1000);
      
      // Should not have any critical errors
      const errorMessages = consoleMessages.filter(msg => 
        msg.toLowerCase().includes('error') && 
        !msg.includes('DevTools') // Ignore DevTools warnings
      );
      
      expect(errorMessages.length).toBe(0);
    });

    test('should maintain rope integrity during rapid interactions', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Perform rapid mouse movements and clicks
      for (let i = 0; i < 10; i++) {
        const x = canvasBox!.x + Math.random() * canvasBox!.width;
        const y = canvasBox!.y + Math.random() * canvasBox!.height;
        
        await page.mouse.move(x, y);
        await page.mouse.click(x, y);
        await page.waitForTimeout(50);
      }
      
      // Rope should still be visible and functional
      await expect(canvas).toHaveScreenshot('rope-after-rapid-interactions.png');
    });
  });

  test.describe('Rope Performance', () => {
    test('should render rope smoothly during animations', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Start a continuous drag operation
      await page.mouse.move(canvasBox!.x + 200, canvasBox!.y + 150);
      await page.mouse.down();
      
      // Perform smooth drag motion
      for (let i = 0; i <= 20; i++) {
        const progress = i / 20;
        const x = canvasBox!.x + 200 + (progress * 200);
        const y = canvasBox!.y + 150 + (Math.sin(progress * Math.PI * 2) * 50);
        
        await page.mouse.move(x, y);
        await page.waitForTimeout(50);
      }
      
      await page.mouse.up();
      
      // Take final screenshot
      await expect(canvas).toHaveScreenshot('rope-smooth-animation.png');
    });

    test('should handle multiple rope connections efficiently', async () => {
      // This test verifies that the single rope doesn't cause performance issues
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      // Perform multiple operations to stress test
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      for (let i = 0; i < 5; i++) {
        await page.mouse.move(canvasBox!.x + 150, canvasBox!.y + 100);
        await page.mouse.down();
        await page.mouse.move(canvasBox!.x + 250, canvasBox!.y + 200);
        await page.mouse.up();
        await page.waitForTimeout(200);
      }
      
      // Should not have performance warnings
      const performanceWarnings = consoleMessages.filter(msg => 
        msg.toLowerCase().includes('performance') || 
        msg.toLowerCase().includes('slow')
      );
      
      expect(performanceWarnings.length).toBe(0);
    });
  });

  test.describe('Rope Integration with Canvas Engine', () => {
    test('should integrate properly with CanvasEngine rendering loop', async () => {
      const consoleMessages: string[] = [];
      page.on('console', msg => consoleMessages.push(msg.text()));
      
      await page.reload();
      await page.waitForTimeout(1000);
      
      // Check that CanvasEngine is running
      expect(consoleMessages.some(msg => 
        msg.includes('CanvasEngine') || msg.includes('render')
      )).toBeTruthy();
    });

    test('should respond to coordinate system transformations', async () => {
      // Test that rope works correctly with the Cartesian coordinate system
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Drag in different directions to test coordinate mapping
      const movements = [
        { dx: 100, dy: 0 },   // Right
        { dx: 0, dy: 100 },   // Down (should be up in Cartesian)
        { dx: -100, dy: 0 },  // Left
        { dx: 0, dy: -100 }   // Up (should be down in Cartesian)
      ];
      
      for (const movement of movements) {
        await page.mouse.move(canvasBox!.x + 200, canvasBox!.y + 150);
        await page.mouse.down();
        await page.mouse.move(
          canvasBox!.x + 200 + movement.dx, 
          canvasBox!.y + 150 + movement.dy
        );
        await page.mouse.up();
        await page.waitForTimeout(300);
      }
      
      // Take final screenshot to verify coordinate handling
      await expect(canvas).toHaveScreenshot('rope-coordinate-transformations.png');
    });
  });
});

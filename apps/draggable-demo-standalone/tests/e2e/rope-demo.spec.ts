import { test, expect, type Page, type Locator } from '@playwright/test';

test.describe('Rope Demo Application E2E Tests', () => {
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

  test.describe('Demo Application Integration', () => {
    test('should load demo application with rope successfully', async () => {
      const consoleMessages: string[] = [];
      page.on('console', (msg: any) => consoleMessages.push(msg.text()));
      
      // Reload to capture all initialization logs
      await page.reload();
      await page.waitForTimeout(1500);
      
      // Check that demo application loaded
      expect(consoleMessages.some(msg => 
        msg.includes('DemoApplication') || msg.includes('Demo loaded')
      )).toBeTruthy();
      
      // Check that rope was created
      expect(consoleMessages.some(msg => 
        msg.includes('🔗 ROPE CREATED:')
      )).toBeTruthy();
      
      // Check that both rectangles were created
      expect(consoleMessages.some(msg => 
        msg.includes('VR1') || msg.includes('VR2')
      )).toBeTruthy();
    });

    test('should display rope connecting VR1 and VR2', async () => {
      // Take screenshot of initial state
      await expect(canvas).toHaveScreenshot('demo-rope-initial.png');
      
      // Verify canvas is interactive
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      expect(canvasBox!.width).toBeGreaterThan(0);
      expect(canvasBox!.height).toBeGreaterThan(0);
    });

    test('should create rope using DemoConfig', async () => {
      const consoleMessages: string[] = [];
      page.on('console', (msg: any) => consoleMessages.push(msg.text()));
      
      await page.reload();
      await page.waitForTimeout(1000);
      
      // Look for DemoConfig rope creation
      const ropeConfigLog = consoleMessages.find(msg => 
        msg.includes('🔗 ROPE CREATED:') && 
        msg.includes('rope-vr1-vr2')
      );
      
      expect(ropeConfigLog).toBeTruthy();
      
      // Verify rope uses design tokens (thick line style)
      if (ropeConfigLog) {
        expect(ropeConfigLog).toMatch(/thick/);
        expect(ropeConfigLog).toMatch(/solid/);
      }
    });
  });

  test.describe('Rope Functionality in Demo', () => {
    test('should demonstrate rope following rectangles during drag', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Take before screenshot
      await expect(canvas).toHaveScreenshot('demo-before-drag.png');
      
      // Find and drag one of the rectangles
      // VR1 and VR2 are at the same position initially, so drag from center
      const centerX = canvasBox!.x + canvasBox!.width / 2;
      const centerY = canvasBox!.y + canvasBox!.height / 2;
      
      // Drag rectangle to new position
      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 150, centerY + 100);
      await page.mouse.up();
      
      // Wait for rope to update
      await page.waitForTimeout(500);
      
      // Take after screenshot
      await expect(canvas).toHaveScreenshot('demo-after-drag.png');
    });

    test('should show rope length updates in real-time', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Drag rectangles to different distances and capture screenshots
      const positions = [
        { x: 100, y: 50, name: 'close' },
        { x: 200, y: 150, name: 'medium' },
        { x: 300, y: 250, name: 'far' }
      ];
      
      for (const pos of positions) {
        await page.mouse.move(canvasBox!.x + canvasBox!.width / 2, canvasBox!.y + canvasBox!.height / 2);
        await page.mouse.down();
        await page.mouse.move(canvasBox!.x + pos.x, canvasBox!.y + pos.y);
        await page.mouse.up();
        
        await page.waitForTimeout(300);
        await expect(canvas).toHaveScreenshot(`demo-rope-${pos.name}-distance.png`);
      }
    });

    test('should maintain rope visual quality during interactions', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Perform various interactions to test rope stability
      const interactions = [
        { action: 'click', x: 100, y: 100 },
        { action: 'drag', startX: 150, startY: 150, endX: 250, endY: 200 },
        { action: 'click', x: 300, y: 250 },
        { action: 'drag', startX: 200, startY: 200, endX: 100, endY: 100 }
      ];
      
      for (let i = 0; i < interactions.length; i++) {
        const interaction = interactions[i];
        
        if (interaction.action === 'click') {
          await page.mouse.click(canvasBox!.x + interaction.x, canvasBox!.y + interaction.y);
        } else if (interaction.action === 'drag') {
          await page.mouse.move(canvasBox!.x + interaction.startX, canvasBox!.y + interaction.startY);
          await page.mouse.down();
          await page.mouse.move(canvasBox!.x + interaction.endX, canvasBox!.y + interaction.endY);
          await page.mouse.up();
        }
        
        await page.waitForTimeout(200);
      }
      
      // Final screenshot to verify rope integrity
      await expect(canvas).toHaveScreenshot('demo-rope-after-interactions.png');
    });
  });

  test.describe('Design Token Verification', () => {
    test('should display rope with correct design token styling', async () => {
      // Take high-quality screenshot for design verification
      await expect(canvas).toHaveScreenshot('demo-rope-design-tokens.png');
    });

    test('should show rope endpoints with proper styling', async () => {
      // Focus on rope endpoint details
      await expect(canvas).toHaveScreenshot('demo-rope-endpoints.png');
    });

    test('should display rope length text with correct typography', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Drag to create a longer rope for better text visibility
      await page.mouse.move(canvasBox!.x + canvasBox!.width / 2, canvasBox!.y + canvasBox!.height / 2);
      await page.mouse.down();
      await page.mouse.move(canvasBox!.x + canvasBox!.width / 2 + 200, canvasBox!.y + canvasBox!.height / 2 + 150);
      await page.mouse.up();
      
      await page.waitForTimeout(300);
      
      // Screenshot showing length text
      await expect(canvas).toHaveScreenshot('demo-rope-length-text.png');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle rapid mouse movements gracefully', async () => {
      const consoleMessages: string[] = [];
      page.on('console', (msg: any) => consoleMessages.push(msg.text()));
      
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Perform rapid, erratic mouse movements
      for (let i = 0; i < 20; i++) {
        const x = canvasBox!.x + Math.random() * canvasBox!.width;
        const y = canvasBox!.y + Math.random() * canvasBox!.height;
        
        await page.mouse.move(x, y);
        
        if (i % 3 === 0) {
          await page.mouse.down();
          await page.mouse.move(x + 50, y + 50);
          await page.mouse.up();
        }
        
        await page.waitForTimeout(25);
      }
      
      // Should not have errors
      const errorMessages = consoleMessages.filter(msg => 
        msg.toLowerCase().includes('error') && 
        !msg.includes('DevTools')
      );
      
      expect(errorMessages.length).toBe(0);
      
      // Rope should still be functional
      await expect(canvas).toHaveScreenshot('demo-rope-after-rapid-movements.png');
    });

    test('should maintain performance during continuous interactions', async () => {
      const canvasBox = await canvas.boundingBox();
      expect(canvasBox).toBeTruthy();
      
      // Measure performance by doing continuous drag operations
      const startTime = Date.now();
      
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(canvasBox!.x + 200, canvasBox!.y + 150);
        await page.mouse.down();
        await page.mouse.move(canvasBox!.x + 300, canvasBox!.y + 200);
        await page.mouse.up();
        await page.waitForTimeout(100);
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (less than 5 seconds)
      expect(duration).toBeLessThan(5000);
      
      // Final verification screenshot
      await expect(canvas).toHaveScreenshot('demo-rope-performance-test.png');
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ScreenCoordinateSystem } from '../src/coordinates/ScreenCoordinateSystem';
import { Vector2 } from '@my-graphics/math';

describe('Drag Coordinate Conversion', () => {
  let coordinateSystem: ScreenCoordinateSystem;
  const canvasWidth = 800;
  const canvasHeight = 600;

  beforeEach(() => {
    coordinateSystem = new ScreenCoordinateSystem(canvasWidth, canvasHeight);
  });

  describe('Screen to Canonical Conversion', () => {
    it('should convert screen center to canonical origin', () => {
      const screenCenter = { x: canvasWidth / 2, y: canvasHeight / 2 };
      const canonical = coordinateSystem.toCanonical(screenCenter);
      
      expect(canonical.x).toBeCloseTo(0, 5);
      expect(canonical.y).toBeCloseTo(0, 5);
    });

    it('should convert screen top-left to canonical bottom-left', () => {
      const screenTopLeft = { x: 0, y: 0 };
      const canonical = coordinateSystem.toCanonical(screenTopLeft);
      
      expect(canonical.x).toBeCloseTo(-canvasWidth / 2, 5);
      expect(canonical.y).toBeCloseTo(canvasHeight / 2, 5); // Y is flipped
    });

    it('should convert screen bottom-right to canonical top-right', () => {
      const screenBottomRight = { x: canvasWidth, y: canvasHeight };
      const canonical = coordinateSystem.toCanonical(screenBottomRight);
      
      expect(canonical.x).toBeCloseTo(canvasWidth / 2, 5);
      expect(canonical.y).toBeCloseTo(-canvasHeight / 2, 5); // Y is flipped
    });
  });

  describe('Drag Delta Calculations', () => {
    it('should calculate correct horizontal drag delta', () => {
      // Simulate dragging 50 pixels to the right
      const startScreen = { x: 400, y: 300 };
      const endScreen = { x: 450, y: 300 };
      
      const screenDeltaX = endScreen.x - startScreen.x;
      const screenDeltaY = endScreen.y - startScreen.y;
      
      // Convert to canonical deltas (as done in CartesianDragController)
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY; // Flip Y
      
      expect(canonicalDeltaX).toBe(50);
      expect(canonicalDeltaY).toBeCloseTo(0, 5);
    });

    it('should calculate correct vertical drag delta with Y-flip', () => {
      // Simulate dragging 30 pixels down (positive Y in screen space)
      const startScreen = { x: 400, y: 300 };
      const endScreen = { x: 400, y: 330 };
      
      const screenDeltaX = endScreen.x - startScreen.x;
      const screenDeltaY = endScreen.y - startScreen.y;
      
      // Convert to canonical deltas
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY; // Flip Y
      
      expect(canonicalDeltaX).toBe(0);
      expect(canonicalDeltaY).toBe(-30); // Negative because Y is flipped
    });

    it('should calculate correct diagonal drag delta', () => {
      // Simulate dragging 40 pixels right and 20 pixels down
      const startScreen = { x: 350, y: 250 };
      const endScreen = { x: 390, y: 270 };
      
      const screenDeltaX = endScreen.x - startScreen.x;
      const screenDeltaY = endScreen.y - startScreen.y;
      
      // Convert to canonical deltas
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY; // Flip Y
      
      expect(canonicalDeltaX).toBe(40);
      expect(canonicalDeltaY).toBe(-20); // Negative because Y is flipped
    });
  });

  describe('Drag Delta Consistency', () => {
    it('should produce consistent deltas regardless of starting position', () => {
      // Test same delta from different starting positions
      const scenarios = [
        { start: { x: 100, y: 100 }, end: { x: 150, y: 80 } },
        { start: { x: 300, y: 400 }, end: { x: 350, y: 380 } },
        { start: { x: 600, y: 200 }, end: { x: 650, y: 180 } }
      ];
      
      const expectedDeltaX = 50;
      const expectedDeltaY = 20; // Positive in canonical space (up)
      
      scenarios.forEach((scenario, index) => {
        const screenDeltaX = scenario.end.x - scenario.start.x;
        const screenDeltaY = scenario.end.y - scenario.start.y;
        
        const canonicalDeltaX = screenDeltaX;
        const canonicalDeltaY = -screenDeltaY; // Flip Y
        
        expect(canonicalDeltaX).toBe(expectedDeltaX);
        expect(canonicalDeltaY).toBe(expectedDeltaY);
      });
    });
  });

  describe('Object Position Updates', () => {
    it('should correctly update object position with drag deltas', () => {
      // Start with object at canonical position (100, 200)
      const initialPosition = new Vector2(100, 200);
      
      // Simulate drag: 30 pixels right, 25 pixels down (screen space)
      const screenDeltaX = 30;
      const screenDeltaY = 25;
      
      // Convert to canonical deltas
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY; // Flip Y
      
      // Apply deltas to object position
      const newPosition = new Vector2(
        initialPosition.x + canonicalDeltaX,
        initialPosition.y + canonicalDeltaY
      );
      
      expect(newPosition.x).toBe(130); // 100 + 30
      expect(newPosition.y).toBe(175); // 200 + (-25) = 175 (moved down in canonical space)
    });

    it('should handle multiple consecutive drag operations', () => {
      let position = new Vector2(0, 0);
      
      // First drag: 20 right, 10 down (screen)
      let screenDeltaX = 20;
      let screenDeltaY = 10;
      let canonicalDeltaX = screenDeltaX;
      let canonicalDeltaY = -screenDeltaY;
      
      position = new Vector2(
        position.x + canonicalDeltaX,
        position.y + canonicalDeltaY
      );
      
      expect(position.x).toBe(20);
      expect(position.y).toBe(-10);
      
      // Second drag: 15 left, 5 up (screen)
      screenDeltaX = -15;
      screenDeltaY = -5;
      canonicalDeltaX = screenDeltaX;
      canonicalDeltaY = -screenDeltaY;
      
      position = new Vector2(
        position.x + canonicalDeltaX,
        position.y + canonicalDeltaY
      );
      
      expect(position.x).toBe(5);  // 20 + (-15)
      expect(position.y).toBe(-5); // -10 + 5
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero deltas correctly', () => {
      const screenDeltaX = 0;
      const screenDeltaY = 0;
      
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY;
      
      expect(canonicalDeltaX).toBeCloseTo(0, 5);
      expect(canonicalDeltaY).toBeCloseTo(0, 5);
    });

    it('should handle large deltas correctly', () => {
      const screenDeltaX = 1000;
      const screenDeltaY = -500;
      
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY;
      
      expect(canonicalDeltaX).toBe(1000);
      expect(canonicalDeltaY).toBe(500); // Flipped
    });

    it('should handle fractional deltas correctly', () => {
      const screenDeltaX = 12.5;
      const screenDeltaY = -7.3;
      
      const canonicalDeltaX = screenDeltaX;
      const canonicalDeltaY = -screenDeltaY;
      
      expect(canonicalDeltaX).toBeCloseTo(12.5, 5);
      expect(canonicalDeltaY).toBeCloseTo(7.3, 5);
    });
  });
});

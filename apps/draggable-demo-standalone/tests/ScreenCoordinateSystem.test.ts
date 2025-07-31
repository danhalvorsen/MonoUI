import { describe, it, expect } from 'vitest';
import { ScreenCoordinateSystem } from '../src/coordinates/ScreenCoordinateSystem';
import type { IPoint } from '../src/coordinates/ICoordinateSystem';

describe('ScreenCoordinateSystem', () => {
  const width = 800;
  const height = 600;
  const scale = 1;

  describe('toCanonical', () => {
    it('should convert screen center to canonical origin', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const screenCenter: IPoint = { x: width / 2, y: height / 2 };
      const canonical = system.toCanonical(screenCenter);
      
      expect(canonical.x).toBeCloseTo(0, 5);
      expect(canonical.y).toBeCloseTo(0, 5);
    });

    it('should convert screen top-left to canonical bottom-left', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const screenTopLeft: IPoint = { x: 0, y: 0 };
      const canonical = system.toCanonical(screenTopLeft);
      
      expect(canonical.x).toBeCloseTo(-width / 2, 5);
      expect(canonical.y).toBeCloseTo(height / 2, 5);
    });

    it('should convert screen bottom-right to canonical top-right', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const screenBottomRight: IPoint = { x: width, y: height };
      const canonical = system.toCanonical(screenBottomRight);
      
      expect(canonical.x).toBeCloseTo(width / 2, 5);
      expect(canonical.y).toBeCloseTo(-height / 2, 5);
    });

    it('should handle offset coordinates correctly', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const screenPoint: IPoint = { x: width / 2 + 100, y: height / 2 - 50 };
      const canonical = system.toCanonical(screenPoint);
      
      // Point offset from center should maintain offset in canonical space
      expect(canonical.x).toBeCloseTo(100, 5);
      expect(canonical.y).toBeCloseTo(50, 5);
    });
  });

  describe('fromCanonical', () => {
    it('should convert canonical origin to screen center', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const canonicalOrigin: IPoint = { x: 0, y: 0 };
      const screen = system.fromCanonical(canonicalOrigin);
      
      expect(screen.x).toBeCloseTo(width / 2, 5);
      expect(screen.y).toBeCloseTo(height / 2, 5);
    });

    it('should convert canonical bottom-left to screen top-left', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const canonicalBottomLeft: IPoint = { x: -width / 2, y: height / 2 };
      const screen = system.fromCanonical(canonicalBottomLeft);
      
      expect(screen.x).toBeCloseTo(0, 5);
      expect(screen.y).toBeCloseTo(0, 5);
    });

    it('should convert canonical top-right to screen bottom-right', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const canonicalTopRight: IPoint = { x: width / 2, y: -height / 2 };
      const screen = system.fromCanonical(canonicalTopRight);
      
      expect(screen.x).toBeCloseTo(width, 5);
      expect(screen.y).toBeCloseTo(height, 5);
    });

    it('should handle offset coordinates correctly', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const canonicalPoint: IPoint = { x: 100, y: 50 };
      const screen = system.fromCanonical(canonicalPoint);
      
      // Canonical offset should maintain offset in screen space
      expect(screen.x).toBeCloseTo(width / 2 + 100, 5);
      expect(screen.y).toBeCloseTo(height / 2 - 50, 5);
    });
  });

  describe('round-trip conversions', () => {
    it('should maintain precision through round-trip conversion', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const originalScreen: IPoint = { x: 123.456, y: 789.012 };
      
      const canonical = system.toCanonical(originalScreen);
      const backToScreen = system.fromCanonical(canonical);
      
      expect(backToScreen.x).toBeCloseTo(originalScreen.x, 5);
      expect(backToScreen.y).toBeCloseTo(originalScreen.y, 5);
    });

    it('should maintain precision with different coordinates', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const originalCanonical: IPoint = { x: -50.25, y: 75.75 };
      
      const screen = system.fromCanonical(originalCanonical);
      const backToCanonical = system.toCanonical(screen);
      
      expect(backToCanonical.x).toBeCloseTo(originalCanonical.x, 5);
      expect(backToCanonical.y).toBeCloseTo(originalCanonical.y, 5);
    });
  });

  describe('updateDimensions', () => {
    it('should update transforms when dimensions change', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const newWidth = 1200;
      const newHeight = 900;
      
      system.updateDimensions(newWidth, newHeight);
      
      // Test that new center is correctly calculated
      const screenCenter: IPoint = { x: newWidth / 2, y: newHeight / 2 };
      const canonical = system.toCanonical(screenCenter);
      
      expect(canonical.x).toBeCloseTo(0, 5);
      expect(canonical.y).toBeCloseTo(0, 5);
    });

    it('should handle corner coordinates correctly after dimension update', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const newWidth = 400;
      const newHeight = 300;
      
      system.updateDimensions(newWidth, newHeight);
      
      const screenTopLeft: IPoint = { x: 0, y: 0 };
      const canonical = system.toCanonical(screenTopLeft);
      
      expect(canonical.x).toBeCloseTo(-newWidth / 2, 5);
      expect(canonical.y).toBeCloseTo(newHeight / 2, 5);
    });
  });

  describe('edge cases', () => {
    it('should handle center coordinates correctly', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const screenPoint: IPoint = { x: width / 2, y: height / 2 };
      const canonical = system.toCanonical(screenPoint);
      
      expect(canonical.x).toBeCloseTo(0, 5);
      expect(canonical.y).toBeCloseTo(0, 5);
    });

    it('should handle negative coordinates', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const screenPoint: IPoint = { x: -100, y: -50 };
      const canonical = system.toCanonical(screenPoint);
      
      expect(canonical.x).toBeCloseTo(-width / 2 - 100, 5);
      expect(canonical.y).toBeCloseTo(height / 2 + 50, 5);
    });

    it('should handle very large coordinates', () => {
      const system = new ScreenCoordinateSystem(width, height, scale);
      const screenPoint: IPoint = { x: 10000, y: 5000 };
      const canonical = system.toCanonical(screenPoint);
      
      expect(canonical.x).toBeCloseTo(10000 - width / 2, 5);
      expect(canonical.y).toBeCloseTo(-(5000 - height / 2), 5);
    });
  });
});

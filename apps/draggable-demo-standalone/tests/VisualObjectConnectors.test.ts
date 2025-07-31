import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VisualRectangle } from '../../../packages/mr-web-components/src/VisualObjects/VisualRectangle';
import { Connector } from '../../../packages/mr-web-components/src/Connectors/Connector';
import { Vector2 } from '@my-graphics/math';

describe('VisualObject Connector Integration', () => {
  let rectangle: VisualRectangle;
  let mockConnector: any;

  beforeEach(() => {
    // Create a VisualRectangle
    rectangle = new VisualRectangle(
      'test-rect',
      { color: '#0000ff' },
      50,
      50
    );
    
    // Create a mock connector with update method
    mockConnector = {
      id: 'mock-connector',
      updatePositionFromHost: vi.fn(),
      update: vi.fn()
    };
    
    // Add mock connector to rectangle
    if (!rectangle.connectors) {
      rectangle.connectors = [];
    }
    rectangle.connectors.push(mockConnector);
  });

  describe('Position Setter Integration', () => {
    it('should call updatePositionFromHost on connectors when position changes', () => {
      // Set initial position
      rectangle.position = new Vector2(100, 200);
      
      // Reset mock calls
      mockConnector.updatePositionFromHost.mockClear();
      
      // Change position
      rectangle.position = new Vector2(300, 400);
      
      // Verify that updatePositionFromHost was called
      expect(mockConnector.updatePositionFromHost).toHaveBeenCalledTimes(1);
    });

    it('should update all connectors when position changes', () => {
      // Add second mock connector
      const mockConnector2 = {
        id: 'mock-connector-2',
        updatePositionFromHost: vi.fn(),
        update: vi.fn()
      };
      rectangle.connectors!.push(mockConnector2);
      
      // Change position
      rectangle.position = new Vector2(150, 250);
      
      // Both connectors should be updated
      expect(mockConnector.updatePositionFromHost).toHaveBeenCalledTimes(1);
      expect(mockConnector2.updatePositionFromHost).toHaveBeenCalledTimes(1);
    });

    it('should handle rectangles with no connectors gracefully', () => {
      // Create rectangle without connectors
      const emptyRect = new VisualRectangle('empty', { color: '#ff0000' }, 30, 30);
      
      // This should not throw an error
      expect(() => {
        emptyRect.position = new Vector2(100, 100);
      }).not.toThrow();
    });

    it('should handle connectors without updatePositionFromHost method', () => {
      // Add connector without updatePositionFromHost method
      const invalidConnector = { id: 'invalid' };
      rectangle.connectors!.push(invalidConnector);
      
      // This should not throw an error
      expect(() => {
        rectangle.position = new Vector2(200, 300);
      }).not.toThrow();
      
      // Valid connector should still be called
      expect(mockConnector.updatePositionFromHost).toHaveBeenCalledTimes(1);
    });
  });

  describe('Real Connector Integration', () => {
    let realConnector: Connector;

    beforeEach(() => {
      // Create a real connector
      realConnector = new Connector('real-connector', rectangle, 0, 0);
      
      // Clear the mock connector and add real one
      rectangle.connectors = [realConnector];
      
      // Set initial position
      rectangle.position = new Vector2(100, 200);
    });

    it('should automatically update real connector position when rectangle moves', () => {
      // Verify initial position
      expect(realConnector.position.x).toBe(100);
      expect(realConnector.position.y).toBe(200);
      
      // Move rectangle
      rectangle.position = new Vector2(300, 400);
      
      // Connector should follow
      expect(realConnector.position.x).toBe(300);
      expect(realConnector.position.y).toBe(400);
    });

    it('should maintain relative offset when rectangle moves', () => {
      // Create connector with offset
      const offsetConnector = new Connector('offset-connector', rectangle, 25, -15);
      rectangle.connectors!.push(offsetConnector);
      
      // Set rectangle position
      rectangle.position = new Vector2(200, 300);
      
      // Check center connector (no offset)
      expect(realConnector.position.x).toBe(200);
      expect(realConnector.position.y).toBe(300);
      
      // Check offset connector
      expect(offsetConnector.position.x).toBe(225); // 200 + 25
      expect(offsetConnector.position.y).toBe(285); // 300 + (-15)
    });

    it('should handle multiple position changes correctly', () => {
      const positions = [
        new Vector2(0, 0),
        new Vector2(100, 50),
        new Vector2(-50, 150),
        new Vector2(500, -200)
      ];
      
      positions.forEach(pos => {
        rectangle.position = pos;
        expect(realConnector.position.x).toBe(pos.x);
        expect(realConnector.position.y).toBe(pos.y);
      });
    });
  });

  describe('VisualRectangle Center Connector', () => {
    it('should automatically create center connector', () => {
      // VisualRectangle should automatically create a center connector
      expect(rectangle.connectors).toBeDefined();
      expect(rectangle.connectors!.length).toBeGreaterThan(0);
      
      // Find the center connector
      const centerConnector = rectangle.connectors!.find(c => 
        c.id.includes('center-connector')
      );
      expect(centerConnector).toBeDefined();
    });

    it('should position center connector at rectangle center', () => {
      rectangle.position = new Vector2(150, 250);
      
      // Find center connector
      const centerConnector = rectangle.connectors!.find(c => 
        c.id.includes('center-connector')
      ) as Connector;
      
      expect(centerConnector).toBeDefined();
      expect(centerConnector.position.x).toBe(150);
      expect(centerConnector.position.y).toBe(250);
    });

    it('should make center connector non-draggable', () => {
      const centerConnector = rectangle.connectors!.find(c => 
        c.id.includes('center-connector')
      ) as Connector;
      
      expect(centerConnector).toBeDefined();
      expect(centerConnector.isDraggable).toBe(false);
    });
  });

  describe('Performance Considerations', () => {
    it('should not create excessive function calls during position updates', () => {
      // Create multiple connectors
      const connectors = Array.from({ length: 5 }, (_, i) => 
        new Connector(`connector-${i}`, rectangle, i * 10, i * 5)
      );
      
      rectangle.connectors = connectors;
      
      // Spy on updatePositionFromHost calls
      const spies = connectors.map(c => vi.spyOn(c as any, 'updatePositionFromHost'));
      
      // Single position change
      rectangle.position = new Vector2(100, 100);
      
      // Each connector should be called exactly once
      spies.forEach(spy => {
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle rapid position changes efficiently', () => {
      const connector = new Connector('perf-test', rectangle, 0, 0);
      rectangle.connectors = [connector];
      
      const spy = vi.spyOn(connector as any, 'updatePositionFromHost');
      
      // Rapid position changes
      for (let i = 0; i < 100; i++) {
        rectangle.position = new Vector2(i, i * 2);
      }
      
      // Should have been called 100 times (once per position change)
      expect(spy).toHaveBeenCalledTimes(100);
      
      // Final position should be correct
      expect(connector.position.x).toBe(99);
      expect(connector.position.y).toBe(198);
    });
  });
});

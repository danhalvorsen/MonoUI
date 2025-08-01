import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Connector } from '../../../packages/mr-web-components/src/Connectors/Connector';
import { VisualRectangle } from 'mr-web-components/src/visual/VisualRectangle';
import { Vector2 } from '@my-graphics/math';

describe('Connector', () => {
  let connector: Connector;
  let hostRectangle: VisualRectangle;

  beforeEach(() => {
    // Create a host rectangle at position (100, 200)
    hostRectangle = new VisualRectangle(
      'test-rect',
      { color: '#0000ff' },
      50,
      50
    );
    hostRectangle.position = new Vector2(100, 200);

    // Create connector with relative position (0, 0) - center of host
    connector = new Connector('test-connector', hostRectangle, 0, 0);
  });

  describe('Constructor and Initial Setup', () => {
    it('should create connector with correct initial properties', () => {
      expect(connector.id).toBe('test-connector');
      expect(connector.hostObject).toBe(hostRectangle);
      expect(connector.relativePosition).toEqual({ x: 0, y: 0 });
      expect(connector.isDraggable).toBe(false);
    });

    it('should set initial position based on host position', () => {
      // Connector should be at host position + relative offset
      expect(connector.position.x).toBe(100); // host.x + relative.x (100 + 0)
      expect(connector.position.y).toBe(200); // host.y + relative.y (200 + 0)
    });

    it('should handle relative offset correctly', () => {
      const offsetConnector = new Connector('offset-connector', hostRectangle, 25, -10);
      
      expect(offsetConnector.position.x).toBe(125); // 100 + 25
      expect(offsetConnector.position.y).toBe(190); // 200 + (-10)
    });
  });

  describe('Position Updates', () => {
    it('should update position when updatePositionFromHost is called', () => {
      // Move host to new position
      hostRectangle.position = new Vector2(300, 400);
      
      // Manually call updatePositionFromHost (simulating what happens in update())
      (connector as any).updatePositionFromHost();
      
      // Connector should follow host
      expect(connector.position.x).toBe(300);
      expect(connector.position.y).toBe(400);
    });

    it('should update position when update() method is called', () => {
      // Move host to new position
      hostRectangle.position = new Vector2(150, 250);
      
      // Call update method
      connector.update();
      
      // Connector should follow host
      expect(connector.position.x).toBe(150);
      expect(connector.position.y).toBe(250);
    });

    it('should maintain relative offset when host moves', () => {
      const offsetConnector = new Connector('offset-connector', hostRectangle, 10, -5);
      
      // Move host
      hostRectangle.position = new Vector2(200, 300);
      offsetConnector.update();
      
      // Connector should maintain offset
      expect(offsetConnector.position.x).toBe(210); // 200 + 10
      expect(offsetConnector.position.y).toBe(295); // 300 + (-5)
    });
  });

  describe('Host Management', () => {
    it('should allow changing host object', () => {
      const newHost = new VisualRectangle('new-host', { color: '#ff0000' }, 30, 30);
      newHost.position = new Vector2(500, 600);
      
      connector.setHost(newHost, 5, -3);
      
      expect(connector.hostObject).toBe(newHost);
      expect(connector.relativePosition).toEqual({ x: 5, y: -3 });
      expect(connector.position.x).toBe(505); // 500 + 5
      expect(connector.position.y).toBe(597); // 600 + (-3)
    });

    it('should return correct host object', () => {
      expect(connector.getHost()).toBe(hostRectangle);
    });

    it('should handle null host gracefully', () => {
      const orphanConnector = new Connector('orphan', undefined, 0, 0);
      
      expect(orphanConnector.hostObject).toBeUndefined();
      expect(orphanConnector.position).toEqual({ x: 0, y: 0 });
      
      // Update should not crash
      orphanConnector.update();
      expect(orphanConnector.position).toEqual({ x: 0, y: 0 });
    });
  });

  describe('Integration with VisualRectangle', () => {
    it('should automatically follow when host position changes via setter', () => {
      // Add connector to host's connectors array so position setter will update it
      hostRectangle.addConnector(connector);
      
      // This tests the integration where VisualObject.position setter calls connector updates
      const initialPos = { x: connector.position.x, y: connector.position.y };
      
      // Change host position using setter (which should trigger connector update)
      hostRectangle.position = new Vector2(400, 500);
      
      // Connector should have moved (this tests that VisualObject.position setter works)
      expect(connector.position.x).toBe(400);
      expect(connector.position.y).toBe(500);
      expect(connector.position.x).not.toBe(initialPos.x);
      expect(connector.position.y).not.toBe(initialPos.y);
    });
  });
});

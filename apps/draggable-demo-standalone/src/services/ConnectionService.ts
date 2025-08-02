import { Rope, Connector } from 'mr-web-components';
import type { IVisualObject } from 'mr-abstract-components';

/**
 * Service for managing visual connections (ropes) between connectors
 * Follows Single Responsibility Principle - handles only connection logic
 */
export class ConnectionService {
  private ropes: Rope[] = [];
  private activeConnector: Connector | null = null;
  private tempRope: Rope | null = null;

  /**
   * Starts a connection from the given connector
   */
  startConnection(connector: Connector): void {
    this.activeConnector = connector;
    console.log('🔗 Starting connection from:', connector.id);
  }

  /**
   * Completes a connection to the target connector
   */
  completeConnection(targetConnector: Connector): Rope | null {
    if (!this.activeConnector || this.activeConnector === targetConnector) {
      this.cancelConnection();
      return null;
    }

    // Create a new rope between the connectors
    const rope = new Rope(
      `rope-${this.activeConnector.id}-${targetConnector.id}`,
      this.activeConnector,
      targetConnector
    );

    // Mark connectors as connected
    this.activeConnector.SetConnectedObject(targetConnector);
    targetConnector.SetConnectedObject(this.activeConnector);

    this.ropes.push(rope);
    
    console.log('✅ Connection created:', {
      from: this.activeConnector.id,
      to: targetConnector.id,
      ropeId: rope.id
    });

    this.activeConnector = null;
    return rope;
  }

  /**
   * Cancels the current connection attempt
   */
  cancelConnection(): void {
    if (this.activeConnector) {
      console.log('❌ Connection cancelled from:', this.activeConnector.id);
      this.activeConnector = null;
    }
    
    if (this.tempRope) {
      this.tempRope = null;
    }
  }

  /**
   * Removes a connection between two connectors
   */
  removeConnection(connector1: Connector, connector2: Connector): boolean {
    const ropeIndex = this.ropes.findIndex(rope => 
      (rope.startConnector === connector1 && rope.endConnector === connector2) ||
      (rope.startConnector === connector2 && rope.endConnector === connector1)
    );

    if (ropeIndex !== -1) {
      const rope = this.ropes[ropeIndex];
      
      // Disconnect the connectors
      connector1.RemoveConnectedObject();
      connector2.RemoveConnectedObject();
      
      // Remove the rope
      this.ropes.splice(ropeIndex, 1);
      
      console.log('🗑️ Connection removed:', rope.id);
      return true;
    }

    return false;
  }

  /**
   * Gets all active ropes for rendering
   */
  getAllRopes(): Rope[] {
    return [...this.ropes];
  }

  /**
   * Checks if there's an active connection attempt
   */
  hasActiveConnection(): boolean {
    return this.activeConnector !== null;
  }

  /**
   * Gets the currently active connector (if any)
   */
  getActiveConnector(): Connector | null {
    return this.activeConnector;
  }

  /**
   * Clears all connections
   */
  clearAllConnections(): void {
    // Disconnect all connectors
    this.ropes.forEach(rope => {
      if (rope.startConnector) {
        rope.startConnector.RemoveConnectedObject();
      }
      if (rope.endConnector) {
        rope.endConnector.RemoveConnectedObject();
      }
    });

    this.ropes.length = 0;
    this.activeConnector = null;
    this.tempRope = null;
    
    console.log('🧹 All connections cleared');
  }
}

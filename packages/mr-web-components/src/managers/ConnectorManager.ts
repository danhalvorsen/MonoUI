import type { IConnector } from 'mr-abstract-components';

/**
 * Manages connector operations for visual objects
 * Follows Single Responsibility Principle by handling only connector-related logic
 */
export class ConnectorManager {
  private connectors: IConnector[] = [];

  /**
   * Adds a connector to the collection
   */
  addConnector(connector: IConnector): void {
    this.connectors.push(connector);
  }

  /**
   * Removes a connector from the collection
   */
  removeConnector(connector: IConnector): void {
    const index = this.connectors.indexOf(connector);
    if (index > -1) {
      this.connectors.splice(index, 1);
    }
  }

  /**
   * Removes a connector by ID
   */
  removeConnectorById(id: string): boolean {
    const index = this.connectors.findIndex(c => c.id === id);
    if (index > -1) {
      this.connectors.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Gets all connectors
   */
  getConnectors(): readonly IConnector[] {
    return [...this.connectors];
  }

  /**
   * Finds a connector by ID
   */
  findConnectorById(id: string): IConnector | undefined {
    return this.connectors.find(c => c.id === id);
  }

  /**
   * Updates all connectors that have an update method
   * Follows DRY principle by centralizing update logic
   */
  updateAllConnectors(): void {
    this.connectors.forEach(connector => {
      if ('update' in connector && typeof connector.update === 'function') {
        (connector as any).update();
      }
    });
  }

  /**
   * Updates position for all connectors that have updatePositionFromHost method
   * Used when host object position changes
   */
  updateAllConnectorPositions(): void {
    this.connectors.forEach(connector => {
      if ('updatePositionFromHost' in connector && typeof connector.updatePositionFromHost === 'function') {
        (connector as any).updatePositionFromHost();
      }
    });
  }

  /**
   * Renders all connectors
   * Follows DRY principle by centralizing render logic
   */
  renderAllConnectors(ctx: CanvasRenderingContext2D): void {
    this.connectors.forEach(connector => {
      if ('render' in connector && typeof connector.render === 'function') {
        connector.render(ctx);
      }
    });
  }

  /**
   * Gets the count of connectors
   */
  getConnectorCount(): number {
    return this.connectors.length;
  }

  /**
   * Checks if there are any connectors
   */
  hasConnectors(): boolean {
    return this.connectors.length > 0;
  }

  /**
   * Clears all connectors
   */
  clearAllConnectors(): void {
    this.connectors.length = 0;
  }

  /**
   * Filters connectors by a predicate function
   */
  filterConnectors(predicate: (connector: IConnector) => boolean): IConnector[] {
    return this.connectors.filter(predicate);
  }

  /**
   * Gets connectors that are currently connected to other objects
   */
  getConnectedConnectors(): IConnector[] {
    return this.filterConnectors(connector => 
      'IsConnected' in connector && 
      typeof connector.IsConnected === 'function' && 
      (connector as any).IsConnected()
    );
  }

  /**
   * Gets connectors that are not connected to other objects
   */
  getUnconnectedConnectors(): IConnector[] {
    return this.filterConnectors(connector => 
      !('IsConnected' in connector) || 
      typeof connector.IsConnected !== 'function' || 
      !(connector as any).IsConnected()
    );
  }
}

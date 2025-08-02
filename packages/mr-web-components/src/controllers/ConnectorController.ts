import type { IConnectorController, IConnectorControllerConfiguration, IVisualObject, IVisualConnector } from 'mr-abstract-components';

/**
 * ConnectorController manages visual connectors and their interactions
 * Implements the IController interface for consistent controller behavior
 */
export class ConnectorController implements IConnectorController {
    configuration: IConnectorControllerConfiguration;
    visualObjects: IVisualObject[] = [];
    
    constructor(connectors: IVisualConnector[] = []) {
        this.configuration = {
            connectors: connectors
        };
    }

    /**
     * Update all connectors and managed visual objects
     * @param time - Current time in milliseconds
     * @param delta - Time elapsed since last update in milliseconds
     */
    update(time: number, delta: number): void {
        // Update all connectors
        this.configuration.connectors.forEach(connector => {
            connector.update(delta);
        });
        
        // Update all managed visual objects
        this.visualObjects.forEach(obj => {
            obj.update(delta);
        });
    }

    /**
     * Add a connector to the controller
     */
    addConnector(connector: IVisualConnector): void {
        this.configuration.connectors.push(connector);
    }

    /**
     * Remove a connector from the controller
     */
    removeConnector(connector: IVisualConnector): void {
        const index = this.configuration.connectors.indexOf(connector);
        if (index > -1) {
            this.configuration.connectors.splice(index, 1);
        }
    }

    /**
     * Get all connectors managed by this controller
     */
    getConnectors(): IVisualConnector[] {
        return this.configuration.connectors;
    }

    /**
     * Clear all connectors
     */
    clearConnectors(): void {
        this.configuration.connectors = [];
    }

    /**
     * Render all connectors
     */
    render(ctx: CanvasRenderingContext2D): void {
        this.configuration.connectors.forEach(connector => {
            connector.render(ctx);
        });
    }
}

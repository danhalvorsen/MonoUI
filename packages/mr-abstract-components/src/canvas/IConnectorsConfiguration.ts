import type { IConnectorConfiguration } from "./IConnectorConfiguration.js";

export interface IConnectorsConfiguration {
  connectors: IConnectorConfiguration[];
  maxConnectors?: number;
  allowConnections?: boolean;
  autoGenerateConnectors?: boolean;
}

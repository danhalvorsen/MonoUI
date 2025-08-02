import { IConfiguration } from "./IConfiguration.js";

export interface IConfigProvider {
  /**
   * Gets application configuration
   * @returns Promise resolving to the configuration
   */
  getConfiguration<T = IConfiguration>(): Promise<T>;
}
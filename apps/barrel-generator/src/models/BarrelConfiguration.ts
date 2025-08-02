import { IConfiguration } from "./IConfiguration.js";

export interface BarrelConfiguration extends IConfiguration {
  packagesPath: string;
  packages: string[];
  dryRun: boolean;
}
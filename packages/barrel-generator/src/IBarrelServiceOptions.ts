import { IBarrelContentOptions } from './IBarrelContentOptions.js';

export interface IBarrelServiceOptions extends IBarrelContentOptions {
    rootDir: string;
    dryRun?: boolean;
}

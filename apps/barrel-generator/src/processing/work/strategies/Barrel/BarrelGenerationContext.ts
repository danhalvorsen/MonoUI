import { IWorkContext } from "../IWorkDefinition.js";

export class BarrelGenerationWorkContext implements IWorkContext {
    constructor(
        public packagePath: string,
        public packageName: string,
        public options?: Record<string, unknown>
    ) { }
}

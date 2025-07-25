import { IPipe } from "@mr/pipeline-core";
import { IData } from "@packages/pipeline-core";
export interface GenerateBarrelData extends IData {
    context: {
        targetDir: string;
        fileCount?: number;
    };
}
export declare class GenerateBarrelPipe implements IPipe<GenerateBarrelData, GenerateBarrelData> {
    name: string;
    execute(data: GenerateBarrelData): Promise<GenerateBarrelData>;
}

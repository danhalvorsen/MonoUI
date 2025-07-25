import { BaseKey } from "./basekey";
import { Point } from "./interfaces";
export declare class WhiteKey extends BaseKey {
    readonly name: string;
    readonly leftCut: boolean;
    readonly rightCut: boolean;
    readonly fillStyle: string;
    constructor(name: string, leftCut: boolean, rightCut: boolean, fillStyle?: string);
    protected outline(): readonly Point[];
}

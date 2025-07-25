import { Pipe } from "../core/Pipe";
import { IData } from "../core/IData";
export interface CalculatorData extends IData {
    context: {
        numbers: number[];
        sum?: number;
        steps?: string[];
    };
}
export declare class SumPipe extends Pipe<CalculatorData> {
    constructor();
}
export declare class MultiplyPipe extends Pipe<CalculatorData> {
    private multiplier;
    constructor(multiplier: number);
}
export declare class SubtractPipe extends Pipe<CalculatorData> {
    private subtractor;
    constructor(subtractor: number);
}

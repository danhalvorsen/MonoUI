import { BaseKey } from './basekey';
import { Point } from './interfaces';
export declare class BlackKey extends BaseKey {
    readonly name: string;
    readonly fillStyle = "#000";
    constructor(note: 'C#' | 'D#' | 'F#' | 'G#' | 'A#');
    protected outline(): readonly Point[];
}

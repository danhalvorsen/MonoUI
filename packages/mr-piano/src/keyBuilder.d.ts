import { IKey } from './core/interfaces';
import { KeyName } from './core/keyregistry';
export declare class KeyBuilder {
    static build(name: KeyName, dx?: number, dy?: number): IKey;
}

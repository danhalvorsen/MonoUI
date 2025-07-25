import { IKeyTemplate } from './interfaces';
export declare const KeyRegistry: Record<string, IKeyTemplate>;
export type KeyName = keyof typeof KeyRegistry;

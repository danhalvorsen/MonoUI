import { Vector2 } from "@my-graphics/math";
import { IObject } from './IObject.js';

export interface IConfiguration { 
    id: string;
        name?: string;
        direction: Vector2;
        position: Vector2;
        size: Vector2;
        velocity: Vector2;
        tags?: string[];
        metadata?: Record<string, any>;
        children?: Set<IObject>[];
}

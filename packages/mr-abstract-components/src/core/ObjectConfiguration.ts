import { Point2, Vector2 } from "@my-graphics/math";
import { IConfiguration } from "./IConfiguration.js";
import { IObject } from './IObject.js';

export class ObjectConfiguration implements IConfiguration {    
    private host: IObject;      
    public constructor(object: IObject) {
        this.host = object;
        //using ts-morph to feed the IObject with configuration data
    }
    id!: string;
    name?: string | undefined;
    direction!: Vector2;
    position!: Vector2;
    size!: Vector2;
    velocity!: Vector2;
    tags?: string[] | undefined;
    metadata?: Record<string, any> | undefined;
    children?: Set<IObject>[] | undefined;
}


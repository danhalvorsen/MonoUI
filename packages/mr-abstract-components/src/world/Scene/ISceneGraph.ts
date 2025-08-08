import { IObject } from "src/index.js";

export interface ISceneGraph {
  /** Add an object to the scene */
  addObject(obj: IObject): void;

  /** Remove an object from the scene */
  removeObject(obj: IObject): void;

  /** Get all objects (for rendering or iteration) */
  getObjects(): ReadonlyArray<IObject>;

  /** Find object by its ID */
  findById(id: string): IObject | undefined;

  /** Clear the entire scene */
  clear(): void;
}

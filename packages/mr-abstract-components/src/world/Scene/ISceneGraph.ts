import { IReactiveController } from "../../controllers/IReactiveController.js";
import { INode } from "../../core/nodes/INode.js"
export interface ISceneGraph<THost> extends IReactiveController {
  addNodes(obj: INode[]): void;
  removeObject(obj: INode): void;
  getObjects(): ReadonlyArray<INode>;
  findById(id: string): INode | undefined;
  clear(): void;
}

 import { IReactiveControllerHost } from '../../controllers/ReactiveControllerHost.js';        
import { IVisualObject } from '../../core/IVisualObject.js';
import { IMouseController } from '../../controllers/reactiveControllers/mouse/IMouseController.js';

export interface ISceneHost<THost> extends IReactiveControllerHost<THost> {
  addObject(obj: IVisualObject): void;
  removeObject(obj: IVisualObject): void;
  getMouse(): IMouseController;
  start(): void;
  stop(): void;
}

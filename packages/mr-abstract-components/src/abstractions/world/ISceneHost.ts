 import { IReactiveControllerHost, IVisualObject } from 'src/index.js';        
import { IMouseReactiveController } from './IMouseReactiveController.js';

export interface ISceneHost extends IReactiveControllerHost {
  addObject(obj: IVisualObject): void;
  removeObject(obj: IVisualObject): void;
  getMouse(): IMouseReactiveController;
  start(): void;
  stop(): void;
}

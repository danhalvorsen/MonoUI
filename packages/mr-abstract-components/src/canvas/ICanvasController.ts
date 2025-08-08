import { IReactiveControllerHost } from "../controllers/ReactiveControllerHost.js"
import { IRenderType } from "../Renders/IRenderType.js"
  import { IVisualObjectConfiguration } from "../world/visualObjects/IVisualObjectConfiguration.js"
export interface ICanvasController  {
  readonly context: IRenderType;
  controllerHost: IReactiveControllerHost;
  visualConfig: IVisualObjectConfiguration;
}

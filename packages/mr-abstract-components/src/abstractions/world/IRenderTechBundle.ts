import { IReactiveController } from "../../controllers/IReactiveController.js";
import { RenderTechType } from "./IRenderTech.js";
import { IRenderType } from "./IRenderType.js";
 
export interface IRenderTechBundle {
  name: RenderTechType;
  renderType: IRenderType;
  controllers: IReactiveController[];
}

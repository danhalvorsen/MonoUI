import { RenderTechType } from "./Renders/IRenderTech.js";
import { IRenderType } from "./Renders/IRenderType.js";
import { IReactiveController } from "src/index.js";

export interface IRenderTechBundle {
  name: RenderTechType;
  renderType: IRenderType;
  controllers: IReactiveController[];
}

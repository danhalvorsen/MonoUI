import { RenderTechType } from "./IRenderTech.js";
import { IRenderType } from "./IRenderType.js";
import { IReactiveController } from "src/index.js";

export interface IRenderTechBundle {
  name: RenderTechType;
  renderType: IRenderType;
  controllers: IReactiveController[];
}

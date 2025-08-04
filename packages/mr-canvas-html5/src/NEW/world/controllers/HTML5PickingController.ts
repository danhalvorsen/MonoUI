import { IRenderTechController } from "./IRenderTechController.js";
import { IRenderType } from "./IRenderType.js";
import { IVisualObject } from "./IVisualObject.js";

export class HTML5PickingController implements IRenderTechController {
  private renderType!: IRenderType;

  attachToRenderTech(renderType: IRenderType): void {
    this.renderType = renderType;
  }

  hostConnected(): void {
    // Setup mouse events if needed
  }

  hostDisconnected(): void {
    // Cleanup
  }

  pick(x: number, y: number): IVisualObject | undefined {
    // Use the SceneGraph & renderer coordinate system
    return undefined;
  }
}

 
import { SceneHost } from "../scene/SceneHost.js";
import { IRenderTechBundle } from "../render/rendering/IRenderTechBundle.js";
import { RenderTechType } from "../render/rendering/IRenderTech.js";
import { IReactiveController } from "../../controllers/IReactiveController.js";

export class RenderManagerReactiveController implements IReactiveController {
  private bundles = new Map<RenderTechType, IRenderTechBundle>();
  private sceneHost?: SceneHost;
  private active?: RenderTechType;

  attachHost(scene: SceneHost): void {
    this.sceneHost = scene;
  }

  hostConnected(): void {
    // Auto-select first registered backend if none active
    if (!this.active && this.bundles.size > 0) {
      const first = this.bundles.keys().next().value as RenderTechType;
      this.switchTo(first);
    }
  }

  hostDisconnected(): void {
    // Cleanup if needed
  }

  register(bundle: IRenderTechBundle): void {
    this.bundles.set(bundle.name, bundle);
  }

  switchTo(name: RenderTechType): void {
    const bundle = this.bundles.get(name);
    if (!bundle) throw new Error(`RenderTech '${name}' not registered`);
    if (!this.sceneHost) throw new Error("SceneHost is not attached");
    this.sceneHost.replaceRenderTech(bundle);
    this.active = name;
    this.onTechChanged?.(name);
  }

  getActive(): RenderTechType | undefined {
    return this.active;
  }

  getAvailable(): RenderTechType[] {
    return Array.from(this.bundles.keys());
  }

  /** Optional event hook */
  onTechChanged?: (newTech: RenderTechType) => void;
}

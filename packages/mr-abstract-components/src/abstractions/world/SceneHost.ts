import "reflect-metadata";
import { injectable, inject, injectAll } from "tsyringe";
import { IRenderType } from "./IRenderType.js";
import {IVisualObject} from '../IVisualObject.js'
import { IReactiveController } from "../../controllers/IReactiveController.js";
import {ISceneGraph} from './ISceneGraph.js'
import {IRenderTechBundle} from './IRenderTechBundle.js'
import { ReactiveControllerBase } from "./ReactiveControllerBase.js";

export type SceneHostEvents = {
  "render-tech-changed": { tech: string };
};

@injectable()
export class SceneHost extends ReactiveControllerBase {
  constructor(
    @inject("RenderType") public renderType: IRenderType,
    @inject("SceneGraph") public graph: ISceneGraph,
    @injectAll("Controllers") private injectedControllers: IReactiveController[]
  ) {
    super([]);
    for (const c of injectedControllers) this.addController(c);
    this.renderType.initialize();
    this.bindRenderTechControllers();
  }

  private listeners: {
    [K in keyof SceneHostEvents]?: Array<(data: SceneHostEvents[K]) => void>;
  } = {};

  /** Bind controllers that need to attach to the RenderTech */
  private bindRenderTechControllers(): void {
    for (const controller of this.getControllers()) {
      if ("attachToRenderTech" in controller) {
        (controller as any).attachToRenderTech(this.renderType);
      }
    }
  }

  /** Replace the current render tech with a new one */
  replaceRenderTech(bundle: IRenderTechBundle): void {
    this.renderType = bundle.renderType;
    this.renderType.initialize();

    for (const c of this.getControllers()) this.removeController(c);
    for (const c of bundle.controllers) this.addController(c);

    this.bindRenderTechControllers();
    this.emit("render-tech-changed", { tech: bundle.name });
  }

  /** Emit custom events */
  emit<K extends keyof SceneHostEvents>(
    event: K,
    data: SceneHostEvents[K]
  ): void {
    if (this.listeners[event]) {
      for (const listener of this.listeners[event]!) listener(data);
    }
  }

  /** Subscribe to events */
  on<K extends keyof SceneHostEvents>(
    event: K,
    listener: (data: SceneHostEvents[K]) => void
  ): void {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(listener);
  }

  /** Rendering update loop */
  protected performUpdate(): void {
    this.renderType.clear();
    for (const obj of this.graph.getObjects()) {
      if ("configuration" in obj) {
        // type guard
        const visual = obj as IVisualObject;
        visual.update(0);
        this.renderType.renderObject(visual);
      }
    }
  }
}

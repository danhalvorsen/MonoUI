import { IReactiveController } from "../../controllers/IReactiveController.js";
import { Vector2, Vector3 } from "@my-graphics/math";
export interface ICamera extends IReactiveController {
  getPosition(): Vector2 | Vector3;
  setPosition(position: Vector2 | Vector3): void;
  getTarget(): Vector2 | Vector3;
  setTarget(target: Vector2 | Vector3): void;
  getZoomOrFov(): number;
  setZoomOrFov(zoomOrFov: number): void;
  getNear(): number;
  setNear(near: number): void;
  getFar(): number;
  setFar(far: number): void;
  getUp(): Vector3;
  setUp(up: Vector3): void;
  getProjection(): 'orthographic' | 'perspective' | 'none';
  setProjection(projection: 'orthographic' | 'perspective' | 'none'): void;
  getViewport(): Vector2;
  setViewport(viewport: Vector2): void;
  getControls(): { allowPan?: boolean; allowZoom?: boolean; allowRotate?: boolean };
  setControls(controls: { allowPan?: boolean; allowZoom?: boolean; allowRotate?: boolean }): void;
}

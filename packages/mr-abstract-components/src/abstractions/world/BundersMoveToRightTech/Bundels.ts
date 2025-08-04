// import { IReactiveController } from "src/controllers/IReactiveController.js";
// import { RenderTechType } from "../IRenderTech.js";
// import { IRenderTechBundle } from "../IRenderTechBundle.js";
// import { IRenderType } from "../IRenderType.js";

// export class HTML5RenderTechBundle implements IRenderTechBundle {
//   name: RenderTechType = "HTML5";
//   renderType: IRenderType;
//   controllers: IReactiveController[];

//   constructor(canvas: HTMLCanvasElement) {
//     this.renderType = new HTML5RenderType(canvas);
//     this.controllers = [new HTML5PickingController(canvas, this.renderType)];
//   }
// }

// // ThreeJS
// export class ThreeJSRenderTechBundle implements IRenderTechBundle {
//   name: RenderTechType = "THREEJS";
//   renderType: IRenderType;
//   controllers: IReactiveController[];

//   constructor(canvas: HTMLCanvasElement, camera: THREE.Camera) {
//     this.renderType = new ThreeJSRenderType(canvas, camera);
//     this.controllers = [new ThreeJSPickingController(canvas, camera, this.renderType)];
//   }
// }

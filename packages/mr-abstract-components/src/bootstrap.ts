// packages/mr-abstract-components/src/bootstrap.ts
import "reflect-metadata";
import { container } from "tsyringe";

// This is where we can register default dependencies for tests
// Example:
// import { HTML5RenderType } from "./render/html5/HTML5RenderType.js";
// import { DefaultSceneGraph } from "./world/DefaultSceneGraph.js";
// container.register("RenderType", { useClass: HTML5RenderType });
// container.register("SceneGraph", { useClass: DefaultSceneGraph });

export { container };

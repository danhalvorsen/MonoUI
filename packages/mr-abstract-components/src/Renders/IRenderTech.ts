export interface RenderTechRegistry {
  HTML5: any;
  THREEJS: any;
  SVG: any;
}

// RenderTechType is now the keys of the registry
export type RenderTechType = keyof RenderTechRegistry;
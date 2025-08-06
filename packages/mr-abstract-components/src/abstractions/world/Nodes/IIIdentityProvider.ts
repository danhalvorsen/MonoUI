// Keeping VisualNode simple for base SceneGraph usage

import { IMatrix} from "@my-graphics/math";  

export interface IIdentityProvider {
  createIdentityMatrix(size: number): IMatrix  ;
}


// Keeping VisualNode simple for base SceneGraph usage
import { IMatrix, Matrix4, Matrix3 } from "@my-graphics/math";
import { IIdentityProvider } from "./IIIdentityProvider.js";
 
export class IdentityClass implements IIdentityProvider {
  /** Cached 3x3 identity matrix for reuse */
  private static matrix3Identity: IMatrix = Matrix3.identity();

  createIdentityMatrix(size: number): IMatrix {
    if (size === 3) {
      return IdentityClass.matrix3Identity.clone();
    }
    if (size === 4) {
      return Matrix4.identity(4);
    }
    const flat = new Float32Array(size * size);
    for (let i = 0; i < size; i++) {
      flat[i * size + i] = 1;
    }
    // Use Matrix4 as a generic matrix creator for dynamic sizes
    return Matrix4.fromFlatData(flat, size);
  }
}
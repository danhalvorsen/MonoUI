import type { IPoint, ICoordinateSystem } from '../../Helpers/IMapCoordinateSystem.js';
import { Matrix, ImplTransform as Transform, Vector2 } from '@my-graphics/math';

// Screen system (top-left origin, y-down) with matrix-based transformation
export class MapScreenCoordinateSystem implements ICoordinateSystem<IPoint> {
  private screenToCanonicalTransform!: Transform;
  private canonicalToScreenTransform!: Transform;

  constructor(private width: number, private height: number, private scale = 1) {
    this.updateTransforms();
  }

  private updateTransforms(): void {
    // Screen to Canonical: translate to center and flip Y
    this.screenToCanonicalTransform = new Transform()
      .translate(new Vector2(-this.width / 2, -this.height / 2))  // Move origin to center
      .scale(1, -1);  // Flip Y axis only

    // Canonical to Screen: inverse transformation (flip Y back and translate)
    this.canonicalToScreenTransform = new Transform()
      .scale(1, -1)  // Flip Y back
      .translate(new Vector2(this.width / 2, this.height / 2));   // Move origin back to top-left
  }

  toCanonical(screen: IPoint): IPoint {
    const screenVec = new Vector2(screen.x, screen.y);
    const canonicalVec = this.screenToCanonicalTransform.transformVec2(screenVec);
    
    console.log('🔄 SCREEN TO CANONICAL:', {
      input: screen,
      output: { x: canonicalVec.x, y: canonicalVec.y },
      canvasSize: { width: this.width, height: this.height },
      scale: this.scale
    });
    
    return { x: canonicalVec.x, y: canonicalVec.y };
  }

  fromCanonical(canonical: IPoint): IPoint {
    const canonicalVec = new Vector2(canonical.x, canonical.y);
    const screenVec = this.canonicalToScreenTransform.transformVec2(canonicalVec);
    
    return { x: screenVec.x, y: screenVec.y };
  }

  updateDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.updateTransforms();  // Recalculate transforms when dimensions change
  }
}

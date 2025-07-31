import { Vector2 } from '@my-graphics/math';
import { 
  CoordinateMapper, 
  IScreenCoordinates, 
  ICartesianCoordinates, 
  ISphericalCoordinates,
  CoordinateFactory 
} from './CoordinateMapper.js';

/**
 * Collection of pre-built coordinate mappers for common transformations
 * Follows Factory Pattern for creating standard mappers
 */
export class CoordinateMappers {
  
  /**
   * Creates a mapper between screen coordinates and Cartesian coordinates
   */
  static createScreenToCartesian(canvasWidth: number, canvasHeight: number): CoordinateMapper<IScreenCoordinates, ICartesianCoordinates> {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    return CoordinateMapper.createBidirectional(
      // Screen to Cartesian
      (screen: IScreenCoordinates) => CoordinateFactory.cartesian(
        screen.x - centerX,        // Translate origin to center
        centerY - screen.y         // Flip Y axis (+Y up in Cartesian)
      ),
      // Cartesian to Screen
      (cartesian: ICartesianCoordinates) => CoordinateFactory.screen(
        cartesian.x + centerX,     // Translate origin to top-left
        centerY - cartesian.y      // Flip Y axis (+Y down in screen)
      ),
      `Screen(${canvasWidth}x${canvasHeight}) <-> Cartesian`
    );
  }

  /**
   * Creates a mapper between Cartesian coordinates and spherical coordinates
   */
  static createCartesianToSpherical(): CoordinateMapper<ICartesianCoordinates, ISphericalCoordinates> {
    return CoordinateMapper.createBidirectional(
      // Cartesian to Spherical
      (cartesian: ICartesianCoordinates) => {
        const radius = Math.sqrt(cartesian.x * cartesian.x + cartesian.y * cartesian.y);
        const azimuth = Math.atan2(cartesian.y, cartesian.x);
        return CoordinateFactory.spherical(radius, azimuth, 0); // 2D, so elevation = 0
      },
      // Spherical to Cartesian
      (spherical: ISphericalCoordinates) => CoordinateFactory.cartesian(
        spherical.radius * Math.cos(spherical.azimuth),
        spherical.radius * Math.sin(spherical.azimuth)
      ),
      'Cartesian <-> Spherical'
    );
  }

  /**
   * Creates a mapper that applies scaling to coordinates
   */
  static createScaling(scaleX: number, scaleY: number): CoordinateMapper<ICartesianCoordinates, ICartesianCoordinates> {
    return CoordinateMapper.createBidirectional(
      // Apply scaling
      (coords: ICartesianCoordinates) => CoordinateFactory.cartesian(
        coords.x * scaleX,
        coords.y * scaleY
      ),
      // Remove scaling
      (coords: ICartesianCoordinates) => CoordinateFactory.cartesian(
        coords.x / scaleX,
        coords.y / scaleY
      ),
      `Scale(${scaleX}, ${scaleY})`
    );
  }

  /**
   * Creates a mapper that applies rotation to coordinates
   */
  static createRotation(angleRadians: number): CoordinateMapper<ICartesianCoordinates, ICartesianCoordinates> {
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);

    return CoordinateMapper.createBidirectional(
      // Apply rotation
      (coords: ICartesianCoordinates) => CoordinateFactory.cartesian(
        coords.x * cos - coords.y * sin,
        coords.x * sin + coords.y * cos
      ),
      // Remove rotation (rotate by -angle)
      (coords: ICartesianCoordinates) => CoordinateFactory.cartesian(
        coords.x * cos + coords.y * sin,
        -coords.x * sin + coords.y * cos
      ),
      `Rotate(${angleRadians} rad)`
    );
  }

  /**
   * Creates a mapper that applies translation to coordinates
   */
  static createTranslation(offsetX: number, offsetY: number): CoordinateMapper<ICartesianCoordinates, ICartesianCoordinates> {
    return CoordinateMapper.createBidirectional(
      // Apply translation
      (coords: ICartesianCoordinates) => CoordinateFactory.cartesian(
        coords.x + offsetX,
        coords.y + offsetY
      ),
      // Remove translation
      (coords: ICartesianCoordinates) => CoordinateFactory.cartesian(
        coords.x - offsetX,
        coords.y - offsetY
      ),
      `Translate(${offsetX}, ${offsetY})`
    );
  }

  /**
   * Creates a composite mapper that applies multiple transformations in sequence
   */
  static createComposite(...mappers: CoordinateMapper<any, any>[]): CoordinateMapper<any, any> {
    if (mappers.length === 0) {
      throw new Error('At least one mapper is required for composite mapping');
    }
    
    if (mappers.length === 1) {
      return mappers[0];
    }

    // Chain all mappers together
    return mappers.reduce((composite, mapper) => composite.chain(mapper));
  }

  /**
   * Creates a mapper for viewport transformations (useful for zooming/panning)
   */
  static createViewport(
    viewportX: number, 
    viewportY: number, 
    viewportWidth: number, 
    viewportHeight: number,
    worldMinX: number,
    worldMinY: number,
    worldMaxX: number,
    worldMaxY: number
  ): CoordinateMapper<IScreenCoordinates, ICartesianCoordinates> {
    const worldWidth = worldMaxX - worldMinX;
    const worldHeight = worldMaxY - worldMinY;

    return CoordinateMapper.createBidirectional(
      // Screen to World
      (screen: IScreenCoordinates) => {
        const normalizedX = (screen.x - viewportX) / viewportWidth;
        const normalizedY = (screen.y - viewportY) / viewportHeight;
        return CoordinateFactory.cartesian(
          worldMinX + normalizedX * worldWidth,
          worldMaxY - normalizedY * worldHeight // Flip Y for world coordinates
        );
      },
      // World to Screen
      (world: ICartesianCoordinates) => {
        const normalizedX = (world.x - worldMinX) / worldWidth;
        const normalizedY = (worldMaxY - world.y) / worldHeight; // Flip Y from world coordinates
        return CoordinateFactory.screen(
          viewportX + normalizedX * viewportWidth,
          viewportY + normalizedY * viewportHeight
        );
      },
      `Viewport(${viewportX},${viewportY},${viewportWidth}x${viewportHeight}) <-> World(${worldMinX},${worldMinY} to ${worldMaxX},${worldMaxY})`
    );
  }
}

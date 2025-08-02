import { Vector2 } from '@my-graphics/math';
import { 
  CoordinateMapper, 
  IScreenCoordinates, 
  ICartesianCoordinates,
  CoordinateFactory 
} from '../mapping/CoordinateMapper.js';
import { CoordinateMappers } from '../mapping/CoordinateMappers.js';

/**
 * Service that manages coordinate mappings for the canvas application
 * Follows Single Responsibility Principle - only handles coordinate mapping
 * Replaces the previous CoordinateSystemService with a more flexible mapping approach
 */
export class MapBetweenCoordinateSystemService {
  private screenToCartesianMapper: CoordinateMapper<IScreenCoordinates, ICartesianCoordinates>;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.screenToCartesianMapper = CoordinateMappers.createScreenToCartesian(canvasWidth, canvasHeight);
  }

  /**
   * Updates the canvas size and recreates the mapper
   */
  updateCanvasSize(width: number, height: number): void {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.screenToCartesianMapper = CoordinateMappers.createScreenToCartesian(width, height);
  }

  /**
   * Maps screen coordinates to Cartesian coordinates
   */
  screenToCartesian(screenPoint: Vector2): Vector2 {
    const screenCoords = CoordinateFactory.screen(screenPoint.x, screenPoint.y);
    const cartesianCoords = this.screenToCartesianMapper.mapTo(screenCoords);
    return new Vector2(cartesianCoords.x, cartesianCoords.y);
  }

  /**
   * Maps Cartesian coordinates to screen coordinates
   */
  cartesianToScreen(cartesianPoint: Vector2): Vector2 {
    const cartesianCoords = CoordinateFactory.cartesian(cartesianPoint.x, cartesianPoint.y);
    const screenCoords = this.screenToCartesianMapper.mapFrom(cartesianCoords);
    return new Vector2(screenCoords.x, screenCoords.y);
  }

  /**
   * Gets the center point in screen coordinates
   */
  getCenter(): Vector2 {
    return new Vector2(this.canvasWidth / 2, this.canvasHeight / 2);
  }

  /**
   * Gets the canvas bounds in Cartesian coordinates
   */
  getCartesianBounds(): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    const halfWidth = this.canvasWidth / 2;
    const halfHeight = this.canvasHeight / 2;
    
    return {
      minX: -halfWidth,
      maxX: halfWidth,
      minY: -halfHeight,
      maxY: halfHeight
    };
  }

  /**
   * Checks if a Cartesian coordinate is within the canvas bounds
   */
  isWithinBounds(cartesian: Vector2): boolean {
    const bounds = this.getCartesianBounds();
    return (
      cartesian.x >= bounds.minX &&
      cartesian.x <= bounds.maxX &&
      cartesian.y >= bounds.minY &&
      cartesian.y <= bounds.maxY
    );
  }

  /**
   * Clamps a Cartesian coordinate to stay within canvas bounds
   */
  clampToBounds(cartesian: Vector2): Vector2 {
    const bounds = this.getCartesianBounds();
    return new Vector2(
      Math.max(bounds.minX, Math.min(bounds.maxX, cartesian.x)),
      Math.max(bounds.minY, Math.min(bounds.maxY, cartesian.y))
    );
  }

  /**
   * Gets the current canvas dimensions
   */
  getCanvasDimensions(): { width: number; height: number } {
    return {
      width: this.canvasWidth,
      height: this.canvasHeight
    };
  }

  /**
   * Gets the underlying screen-to-Cartesian mapper (for advanced usage)
   */
  getScreenToCartesianMapper(): CoordinateMapper<IScreenCoordinates, ICartesianCoordinates> {
    return this.screenToCartesianMapper;
  }

  /**
   * Creates a custom mapper for specific transformations
   */
  createCustomMapper<TSource, TTarget>(
    mapToFunction: (source: TSource) => TTarget,
    mapFromFunction: (target: TTarget) => TSource,
    description: string
  ): CoordinateMapper<TSource, TTarget> {
    return new CoordinateMapper(mapToFunction, mapFromFunction, description);
  }

  /**
   * Creates a viewport mapper for zooming/panning functionality
   */
  createViewportMapper(
    viewportX: number,
    viewportY: number, 
    viewportWidth: number,
    viewportHeight: number,
    worldMinX: number,
    worldMinY: number,
    worldMaxX: number,
    worldMaxY: number
  ): CoordinateMapper<IScreenCoordinates, ICartesianCoordinates> {
    return CoordinateMappers.createViewport(
      viewportX, viewportY, viewportWidth, viewportHeight,
      worldMinX, worldMinY, worldMaxX, worldMaxY
    );
  }

  /**
   * Creates a scaling mapper
   */
  createScalingMapper(scaleX: number, scaleY: number): CoordinateMapper<ICartesianCoordinates, ICartesianCoordinates> {
    return CoordinateMappers.createScaling(scaleX, scaleY);
  }

  /**
   * Creates a rotation mapper
   */
  createRotationMapper(angleRadians: number): CoordinateMapper<ICartesianCoordinates, ICartesianCoordinates> {
    return CoordinateMappers.createRotation(angleRadians);
  }

  /**
   * Creates a translation mapper
   */
  createTranslationMapper(offsetX: number, offsetY: number): CoordinateMapper<ICartesianCoordinates, ICartesianCoordinates> {
    return CoordinateMappers.createTranslation(offsetX, offsetY);
  }
}

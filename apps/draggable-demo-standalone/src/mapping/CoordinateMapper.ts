import { Vector2 } from '@my-graphics/math';

/**
 * Generic interface for coordinate system mappings
 * Follows Open/Closed Principle - easy to extend with new coordinate systems
 */
export interface ICoordinateMapper<TSource, TTarget> {
  /**
   * Maps from source coordinate system to target coordinate system
   */
  mapTo(source: TSource): TTarget;
  
  /**
   * Maps from target coordinate system back to source coordinate system
   */
  mapFrom(target: TTarget): TSource;
  
  /**
   * Gets a description of this mapping
   */
  getDescription(): string;
}

/**
 * Represents a 2D point in any coordinate system
 */
export interface IPoint2D {
  x: number;
  y: number;
}

/**
 * Represents spherical coordinates (radius, azimuth, elevation)
 */
export interface ISphericalCoordinates {
  radius: number;    // Distance from origin
  azimuth: number;   // Horizontal angle (radians)
  elevation: number; // Vertical angle (radians)
}

/**
 * Screen coordinates (pixels from top-left)
 */
export interface IScreenCoordinates extends IPoint2D {
  readonly type: 'screen';
}

/**
 * Cartesian coordinates (origin at center, +Y up)
 */
export interface ICartesianCoordinates extends IPoint2D {
  readonly type: 'cartesian';
}

/**
 * Factory for creating coordinate points
 */
export class CoordinateFactory {
  static screen(x: number, y: number): IScreenCoordinates {
    return { x, y, type: 'screen' };
  }
  
  static cartesian(x: number, y: number): ICartesianCoordinates {
    return { x, y, type: 'cartesian' };
  }
  
  static spherical(radius: number, azimuth: number, elevation: number): ISphericalCoordinates {
    return { radius, azimuth, elevation };
  }
}

/**
 * Generic coordinate mapper that can be configured for different transformations
 * Follows Strategy Pattern for different mapping algorithms
 */
export class CoordinateMapper<TSource, TTarget> implements ICoordinateMapper<TSource, TTarget> {
  private mapToFunction: (source: TSource) => TTarget;
  private mapFromFunction: (target: TTarget) => TSource;
  private description: string;

  constructor(
    mapToFunction: (source: TSource) => TTarget,
    mapFromFunction: (target: TTarget) => TSource,
    description: string
  ) {
    this.mapToFunction = mapToFunction;
    this.mapFromFunction = mapFromFunction;
    this.description = description;
  }

  mapTo(source: TSource): TTarget {
    return this.mapToFunction(source);
  }

  mapFrom(target: TTarget): TSource {
    return this.mapFromFunction(target);
  }

  getDescription(): string {
    return this.description;
  }

  /**
   * Creates a bidirectional mapper (can map both ways)
   */
  static createBidirectional<T1, T2>(
    forwardMap: (from: T1) => T2,
    reverseMap: (from: T2) => T1,
    description: string
  ): CoordinateMapper<T1, T2> {
    return new CoordinateMapper(forwardMap, reverseMap, description);
  }

  /**
   * Chains two mappers together (A -> B -> C)
   */
  chain<TNext>(nextMapper: ICoordinateMapper<TTarget, TNext>): CoordinateMapper<TSource, TNext> {
    return new CoordinateMapper(
      (source: TSource) => nextMapper.mapTo(this.mapTo(source)),
      (final: TNext) => this.mapFrom(nextMapper.mapFrom(final)),
      `${this.description} -> ${nextMapper.getDescription()}`
    );
  }
}

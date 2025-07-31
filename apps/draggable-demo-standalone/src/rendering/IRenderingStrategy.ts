/**
 * Interface for rendering strategies
 * Follows Open/Closed Principle - open for extension, closed for modification
 */
export interface IRenderingStrategy<T> {
  /**
   * Renders an object using the specific strategy
   */
  render(ctx: CanvasRenderingContext2D, object: T): void;

  /**
   * Checks if this strategy can handle the given object type
   */
  canRender(object: unknown): object is T;

  /**
   * Gets the priority of this strategy (higher numbers = higher priority)
   * Used when multiple strategies can handle the same object
   */
  getPriority(): number;
}

/**
 * Base class for rendering strategies
 * Provides common functionality and enforces the interface
 */
export abstract class BaseRenderingStrategy<T> implements IRenderingStrategy<T> {
  constructor(protected priority: number = 0) {}

  abstract render(ctx: CanvasRenderingContext2D, object: T): void;
  abstract canRender(object: unknown): object is T;

  getPriority(): number {
    return this.priority;
  }
}

/**
 * Manages multiple rendering strategies
 * Follows Strategy Pattern and Single Responsibility Principle
 */
export class RenderingStrategyManager {
  private strategies: IRenderingStrategy<any>[] = [];

  /**
   * Registers a new rendering strategy
   */
  registerStrategy<T>(strategy: IRenderingStrategy<T>): void {
    this.strategies.push(strategy);
    // Sort by priority (highest first)
    this.strategies.sort((a, b) => b.getPriority() - a.getPriority());
  }

  /**
   * Removes a rendering strategy
   */
  removeStrategy<T>(strategy: IRenderingStrategy<T>): void {
    const index = this.strategies.indexOf(strategy);
    if (index > -1) {
      this.strategies.splice(index, 1);
    }
  }

  /**
   * Renders an object using the appropriate strategy
   * Returns true if a strategy was found and used, false otherwise
   */
  renderObject(ctx: CanvasRenderingContext2D, object: unknown): boolean {
    for (const strategy of this.strategies) {
      if (strategy.canRender(object)) {
        strategy.render(ctx, object);
        return true;
      }
    }
    return false;
  }

  /**
   * Renders multiple objects
   */
  renderObjects(ctx: CanvasRenderingContext2D, objects: unknown[]): void {
    objects.forEach(obj => this.renderObject(ctx, obj));
  }

  /**
   * Gets all registered strategies
   */
  getStrategies(): readonly IRenderingStrategy<any>[] {
    return [...this.strategies];
  }

  /**
   * Finds strategies that can handle a specific object type
   */
  findStrategiesForObject(object: unknown): IRenderingStrategy<any>[] {
    return this.strategies.filter(strategy => strategy.canRender(object));
  }
}

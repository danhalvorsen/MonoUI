/**
 * Interface defining the Result pattern contract
 */
export interface IResult<T> {
  /** Indicates if the operation was successful */
  readonly isSuccess: boolean;
  
  /** Contains the result value when operation is successful */
  readonly value?: T;
  
  /** Contains error messages when operation fails */
  readonly errors?: string[];
  
  /**
   * Transforms the result value using the provided function
   * @param fn Function to transform the value
   */
  map<U>(fn: (value: T) => U): IResult<U>;
  
  /**
   * Transforms the result value using a function that returns another Result
   * @param fn Function to transform the value to another Result
   */
  flatMap<U>(fn: (value: T) => IResult<U>): IResult<U>;
}

/**
 * Interface for the Result factory methods
 */
export interface IResultFactory {
  /**
   * Creates a successful result with the provided value
   * @param value The success value
   */
  ok<T>(value: T): IResult<T>;
  
  /**
   * Creates a failed result with the provided error(s)
   * @param errors Error message(s)
   */
  fail<T = never>(errors: string | string[]): IResult<T>;
  
  /**
   * Combines multiple results into a single result
   * @param results Array of results to combine
   */
  combine(results: IResult<any>[]): IResult<void>;
}

export class Result<T> implements IResult<T> {
  private constructor(
    public readonly isSuccess: boolean,
    public readonly value?: T,
    public readonly errors?: string[]
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  static fail<T = never>(errors: string | string[]): Result<T> {
    return new Result<T>(false, undefined, Array.isArray(errors) ? errors : [errors]);
  }

  map<U>(fn: (value: T) => U): Result<U> {
    if (!this.isSuccess || this.value === undefined) return Result.fail<U>(this.errors ?? ['No value']);
    try {
      return Result.ok(fn(this.value));
    } catch (e) {
      return Result.fail<U>(String(e));
    }
  }

  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (!this.isSuccess || this.value === undefined) return Result.fail<U>(this.errors ?? ['No value']);
    try {
      return fn(this.value);
    } catch (e) {
      return Result.fail<U>(String(e));
    }
  }

  static combine(results: Result<any>[]): Result<void> {
    const errors = results.filter(r => !r.isSuccess).flatMap(r => r.errors ?? []);
    return errors.length ? Result.fail(errors) : Result.ok(undefined);
  }
}

/**
 * Factory object that implements IResultFactory
 */
export const ResultFactory: IResultFactory = {
  ok: Result.ok,
  fail: Result.fail,
  combine: Result.combine
};
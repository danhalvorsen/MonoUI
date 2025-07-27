export class Result<T> {
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

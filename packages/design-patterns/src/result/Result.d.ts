export declare class Result<T> {
    readonly isSuccess: boolean;
    readonly value?: T | undefined;
    readonly errors?: string[] | undefined;
    private constructor();
    static ok<T>(value: T): Result<T>;
    static fail<T = never>(errors: string | string[]): Result<T>;
    map<U>(fn: (value: T) => U): Result<U>;
    flatMap<U>(fn: (value: T) => Result<U>): Result<U>;
    static combine(results: Result<any>[]): Result<void>;
}

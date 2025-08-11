import { Observable, TimeoutError } from "rxjs";
export declare function waitForRx<T>(src: Observable<T>, pred: (v: T) => boolean, ms?: number): Promise<T>;
export { TimeoutError };

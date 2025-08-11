import { firstValueFrom, Observable, TimeoutError } from "rxjs";
import { filter, timeout } from "rxjs/operators";

export function waitForRx<T>(src: Observable<T>, pred: (v: T) => boolean, ms = 1000) {
  return firstValueFrom(src.pipe(filter(pred), timeout({ first: ms })));
}
export { TimeoutError };

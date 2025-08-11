import type { IObserver, IObservable, ISubject, ISubscription } from "mr-event-base";
import { Observable as RxObservable, Subject as RxSubject, Subscription as RxSubscription } from "rxjs";

class RxSubAdapter implements ISubscription {
  constructor(private sub: RxSubscription) {}
  get closed() { return this.sub.closed; }
  unsubscribe() { this.sub.unsubscribe(); }
}

class RxObsAdapter<T> implements IObservable<T> {
  constructor(private source: RxObservable<T>) {}
  subscribe(arg: IObserver<T> | ((v: T) => void)): ISubscription {
    const rxSub = typeof arg === "function"
      ? this.source.subscribe(arg)
      : this.source.subscribe({
          next: v => arg.next(v),
          complete: () => arg.complete?.()
        });
    return new RxSubAdapter(rxSub);
  }
}

export class RxSubjectAdapter<T> implements ISubject<T> {
  private inner = new RxSubject<T>();
  subscribe(arg: IObserver<T> | ((v: T) => void)) {
    return new RxObsAdapter(this.inner.asObservable()).subscribe(arg);
  }
  next(v: T) { this.inner.next(v); }
  complete() { this.inner.complete(); }
}

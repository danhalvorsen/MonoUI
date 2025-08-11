export type EventMap = Record<string | symbol, unknown>;
export type EventEnvelope<E extends EventMap, K extends keyof E> = {
    type: K;
    payload: E[K];
};
export type Handler<E extends EventMap, K extends keyof E> = (value: E[K]) => void;
export interface ISubscription {
    readonly closed: boolean;
    unsubscribe(): void;
}
export interface IObserver<T> {
    next(value: T): void;
    complete?(): void;
}
export interface IObservable<T> {
    subscribe(observer: IObserver<T>): ISubscription;
    subscribe(next: (value: T) => void): ISubscription;
}
export interface ISubject<T> extends IObservable<T>, IObserver<T> {
}

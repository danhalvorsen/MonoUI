import type { EventEnvelope, EventMap, Handler, IObservable, ISubject, ISubscription } from "./EventSystemTypes.js";
import type { IEventSystem } from "./IEventSystem.js";
export declare abstract class EventSystemBase<E extends EventMap> implements IEventSystem<E> {
    private _completed;
    protected abstract subjectOf<K extends keyof E>(event: K): ISubject<E[K]>;
    protected abstract envelopeBus(): ISubject<EventEnvelope<E, keyof E>>;
    protected abstract onComplete(): void;
    protected get isCompleted(): boolean;
    observe<K extends keyof E>(event: K): IObservable<E[K]>;
    events$(): IObservable<EventEnvelope<E, keyof E>>;
    on<K extends keyof E>(event: K, handler: Handler<E, K>): ISubscription;
    once<K extends keyof E>(event: K, handler: Handler<E, K>): ISubscription;
    emit<K extends keyof E>(event: K, payload: E[K]): void;
    complete(): void;
}

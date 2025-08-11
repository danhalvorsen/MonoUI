// Base/ReactiveBase/src/core/IEventSystem.ts
import type { EventEnvelope, EventMap, Handler } from "./EventSystemTypes.js";
import type { IObservable, ISubscription } from "./EventSystemTypes.js";

export interface IEventSystem<E extends EventMap> {
  // Reactive access
  observe<K extends keyof E>(event: K): IObservable<E[K]>;
  events$(): IObservable<EventEnvelope<E, keyof E>>;

  // Imperative helpers
  on<K extends keyof E>(event: K, handler: Handler<E, K>): ISubscription;
  once<K extends keyof E>(event: K, handler: Handler<E, K>): ISubscription;
  emit<K extends keyof E>(event: K, payload: E[K]): void;

  // Lifecycle
  complete(): void;
}
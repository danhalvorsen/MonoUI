// src/controllers/EventBusController.ts
import { AppEvents } from "../events/AppEvents.js";
import type { IReactiveController } from "./IReactiveController.js";
import type { IReactiveControllerHost } from "./ReactiveControllerHost.js";
import type { EventEnvelope, IObservable } from "mr-event-base";
import { RxJSEventSystemBase } from "mr-event-rxjs";
 export class EventBusController implements IReactiveController {
  readonly bus: RxJSEventSystemBase<AppEvents>;
  constructor(private host: IReactiveControllerHost<any>, bus?: RxJSEventSystemBase<AppEvents>) {
    this.bus = bus ?? new RxJSEventSystemBase<AppEvents>();
    this.host.addController(this);
  }
  hostConnected(): void { this.bus.emit("host:connected", undefined as any); }
  hostDisconnected(): void { this.bus.emit("host:disconnected", undefined as any); this.bus.complete(); }
  hostUpdate(): void { this.bus.emit("host:update", undefined as any); }
  hostUpdated?(): void {}

  on<K extends keyof AppEvents>(t: K, h: (p: AppEvents[K]) => void) { return this.bus.on(t, h); }
  once<K extends keyof AppEvents>(t: K, h: (p: AppEvents[K]) => void) { return this.bus.once(t, h); }
  emit<K extends keyof AppEvents>(t: K, p: AppEvents[K]) { this.bus.emit(t, p); this.host.requestUpdate(); }
  events$(): IObservable<EventEnvelope<AppEvents, keyof AppEvents>> { return this.bus.events$(); }
  complete() { this.bus.complete(); }
}

import type { EventEnvelope, EventMap, ISubject } from "mr-event-base";
import { EventSystemBase } from "mr-event-base";
import { RxSubjectAdapter } from "./RxAdapters.js";

export class RxJSEventSystemBase<E extends EventMap> extends EventSystemBase<E> {
  private channels = new Map<keyof E, ISubject<unknown>>();
  private envelopes: ISubject<EventEnvelope<E, keyof E>> = new RxSubjectAdapter();

  protected subjectOf<K extends keyof E>(event: K): ISubject<E[K]> {
    let s = this.channels.get(event) as ISubject<E[K]> | undefined;
    if (!s) {
      s = new RxSubjectAdapter<E[K]>();
      this.channels.set(event, s as ISubject<unknown>);
    }
    return s;
  }

  protected envelopeBus() { return this.envelopes; }

  protected onComplete(): void {
    for (const s of this.channels.values()) s.complete?.();
    this.envelopes.complete?.();
    this.channels.clear();
  }
}

// packages/mr-event-base/tests/_support/TestEventSystem.ts
import { EventSystemBase } from "../../src/core/EventSystemBase.js";
import type { EventEnvelope, EventMap, ISubject } from "../../src/core/EventSystemTypes.js";
import { MiniSubject } from "./MiniSubject.js";

export class TestEventSystem<E extends EventMap> extends EventSystemBase<E> {
  private channels = new Map<keyof E, ISubject<unknown>>();
  private envelopes: ISubject<EventEnvelope<E, keyof E>> = new MiniSubject();

  protected subjectOf<K extends keyof E>(event: K): ISubject<E[K]> {
    let s = this.channels.get(event) as ISubject<E[K]> | undefined;
    if (!s) {
      s = new MiniSubject<E[K]>();
      this.channels.set(event, s as unknown as ISubject<unknown>);
    }
    return s;
  }

  protected envelopeBus(): ISubject<EventEnvelope<E, keyof E>> {
    return this.envelopes;
  }

  protected onComplete(): void {
    for (const s of this.channels.values()) s.complete?.();
    this.envelopes.complete?.();
    this.channels.clear();
  }
}

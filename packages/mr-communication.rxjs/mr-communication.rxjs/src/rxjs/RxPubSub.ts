import { Subject } from 'rxjs';
import type { IPubSub, Unsubscribe, Topic, MessageMeta } from 'mr-communication-core';
import { createMeta } from 'mr-communication-core';

type Envelope<T> = { payload: T; meta: MessageMeta };

export class RxPubSub implements IPubSub {
  private readonly topics = new Map<string, Subject<Envelope<any>>>();

  publish<T>(topic: Topic<T>, payload: T, meta?: Partial<MessageMeta>): void {
    const subject = this.ensure<T>(topic.key);
    subject.next({ payload, meta: createMeta(meta) });
  }

  subscribe<T>(topic: Topic<T>, handler: (payload: T, meta: MessageMeta) => void): Unsubscribe {
    const sub = this.ensure<T>(topic.key).subscribe(({ payload, meta }) => handler(payload, meta));
    return () => sub.unsubscribe();
  }

  private ensure<T>(key: string): Subject<Envelope<T>> {
    let s = this.topics.get(key) as Subject<Envelope<T>> | undefined;
    if (!s) {
      s = new Subject<Envelope<T>>();
      this.topics.set(key, s);
    }
    return s;
  }
}

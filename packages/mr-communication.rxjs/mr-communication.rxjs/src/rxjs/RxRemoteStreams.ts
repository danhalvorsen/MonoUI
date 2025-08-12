import { Subject, Observable } from 'rxjs';
import type { IRemoteObserver, IRemoteSubject, MessageMeta, Stream } from 'mr-communication-core';
import { createMeta } from 'mr-communication-core';

type StreamEnvelope<T> = { value: T; meta: MessageMeta };

export class RxRemoteStreams implements IRemoteObserver, IRemoteSubject {
  private readonly streams = new Map<string, Subject<StreamEnvelope<any>>>();

  observe<T>(stream: Stream<T>): Observable<T> {
    return new Observable<T>(subscriber => {
      const sub = this.ensure<T>(stream.key).subscribe(({ value }) => subscriber.next(value));
      return () => sub.unsubscribe();
    });
  }

  next<T>(stream: Stream<T>, value: T, meta?: Partial<MessageMeta>): void {
    this.ensure<T>(stream.key).next({ value, meta: createMeta(meta) });
  }

  complete<T>(stream: Stream<T>): void {
    this.ensure<T>(stream.key).complete();
    this.streams.delete(stream.key);
  }

  error<T>(stream: Stream<T>, error: Error): void {
    this.ensure<T>(stream.key).error(error);
    this.streams.delete(stream.key);
  }

  private ensure<T>(key: string): Subject<StreamEnvelope<T>> {
    let s = this.streams.get(key) as Subject<StreamEnvelope<T>> | undefined;
    if (!s) {
      s = new Subject<StreamEnvelope<T>>();
      this.streams.set(key, s);
    }
    return s;
  }
}

// Core/shared types – no external deps
export type JsonValue =
  | null | boolean | number | string
  | JsonValue[]
  | { [k: string]: JsonValue };

export type MaybePromise<T> = T | Promise<T>;
export type Unsubscribe = () => void;

/** Minimal observable shape to avoid pinning to RxJS in core */
export interface ObservableLike<T> {
  subscribe(next: (value: T) => void): { unsubscribe(): void };
}

export interface MessageMeta {
  id: string;
  correlationId?: string;
  timestamp: number; // epoch ms
  headers?: Record<string, string>;
}

export function createMeta(seed?: Partial<MessageMeta>): MessageMeta {
  return {
    id: seed?.id ?? randomId(),
    correlationId: seed?.correlationId,
    timestamp: seed?.timestamp ?? Date.now(),
    headers: seed?.headers ?? {},
  };
}

function randomId(): string {
  // Small, fast, stable ID generator (avoid crypto dependency)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Strongly-typed keys to avoid magic strings
export type Branded<K, T> = K & { __brand: T };

export type TopicKey = Branded<string, 'TopicKey'>;
export type MethodKey = Branded<string, 'MethodKey'>;
export type RequestKey = Branded<string, 'RequestKey'>;
export type StreamKey = Branded<string, 'StreamKey'>;

export interface Topic<T> { key: TopicKey }
export interface Method<TReq, TRes> { key: MethodKey }
export interface RequestType<TReq, TRes> { key: RequestKey }
export interface Stream<T> { key: StreamKey }

export const topic = <T>(key: string): Topic<T> => ({ key: key as TopicKey });
export const method = <TReq, TRes>(key: string): Method<TReq, TRes> => ({ key: key as MethodKey });
export const request = <TReq, TRes>(key: string): RequestType<TReq, TRes> => ({ key: key as RequestKey });
export const stream = <T>(key: string): Stream<T> => ({ key: key as StreamKey });

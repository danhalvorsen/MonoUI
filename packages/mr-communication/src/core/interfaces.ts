import { MaybePromise, MessageMeta, Topic, RequestType, Method, Stream, Unsubscribe, ObservableLike } from './types.js';

/** Pub/Sub */
export interface IPubSub {
  publish<T>(topic: Topic<T>, payload: T, meta?: Partial<MessageMeta>): MaybePromise<void>;
  subscribe<T>(
    topic: Topic<T>,
    handler: (payload: T, meta: MessageMeta) => void
  ): Unsubscribe;
}

/** Mediator (in-process request/response with single handler) */
export interface IMediator {
  send<TReq, TRes>(
    type: RequestType<TReq, TRes>,
    request: TReq,
    meta?: Partial<MessageMeta>
  ): Promise<TRes>;

  handle<TReq, TRes>(
    type: RequestType<TReq, TRes>,
    handler: (req: TReq, meta: MessageMeta) => MaybePromise<TRes>
  ): Unsubscribe;
}

/** RPC (cross-boundary) */
export interface IRpc {
  call<TReq, TRes>(
    method: Method<TReq, TRes>, 
    req: TReq,
    options?: { timeoutMs?: number; meta?: Partial<MessageMeta> }
  ): Promise<TRes>;

  expose<TReq, TRes>(
    method: Method<TReq, TRes>,
    handler: (req: TReq, meta: MessageMeta) => MaybePromise<TRes>
  ): Unsubscribe;
}

/** Remote Observer/Subject (typed streams) */
export interface IRemoteObserver {
  observe<T>(stream: Stream<T>): ObservableLike<T>;
}

export interface IRemoteSubject {
  next<T>(stream: Stream<T>, value: T, meta?: Partial<MessageMeta>): MaybePromise<void>;
  complete<T>(stream: Stream<T>): MaybePromise<void>;
  error<T>(stream: Stream<T>, error: Error): MaybePromise<void>;
}

/** Optional: unified Facade */
export interface ICommunication extends IPubSub, IMediator, IRpc, IRemoteObserver, IRemoteSubject {}

import type { IMediator, MessageMeta, RequestType, Unsubscribe } from 'mr-communication-core';
import { createMeta } from 'mr-communication-core';

type Handler<TReq, TRes> = (req: TReq, meta: MessageMeta) => Promise<TRes> | TRes;

export class RxMediator implements IMediator {
  private readonly handlers = new Map<string, Handler<any, any>>();

  async send<TReq, TRes>(
    type: RequestType<TReq, TRes>,
    request: TReq,
    meta?: Partial<MessageMeta>
  ): Promise<TRes> {
    const handler = this.handlers.get(type.key) as Handler<TReq, TRes> | undefined;
    if (!handler) throw new Error(`No mediator handler registered for ${type.key}`);
    return await handler(request, createMeta(meta));
  }

  handle<TReq, TRes>(
    type: RequestType<TReq, TRes>,
    handler: Handler<TReq, TRes>
  ): Unsubscribe {
    if (this.handlers.has(type.key)) {
      throw new Error(`Mediator handler already registered for ${type.key}`);
    }
    this.handlers.set(type.key, handler);
    return () => this.handlers.delete(type.key);
  }
}

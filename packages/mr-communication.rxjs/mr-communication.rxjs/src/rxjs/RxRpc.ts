import type { IRpc, MessageMeta, Method, Unsubscribe } from 'mr-communication-core';
import { createMeta } from 'mr-communication-core';

type RpcHandler<TReq, TRes> = (req: TReq, meta: MessageMeta) => Promise<TRes> | TRes;

export class RxRpc implements IRpc {
  private readonly handlers = new Map<string, RpcHandler<any, any>>();

  async call<TReq, TRes>(
    method: Method<TReq, TRes>,
    req: TReq,
    options?: { timeoutMs?: number; meta?: Partial<MessageMeta> }
  ): Promise<TRes> {
    const handler = this.handlers.get(method.key) as RpcHandler<TReq, TRes> | undefined;
    if (!handler) throw new Error(`No RPC handler exposed for ${method.key}`);

    const exec = handler(req, createMeta(options?.meta));
    if (options?.timeoutMs && options.timeoutMs > 0) {
      const timeout = new Promise<never>((_, rej) =>
        setTimeout(() => rej(new Error(`RPC timeout after ${options.timeoutMs}ms`)), options.timeoutMs)
      );
      return await Promise.race([exec, timeout]);
    }
    return await exec;
  }

  expose<TReq, TRes>(
    method: Method<TReq, TRes>,
    handler: RpcHandler<TReq, TRes>
  ): Unsubscribe {
    if (this.handlers.has(method.key)) {
      throw new Error(`RPC handler already exposed for ${method.key}`);
    }
    this.handlers.set(method.key, handler);
    return () => this.handlers.delete(method.key);
  }
}

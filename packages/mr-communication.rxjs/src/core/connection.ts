import type { ObservableLike } from './types.js';

export type ConnectionState = 'idle' | 'connecting' | 'open' | 'closing' | 'closed' | 'error';

export interface IConnection {
  open(): Promise<void>;
  close(code?: number, reason?: string): Promise<void>;

  readonly state$: ObservableLike<ConnectionState>;
  readonly messages$: ObservableLike<Uint8Array>;

  send(data: Uint8Array): Promise<void>;
}

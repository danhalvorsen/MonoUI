import type { ICommunication } from 'mr-communication-core';
import { RxPubSub } from './RxPubSub.js';
import { RxMediator } from './RxMediator.js';
import { RxRpc } from './RxRpc.js';
import { RxRemoteStreams } from './RxRemoteStreams.js';

export class RxCommunication implements ICommunication {
  private readonly pubsub = new RxPubSub();
  private readonly mediator = new RxMediator();
  private readonly rpc = new RxRpc();
  private readonly streams = new RxRemoteStreams();

  // IPubSub
  publish = this.pubsub.publish.bind(this.pubsub);
  subscribe = this.pubsub.subscribe.bind(this.pubsub);

  // IMediator
  send = this.mediator.send.bind(this.mediator);
  handle = this.mediator.handle.bind(this.mediator);

  // IRpc
  call = this.rpc.call.bind(this.rpc);
  expose = this.rpc.expose.bind(this.rpc);

  // IRemoteObserver/Subject
  observe = this.streams.observe.bind(this.streams);
  next = this.streams.next.bind(this.streams);
  complete = this.streams.complete.bind(this.streams);
  error = this.streams.error.bind(this.streams);
}

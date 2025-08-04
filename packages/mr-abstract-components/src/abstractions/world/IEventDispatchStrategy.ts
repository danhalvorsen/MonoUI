import { IReactiveController } from "src/index.js";

export interface IEventDispatchStrategy extends IReactiveController {
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  dispatchEvent(event: Event): boolean;
}


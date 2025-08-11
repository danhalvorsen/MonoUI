import { IReactiveController } from "../controllers/IReactiveController.js";

export interface IEventDispatchStrategy extends IReactiveController {
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  dispatchEvent(event: Event): boolean;
}

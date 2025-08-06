import { IEventDispatchStrategy } from "./IEventDispatchStrategy.js";


export class DefaultEventDispatchStrategy implements IEventDispatchStrategy {
    private target = new EventTarget();

    hostConnected(): void {
        // No-op for default
    }

    hostDisconnected(): void {
        // Cleanup if needed
    }

    addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
        this.target.addEventListener(type, listener);
    }

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
        this.target.removeEventListener(type, listener);
    }

    dispatchEvent(event: Event): boolean {
        return this.target.dispatchEvent(event);
    }
}

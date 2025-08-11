
// packages/mr-event-base/tests/EventSystemBase.test.ts
import { describe, it, expect, vi } from "vitest";
import type { EventMap } from "../src/core/EventSystemTypes.js";
import { TestEventSystem } from "./support/TestEventSystem.js";

interface AppEvents extends EventMap {
  "mouse:down": { x: number; y: number };
  "config:updated": { id: string; value: unknown };
}

describe("EventSystemBase (with MiniSubject backend)", () => {
  it("on + emit => handler receives payload", () => {
    const bus = new TestEventSystem<AppEvents>();
    const handler = vi.fn();

    const sub = bus.on("mouse:down", handler);
    bus.emit("mouse:down", { x: 10, y: 20 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ x: 10, y: 20 });
    sub.unsubscribe();
  });

  it("once unsubscribes after first event", () => {
    const bus = new TestEventSystem<AppEvents>();
    const handler = vi.fn();

    bus.once("config:updated", handler);
    bus.emit("config:updated", { id: "a", value: 1 });
    bus.emit("config:updated", { id: "b", value: 2 });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith({ id: "a", value: 1 });
  });

  it("events$ emits envelopes matching type and payload", () => {
    const bus = new TestEventSystem<AppEvents>();
    const seen: Array<{ type: keyof AppEvents; payload: unknown }> = [];

    const sub = bus.events$().subscribe(e => seen.push(e));
    bus.emit("mouse:down", { x: 1, y: 2 });
    bus.emit("config:updated", { id: "z", value: 42 });

    expect(seen).toEqual([
      { type: "mouse:down", payload: { x: 1, y: 2 } },
      { type: "config:updated", payload: { id: "z", value: 42 } }
    ]);
    sub.unsubscribe();
  });

  it("complete() gates future observe/emit/once", () => {
    const bus = new TestEventSystem<AppEvents>();

    // create channels
    const unsubA = bus.on("mouse:down", () => {});
    const unsubB = bus.events$().subscribe(() => {});

    expect(() => bus.complete()).not.toThrow();

    // post-complete emit => ignored
    const afterComplete = vi.fn();
    bus.on("mouse:down", afterComplete);
    bus.emit("mouse:down", { x: 0, y: 0 });
    expect(afterComplete).not.toHaveBeenCalled();

    // post-complete once => inert subscription
    const onceFn = vi.fn();
    const onceSub = bus.once("mouse:down", onceFn);
    expect(onceSub.closed).toBe(true);
    bus.emit("mouse:down", { x: 1, y: 1 });
    expect(onceFn).not.toHaveBeenCalled();

    unsubA.unsubscribe();
    unsubB.unsubscribe();
  });
});

import { describe, it, expect, vi } from "vitest";
import { RxJSEventSystemBase } from "../src/RxJSEventSystemBase.js";
describe("RxJSEventSystemBase integration", () => {
    it("on + emit works", () => {
        const bus = new RxJSEventSystemBase();
        const fn = vi.fn();
        const sub = bus.on("mouse:down", fn);
        bus.emit("mouse:down", { x: 1, y: 2 });
        expect(fn).toHaveBeenCalledWith({ x: 1, y: 2 });
        sub.unsubscribe();
    });
    it("once unsubscribes after first event", () => {
        const bus = new RxJSEventSystemBase();
        const fn = vi.fn();
        bus.once("config:updated", fn);
        bus.emit("config:updated", { id: "a", value: 1 });
        bus.emit("config:updated", { id: "b", value: 2 });
        expect(fn).toHaveBeenCalledTimes(1);
    });
    it("events$ emits envelopes", () => {
        const bus = new RxJSEventSystemBase();
        const seen = [];
        const sub = bus.events$().subscribe(e => seen.push(e));
        bus.emit("mouse:down", { x: 7, y: 9 });
        expect(seen).toEqual([{ type: "mouse:down", payload: { x: 7, y: 9 } }]);
        sub.unsubscribe();
    });
    it("complete() gates future observe/emit", () => {
        const bus = new RxJSEventSystemBase();
        const first = vi.fn();
        bus.on("mouse:down", first);
        bus.complete();
        // post-complete emit => ignored
        bus.emit("mouse:down", { x: 0, y: 0 });
        expect(first).not.toHaveBeenCalled();
        // post-complete subscribe => inert
        const later = vi.fn();
        const sub = bus.on("mouse:down", later);
        bus.emit("mouse:down", { x: 1, y: 1 });
        expect(later).not.toHaveBeenCalled();
        sub.unsubscribe();
    });
});

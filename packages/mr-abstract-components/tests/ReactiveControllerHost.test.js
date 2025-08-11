import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReactiveControllerHost } from "../src/controllers/ReactiveControllerHost.js";
describe("ReactiveControllerHost", () => {
    let host;
    let controller;
    let controller2;
    beforeEach(() => {
        host = new ReactiveControllerHost();
        controller = {
            hostUpdate: vi.fn(),
            hostConnected: vi.fn(),
            hostDisconnected: vi.fn()
        };
        controller2 = {
            hostUpdate: vi.fn(),
            hostConnected: vi.fn(),
            hostDisconnected: vi.fn()
        };
    });
    it("should initialize with an empty set of controllers", () => {
        expect(host.knowedControllers.size).toBe(0);
    });
    it("should add a controller", () => {
        host.addController(controller);
        expect(host.knowedControllers.has(controller)).toBe(true);
    });
    it("should not add the same controller twice", () => {
        host.addController(controller);
        host.addController(controller);
        expect(host.knowedControllers.size).toBe(1);
    });
    it("should remove a controller", () => {
        host.addController(controller);
        host.removeController(controller);
        expect(host.knowedControllers.has(controller)).toBe(false);
    });
    it("should call hostUpdate on all controllers when requestUpdate is called", () => {
        host.addController(controller);
        host.addController(controller2);
        host.requestUpdate();
        expect(controller.hostUpdate).toHaveBeenCalledTimes(1);
        expect(controller2.hostUpdate).toHaveBeenCalledTimes(1);
    });
    it("should not throw if controller does not have hostUpdate", () => {
        // @ts-expect-error
        const noUpdateController = {};
        host.addController(noUpdateController);
        expect(() => host.requestUpdate()).not.toThrow();
    });
    it("should resolve updateComplete to true", async () => {
        await expect(host.updateComplete).resolves.toBe(true);
    });
});
// We recommend installing an extension to run vitest tests.

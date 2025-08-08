import { IReactiveController } from "src/index.js";
import { injectable } from "tsyringe";
import { container } from "tsyringe";

@injectable()
export class IoCDiscoveryReactiveController implements IReactiveController {
  hostConnected(): void {}
  hostDisconnected(): void {}

  /** Get all registered names for a given namespace (Controller, RenderTech, etc.) */
  getRegisteredNames(namespace: string): readonly string[] {
    // Since tsyringe does not expose a public API to list all registrations,
    // you need to maintain your own registry of registered names.
    // Here is a placeholder implementation that returns an empty array.
    // To implement this properly, you should create a registry when registering dependencies.
    return [];
  }

  /** Resolve a registered instance by namespace + name */
  resolve<T>(namespace: string, name: string): T {
    return container.resolve<T>(`${namespace}:${name}`);
  }
}

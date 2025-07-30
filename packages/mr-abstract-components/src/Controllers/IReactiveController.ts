
export interface IReactiveController {
  hostConnected(): void;
  hostDisconnected(): void;
  hostUpdate?(): void;
  hostUpdated?(): void;
}

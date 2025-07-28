
export interface ReactiveControllerHost {
 
    addController(controller: ReactiveController): void;
    removeController(controller: ReactiveController): void;
    requestUpdate(): void;
    readonly updateComplete: Promise<boolean>;
}

export interface IReactiveController {
  hostConnected(): void;
  hostDisconnected(): void;
  hostUpdate?(): void;
  hostUpdated?(): void;
}

export class ReactiveController implements IReactiveController {
  hostConnected(): void {
    
  }
  hostDisconnected(): void {
    
  }
  hostUpdate?(): void {
    
  }
  hostUpdated?(): void {
    
  }
  private host?: ReactiveControllerHost;
};
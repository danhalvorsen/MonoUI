// ObjectBase.ts
import type { ReactiveControllerHost } from 'lit';
import type { Vector2 } from '@my-graphics/math';
import type { IObject } from './IObject.js';

type Init = {
  id: string;
  name?: string;
  direction: Vector2;
  position: Vector2;
  size: Vector2;
};

/** Base implementation of IObject + Lit ReactiveController */
export abstract class ObjectBase implements IObject {
  protected readonly host: ReactiveControllerHost;

  private _id: string;
  private _name = '';
  private _direction: Vector2;
  private _position: Vector2;
  private _size: Vector2;

  constructor(host: ReactiveControllerHost, init: Init) {
    this.host = host;
    this._id = init.id;
    this._name = init.name ?? '';
    this._direction = init.direction;
    this._position = init.position;
    this._size = init.size;

    this.host.addController(this);
  }

  // IObject API
  GetId(): string { return this._id; }
  SetId(id: string): void {
    if (this._id !== id) {
      this._id = id;
      this.requestHostUpdate();
    }
  }

  GetName(): string { return this._name; }
  SetName(name: string): void {
    if (this._name !== name) {
      this._name = name;
      this.requestHostUpdate();
    }
  }

  GetDirection(): Vector2 { return this._direction; }
  SetDirection(direction: Vector2): void {
    this._direction = direction;
    this.requestHostUpdate();
  }

  GetPosition(): Vector2 { return this._position; }
  SetPosition(position: Vector2): void {
    this._position = position;
    this.requestHostUpdate();
  }

  GetSize(): Vector2 { return this._size; }
  SetSize(size: Vector2): void {
    this._size = size;
    this.requestHostUpdate();
  }

  // ReactiveController hooks (concrete no-ops; override in subclasses as needed)
  hostConnected(): void { /* no-op */ }
  hostDisconnected(): void { /* no-op */ }
  hostUpdate(): void { /* no-op */ }
  hostUpdated(): void { /* no-op */ }

  // Per-frame update (override if needed)
  update(_dt: number): void { /* no-op */ }

  protected requestHostUpdate(): void {
    this.host.requestUpdate();
  }
}

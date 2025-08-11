import { ReactiveController } from 'lit';
import { Vector2 } from "@my-graphics/math"

export interface IObject extends ReactiveController {
  GetId(): string;
  SetId(id: string): void;

  GetName(): string;
  SetName(name: string): void;

  GetDirection(): Vector2;
  SetDirection(direction: Vector2): void;

  GetPosition(): Vector2;
  SetPosition(position: Vector2): void;

  GetSize(): Vector2;
  SetSize(size: Vector2): void;

  hostConnected(): void;
  hostDisconnected(): void;
  hostUpdate?(): void;
  hostUpdated?(): void;
  update(dt: number): void;
}

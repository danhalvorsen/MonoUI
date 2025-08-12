import type { IVisualObject, IStyle, IConnector, ChangedProperties } from "mr-abstract-components";
import { Vector2 } from "@my-graphics/math";
import { vi } from "vitest";

class MockDraggableObject implements IVisualObject {
  id = 'mock-id';
  position = new Vector2(100, 100);
  size = { width: 100, height: 100 };
  isDraggable = true;
  style?: IStyle;
  connectors?: IConnector[];
  selected?: boolean;
  enabled?: boolean;

  // Optional separate coordinates if needed for hit tests
  x = 100;
  y = 100;
  width = 50;
  height = 50;

  onDragStart = vi.fn();
  onDrag = vi.fn();
  onDragEnd = vi.fn();
  onDragEnter?: (event: MouseEvent) => void;
  onDragOver?: (event: MouseEvent) => void;
  onDragLeave?: (event: MouseEvent) => void;
  onDrop?: (event: MouseEvent) => void;

  update(dt: number): void { throw new Error('Method not implemented.'); }
  render(ctx: unknown): void { throw new Error('Method not implemented.'); }
  connectedCallback?(): void { throw new Error('Method not implemented.'); }
  disconnectedCallback?(): void { throw new Error('Method not implemented.'); }
     updated?(changedProperties: ChangedProperties): void { throw new Error('Method not implemented.'); }
}

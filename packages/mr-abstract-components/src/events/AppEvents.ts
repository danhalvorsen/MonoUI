// packages/mr-abstract-components/src/events/AppEvents.ts
import type { EventMap } from "mr-event-base";

export interface AppEvents extends EventMap {
  "host:connected": void;
  "host:disconnected": void;
  "host:update": void;

  "canvas:resize": { width: number; height: number; dpr: number };
  "canvas:drawn": { id: string };

  "drag:start": { id: string; x: number; y: number };
  "drag:move":  { id: string; x: number; y: number };
  "drag:end":   { id: string; x: number; y: number };
}

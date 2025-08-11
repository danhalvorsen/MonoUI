// src/controllers/reactiveControllers/mouse/MouseController.ts
import type { IMouseController } from "./IMouseController.js";
import { BehaviorSubject, Subject, fromEvent, merge, map, takeUntil, switchMap } from "rxjs";
import { BaseController } from "../BaseController.js";
import type { Vector2 } from "@my-graphics/math";

export class MouseController extends BaseController implements IMouseController {
  private el: HTMLElement | Window | null = null;
  private transform: (p: Vector2, ev: PointerEvent) => Vector2 = (p) => p;

  pos$   = new BehaviorSubject<Vector2>({ x: 0, y: 0 } as Vector2);
  down$  = new Subject<PointerEvent>();
  move$  = new Subject<PointerEvent>();
  up$    = new Subject<PointerEvent>();
  wheel$ = new Subject<WheelEvent>();
  drag$  = new Subject<{ start: PointerEvent; move: PointerEvent; dx: number; dy: number }>();

  attach(el: HTMLElement | Window): void {
    this.detach();
    this.el = el;
    const target = el as EventTarget;

    const down$  = fromEvent<PointerEvent>(target, "pointerdown");
    const move$  = fromEvent<PointerEvent>(target, "pointermove");
    const up$    = fromEvent<PointerEvent>(target, "pointerup");
    const wheel$ = fromEvent<WheelEvent>(target, "wheel");

    this.effect(down$, ev => this.down$.next(ev));
    this.effect(move$, ev => {
      const p = this.transform({ x: ev.clientX, y: ev.clientY } as Vector2, ev);
      this.pos$.next(p);
      this.move$.next(ev);
    });
    this.effect(up$,   ev => this.up$.next(ev));
    this.effect(wheel$, ev => this.wheel$.next(ev));

    this.effect(
      down$.pipe(
        switchMap((start) =>
          merge(move$.pipe(map(move => ({ start, move }))))
            .pipe(
              map(({ start, move }) => ({
                start,
                move,
                dx: move.clientX - start.clientX,
                dy: move.clientY - start.clientY
              })),
              takeUntil(up$)
            )
        )
      ),
      v => this.drag$.next(v)
    );
  }

  detach(): void {
    this.pos$.next({ x: 0, y: 0 } as Vector2);
    this.hostDisconnected();
  }

  setTransform(fn: (p: Vector2, ev: PointerEvent) => Vector2): void {
    this.transform = fn ?? ((p) => p);
  }

  hostConnected(): void {}
  hostDisconnected(): void { super.hostDisconnected(); }
  hostUpdate(): void {}
  hostUpdated?(): void {}
}

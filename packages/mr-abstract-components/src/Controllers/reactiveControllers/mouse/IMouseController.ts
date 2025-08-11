// mouse-controller.ts
import { singleton } from 'tsyringe';
import { BehaviorSubject, Subject, merge, switchMap, map, takeUntil, Subscription, share } from 'rxjs';
import { IReactiveController } from "../../IReactiveController.js"
import { Vector2 } from '@my-graphics/math';

 
export interface IMouseController extends IReactiveController {
  readonly pos$:   BehaviorSubject<Vector2>;
  readonly down$:  Subject<PointerEvent>;
  readonly move$:  Subject<PointerEvent>;
  readonly up$:    Subject<PointerEvent>;
  readonly wheel$: Subject<WheelEvent>;
  readonly drag$:  Subject<{ start: PointerEvent; move: PointerEvent; dx: number; dy: number }>;
  attach(el: HTMLElement | Window): void;
  detach(): void;
  setTransform(fn: (p: Vector2, ev: PointerEvent) => Vector2): void;
}

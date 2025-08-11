// draggable-controller.ts
import { switchMap, map, filter, takeUntil, Subscription } from 'rxjs';
import { BaseController } from '../BaseController.js';
import type { IMouseController} from "../mouse/IMouseController.js"
import { Vector2 } from '@my-graphics/math';
import { IConfiguration } from './IConfiguration.js';
import { IVisualNode } from '../../../core/index.js';
 

// Define DraggableOptions type if not already defined or imported
export interface DraggableOptions {
  button?: number;
  pick?: (p: Vector2, objects: readonly IVisualNode[]) => IVisualNode | undefined;
  canDrag?: (target: IVisualNode, config: IConfiguration) => boolean;
  constrain?: (next: Vector2, target: IVisualNode) => Vector2;
  snap?: (next: Vector2, target: IVisualNode) => Vector2;
}


export class DraggableController extends BaseController {
  private objects: IVisualNode[] = [];

  constructor(
    private readonly mouse: IMouseController,
    private readonly opts: DraggableOptions = {}
  ) { super(); }

  addObject(obj: IVisualNode): void {
    const i = this.objects.indexOf(obj);
    if (i >= 0) this.objects.splice(i, 1);
    this.objects.push(obj);
  }

  removeObject(obj: IVisualNode): void {
    const i = this.objects.indexOf(obj);
    if (i >= 0) this.objects.splice(i, 1);
  }

  protected onConnected(): void {
    const button   = this.opts.button ?? 0;
    const pick     = this.opts.pick ?? defaultPick;
    const canDrag  = this.opts.canDrag ?? (() => true);

    this.effect(
      this.mouse.down$.pipe(
        filter(ev => ev.button === button),
        map(ev => {
          try { (ev.target as Element | undefined)?.setPointerCapture?.(ev.pointerId); } catch {}
          const p0 = this.mouse.pos$.getValue();
          const target = pick(p0, this.objects);
          if (!target) return null;
          if (!canDrag(target, target.configuration as any)) return null;
          const offset = { x: p0.x - (target as any).position.x, y: p0.y - (target as any).position.y } as Vector2;
          return { target, offset };
        }),
        filter(Boolean) as any,
        switchMap(({ target, offset }: { target: IVisualNode; offset: Vector2 }) =>
          this.mouse.pos$.pipe(
            map(p => {
              let next = { x: p.x - offset.x, y: p.y - offset.y } as Vector2;
              if (this.opts.constrain) next = this.opts.constrain(next, target);
              if (this.opts.snap)      next = this.opts.snap(next, target);
              return { target, next };
            }),
            takeUntil(this.mouse.up$)
          )
        )
      ),
      ({ target, next }) => { (target as any).position = next; }
    );
  }
}

function defaultPick(p: Vector2, objects: readonly IVisualNode[]): IVisualNode | undefined {
  for (let i = objects.length - 1; i >= 0; i--) {
    const o: any = objects[i];
    const { x, y } = o.position, { x: w, y: h } = o.size;
    if (p.x >= x && p.y >= y && p.x <= x + w && p.y <= y + h) return o;
  }
  return undefined;
}
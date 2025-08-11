// config-store.ts  (add a tiny get() helper)
import { BehaviorSubject, map, distinctUntilChanged } from 'rxjs';
export class ConfigStore<C extends object> {
  private readonly _state$ = new BehaviorSubject<ReadonlyMap<string, C>>(new Map());
  readonly state$ = this._state$.asObservable();

  patch(id: string, patch: Partial<C>): void {
    const cur = this._state$.value;
    const next = new Map(cur);
    const prev = next.get(id) ?? ({} as C);
    next.set(id, Object.assign({}, prev, patch));
    this._state$.next(next);
  }

  select(id: string) {
    return this.state$.pipe(
      map((m: ReadonlyMap<string, C>): C | undefined => m.get(id)),
      distinctUntilChanged((a: C | undefined, b: C | undefined) => JSON.stringify(a) === JSON.stringify(b))
    );
  }

  get(id: string): C | undefined {            // <-- sync read (used at pointerdown)
    return this._state$.value.get(id);
  }
}

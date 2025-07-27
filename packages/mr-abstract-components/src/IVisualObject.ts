export interface IVisualObject<C = unknown> {
  id: string;
  selected?: boolean;
  position: { x: number; y: number };

  update(dt: number): void;
  render(ctx: C): void;
}

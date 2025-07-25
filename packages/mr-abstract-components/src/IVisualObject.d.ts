export interface IVisualObject<C = unknown> {
    update(dt: number): void;
    render(ctx: C): void;
}

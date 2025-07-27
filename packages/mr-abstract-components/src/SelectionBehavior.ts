export interface ISelectionBehavior<TCtx, TActionArgs = any> {
    selected: boolean;
    drawSelection(ctx: TCtx, rect: { x: number, y: number, width: number, height: number }): void;
    containsPoint?(x: number, y: number, rect: { x: number, y: number, width: number, height: number }): boolean;
    onAction?: (action: string, args: TActionArgs) => void; // Action delegate/handler
}
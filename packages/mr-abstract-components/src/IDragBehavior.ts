export interface IDragBehavior<TCtx, TActionArgs = any> {
  /**
   * Called when dragging starts
   * @param ctx - Rendering context
   * @param event - Mouse event
   * @param rect - Object bounds
   */
  onDragStart(ctx: TCtx, event: MouseEvent, rect: { x: number, y: number, width: number, height: number }): void;

  /**
   * Called during dragging
   * @param ctx - Rendering context
   * @param event - Mouse event
   * @param deltaX - Horizontal movement delta
   * @param deltaY - Vertical movement delta
   * @param rect - Object bounds
   */
  onDrag(ctx: TCtx, event: MouseEvent, deltaX: number, deltaY: number, rect: { x: number, y: number, width: number, height: number }): void;

  /**
   * Called when dragging ends
   * @param ctx - Rendering context
   * @param event - Mouse event
   * @param rect - Object bounds
   */
  onDragEnd(ctx: TCtx, event: MouseEvent, rect: { x: number, y: number, width: number, height: number }): void;

  /**
   * Optional visual feedback during drag (e.g., ghost image, outline)
   * @param ctx - Rendering context
   * @param rect - Object bounds
   */
  drawDragFeedback?(ctx: TCtx, rect: { x: number, y: number, width: number, height: number }): void;

  /**
   * Action delegate/handler for custom drag actions
   */
  onAction?: (action: string, args: TActionArgs) => void;
}

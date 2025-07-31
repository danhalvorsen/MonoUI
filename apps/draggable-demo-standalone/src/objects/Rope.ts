import { Vector2 } from '@my-graphics/math';
import { VisualRectangle } from 'mr-web-components';
import { RopeTokenService, RopeTokensDark } from 'mr-style';

/**
 * Rope class that connects two VisualRectangles
 * Uses design tokens from mr-style for consistent styling
 */
export class Rope {
  public id: string;
  private startRectangle: VisualRectangle;
  private endRectangle: VisualRectangle;
  private tokenService: RopeTokenService;
  private state: 'default' | 'active' | 'selected' | 'disabled' = 'default';
  private lineStyle: 'solid' | 'dotted' | 'dashed' = 'solid';
  private lineVariant: 'thin' | 'medium' | 'thick' = 'medium';

  constructor(
    id: string,
    startRectangle: VisualRectangle,
    endRectangle: VisualRectangle,
    lineVariant: 'thin' | 'medium' | 'thick' = 'medium',
    lineStyle: 'solid' | 'dotted' | 'dashed' = 'solid'
  ) {
    this.id = id;
    this.startRectangle = startRectangle;
    this.endRectangle = endRectangle;
    this.lineVariant = lineVariant;
    this.lineStyle = lineStyle;
    this.tokenService = new RopeTokenService(RopeTokensDark);
  }

  /**
   * Gets the start point of the rope (center of start rectangle)
   */
  getStartPoint(): Vector2 {
    return new Vector2(this.startRectangle.position.x, this.startRectangle.position.y);
  }

  /**
   * Gets the end point of the rope (center of end rectangle)
   */
  getEndPoint(): Vector2 {
    return new Vector2(this.endRectangle.position.x, this.endRectangle.position.y);
  }

  /**
   * Gets the length of the rope
   */
  getLength(): number {
    const start = this.getStartPoint();
    const end = this.getEndPoint();
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Sets rope visual properties using design tokens
   */
  setRopeStyle(
    lineVariant: 'thin' | 'medium' | 'thick' = 'medium',
    lineStyle: 'solid' | 'dotted' | 'dashed' = 'solid',
    state: 'default' | 'active' | 'selected' | 'disabled' = 'default'
  ): void {
    this.lineVariant = lineVariant;
    this.lineStyle = lineStyle;
    this.state = state;
  }

  /**
   * Renders the rope as a line between the two rectangles using design tokens
   */
  render(ctx: CanvasRenderingContext2D): void {
    const start = this.getStartPoint();
    const end = this.getEndPoint();

    // Get styling from design tokens
    const lineWidth = this.tokenService.getLineWidth(this.lineVariant);
    const lineColor = this.tokenService.getLineColor(this.state);
    const dashPattern = this.tokenService.getDashPattern(this.lineStyle);
    const endpointColor = this.tokenService.getEndpointColor(this.state === 'disabled' ? 'default' : this.state);

    // Set line style using design tokens
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    // Set dash pattern from design tokens
    ctx.setLineDash(dashPattern);

    // Draw the rope line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Reset line dash
    ctx.setLineDash([]);

    // Draw rope endpoints as small circles using design tokens
    this.drawEndpoint(ctx, start, endpointColor);
    this.drawEndpoint(ctx, end, endpointColor);

    // Draw rope info (length) at midpoint
    this.drawRopeInfo(ctx, start, end);
  }

  /**
   * Draws a small circle at rope endpoints using design tokens
   */
  private drawEndpoint(ctx: CanvasRenderingContext2D, point: Vector2, color: string): void {
    const tokens = this.tokenService.getTokens();
    const radius = tokens.endpointRadius;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * Draws rope information at the midpoint using design tokens
   */
  private drawRopeInfo(ctx: CanvasRenderingContext2D, start: Vector2, end: Vector2): void {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const length = this.getLength();
    const tokens = this.tokenService.getTokens();

    // Set text style using design tokens
    ctx.fillStyle = tokens.infoTextColor;
    ctx.font = `${tokens.infoFontSize} ${tokens.infoFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw background for text using design tokens
    const text = `${Math.round(length)}px`;
    const textMetrics = ctx.measureText(text);
    const padding = tokens.infoPadding;
    
    ctx.fillStyle = tokens.infoBackgroundColor;
    ctx.fillRect(
      midX - textMetrics.width / 2 - padding,
      midY - 8,
      textMetrics.width + padding * 2,
      16
    );
    
    // Draw text using design tokens
    ctx.fillStyle = tokens.infoTextColor;
    ctx.fillText(text, midX, midY);
  }

  /**
   * Gets information about the rope connection
   */
  getConnectionInfo(): {
    isConnected: boolean;
    startRectangle: string;
    endRectangle: string;
    length: number;
  } {
    return {
      isConnected: true,
      startRectangle: this.startRectangle.id,
      endRectangle: this.endRectangle.id,
      length: this.getLength()
    };
  }

  /**
   * Updates rope (called each frame if needed)
   */
  update(): void {
    // Rope automatically follows rectangles since it uses their positions directly
    // No additional update logic needed
  }
}

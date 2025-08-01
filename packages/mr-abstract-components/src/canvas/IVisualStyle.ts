export interface ILineStyle {
  width?: number;
  color?: string;
  dash?: number[];
  cap?: 'butt' | 'round' | 'square';
  join?: 'miter' | 'round' | 'bevel';
  miterLimit?: number;
}

export interface IBorderStyle {
  width?: number;
  color?: string;
  radius?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'double';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface IOpacityStyle {
  opacity?: number;
  fillOpacity?: number;
  strokeOpacity?: number;
  backgroundOpacity?: number;
}

export interface IColorStyle {
  fillColor?: string;
  strokeColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface IShadowStyle {
  color?: string;
  blur?: number;
  offsetX?: number;
  offsetY?: number;
  inset?: boolean;
}

export interface ITextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right' | 'start' | 'end';
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface IGradientStyle {
  type: 'linear' | 'radial';
  stops: Array<{
    offset: number;
    color: string;
  }>;
  coordinates?: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    r0?: number;
    r1?: number;
  };
}

export interface IPatternStyle {
  image: HTMLImageElement | HTMLCanvasElement;
  repetition: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
}

export interface ITransformStyle {
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  skewX?: number;
  skewY?: number;
  originX?: number;
  originY?: number;
}

export interface IVisualStyle {
  line?: ILineStyle;
  border?: IBorderStyle;
  opacity?: IOpacityStyle;
  color?: IColorStyle;
  shadow?: IShadowStyle;
  text?: ITextStyle;
  gradient?: IGradientStyle;
  pattern?: IPatternStyle;
  transform?: ITransformStyle;
  hoverStyle?: Partial<IVisualStyle>;
  selectedStyle?: Partial<IVisualStyle>;
  disabledStyle?: Partial<IVisualStyle>;
  activeStyle?: Partial<IVisualStyle>;
}

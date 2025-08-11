// packages/mr-abstract-components/src/canvas/IScreen.ts
export interface IScreen {
  id?: string;
  width: number;
  height: number;
  pixelRatio?: number;
  resize(width: number, height: number): void;
  clear?(color?: string): void;
  getElement?(): HTMLElement | undefined;
}

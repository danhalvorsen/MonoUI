export const Kinds = {
  Group: "group",
  Transform: "transform",
  Style: "style",
  Rect: "rect",
  Circle: "circle",
} as const;

export type Kind = typeof Kinds[keyof typeof Kinds];

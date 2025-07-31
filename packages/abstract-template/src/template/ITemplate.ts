import { TemplateType } from "./TemplateTypes.js";

/** Representerer en template */
export interface ITemplate {
  /** Rå template-streng, f.eks. "Hello {Name}" eller "class {Name} { }" */
  content: string;

  /** Hvilken type template dette er */
  type: TemplateType;
}

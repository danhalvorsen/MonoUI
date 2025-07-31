import { IFormatter } from "../format/IFormatter.js";

/** Data som kan brukes til å rendre templates */
export interface ITemplateContext {
  /** Key-value‑par for substitusjon */
  data: Record<string, any>;

  /** Formatter for tilpasset output */
  formatter?: IFormatter;

  /** Metadata, f.eks. språk eller runtime‑info */
  metadata?: Record<string, any>;
}

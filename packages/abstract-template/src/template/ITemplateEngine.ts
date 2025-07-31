import { ITemplate } from "./ITemplate.js";
import { ITemplateContext } from "./ITemplateContext.js";

/** Kontrakt for alle template‑motorer */
export interface ITemplateEngine {
  /**
   * Renderer en template med gitt data
   * @param template Template‑objekt
   * @param context Data og formatter for substitusjon
   */
  render(template: ITemplate, context: ITemplateContext): string;
}

import { ITemplate } from "./ITemplate.js";

/**
 * Forsøker å hente ut en property path fra en lambda-funksjon.
 * Støtter også dypere paths (f.eks. x => x.address.city)
 */
export function extractPropertyPath(selector: Function): string {
  const text = selector.toString();
  // Match the full property path after the parameter (e.g., x.address.city)
  const match = text.match(/=>\s*\w+\.(.+)/);
  if (match) {
    // Clean up the captured property path
    return match[1].replace(/[;\}\)\s].*$/g, "").trim();
  }
  return "unknown";
}

/**
 * Interface for property templates that bind to specific object properties
 */
export interface IPropertyTemplate<T> extends ITemplate {
  propertyName: string;
  propertyValue: any;
  source: T;
}

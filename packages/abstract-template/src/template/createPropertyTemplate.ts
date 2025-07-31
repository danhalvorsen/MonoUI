import { extractPropertyPath, IPropertyTemplate } from "./IPropertyTemplate.js";
import { TemplateType } from "./TemplateTypes.js";

/**
 * Oppretter en robust PropertyTemplate
 */

export function createPropertyTemplate<T, K>(
    obj: T,
    selector: (x: T) => K,
    templateContent: string,
    type: TemplateType = TemplateType.Property,
    explicitName?: string
): IPropertyTemplate<T> {
    const propertyPath = explicitName ?? extractPropertyPath(selector);

    // Prøv å slå opp verdi (støtte for nested path)
    let value: any;
    try {
        value = propertyPath.split(".").reduce((acc: any, key) => acc?.[key], obj);
    } catch {
        value = undefined;
    }

    return {
        content: templateContent,
        type,
        propertyName: propertyPath,
        propertyValue: value,
        source: obj
    };
}

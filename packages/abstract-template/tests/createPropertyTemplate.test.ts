import { describe, it, expect } from "vitest";
import { createPropertyTemplate } from "../src/template/createPropertyTemplate.js";
import { TemplateType } from "../src/template/TemplateTypes.js";

describe("createPropertyTemplate", () => {
  const user = { name: "Dan", address: { city: "Oslo" } };

  it("should extract property name from simple selector", () => {
    const tmpl = createPropertyTemplate(user, x => x.name, "Hello {PropertyName}");
    expect(tmpl.propertyName).toBe("name");
    expect(tmpl.propertyValue).toBe("Dan");
    expect(tmpl.content).toBe("Hello {PropertyName}");
    expect(tmpl.type).toBe(TemplateType.Property);
  });

  it("should support nested property paths", () => {
    const tmpl = createPropertyTemplate(user, x => x.address.city, "City is {PropertyValue}");
    expect(tmpl.propertyName).toBe("address.city");
    expect(tmpl.propertyValue).toBe("Oslo");
  });

  it("should use explicit name if provided", () => {
    const tmpl = createPropertyTemplate(user, x => x.address.city, "Custom {PropertyName}", TemplateType.Text, "CustomKey");
    expect(tmpl.propertyName).toBe("CustomKey");
  });

  it("should return undefined for non-existing property", () => {
    const tmpl = createPropertyTemplate(user, (x: any) => x.unknown, "Missing {PropertyValue}");
    expect(tmpl.propertyValue).toBeUndefined();
  });
});

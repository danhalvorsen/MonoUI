import { describe, it, expect } from "vitest";
import { ITemplateEngine } from "../src/template/ITemplateEngine.js";
import { TemplateType } from "../src/template/TemplateTypes.js";

describe("ITemplateEngine", () => {
  it("should render a template with context data", () => {
    // Mock engine
    const engine: ITemplateEngine = {
      render: (template: { content: any; }, context: { data: { [s: string]: unknown; } | ArrayLike<unknown>; }) => {
        let output = template.content;
        for (const [key, value] of Object.entries(context.data)) {
          output = output.replace(`{${key}}`, String(value));
        }
        return output;
      }
    };

    const template = { content: "Hello {Name}", type: TemplateType.Text };
    const context = { data: { Name: "Dan" } };

    const result = engine.render(template, context);
    expect(result).toBe("Hello Dan");
  });
});

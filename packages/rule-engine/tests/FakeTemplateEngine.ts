import "reflect-metadata"
import { ITemplate, ITemplateEngine } from "abstract-template";

// Fake template engine for tests
export class FakeTemplateEngine implements ITemplateEngine {
    render(template: ITemplate, context: any): string {
        return `Rendered: ${JSON.stringify(context.data)}`;
    }
}

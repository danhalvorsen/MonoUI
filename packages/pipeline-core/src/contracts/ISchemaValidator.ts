export interface ISchemaValidator<T = any> { validate(data: unknown): T; toJSONSchema?(): object; }

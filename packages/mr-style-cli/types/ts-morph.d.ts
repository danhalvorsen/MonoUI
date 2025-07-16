declare module 'ts-morph' {
  export class Project {
    constructor(options?: any);
    addSourceFileAtPath(filePath: string): SourceFile;
  }

  export class SourceFile {
    getVariableDeclarationOrThrow(name: string): VariableDeclaration;
  }

  export class VariableDeclaration {
    getInitializerIfKindOrThrow(kind: SyntaxKind): ObjectLiteralExpression;
  }

  export class ObjectLiteralExpression {
    getProperties(): PropertyDeclaration[];
  }

  export class PropertyDeclaration {
    getName(): string;
    getInitializerOrThrow(): Expression;
    getText(): string;
  }

  export enum SyntaxKind {
    ObjectLiteralExpression = 1
  }

  export type Expression = {
    getText(): string;
  };
}

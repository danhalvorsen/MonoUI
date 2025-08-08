import type { IFilePath } from "./IFilePath.js";
import type { IFileOperation } from "./IFileOperation.js";
import { NodeFilePath } from "./NodeFilePath.js";
import { NodeFileOperation } from "./NodeFileOperation.js";
import { MockFileOperation } from "./MockFileOperation.js";
import type { Builder } from "./Builder.js";
import { FluentBuilder } from "./Builder.js";

export interface IFileOps {
  readonly path: IFilePath;
  readonly file: IFileOperation;
}

export type PathFactory = () => IFilePath;
export type FileFactory = () => IFileOperation;

export class FileOperationsBuilder
  extends FluentBuilder<IFileOps, FileOperationsBuilder>
  implements Builder<IFileOps> {

  private pathFactory: PathFactory = () => new NodeFilePath();
  private fileFactory: FileFactory = () => new NodeFileOperation();

  /** Explicit Node preset (prod default). */
  forNode(): this {
    this.pathFactory = () => new NodeFilePath();
    this.fileFactory = () => new NodeFileOperation();
    return this;
  }

  /** Useful in tests: keep Node paths, in-memory file IO. */
  forInMemory(): this {
    this.pathFactory = () => new NodeFilePath();
    this.fileFactory = () => new MockFileOperation();
    return this;
  }

  /** Precise DI: use given instance (will be used as-is). */
  withPath(path: IFilePath): this {
    this.pathFactory = () => path;
   return this;;
  }

  withFile(file: IFileOperation): this {
    this.fileFactory = () => file;
  return this;;
  }

  /** Lazily construct dependencies (Open–Closed for new envs). */
  withPathFactory(factory: PathFactory): this {
    this.pathFactory = factory;
  return this;;
  }

  withFileFactory(factory: FileFactory): this {
    this.fileFactory = factory;
  return this;;
  }

  build(): IFileOps {
    return {
      path: this.pathFactory(),
      file: this.fileFactory(),
    };
  }

  /** Convenience static for Node. */
  static node(): IFileOps {
    return new FileOperationsBuilder().forNode().build();
  }
}

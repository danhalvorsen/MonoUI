// packages/virtual-filesystem/tests/fakes/FakeGlobService.ts
import type { IGlobService, GlobOptions } from "../../src/glob/IGlobService.js";

export class FakeGlobService implements IGlobService {
  constructor(
    private readonly files: string[] = [],
    private readonly dirs: string[] = []
  ) {}
  async glob(_patterns: string[] | string, options: GlobOptions): Promise<string[]> {
    if (options.onlyFiles) return this.files;
    if (options.onlyDirectories) return this.dirs;
    return [];
  }
}

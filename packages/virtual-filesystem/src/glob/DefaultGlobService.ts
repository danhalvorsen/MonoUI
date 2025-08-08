// packages/virtual-filesystem/src/glob/DefaultGlobService.ts
import fg from "fast-glob";
import type { IGlobService, GlobOptions } from "./IGlobService.js";

type FGStrings = (patterns: string | string[], options: unknown) => Promise<string[]>;
const fgStrings: FGStrings = fg as unknown as FGStrings;

export class DefaultGlobService implements IGlobService {
  async glob(patterns: string[] | string, options: GlobOptions): Promise<string[]> {
    return fgStrings(patterns, { ...options, objectMode: false });
  }
}

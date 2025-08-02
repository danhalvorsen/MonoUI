import { Result } from '@mr/design-patterns';
import { IWorkResult } from '../IWorkDefinition.js';

/**
 * Creates a result object for when no export files are found
 * @param packageName Package name
 * @returns Result with no files information
 */

export function createNoFilesResult(packageName: string): Result<IWorkResult> {
  return Result.ok({
    message: `No export files found in ${packageName}`,
    fileCount: 0,
    toString() {
      return this.message;
    }
  });
}

// Update the import path if the file is located elsewhere, for example:
import { IWorkResult } from './IWorkDefinition.js';
// or provide the correct relative path to where IWorkDefinition is defined

/**
 * Creates an error result object
 * @param message Error message
 * @param error Optional error object
 * @returns Work result with error information
 */
export function createErrorResult(message: string | unknown, error?: unknown): IWorkResult {
  const result: IWorkResult = {
    success: false,
    message: typeof message === 'string' ? message : String(message),
    error,
    toString() {
      return typeof this.message === 'string' ? this.message : String(this.message ?? '');
    }
  };
  return result;
}

export function createSuccessResult(
  packageName: string,
  exportFiles: string[],
  barrelPath: string,
  dryRun: boolean
): IWorkResult {
  const message = dryRun
    ? `[DRY RUN] Generated barrel file for ${packageName} with ${exportFiles.length} exports`
    : `Generated barrel file for ${packageName} with ${exportFiles.length} exports`;

const result: IWorkResult = {
    success: true,
    message,
    fileCount: exportFiles.length,
    barrelPath,
    toString() {
        return this.message ?? '';
    }
};
  
  return result;
}
export function createNoFilesResult(packageName: string): IWorkResult {
  const result: IWorkResult = {
    success: true,
    message: `No export files found in ${packageName}`,
    fileCount: 0,
    toString() {
      return this.message;
    }
  };
  
  return result;
}
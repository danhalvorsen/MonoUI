import { Result } from '@mr/design-patterns';
import { IFileOperations } from '../../../../file-operations/IFileOperations.js';

/**
 * Service that finds TypeScript files containing export statements
 */
export class ExportFileFinder {
  /**
   * Constructor
   * @param fileOps File operations service
   */
  constructor(private fileOps: IFileOperations) {}

  /**
   * Find all TypeScript files in the directory that contain export statements
   * @param srcDir Source directory to search
   * @returns Result with array of file paths
   */
  async findFiles(srcDir: string): Promise<Result<string[]>> {
    try {
      if (!srcDir) {
        return Result.fail('Source directory path is required');
      }

      // Verify source directory exists
      if (!await this.fileOps.exists(srcDir)) {
        return Result.fail(`Source directory ${srcDir} does not exist`);
      }

      // Find all TypeScript files in the directory, excluding test files and barrel files
      const pattern = `${srcDir}/**/*.ts`;
      const options = {
        ignore: [
          `${srcDir}/**/*.spec.ts`,
          `${srcDir}/**/*.test.ts`,
          `${srcDir}/**/index.ts`
        ]
      };

      let tsFiles: string[];
      try {
        tsFiles = await this.fileOps.findFiles(pattern, options);
      } catch (error) {
        console.error(`[ExportFileFinder] Error finding TypeScript files: ${error}`);
        return Result.fail(`Failed to find TypeScript files: ${error}`);
      }

      if (tsFiles.length === 0) {
        return Result.ok([]);
      }

      // Filter files to only include those with export statements
      const exportFiles: string[] = [];

      for (const file of tsFiles) {
        try {
          const content = await this.fileOps.readFile(file);
          
          // Check if the file has any export statements
          if (/\bexport\b/.test(content)) {
            exportFiles.push(file);
          }
        } catch (error) {
          // Log but continue with other files
          console.warn(`[ExportFileFinder] Could not read file ${file}: ${error}`);
        }
      }

      return Result.ok(exportFiles);
    } catch (error) {
      console.error(`[ExportFileFinder] Unexpected error finding export files: ${error}`);
      return Result.fail(`Error finding export files: ${error}`);
    }
  }
}
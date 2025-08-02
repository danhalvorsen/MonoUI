import { Result } from '@mr/design-patterns';
import { BaseSpecification } from 'rule-engine';
import { IFileOperations } from '../../file-operations/IFileOperations.js';

export interface ExportFileCheckContext {
  srcDir: string;
  fileOperations: IFileOperations;
  file?: string;
  content?: string;
}

/**
 * Collection of specifications for validating and finding export files
 */
export class ExportFileSpecifications {
  /**
   * Factory method to create a function that checks if source directory exists
   * @returns A function that evaluates the existence of the source directory
   */
  static createSrcDirExistsCheck(): (context: ExportFileCheckContext) => Promise<boolean> {
    return async (context: ExportFileCheckContext): Promise<boolean> => {
      return await context.fileOperations.exists(context.srcDir);
    };
  }

  /**
   * Checks if a file is a TypeScript file (excluding test files and barrel files)
   */
  static isValidTypeScriptFile = new BaseSpecification<ExportFileCheckContext>((context: ExportFileCheckContext): boolean => {
    const file = context.file;
    if (!file) return false;
    
    return file.endsWith('.ts') &&
      !file.endsWith('.spec.ts') &&
      !file.endsWith('.test.ts') &&
      !file.endsWith('/index.ts') &&
      !file.includes('\\index.ts');
  });

  /**
   * Checks if a file contains export statements
   */
  static containsExports = new BaseSpecification<ExportFileCheckContext>((context: ExportFileCheckContext): boolean => {
    const content = context.content;
    if (!content) return false;
    
    return /\bexport\b/.test(content);
  });

  /**
   * Helper method to check source directory existence asynchronously
   * @param context The validation context
   * @returns Boolean indicating if the source directory exists
   */
  static async checkSrcDirExists(context: ExportFileCheckContext): Promise<boolean> {
    const srcDirExistsCheck = this.createSrcDirExistsCheck();
    return await srcDirExistsCheck(context);
  }

  /**
   * Finds all TypeScript files in the source directory
   * @param context The context with file operations and source directory
   * @returns Result containing array of file paths or error
   */
  static async findTsFiles(context: ExportFileCheckContext): Promise<Result<string[]>> {
    try {
      const pattern = `${context.srcDir}/**/*.ts`;
      const options = {
        ignore: [
          `${context.srcDir}/**/*.spec.ts`,
          `${context.srcDir}/**/*.test.ts`,
          `${context.srcDir}/**/index.ts`
        ]
      };
      
      return Result.ok(await context.fileOperations.findFiles(pattern, options));
    } catch (error) {
      return Result.fail(`Failed to find TypeScript files: ${error}`);
    }
  }

  /**
   * Filters files to only include those with export statements
   * @param context The context with file operations
   * @param files Array of file paths to check
   * @returns Result containing filtered array of file paths
   */
  static async filterExportFiles(context: ExportFileCheckContext, files: string[]): Promise<Result<string[]>> {
    try {
      const exportFiles: string[] = [];
      
      for (const file of files) {
        try {
          const fileContext = { ...context, file, content: await context.fileOperations.readFile(file) };
          
          // Use the specification for consistent validation
          if (this.containsExports.isSatisfiedBy(fileContext)) {
            exportFiles.push(file);
          }
        } catch (error) {
          this.logError(`Error reading file ${file}`, error);
          // Continue with other files even if one fails
        }
      }
      
      return Result.ok(exportFiles);
    } catch (error) {
      return Result.fail(`Error filtering export files: ${error}`);
    }
  }
  
  /**
   * Finds all TypeScript files with exports in a directory
   * @param context The context with file operations and directory
   * @returns Result containing array of files with exports
   */
  static async findFilesWithExports(context: ExportFileCheckContext): Promise<Result<string[]>> {
    try {
      // First check if directory exists
      if (!await this.checkSrcDirExists(context)) {
        return Result.fail(`Source directory ${context.srcDir} does not exist`);
      }
      
      // Find TypeScript files
      const filesResult = await this.findTsFiles(context);
      if (!filesResult.isSuccess) {
        return filesResult;
      }
      
      // Filter files with exports
      if (!filesResult.value) {
        return Result.fail('No files found to filter for exports');
      }
      return await this.filterExportFiles(context, filesResult.value);
    } catch (error) {
      return Result.fail(`Error finding files with exports: ${error}`);
    }
  }
  
  /**
   * Logs errors with consistent formatting
   * @param message The error message
   * @param detail Additional error details
   */
  private static logError(message: string, detail?: unknown): void {
    if (detail !== undefined) {
      console.log(`[ExportFileFinder] ${message}: ${detail}`);
    } else {
      console.log(`[ExportFileFinder] ${message}`);
    }
  }
}
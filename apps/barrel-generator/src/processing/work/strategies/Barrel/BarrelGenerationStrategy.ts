import { Result } from '@mr/design-patterns';
import * as path from 'path';
import { FileOperations } from '../../../../file-operations/FileOperations.js';
import { TsConfigValidator } from '../../../../validation/specifications/TsConfigValidator.js';
import { ExportFileFinder } from './ExportFileFinder.js';
import { IWorkDefinition, IWorkContext, IWorkResult } from '../IWorkDefinition.js';
import { formatBarrelContent } from './formatBarrelContent.js';
import { createSuccessResult, createErrorResult } from '../createResultMessage.js';
import { createNoFilesResult } from './createNoFilesResult.js';

/**
 * Strategy for generating barrel files in packages
 */
export class BarrelGenerationStrategy implements IWorkDefinition {  
  private fileOps: FileOperations;
  private tsConfigValidator: TsConfigValidator;
  private exportFileFinder: ExportFileFinder;
  
  /**
   * Creates a new barrel generation strategy
   * @param fileOps Optional file operations dependency for testing
   * @param tsConfigValidator Optional tsconfig validator dependency for testing
   * @param exportFileFinder Optional export file finder dependency for testing
   */
  constructor(
    fileOps?: FileOperations,
    tsConfigValidator?: TsConfigValidator,
    exportFileFinder?: ExportFileFinder
  ) {
    this.fileOps = fileOps || new FileOperations();
    this.tsConfigValidator = tsConfigValidator || new TsConfigValidator(this.fileOps);
    this.exportFileFinder = exportFileFinder || new ExportFileFinder(this.fileOps);
  }
  
  /**
   * Validates the tsconfig.json in the given package path.
   */
  async validateTsConfig(packagePath: string) {
    return this.tsConfigValidator.validate(packagePath);
  }

  /**
   * Checks if source directory exists
   * @param packagePath Package path
   * @returns Whether the src directory exists
   */
  async srcDirectoryExists(packagePath: string): Promise<boolean> {
    const srcDir = path.join(packagePath || '', 'src');
    return this.fileOps.exists(srcDir);
  }

  /**
   * Gets the source directory path
   * @param packagePath Package path
   * @returns Source directory path
   */
  getSrcDirPath(packagePath: string): string {
    return path.join(packagePath || '', 'src');
  }

  /**
   * Finds export files in the source directory
   * @param srcDir Source directory
   * @returns Result with array of export files
   */
  async findExportFiles(srcDir: string): Promise<Result<string[]>> {
    return this.exportFileFinder.findFiles(srcDir);
  }

  /**
   * Writes barrel file to disk or simulates write in dry run mode
   * @param barrelPath Path to barrel file
   * @param barrelContent Barrel file content
   * @param dryRun Whether this is a dry run
   */
  async writeBarrelFile(barrelPath: string, barrelContent: string, dryRun: boolean): Promise<void> {
    if (dryRun) {
      console.log(`[DRY RUN] Would write barrel file to ${barrelPath}`);
      console.log(`[DRY RUN] Content:`);
      console.log(barrelContent);
    } else {
      await this.fileOps.writeFile(barrelPath, barrelContent);
    }
  }

  /**
   * Executes the barrel generation strategy
   */
  async execute(context: IWorkContext): Promise<IWorkResult> {
    try {
      const { packagePath, packageName, options } = context;
      
      console.log(`[BarrelGeneration] Generating barrel file for package: ${packageName} with packagePath: ${packagePath}`);

      // Verify tsconfig.json has rootDir set to "src"
      const tsconfigValidation = await this.validateTsConfig(packagePath || '');
      if (!tsconfigValidation.isSuccess) {
        const errorResult: IWorkResult = {
          success: false,
          message: tsconfigValidation.errors?.toString() || 'Invalid tsconfig.json',
          error: tsconfigValidation.errors,
          toString: function() {
            return typeof errorResult.message === 'string' ? errorResult.message : '';
          }
        };
        return errorResult;
      }

      // Check if src directory exists
      const srcDir = this.getSrcDirPath(packagePath || '');
      if (!await this.srcDirectoryExists(packagePath || '')) {
        const result: IWorkResult = {
          success: false,
          message: `Package ${packageName} has no src directory`,
          toString() {
            return typeof result.message === 'string' ? result.message : '';
          }
        };
        return createErrorResult(result.message);
      }

      // Find export files
      const exportFilesResult = await this.findExportFiles(srcDir);
      if (!exportFilesResult.isSuccess) {
        return createErrorResult(exportFilesResult.errors?.toString() || 'Failed to find export files');
      }

      // Get files to export
      const exportFiles = exportFilesResult.value;
      
      if (!exportFiles || exportFiles.length === 0) {
        // createNoFilesResult returns Result<IWorkResult>, so extract value
        const noFilesResult = await createNoFilesResult(packageName);
        if (noFilesResult.isSuccess && noFilesResult.value) {
          return noFilesResult.value;
        } else {
          return {
            success: false,
            message: noFilesResult.errors?.toString() || 'No files to export',
            error: noFilesResult.errors,
            toString(this: IWorkResult) {
              return typeof this.message === 'string' ? this.message : '';
            }
          };
        }
      }

      // Generate barrel file content
      const barrelContent = formatBarrelContent(
        exportFiles, 
        srcDir,
        (from, to) => this.fileOps.getRelativePath(from, to)
      );

      // Barrel file path
      const barrelPath = path.join(srcDir, 'index.ts');

      // Write or simulate write
      const safeOptions = options ?? {};
      await this.writeBarrelFile(barrelPath, barrelContent, safeOptions.dryRun || false);

      const successResult =  createSuccessResult(packageName, exportFiles, barrelPath, safeOptions.dryRun || false);
      return successResult.success ?  successResult:  createErrorResult(successResult.message);

    } catch (error) {
      const message = `Error generating barrel file: ${error}`;
      console.error(`[BarrelGeneration] ${message}`);
      const errorResult: IWorkResult = {
        success: false,
        message,
        error,
        toString() {
          return typeof errorResult.message === 'string' ? errorResult.message : '';
        }
      };
      return errorResult;
    }
  }
}
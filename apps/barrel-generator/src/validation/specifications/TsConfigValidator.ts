import { Result } from '@mr/design-patterns';
import { IFileOperations } from '../../file-operations/IFileOperations.js';
import { TsConfigSpecifications, TsConfigCheckContext } from './TsConfigSpecifications.js';

/**
 * Validates TypeScript configuration files using specification pattern
 */
export class TsConfigValidator {
  constructor(private fileOps: IFileOperations) {}

  /**
   * Validates that the tsconfig.json file exists and has rootDir set to "src"
   * @param packagePath Path to the package to validate
   * @returns Result indicating success or failure with detailed error messages
   */
  async validate(packagePath: string): Promise<Result<boolean>> {
    try {
      // Create initial validation context
      const context = this.createValidationContext(packagePath);
      
      // Execute validation pipeline
      return await this.executeValidationPipeline(context);
    } catch (error) {
      return this.handleUnexpectedError(error);
    }
  }

  /**
   * Creates the validation context with the package path and file operations
   */
  private createValidationContext(packagePath: string): TsConfigCheckContext {
    return {
      packagePath,
      fileOperations: this.fileOps
    };
  }

  /**
   * Executes the validation pipeline in sequence
   */
  private async executeValidationPipeline(context: TsConfigCheckContext): Promise<Result<boolean>> {
    // Step 1: Validate file existence
    const fileExistsResult = await this.validateFileExists(context);
    if (!fileExistsResult.isSuccess) {
      return fileExistsResult;
    }

    // Step 2: Load and parse the tsconfig
    const loadResult = await this.loadAndParseTsConfig(context);
    if (!loadResult.isSuccess) {
      return loadResult;
    }

    // Step 3: Validate tsconfig structure
    const structureResult = this.validateTsConfigStructure(context);
    if (!structureResult.isSuccess) {
      return structureResult;
    }

    // Step 4: Validate rootDir configuration
    return this.validateRootDir(context);
  }

  /**
   * Validates that the tsconfig.json file exists
   */
  private async validateFileExists(context: TsConfigCheckContext): Promise<Result<boolean>> {
    // Using the helper method instead of the BaseSpecification
    if (!await TsConfigSpecifications.checkFileExists(context)) {
      this.logValidationFailure('No tsconfig.json found', `${context.packagePath}/tsconfig.json`);
      return Result.fail('tsconfig.json not found');
    }
    return Result.ok(true);
  }

  /**
   * Loads and parses the tsconfig.json file
   */
  private async loadAndParseTsConfig(context: TsConfigCheckContext): Promise<Result<boolean>> {
    const loadResult = await TsConfigSpecifications.loadTsConfig(context);
    if (!loadResult.isSuccess) {
      return loadResult.flatMap(() => Result.fail<boolean>(loadResult.errors || []));
    }
    
    // Update context with loaded tsconfig
    context.tsconfig = loadResult.value;
    return Result.ok(true);
  }

  /**
   * Validates the structure of the tsconfig.json file
   */
  private validateTsConfigStructure(context: TsConfigCheckContext): Result<boolean> {
    if (!TsConfigSpecifications.hasValidStructure.isSatisfiedBy(context)) {
      this.logValidationFailure('tsconfig is not a valid object');
      return Result.fail('Invalid tsconfig.json structure');
    }

    if (!TsConfigSpecifications.hasRootDir.isSatisfiedBy(context)) {
      this.logValidationFailure('rootDir is not defined or not a valid string');
      return Result.fail('rootDir is not defined in tsconfig.json');
    }
    
    return Result.ok(true);
  }

  /**
   * Validates that rootDir is set to 'src'
   */
  private validateRootDir(context: TsConfigCheckContext): Result<boolean> {
    if (!TsConfigSpecifications.rootDirIsSrc.isSatisfiedBy(context)) {
      const rootDir = context.tsconfig.compilerOptions.rootDir;
      this.logValidationFailure(`rootDir "${rootDir}" does not match expected "src"`);
      return Result.fail(`rootDir "${rootDir}" does not match expected "src"`);
    }
    
    return Result.ok(true);
  }

  /**
   * Handles unexpected errors during validation
   */
  private handleUnexpectedError(error: unknown): Result<boolean> {
    this.logValidationFailure('Unexpected error validating tsconfig.json', error);
    return Result.fail(`Unexpected error validating tsconfig.json: ${error}`);
  }
  
  /**
   * Logs validation failures with consistent formatting
   */
  private logValidationFailure(message: string, detail?: unknown): void {
    if (detail !== undefined) {
      console.log(`[TsConfigValidator] ${message}: ${detail}`);
    } else {
      console.log(`[TsConfigValidator] ${message}`);
    }
  }
}
import { Result } from "@mr/design-patterns";
import { BaseSpecification } from "rule-engine";
import { IFileOperations } from "../../file-operations/IFileOperations.js";

export interface TsConfigCheckContext {
  packagePath: string;
  fileOperations: IFileOperations;
  tsconfig?: any;
}

/**
 * Collection of specifications for validating tsconfig.json
 */
export class TsConfigSpecifications {
  /**
   * Checks if tsconfig.json file exists
   */
  static async checkFileExists(context: TsConfigCheckContext): Promise<boolean> {
    try {
      // Fix: Ensure we're passing the path correctly
      // We don't need to use joinPaths here, we can construct the path directly
      const tsconfigPath = `${context.packagePath}/tsconfig.json`;
      console.log(`[DEBUG] Checking if exists: ${tsconfigPath}`);
      return await context.fileOperations.exists(tsconfigPath);
    } catch (error) {
      console.error(`[TsConfigSpecifications] Error checking file existence: ${error}`);
      return false;
    }
  }

  /**
   * Specification to check if tsconfig.json has valid structure
   */
  static hasValidStructure = new BaseSpecification<TsConfigCheckContext>((context) => {
    return (
      !!context.tsconfig &&
      typeof context.tsconfig === 'object' &&
      !!context.tsconfig.compilerOptions &&
      typeof context.tsconfig.compilerOptions === 'object'
    );
  });

  /**
   * Specification to check if tsconfig.json has rootDir property
   */
  static hasRootDir = new BaseSpecification<TsConfigCheckContext>((context) => {
    return (
      !!context.tsconfig?.compilerOptions?.rootDir &&
      typeof context.tsconfig.compilerOptions.rootDir === 'string'
    );
  });

  /**
   * Specification to check if rootDir is set to "src"
   */
  static rootDirIsSrc = new BaseSpecification<TsConfigCheckContext>((context) => {
    if (!context.tsconfig?.compilerOptions?.rootDir) {
      return false;
    }
    
    const rootDir = context.tsconfig.compilerOptions.rootDir
      .replace(/^\.\//, '') // Remove leading ./
      .replace(/\/$/, '');  // Remove trailing /
    
    return rootDir === 'src';
  });

  /**
   * Loads tsconfig.json file and parses it
   */
  static async loadTsConfig(context: TsConfigCheckContext): Promise<Result<any>> {
    try {
      // Fix: Ensure we're passing the path correctly
      // We don't need to use joinPaths here, we can construct the path directly
      const tsconfigPath = `${context.packagePath}/tsconfig.json`;
      console.log(`[DEBUG] Reading file: ${tsconfigPath}`);
      const content = await context.fileOperations.readFile(tsconfigPath);
      
      try {
        const tsconfig = JSON.parse(content);
        return Result.ok(tsconfig);
      } catch (error) {
        console.error(`[TsConfigValidator] Invalid JSON in tsconfig.json: ${error}`);
        return Result.fail(`Invalid JSON in tsconfig.json: ${error}`);
      }
    } catch (error) {
      console.error(`[TsConfigValidator] Error reading tsconfig.json: ${error}`);
      return Result.fail(`Failed to read tsconfig.json: ${error}`);
    }
  }
}
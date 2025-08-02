import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@mr/design-patterns';
import { BarrelGenerationStrategy } from '../src/processing/work/strategies/Barrel/BarrelGenerationStrategy.js';
import { IWorkContext } from '../src/processing/work/strategies/IWorkDefinition.js';
import { FileOperations } from '../src/file-operations/FileOperations.js';
import { InMemoryFileSystem } from './InMemoryFileSystem.js';
import * as path from 'path';

describe('BarrelGenerationStrategy', () => {
  // Test fixture containing all shared test data and helpers
  interface TestFixture {
    fileSystem: InMemoryFileSystem;
    fileOps: FileOperations;
    strategy: BarrelGenerationStrategy;
    createContext(options?: Partial<IWorkContext>): IWorkContext;
    runTest(contextOptions?: Partial<IWorkContext>): Promise<Result<any>>;
  }
  
  /**
   * Creates a baseline test fixture with all common setup
   */
  function createFixture(): TestFixture {
    // Create in-memory file system
    const fileSystem = new InMemoryFileSystem();
    const fileOps = new FileOperations();
    
    // Create the strategy with our file operations
    const strategy = new BarrelGenerationStrategy(fileOps);
    
    // Set up test package structure
    const packageRoot = '/test/packages/test-package';
    const srcDir = path.join(packageRoot, 'src');
    
    // Create directories
    fileSystem.createDirectory(packageRoot);
    fileSystem.createDirectory(srcDir);
    
    fileSystem.writeFile(
      path.join(packageRoot, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          rootDir: './src'
        }
      })
    );
    
    // Create source files with export statements
    fileSystem.writeFile(
      path.join(srcDir, 'file1.ts'),
      'export const value1 = "test";'
    );
    
    fileSystem.writeFile(
      path.join(srcDir, 'file2.ts'),
      'export class TestClass {}'
    );
    
    // Helper to create a standard test context
    const createContext = (options?: Partial<IWorkContext>): IWorkContext => ({
      packagePath: packageRoot,
      packageName: 'test-package',
      options: {
        dryRun: true,
        ...options?.options
      },
      ...options
    });
    
    // Helper to run a test with the strategy
    const runTest = async (contextOptions?: Partial<IWorkContext>): Promise<Result<any>> => {
      const context = createContext(contextOptions);
      const workResult = await strategy.execute(context);
      
      if (workResult.success) {
        // For successful results
        return Result.ok({
          fileCount: workResult.fileCount || 0,
          barrelPath: workResult.barrelPath,
          ...workResult
        });
      } else {
        // For error results
        // Create an array with the error message for compatibility with tests
        const errorMessages = typeof workResult.message === 'string'
          ? [workResult.message]
          : workResult.error 
            ? [workResult.error.toString()] 
            : ['Unknown error'];
            
        return Result.fail(errorMessages);
      }
    };
    
    return { fileSystem, fileOps, strategy, createContext, runTest };
  }
  
  // Fresh fixture for each test
  let fixture: TestFixture;
  
  beforeEach(() => {
    fixture = createFixture();
  });
  it('should successfully generate barrel file when all conditions are met', async () => {
  try {
    // Arrange
    const writeFileSpy = vi.spyOn(fixture.fileSystem, 'writeFile');
    
    // Act
    const result = await fixture.runTest();
    
    // Debug output
    console.log('Test result:', JSON.stringify(result, null, 2));
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).toContain('[DRY RUN]');
    expect(result.value?.message).toContain('Generated barrel file');
    expect(result.value?.fileCount).toBe(2);
    // In dry run mode, the file should not be written
    expect(writeFileSpy).not.toHaveBeenCalledWith(
      '/test/packages/test-package/src/index.ts', 
      expect.anything()
    );
  } catch (error) {
    // Capture and log the full error with stack trace
    const errorWithStack = error instanceof Error 
      ? { message: error.message, stack: error.stack } 
      : { error: String(error) };
    
    console.error('Test failed with error:', JSON.stringify(errorWithStack, null, 2));
    throw error;
  }
});
  it('should fail when package has no src directory', async () => {
    // Arrange - delete src directory
    fixture.fileSystem.deleteDirectory('/test/packages/test-package/src');
    
    // Act
    const result = await fixture.runTest();
    
    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.errors?.[0]).toContain('no src directory');
  });
  
  it('should handle when no export files are found', async () => {
    // Arrange - delete the export files
    fixture.fileSystem.deleteFile('/test/packages/test-package/src/file1.ts');
    fixture.fileSystem.deleteFile('/test/packages/test-package/src/file2.ts');
    
    // Act
    const result = await fixture.runTest();
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).toBe('No export files found in test-package');
    expect(result.value?.fileCount).toBe(0);
  });
  
  it('should write file in non-dry-run mode', async () => {
    // Arrange
    const writeFileSpy = vi.spyOn(fixture.fileSystem, 'writeFile');
    
    // Act
    const result = await fixture.runTest({
      options: { dryRun: false }
    });
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).not.toContain('[DRY RUN]');
    expect(result.value?.fileCount).toBe(2);
    
    // Check that file was written
    expect(writeFileSpy).toHaveBeenCalledWith(
      '/test/packages/test-package/src/index.ts',
      expect.stringContaining("export * from './file1.js'")
    );
    
    // Check file content directly
    const barrelContent = fixture.fileSystem.readFile('/test/packages/test-package/src/index.ts');
    expect(barrelContent).toContain("export * from './file1.js'");
    expect(barrelContent).toContain("export * from './file2.js'");
  });
  
  it('should fail with invalid tsconfig.json', async () => {
    // Arrange - update tsconfig with invalid rootDir
    fixture.fileSystem.writeFile(
      '/test/packages/test-package/tsconfig.json',
      JSON.stringify({
        compilerOptions: {
          rootDir: './different-dir'
        }
      })
    );
    
    // Act
    const result = await fixture.runTest();
    
    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.errors?.[0]).toContain('does not have rootDir set to "src"');
  });
});
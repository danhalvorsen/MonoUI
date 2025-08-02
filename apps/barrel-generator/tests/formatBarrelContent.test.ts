import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@mr/design-patterns';
import { BarrelGenerationStrategy } from '../src/processing/work/strategies/Barrel/BarrelGenerationStrategy.js';
import { IWorkContext } from '../src/processing/work/strategies/IWorkDefinition.js';
import { MockFileOperations } from '../src/file-operations/MockFileOperations.js';

describe('BarrelGenerationStrategy', () => {
  // Test fixture containing all shared test data and helpers
  interface TestFixture {
    fileOps: MockFileOperations;
    strategy: BarrelGenerationStrategy;
    createContext(options?: Partial<IWorkContext>): IWorkContext;
    runTest(contextOptions?: Partial<IWorkContext>): Promise<Result<any>>;
  }
  
  /**
   * Creates a baseline test fixture with all common setup
   */
  function createFixture(): TestFixture {
    const fileOps = new MockFileOperations();
    const strategy = new BarrelGenerationStrategy(fileOps);
    
    // Set up default mocked behavior
    fileOps.mockExists('/test/packages/test-package/src', true);
    fileOps.mockExists('/test/packages/test-package/tsconfig.json', true);
    
    // Mock tsconfig.json content
    fileOps.mockFile('/test/packages/test-package/tsconfig.json', JSON.stringify({
      compilerOptions: {
        rootDir: './src'
      }
    }));
    
    // Mock source files to find
    fileOps.mockGlob('/test/packages/test-package/src/**/*.ts', [
      '/test/packages/test-package/src/file1.ts',
      '/test/packages/test-package/src/file2.ts'
    ]);
    
    // Mock file contents with export statements
    fileOps.mockFile('/test/packages/test-package/src/file1.ts', 'export const value1 = "test";');
    fileOps.mockFile('/test/packages/test-package/src/file2.ts', 'export class TestClass {}');
    
    // Helper to create a standard test context
    const createContext = (options?: Partial<IWorkContext>): IWorkContext => ({
      packagePath: '/test/packages/test-package',
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
      
      // Convert IWorkResult to Result<any>
      if (workResult.success === true) {
        return Result.ok({
          fileCount: workResult.fileCount,
          barrelPath: workResult.barrelPath,
          ...workResult
        });
      } else {
        return Result.fail(workResult.message || workResult.error?.toString() || 'Unknown error');
      }
    };
    
    return { fileOps, strategy, createContext, runTest };
  }
  
  // Fresh fixture for each test
  let fixture: TestFixture;
  
  beforeEach(() => {
    fixture = createFixture();
  });
  
  it('should successfully generate barrel file when all conditions are met', async () => {
    // Arrange
    const writeFileSpy = vi.spyOn(fixture.fileOps, 'writeFile');
    
    // Act
    const result = await fixture.runTest();
    
    // Debug output
    console.log('Test result:', JSON.stringify(result, null, 2));
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).toContain('[DRY RUN]');
    expect(result.value?.message).toContain('Generated barrel file');
    expect(result.value?.fileCount).toBe(2);
    expect(writeFileSpy).not.toHaveBeenCalled();
  });
  
  it('should fail when package has no src directory', async () => {
    // Arrange
    fixture.fileOps.mockExists('/test/packages/test-package/src', false);
    
    // Act
    const result = await fixture.runTest();
    
    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.errors?.[0]).toContain('no src directory');
  });
  
  it('should handle when no export files are found', async () => {
    // Arrange
    fixture.fileOps.mockGlob('/test/packages/test-package/src/**/*.ts', []);
    
    // Act
    const result = await fixture.runTest();
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).toBe('No export files found in test-package');
    expect(result.value?.fileCount).toBe(0);
  });
  
  it('should write file in non-dry-run mode', async () => {
    // Arrange
    const writeFileSpy = vi.spyOn(fixture.fileOps, 'writeFile');
    
    // Act
    const result = await fixture.runTest({
      options: { dryRun: false }
    });
    
    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).not.toContain('[DRY RUN]');
    expect(result.value?.fileCount).toBe(2);
    expect(writeFileSpy).toHaveBeenCalled();
    
    // Check the file path and content
    const filePath = writeFileSpy.mock.calls[0][0];
    const content = writeFileSpy.mock.calls[0][1];
    expect(filePath).toBe('/test/packages/test-package/src/index.ts');
    expect(content).toContain("export * from './file1.js'");
    expect(content).toContain("export * from './file2.js'");
  });
  
  it('should fail with invalid tsconfig.json', async () => {
    // Arrange
    fixture.fileOps.mockFile('/test/packages/test-package/tsconfig.json', JSON.stringify({
      compilerOptions: {
        rootDir: './different-dir'
      }
    }));
    
    // Act
    const result = await fixture.runTest();
    
    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.errors?.[0]).toContain('does not have rootDir set to "src"');
  });
});
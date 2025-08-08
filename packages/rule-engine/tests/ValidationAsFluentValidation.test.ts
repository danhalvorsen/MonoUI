
import { MockFileOperations } from '../../../apps//barrel-generator/src/file-operations/MockFileOperations';
import { BarrelGenerationStrategy } from '../../../apps//barrel-generator/src/processing/work/strategies/Barrel/BarrelGenerationStrategy';
import { IWorkContext } from '../../../apps/barrel-generator/src/processing/work/strategies/IWorkDefinition';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('BarrelGenerationStrategy', () => {
  let mockFileOps: MockFileOperations;
  let strategy: BarrelGenerationStrategy;
  
  beforeEach(() => {
    // Create a fresh mock file operations for each test
    mockFileOps = new MockFileOperations();
    
    // Initialize the strategy with our mock
    strategy = new BarrelGenerationStrategy(mockFileOps);
    
    // Set up default mocked behavior
    mockFileOps.mockExists('/test/packages/test-package/src', true);
    mockFileOps.mockExists('/test/packages/test-package/tsconfig.json', true);
    
    // Mock tsconfig.json content
    mockFileOps.mockFile('/test/packages/test-package/tsconfig.json', JSON.stringify({
      compilerOptions: {
        rootDir: './src'
      }
    }));
    
    // Mock source files to find
    mockFileOps.mockGlob('/test/packages/test-package/src/**/*.ts', [
      '/test/packages/test-package/src/file1.ts',
      '/test/packages/test-package/src/file2.ts'
    ]);
    
    // Mock file contents with export statements
    mockFileOps.mockFile('/test/packages/test-package/src/file1.ts', 'export const value1 = "test";');
    mockFileOps.mockFile('/test/packages/test-package/src/file2.ts', 'export class TestClass {}');
  });
  
  it('should successfully generate barrel file when all conditions are met', async () => {
    // Arrange
    const mockContext: IWorkContext = {
      packagePath: '/test/packages/test-package',
      packageName: 'test-package',
      options: {
        dryRun: true
      }
    };
    
    // Spy on writeFile to verify it's not called in dry run mode
    const writeFileSpy = vi.spyOn(mockFileOps, 'writeFile');
    
    // Act
    const result = await strategy.execute(mockContext);
    
    // Debug output
    console.log('Test result:', JSON.stringify(result, null, 2));
    
    // Assert - updated for Result pattern
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).toContain('[DRY RUN]');
    expect(result.value?.message).toContain('Generated barrel file');
    expect(result.value?.fileCount).toBe(2);
    expect(writeFileSpy).not.toHaveBeenCalled();
  });
  
  it('should fail when package has no src directory', async () => {
    // Arrange - Override src directory existence for this test
    mockFileOps.mockExists('/test/packages/test-package/src', false);
    
    const mockContext: IWorkContext = {
      packagePath: '/test/packages/test-package',
      packageName: 'test-package',
      options: {
        dryRun: true
      }
    };
    
    // Act
    const result = await strategy.execute(mockContext);
    
    // Assert - updated for Result pattern
    expect(result.isSuccess).toBe(false);
    expect(result.errors?.[0]).toContain('no src directory');
  });
  
  it('should handle when no export files are found', async () => {
    // Arrange - Override glob results for this test to return empty array
    mockFileOps.mockGlob('/test/packages/test-package/src/**/*.ts', []);
    
    const mockContext: IWorkContext = {
      packagePath: '/test/packages/test-package',
      packageName: 'test-package',
      options: {
        dryRun: true
      }
    };
    
    // Act
    const result = await strategy.execute(mockContext);
    
    // Assert - updated for Result pattern
    expect(result.isSuccess).toBe(true);
    expect(result.value?.message).toBe('No export files found in test-package');
    expect(result.value?.fileCount).toBe(0);
  });
  
  it('should write file in non-dry-run mode', async () => {
    // Arrange
    const writeFileSpy = vi.spyOn(mockFileOps, 'writeFile');
    
    const mockContext: IWorkContext = {
      packagePath: '/test/packages/test-package',
      packageName: 'test-package',
      options: {
        dryRun: false
      }
    };
    
    // Act
    const result = await strategy.execute(mockContext);
    
    // Assert - updated for Result pattern
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
    // Arrange - Override tsconfig with invalid rootDir
    mockFileOps.mockFile('/test/packages/test-package/tsconfig.json', JSON.stringify({
      compilerOptions: {
        rootDir: './different-dir'
      }
    }));
    
    const mockContext: IWorkContext = {
      packagePath: '/test/packages/test-package',
      packageName: 'test-package',
      options: {
        dryRun: true
      }
    };
    
    // Act
    const result = await strategy.execute(mockContext);
    
    // Assert - updated for Result pattern
    expect(result.isSuccess).toBe(false);
    expect(result.errors?.[0]).toContain('does not have rootDir set to "src"');
  });
});
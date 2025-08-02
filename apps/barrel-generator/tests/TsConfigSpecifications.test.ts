import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TsConfigSpecifications, type TsConfigCheckContext } from '../src/validation/specifications/TsConfigSpecifications'; 

describe('TsConfigSpecifications', () => {
  const mockFileOperations = {
    joinPaths: vi.fn((base, ...segments) => {
      return `${base}/${segments.join('/')}`;
    }),
    exists: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    findFiles: vi.fn(),
    getRelativePath: vi.fn()
  };

  // Test context
  let context: TsConfigCheckContext;

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Set up default context
    context = {
      packagePath: '/test/package',
      fileOperations: mockFileOperations,
      tsconfig: {
        compilerOptions: {
          rootDir: 'src'
        }
      }
    };
  });
  
  describe('checkFileExists', () => {
    it('should return true when tsconfig.json exists', async () => {
      // Arrange
      mockFileOperations.exists.mockResolvedValue(true);
      
      // Act
      const result = await TsConfigSpecifications.checkFileExists(context);
      
      // Assert
      expect(result).toBe(true);
      expect(mockFileOperations.exists).toHaveBeenCalledWith('/test/package/tsconfig.json');
    });
    
    it('should return false when tsconfig.json does not exist', async () => {
      // Arrange
      mockFileOperations.exists.mockResolvedValue(false);
      
      // Act
      const result = await TsConfigSpecifications.checkFileExists(context);
      
      // Assert
      expect(result).toBe(false);
      expect(mockFileOperations.exists).toHaveBeenCalledWith('/test/package/tsconfig.json');
    });
  });
  
  describe('hasValidStructure', () => {
    it('should return true for valid tsconfig structure', () => {
      // Act
      const result = TsConfigSpecifications.hasValidStructure.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return false when tsconfig is undefined', () => {
      // Arrange
      context.tsconfig = undefined;
      
      // Act
      const result = TsConfigSpecifications.hasValidStructure.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should return false when compilerOptions is missing', () => {
      // Arrange
      context.tsconfig = {};
      
      // Act
      const result = TsConfigSpecifications.hasValidStructure.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should return false when compilerOptions is not an object', () => {
      // Arrange
      context.tsconfig = { compilerOptions: 'not-an-object' };
      
      // Act
      const result = TsConfigSpecifications.hasValidStructure.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('hasRootDir', () => {
    it('should return true when rootDir is defined', () => {
      // Act
      const result = TsConfigSpecifications.hasRootDir.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return false when rootDir is undefined', () => {
      // Arrange
      context.tsconfig = { compilerOptions: {} };
      
      // Act
      const result = TsConfigSpecifications.hasRootDir.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should return false when rootDir is not a string', () => {
      // Arrange
      context.tsconfig = { compilerOptions: { rootDir: 123 } };
      
      // Act
      const result = TsConfigSpecifications.hasRootDir.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('rootDirIsSrc', () => {
    it('should return true when rootDir is "src"', () => {
      // Act
      const result = TsConfigSpecifications.rootDirIsSrc.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return true when rootDir is "./src"', () => {
      // Arrange
      context.tsconfig = { compilerOptions: { rootDir: './src' } };
      
      // Act
      const result = TsConfigSpecifications.rootDirIsSrc.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return true when rootDir is "src/"', () => {
      // Arrange
      context.tsconfig = { compilerOptions: { rootDir: 'src/' } };
      
      // Act
      const result = TsConfigSpecifications.rootDirIsSrc.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(true);
    });
    
    it('should return false when rootDir is not "src"', () => {
      // Arrange
      context.tsconfig = { compilerOptions: { rootDir: 'lib' } };
      
      // Act
      const result = TsConfigSpecifications.rootDirIsSrc.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(false);
    });
    
    it('should return false when rootDir is undefined', () => {
      // Arrange
      context.tsconfig = { compilerOptions: {} };
      
      // Act
      const result = TsConfigSpecifications.rootDirIsSrc.isSatisfiedBy(context);
      
      // Assert
      expect(result).toBe(false);
    });
  });
  
  describe('loadTsConfig', () => {
    it('should return tsconfig when file is valid', async () => {
      // Arrange
      mockFileOperations.readFile.mockResolvedValue('{"compilerOptions":{"rootDir":"src"}}');
      
      // Act
      const result = await TsConfigSpecifications.loadTsConfig(context);
      
      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toEqual({ compilerOptions: { rootDir: 'src' } });
      expect(mockFileOperations.readFile).toHaveBeenCalledWith('/test/package/tsconfig.json');
    });
    
    it('should return error when file read fails', async () => {
      // Arrange
      mockFileOperations.readFile.mockRejectedValue(new Error('File not found'));
      
      // Act
      const result = await TsConfigSpecifications.loadTsConfig(context);
      
      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.errors?.[0]).toContain('Failed to read tsconfig.json');
    });
    
    it('should return error when JSON is invalid', async () => {
      // Arrange
      mockFileOperations.readFile.mockResolvedValue('{ invalid json');
      
      // Act
      const result = await TsConfigSpecifications.loadTsConfig(context);
      
      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.errors?.[0]).toContain('Invalid JSON in tsconfig.json');
    });
  });
});
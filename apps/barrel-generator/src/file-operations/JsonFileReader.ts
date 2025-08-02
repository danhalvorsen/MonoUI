import { readFileSync, existsSync } from 'fs';
import { BarrelConfiguration } from '../models/BarrelConfiguration.js';

/**
 * Handles reading and parsing JSON files
 */
export class JsonFileReader {
  /**
   * Reads and parses a JSON file into the specified type
   * @param filePath - Path to the JSON file
   * @returns Parsed JSON content as the specified type
   * @throws Error if file doesn't exist or contains invalid JSON
   */
  public readJson<T = unknown>(filePath: string): T {
    console.log(`Reading JSON file: ${filePath}`);                
    this.validateFilePath(filePath);
    
    try {
      const fileContent = readFileSync(filePath, 'utf8');
      console.log(`data from readJson: ${fileContent}`);              
      const json = this.parseJson<T>(fileContent);
      console.log(`Parsed JSON data: ${JSON.stringify(json)}`); 
      return json;

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to read or parse JSON file (${filePath}): ${error.message}`);
      }
      throw error;
    }
  }
  
  /**
   * Validates that the file exists
   * @param filePath - Path to check
   * @throws Error if file doesn't exist
   */
  private validateFilePath(filePath: string): void {
    if (!existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);                  
      throw new Error(`File does not exist: ${filePath}`);
    }
  }
  
  /**
   * Parses JSON content into the specified type
   * @param content - JSON content as a string
   * @returns Parsed JSON as the specified type
   */
  private parseJson<T>(content: string): T {
    return JSON.parse(content) as T;
  }
}

// Example usage (could be moved to a separate file)
export function loadConfiguration(configPath: string): BarrelConfiguration {
  try {
    const jsonReader = new JsonFileReader();
    const config = jsonReader.readJson<BarrelConfiguration>(configPath);
    console.log(`Config loaded: ${config.packagesPath} ${config.packages?.join(", ") || "No packages specified"} (dryRun: ${config.dryRun || false})`);
    return config;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error; // Re-throw to allow caller to handle the error
  }
}
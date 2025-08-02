/**
 * Model representing parsed command line arguments
 */
export interface ApplicationArgs {
  /**
   * The main command
   */
  command: string;
  
  /**
   * Key-value pairs for options
   */
  options: Record<string, string | boolean>;
  
  /**
   * List of positional arguments
   */
  positionals: string[];
}
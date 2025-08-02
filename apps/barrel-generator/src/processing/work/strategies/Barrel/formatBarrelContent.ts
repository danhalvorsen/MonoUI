/**
 * Formats barrel file content from export files
 * @param exportFiles Array of export file paths
 * @param srcDir Source directory path
 * @param getRelativePath Function to get relative path between directories
 * @returns Formatted barrel file content
 */

export function formatBarrelContent(
  exportFiles: string[],
  srcDir: string,
  getRelativePath: (from: string, to: string) => string
): string {
  return exportFiles
    .map(file => {
      // Get relative path from src directory
      const relativePath = getRelativePath(srcDir, file);
      // Convert to posix path and remove .ts extension
      const normalizedPath = relativePath
        .replace(/\\/g, '/')
        .replace(/\.ts$/, '.js');
      // Create export statement
      return `export * from './${normalizedPath}'`;
    })
    .join('\n');
}

declare module 'glob' {
  function glob(pattern: string, options?: any, callback?: (err: Error | null, matches: string[]) => void): void;
  namespace glob {
    function sync(pattern: string, options?: any): string[];
  }
  export = glob;
}

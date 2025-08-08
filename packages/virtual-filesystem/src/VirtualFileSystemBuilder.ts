 
 import type { IMutableFileSystem, IFileSystem } from "./Filesystem.js";

export class VirtualFileSystemBuilder {
  private fs: IMutableFileSystem = { files: new Map(), directories: new Set() };
  private makeImmutable = false;

  withFile(path: string, content: string): this {
    if (this.makeImmutable) throw new Error("Immutable FS");
    this.fs.files.set(path, content);
    return this;
  }

  withDirectory(path: string): this {
    if (this.makeImmutable) throw new Error("Immutable FS");
    this.fs.directories.add(path);
    return this;
  }

  withDeletedFile(path: string): this {
    if (this.makeImmutable) throw new Error("Immutable FS");
    this.fs.files.delete(path);
    return this;
  }

  withDeletedDirectory(path: string): this {
    if (this.makeImmutable) throw new Error("Immutable FS");
    this.fs.directories.delete(path);
    return this;
  }

  withReadFile(path: string, callback: (content: string) => void): this {
    const content = this.fs.files.get(path);
    if (content !== undefined) callback(content);
    return this;
  }

  withAssertExists(path: string, callback?: (exists: boolean) => void): this {
    const exists = this.fs.files.has(path) || this.fs.directories.has(path);
    callback?.(exists);
    return this;
  }

  withFindFiles(pattern: string, callback: (results: string[]) => void): this {
    const regex = this.globToRegex(pattern);
    const results = Array.from(this.fs.files.keys()).filter(f => regex.test(f));
    callback(results);
    return this;
  }

  withImmutable(state = true): this {
    this.makeImmutable = state;
    return this;
  }

  build(): IFileSystem {
    if (this.makeImmutable) {
      return {
        files: this.createReadOnlyMap(this.fs.files),
        directories: this.createReadOnlySet(this.fs.directories)
      };
    }
    return this.fs;
  }

private createReadOnlyMap<K, V>(map: Map<K, V>): ReadonlyMap<K, V> {
    return new Proxy(map, {
        get(target, prop, receiver) {
            if (["set", "delete", "clear"].includes(prop as string)) {
                throw new Error("Immutable Map");
            }
            const value = Reflect.get(target, prop, receiver);
            // Bind functions like get, has, keys to the original map
            if (typeof value === "function") {
                return value.bind(target);
            }
            return value;
        }
    });
}

private createReadOnlySet<T>(set: Set<T>): ReadonlySet<T> {
    return new Proxy(set, {
        get(target, prop, receiver) {
            if (["add", "delete", "clear"].includes(prop as string)) {
                throw new Error("Immutable Set");
            }
            const value = Reflect.get(target, prop, receiver);
            // Bind functions like has, entries, values to the original set
            if (typeof value === "function") {
                return value.bind(target);
            }
            return value;
        }
    });
}

  private globToRegex(pattern: string): RegExp {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    return new RegExp(`^${escaped}$`);
  }
}

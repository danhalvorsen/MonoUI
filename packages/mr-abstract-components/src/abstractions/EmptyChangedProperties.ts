// packages/mr-abstract-components/src/abstractions/EmptyChangedProperties.ts
import { IChangedProperties } from './IChangedProperties.js';

/**
 * A no-op, immutable implementation of IChangedProperties used when no properties have changed.
 */
export class EmptyChangedProperties implements IChangedProperties {
    static readonly instance = new EmptyChangedProperties();

    private constructor() {} // prevent external instantiation

    get<T = any>(key: string): T | undefined {
        return undefined;
    }

    set<T = any>(key: string, value: T): void {
        // no-op
    }

    keys(): string[] {
        return [];
    }

    hasChanged(key: string): boolean {
        return false;
    }

    [Symbol.iterator](): Iterator<[string, any]> {
        return {
            next: () => ({ done: true, value: undefined as any })
        };
    }
}

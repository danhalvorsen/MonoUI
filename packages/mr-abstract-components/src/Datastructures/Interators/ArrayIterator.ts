// packages/mr-abstract-components/src/abstractions/world/ArrayIterator.ts

import { IIterator } from "../IIterator.js";

export class ArrayIterator<T> implements IIterator<T> {
    private index = -1;

    constructor(private readonly collection: T[]) {}

    next(): boolean {
        if (this.index + 1 < this.collection.length) {
            this.index++;
            return true;
        }
        return false;
    }

    current(): T {
        if (this.index < 0 || this.index >= this.collection.length) {
            throw new Error('Iterator is out of bounds. Call next() first.');
        }
        return this.collection[this.index];
    }

    reset(): void {
        this.index = -1;
    }

    hasNext(): boolean {
        return this.index + 1 < this.collection.length;
    }
}

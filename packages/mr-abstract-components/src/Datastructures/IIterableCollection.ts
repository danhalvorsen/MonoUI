// packages/mr-abstract-components/src/world/IIterableCollection.ts
import { IIterator } from "./IIterator.js";

export interface IIterableCollection<T> {
    /** Create a new iterator for this collection */
    createIterator(): IIterator<T>;
}

export interface IIterator<T> {
    /** Move to the next element. Returns false if done. */
    next(): boolean;

    /** Get the current element. */
    current(): T;

    /** Reset to the start. */
    reset(): void;

    /** Whether there are more elements to iterate over. */
    hasNext(): boolean;
}
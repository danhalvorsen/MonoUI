// Specification interface

export interface Specification<T> {
    isSatisfiedBy(candidate: T): boolean;
    and(other: Specification<T>): Specification<T>;
    or(other: Specification<T>): Specification<T>;
    not(): Specification<T>;
}

// Concrete implementation for simple predicate-based specifications
export class BaseSpecification<T> implements Specification<T> {
    constructor(private predicate: (candidate: T) => boolean) {}

    isSatisfiedBy(candidate: T): boolean {
        return this.predicate(candidate);
    }

    and(other: Specification<T>): Specification<T> {
        return new BaseSpecification<T>(candidate => 
            this.isSatisfiedBy(candidate) && other.isSatisfiedBy(candidate)
        );
    }

    or(other: Specification<T>): Specification<T> {
        return new BaseSpecification<T>(candidate => 
            this.isSatisfiedBy(candidate) || other.isSatisfiedBy(candidate)
        );
    }

    not(): Specification<T> {
        return new BaseSpecification<T>(candidate => !this.isSatisfiedBy(candidate));
    }
}

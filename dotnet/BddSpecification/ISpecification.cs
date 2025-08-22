namespace Bdd;

public interface ISpecification<T>
{
    bool IsSatisfiedBy(T candidate);
    ISpecification<T> And(ISpecification<T> other);
    ISpecification<T> Or(ISpecification<T> other);
}

public class ExpressionSpecification<T> : ISpecification<T>
{
    private readonly Func<T, bool> _predicate;
    public ExpressionSpecification(Func<T, bool> predicate) => _predicate = predicate;
    public bool IsSatisfiedBy(T candidate) => _predicate(candidate);
    public ISpecification<T> And(ISpecification<T> other) => new ExpressionSpecification<T>(c => IsSatisfiedBy(c) && other.IsSatisfiedBy(c));
    public ISpecification<T> Or(ISpecification<T> other) => new ExpressionSpecification<T>(c => IsSatisfiedBy(c) || other.IsSatisfiedBy(c));
}

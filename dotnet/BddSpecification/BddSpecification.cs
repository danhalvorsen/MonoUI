namespace Bdd;

public class BddSpecification<T>
{
    private ISpecification<T> _given = new ExpressionSpecification<T>(_ => true);
    private ISpecification<T> _when = new ExpressionSpecification<T>(_ => true);
    private ISpecification<T> _then = new ExpressionSpecification<T>(_ => true);

    public BddSpecification<T> Given(Func<T, bool> predicate) => Given(new ExpressionSpecification<T>(predicate));
    public BddSpecification<T> Given(ISpecification<T> spec) { _given = spec; return this; }
    public BddSpecification<T> AndGiven(Func<T, bool> predicate) { _given = _given.And(new ExpressionSpecification<T>(predicate)); return this; }
    public BddSpecification<T> OrGiven(Func<T, bool> predicate) { _given = _given.Or(new ExpressionSpecification<T>(predicate)); return this; }

    public BddSpecification<T> When(Func<T, bool> predicate) => When(new ExpressionSpecification<T>(predicate));
    public BddSpecification<T> When(ISpecification<T> spec) { _when = spec; return this; }
    public BddSpecification<T> AndWhen(Func<T, bool> predicate) { _when = _when.And(new ExpressionSpecification<T>(predicate)); return this; }
    public BddSpecification<T> OrWhen(Func<T, bool> predicate) { _when = _when.Or(new ExpressionSpecification<T>(predicate)); return this; }

    public BddSpecification<T> Then(Func<T, bool> predicate) => Then(new ExpressionSpecification<T>(predicate));
    public BddSpecification<T> Then(ISpecification<T> spec) { _then = spec; return this; }
    public BddSpecification<T> AndThen(Func<T, bool> predicate) { _then = _then.And(new ExpressionSpecification<T>(predicate)); return this; }
    public BddSpecification<T> OrThen(Func<T, bool> predicate) { _then = _then.Or(new ExpressionSpecification<T>(predicate)); return this; }

    public bool Evaluate(T context) => _given.IsSatisfiedBy(context) && _when.IsSatisfiedBy(context) && _then.IsSatisfiedBy(context);
}

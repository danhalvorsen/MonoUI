namespace Core.Roslyn;

/// <summary>
/// Represents the outcome of an operation.
/// </summary>
public interface IResult<out T>
{
    /// <summary>
    /// Indicates whether the operation succeeded.
    /// </summary>
    bool IsSuccess { get; }

    /// <summary>
    /// The resulting value when the operation succeeds.
    /// </summary>
    T? Value { get; }

    /// <summary>
    /// Error message when the operation fails.
    /// </summary>
    string? Error { get; }
}

/// <summary>
/// Helper methods for creating <see cref="IResult{T}"/> instances.
/// </summary>
public static class Result
{
    public static IResult<T> Success<T>(T value) => new SuccessResult<T>(value);
    public static IResult<T> Failure<T>(string error) => new FailureResult<T>(error);

    private sealed record SuccessResult<T>(T Value) : IResult<T>
    {
        public bool IsSuccess => true;
        public string? Error => null;
        T? IResult<T>.Value => Value;
    }

    private sealed record FailureResult<T>(string Error) : IResult<T>
    {
        public bool IsSuccess => false;
        T? IResult<T>.Value => default;
        string? IResult<T>.Error => Error;
    }
}

/// <summary>
/// Represents a void value for <see cref="IResult{T}"/>.
/// </summary>
public readonly record struct Unit;


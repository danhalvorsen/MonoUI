using System.Threading.Tasks;

namespace Core.Roslyn;

/// <summary>
/// Represents a unit of work that can be executed against a context.
/// </summary>
/// <typeparam name="T">Type of the result value.</typeparam>
public interface IOperation<T>
{
    /// <summary>
    /// Executes the operation within the provided context.
    /// </summary>
    /// <param name="context">Context containing the workspace and solution information.</param>
    Task<IResult<T>> ExecuteAsync(IContext context);
}

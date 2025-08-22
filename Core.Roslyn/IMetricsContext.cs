using System.Threading;
using System.Threading.Tasks;

namespace Core.Roslyn;

/// <summary>
/// Provides code metric analysis capabilities over a solution context.
/// </summary>
public interface IMetricsContext : IContext
{
    /// <summary>
    /// Calculates the maintainability index for the current context.
    /// </summary>
    /// <param name="cancellationToken">Token used to cancel the operation.</param>
    /// <returns>The average maintainability index or an error.</returns>
    Task<IResult<double>> CalculateMaintainabilityIndexAsync(CancellationToken cancellationToken = default);
}

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Core.Roslyn;

/// <summary>
/// Default implementation of <see cref="IMetricsContext"/> providing maintainability index calculations.
/// </summary>
public class MetricsContext : Context, IMetricsContext
{
    public MetricsContext(Workspace workspace, ISolution solution, IProject? project = null, IDocument? document = null)
        : base(workspace, solution, project, document)
    {
    }

    /// <inheritdoc />
    public async Task<IResult<double>> CalculateMaintainabilityIndexAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var documents = Solution.Projects.SelectMany(p => p.Documents).ToList();
            if (documents.Count == 0)
            {
                return Result.Failure<double>("No documents available for analysis.");
            }

            double total = 0;
            int counted = 0;

            foreach (var doc in documents)
            {
                var textResult = await doc.GetTextAsync();
                if (!textResult.IsSuccess || textResult.Value is null)
                {
                    continue;
                }

                var lines = textResult.Value.Split('\n').Length;
                var index = Math.Clamp(171 - 16.2 * Math.Log(Math.Max(lines, 1)), 0, 171);
                total += index;
                counted++;
            }

            if (counted == 0)
            {
                return Result.Failure<double>("Failed to compute maintainability index.");
            }

            return Result.Success(total / counted);
        }
        catch (Exception ex)
        {
            return Result.Failure<double>(ex.Message);
        }
    }
}

using System;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.MSBuild;

namespace Core.Roslyn;

/// <summary>
/// Provides asynchronous access to a Roslyn <see cref="Microsoft.CodeAnalysis.Workspace"/>.
/// </summary>
public class Workspace
{
    private readonly MSBuildWorkspace _workspace;

    public Workspace()
    {
        _workspace = MSBuildWorkspace.Create();
    }

    /// <summary>
    /// Asynchronously opens a solution and returns a <see cref="ISolution"/> result.
    /// </summary>
    /// <param name="solutionPath">Path to the solution file.</param>
    public async Task<IResult<ISolution>> OpenSolutionAsync(string solutionPath)
    {
        try
        {
            var solution = await _workspace.OpenSolutionAsync(solutionPath);
            return Result.Success<ISolution>(new RoslynSolution(_workspace, solution));
        }
        catch (Exception ex)
        {
            return Result.Failure<ISolution>(ex.Message);
        }
    }

    /// <summary>
    /// Opens a solution and wraps it in a <see cref="Context"/> for subsequent operations.
    /// </summary>
    /// <param name="solutionPath">Path to the solution file.</param>
    public async Task<IResult<IContext>> OpenContextAsync(string solutionPath)
    {
        var solutionResult = await OpenSolutionAsync(solutionPath);
        if (!solutionResult.IsSuccess || solutionResult.Value is null)
        {
            return Result.Failure<IContext>(solutionResult.Error ?? "Failed to load solution.");
        }

        return Result.Success<IContext>(new Context(this, solutionResult.Value));
    }

    /// <summary>
    /// Asynchronously opens a project and returns a <see cref="IProject"/> result.
    /// </summary>
    /// <param name="projectPath">Path to the project file.</param>
    public async Task<IResult<IProject>> OpenProjectAsync(string projectPath)
    {
        try
        {
            var project = await _workspace.OpenProjectAsync(projectPath);
            return Result.Success<IProject>(new RoslynProject(project));
        }
        catch (Exception ex)
        {
            return Result.Failure<IProject>(ex.Message);
        }
    }

    /// <summary>
    /// Opens a solution and wraps it in a <see cref="IMetricsContext"/> for metric calculations.
    /// </summary>
    /// <param name="solutionPath">Path to the solution file.</param>
    public async Task<IResult<IMetricsContext>> OpenMetricsContextAsync(string solutionPath)
    {
        var solutionResult = await OpenSolutionAsync(solutionPath);
        if (!solutionResult.IsSuccess || solutionResult.Value is null)
        {
            return Result.Failure<IMetricsContext>(solutionResult.Error ?? "Failed to load solution.");
        }

        return Result.Success<IMetricsContext>(new MetricsContext(this, solutionResult.Value));
    }
}

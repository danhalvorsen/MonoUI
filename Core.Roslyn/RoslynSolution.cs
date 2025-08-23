using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.MSBuild;

namespace Core.Roslyn;

/// <summary>
/// Roslyn-backed implementation of <see cref="ISolution"/>.
/// </summary>
internal class RoslynSolution : ISolution
{
    private readonly MSBuildWorkspace _workspace;
    private Solution _solution;

    public RoslynSolution(MSBuildWorkspace workspace, Solution solution)
    {
        _workspace = workspace;
        _solution = solution;
    }

    public string Name => Path.GetFileNameWithoutExtension(_solution.FilePath);
    public string FilePath => _solution.FilePath;

    public IReadOnlyList<IProject> Projects =>
        _solution.Projects.Select(p => (IProject)new RoslynProject(p)).ToList();

    public async Task<IResult<IProject>> AddProjectAsync(string projectPath)
    {
        try
        {
            var project = await _workspace.OpenProjectAsync(projectPath);
            _solution = project.Solution;
            return Result.Success<IProject>(new RoslynProject(project));
        }
        catch (Exception ex)
        {
            return Result.Failure<IProject>(ex.Message);
        }
    }

    public Task<IResult<Unit>> RemoveProjectAsync(string projectName)
    {
        var project = _solution.Projects.FirstOrDefault(p => p.Name == projectName);
        if (project == null)
        {
            return Task.FromResult(Result.Failure<Unit>("Project not found"));
        }

        _solution = _solution.RemoveProject(project.Id);
        if (_workspace.TryApplyChanges(_solution))
        {
            return Task.FromResult(Result.Success(new Unit()));
        }

        return Task.FromResult(Result.Failure<Unit>("Failed to apply changes."));
    }

    public Task<IResult<Unit>> SaveAsync()
    {
        return _workspace.TryApplyChanges(_solution)
            ? Task.FromResult(Result.Success(new Unit()))
            : Task.FromResult(Result.Failure<Unit>("Failed to save solution."));
    }
}


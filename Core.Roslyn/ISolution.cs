using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Roslyn;

/// <summary>
/// Represents a Visual Studio solution.
/// </summary>
public interface ISolution
{
    /// <summary>
    /// Gets the solution name.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// Gets the full path to the solution file.
    /// </summary>
    string FilePath { get; }

    /// <summary>
    /// Gets the projects contained in the solution.
    /// </summary>
    IReadOnlyList<IProject> Projects { get; }

    /// <summary>
    /// Adds a project to the solution.
    /// </summary>
    /// <param name="projectPath">Path to the project file.</param>
    Task<IResult<IProject>> AddProjectAsync(string projectPath);

    /// <summary>
    /// Removes a project from the solution by name.
    /// </summary>
    /// <param name="projectName">Name of the project to remove.</param>
    Task<IResult<Unit>> RemoveProjectAsync(string projectName);

    /// <summary>
    /// Persists changes to the solution file.
    /// </summary>
    Task<IResult<Unit>> SaveAsync();
}


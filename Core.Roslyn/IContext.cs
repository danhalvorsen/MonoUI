namespace Core.Roslyn;

/// <summary>
/// Provides contextual access to the workspace, solution, and optionally a current project or document.
/// </summary>
public interface IContext
{
    /// <summary>
    /// Gets the underlying Roslyn workspace.
    /// </summary>
    Workspace Workspace { get; }

    /// <summary>
    /// Gets the loaded solution.
    /// </summary>
    ISolution Solution { get; }

    /// <summary>
    /// Gets the current project if one is selected; otherwise, <c>null</c>.
    /// </summary>
    IProject? CurrentProject { get; }

    /// <summary>
    /// Gets the current document if one is selected; otherwise, <c>null</c>.
    /// </summary>
    IDocument? CurrentDocument { get; }
}

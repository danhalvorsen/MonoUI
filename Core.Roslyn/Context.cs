namespace Core.Roslyn;

/// <summary>
/// Default implementation of <see cref="IContext"/> used to scope operations over a solution.
/// </summary>
public class Context : IContext
{
    public Context(Workspace workspace, ISolution solution, IProject? project = null, IDocument? document = null)
    {
        Workspace = workspace;
        Solution = solution;
        CurrentProject = project;
        CurrentDocument = document;
    }

    public Workspace Workspace { get; }
    public ISolution Solution { get; }
    public IProject? CurrentProject { get; }
    public IDocument? CurrentDocument { get; }
}

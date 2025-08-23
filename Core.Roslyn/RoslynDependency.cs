namespace Core.Roslyn;

/// <summary>
/// Represents a dependency referenced by a project.
/// </summary>
internal class RoslynDependency : IDependency
{
    public RoslynDependency(string name, string? version = null)
    {
        Name = name;
        Version = version;
    }

    public string Name { get; }
    public string? Version { get; }
}


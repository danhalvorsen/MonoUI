namespace Core.Roslyn;

/// <summary>
/// Represents a project dependency such as a package or project reference.
/// </summary>
public interface IDependency
{
    /// <summary>
    /// Gets the dependency name.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// Gets the dependency version, if available.
    /// </summary>
    string? Version { get; }
}


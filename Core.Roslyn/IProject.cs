using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Roslyn;

/// <summary>
/// Represents a project within a Visual Studio solution.
/// </summary>
public interface IProject
{
    /// <summary>
    /// Gets the project name.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// Gets the full path to the project file.
    /// </summary>
    string FilePath { get; }

    /// <summary>
    /// Gets the documents in the project.
    /// </summary>
    IReadOnlyList<IDocument> Documents { get; }

    /// <summary>
    /// Gets the dependencies referenced by the project.
    /// </summary>
    IReadOnlyList<IDependency> Dependencies { get; }

    /// <summary>
    /// Adds a document to the project.
    /// </summary>
    /// <param name="name">Document name.</param>
    /// <param name="text">Initial text content.</param>
    Task<IResult<IDocument>> AddDocumentAsync(string name, string text);

    /// <summary>
    /// Removes a document from the project.
    /// </summary>
    /// <param name="name">Name of the document to remove.</param>
    Task<IResult<Unit>> RemoveDocumentAsync(string name);

    /// <summary>
    /// Persists changes to the project file.
    /// </summary>
    Task<IResult<Unit>> SaveAsync();
}


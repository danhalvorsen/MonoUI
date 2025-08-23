using System.Threading.Tasks;

namespace Core.Roslyn;

/// <summary>
/// Represents a source document within a project.
/// </summary>
public interface IDocument
{
    /// <summary>
    /// Gets the document name.
    /// </summary>
    string Name { get; }

    /// <summary>
    /// Gets the full path to the document.
    /// </summary>
    string FilePath { get; }

    /// <summary>
    /// Retrieves the document text.
    /// </summary>
    Task<IResult<string>> GetTextAsync();

    /// <summary>
    /// Saves the provided text to the document.
    /// </summary>
    /// <param name="text">Updated document content.</param>
    Task<IResult<Unit>> SaveTextAsync(string text);
}


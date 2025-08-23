using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Roslyn;

/// <summary>
/// Operation that discovers the hierarchical path to a code element and optionally reports each step through a callback.
/// </summary>
public interface IPath : IOperation<IReadOnlyList<string>>
{
    /// <summary>
    /// Gets the document from which the path discovery starts.
    /// </summary>
    IDocument Document { get; }

    /// <summary>
    /// Optional callback invoked for each path segment discovered.
    /// </summary>
    Func<string, Task>? OnSegment { get; }
}

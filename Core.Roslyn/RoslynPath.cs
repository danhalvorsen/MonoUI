using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace Core.Roslyn;

/// <summary>
/// Roslyn-based implementation of <see cref="IPath"/> that produces a hierarchical representation of a code item.
/// </summary>
public class RoslynPath : IPath
{
    public RoslynPath(IDocument document, Func<string, Task>? onSegment = null)
    {
        Document = document;
        OnSegment = onSegment;
    }

    public IDocument Document { get; }

    public Func<string, Task>? OnSegment { get; }

    public async Task<IResult<IReadOnlyList<string>>> ExecuteAsync(IContext context)
    {
        var project = context.Solution.Projects.FirstOrDefault(p => p.Documents.Contains(Document));
        if (project is null)
        {
            return Result.Failure<IReadOnlyList<string>>("Document not found in the provided context.");
        }

        var segments = new List<string>
        {
            context.Solution.Name,
            project.Name,
            Document.Name
        };

        var textResult = await Document.GetTextAsync();
        if (!textResult.IsSuccess)
        {
            return Result.Failure<IReadOnlyList<string>>(textResult.Error ?? "Unable to read document text.");
        }

        var tree = CSharpSyntaxTree.ParseText(textResult.Value);
        var root = await tree.GetRootAsync();

        var namespaceNode = root.DescendantNodes().OfType<NamespaceDeclarationSyntax>().FirstOrDefault();
        if (namespaceNode != null)
        {
            segments.Add(namespaceNode.Name.ToString());
        }

        var typeNode = root.DescendantNodes().OfType<TypeDeclarationSyntax>().FirstOrDefault();
        if (typeNode != null)
        {
            segments.Add(typeNode.Identifier.Text);
        }

        if (OnSegment != null)
        {
            foreach (var segment in segments)
            {
                await OnSegment(segment);
            }
        }

        return Result.Success<IReadOnlyList<string>>(segments);
    }
}

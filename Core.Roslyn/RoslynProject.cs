using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;

namespace Core.Roslyn;

/// <summary>
/// Roslyn-backed implementation of <see cref="IProject"/>.
/// </summary>
internal class RoslynProject : IProject
{
    private Project _project;

    public RoslynProject(Project project)
    {
        _project = project;
    }

    public string Name => _project.Name;
    public string FilePath => _project.FilePath ?? string.Empty;

    public IReadOnlyList<IDocument> Documents =>
        _project.Documents.Select(d => (IDocument)new RoslynDocument(d)).ToList();

    public IReadOnlyList<IDependency> Dependencies =>
        _project.MetadataReferences
            .Select(r => (IDependency)new RoslynDependency(r.Display ?? string.Empty))
            .ToList();

    public async Task<IResult<IDocument>> AddDocumentAsync(string name, string text)
    {
        try
        {
            var doc = _project.AddDocument(name, SourceText.From(text));
            _project = doc.Project;
            if (_project.Solution.Workspace.TryApplyChanges(_project.Solution))
            {
                return Result.Success<IDocument>(new RoslynDocument(doc));
            }

            return Result.Failure<IDocument>("Failed to apply changes.");
        }
        catch (Exception ex)
        {
            return Result.Failure<IDocument>(ex.Message);
        }
    }

    public Task<IResult<Unit>> RemoveDocumentAsync(string name)
    {
        var doc = _project.Documents.FirstOrDefault(d => d.Name == name);
        if (doc == null)
        {
            return Task.FromResult(Result.Failure<Unit>("Document not found"));
        }

        _project = _project.RemoveDocument(doc.Id);
        if (_project.Solution.Workspace.TryApplyChanges(_project.Solution))
        {
            return Task.FromResult(Result.Success(new Unit()));
        }

        return Task.FromResult(Result.Failure<Unit>("Failed to apply changes."));
    }

    public Task<IResult<Unit>> SaveAsync()
    {
        return _project.Solution.Workspace.TryApplyChanges(_project.Solution)
            ? Task.FromResult(Result.Success(new Unit()))
            : Task.FromResult(Result.Failure<Unit>("Failed to save project."));
    }
}


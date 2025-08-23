using System;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Text;

namespace Core.Roslyn;

/// <summary>
/// Roslyn-backed implementation of <see cref="IDocument"/>.
/// </summary>
internal class RoslynDocument : IDocument
{
    private Document _document;

    public RoslynDocument(Document document)
    {
        _document = document;
    }

    public string Name => _document.Name;
    public string FilePath => _document.FilePath ?? string.Empty;

    public async Task<IResult<string>> GetTextAsync()
    {
        try
        {
            var text = await _document.GetTextAsync();
            return Result.Success(text.ToString());
        }
        catch (Exception ex)
        {
            return Result.Failure<string>(ex.Message);
        }
    }

    public async Task<IResult<Unit>> SaveTextAsync(string text)
    {
        try
        {
            var newDoc = _document.WithText(SourceText.From(text));
            if (_document.Project.Solution.Workspace.TryApplyChanges(newDoc.Project.Solution))
            {
                _document = newDoc;
                return Result.Success(new Unit());
            }

            return Result.Failure<Unit>("Failed to apply changes.");
        }
        catch (Exception ex)
        {
            return Result.Failure<Unit>(ex.Message);
        }
    }
}


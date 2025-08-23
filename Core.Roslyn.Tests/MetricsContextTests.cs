using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Roslyn;
using Xunit;

namespace Core.Roslyn.Tests;

public class MetricsContextTests
{
    private class FakeDocument : IDocument
    {
        private string _text;
        public FakeDocument(string text)
        {
            _text = text;
            Name = "Doc";
            FilePath = "Doc";
        }

        public string Name { get; }
        public string FilePath { get; }
        public Task<IResult<string>> GetTextAsync() => Task.FromResult(Result.Success(_text));
        public Task<IResult<Unit>> SaveTextAsync(string text)
        {
            _text = text;
            return Task.FromResult(Result.Success(new Unit()));
        }
    }

    private class FakeProject : IProject
    {
        private readonly List<IDocument> _documents;
        public FakeProject(IEnumerable<IDocument> docs)
        {
            _documents = docs.ToList();
        }

        public string Name => "Project";
        public string FilePath => "Project";
        public IReadOnlyList<IDocument> Documents => _documents;
        public IReadOnlyList<IDependency> Dependencies => Array.Empty<IDependency>();
        public Task<IResult<IDocument>> AddDocumentAsync(string name, string text)
        {
            var doc = new FakeDocument(text);
            _documents.Add(doc);
            return Task.FromResult(Result.Success((IDocument)doc));
        }
        public Task<IResult<Unit>> RemoveDocumentAsync(string name) => Task.FromResult(Result.Success(new Unit()));
        public Task<IResult<Unit>> SaveAsync() => Task.FromResult(Result.Success(new Unit()));
    }

    private class FakeSolution : ISolution
    {
        private readonly List<IProject> _projects;
        public FakeSolution(IEnumerable<IProject> projects)
        {
            _projects = projects.ToList();
        }

        public string Name => "Solution";
        public string FilePath => "Solution";
        public IReadOnlyList<IProject> Projects => _projects;
        public Task<IResult<IProject>> AddProjectAsync(string projectPath)
        {
            var project = new FakeProject(Enumerable.Empty<IDocument>());
            _projects.Add(project);
            return Task.FromResult(Result.Success((IProject)project));
        }
        public Task<IResult<Unit>> RemoveProjectAsync(string projectName) => Task.FromResult(Result.Success(new Unit()));
        public Task<IResult<Unit>> SaveAsync() => Task.FromResult(Result.Success(new Unit()));
    }

    [Fact]
    public async Task CalculateMaintainabilityIndexAsync_ReturnsAverage()
    {
        var docs = new[]
        {
            new FakeDocument(string.Join('\n', Enumerable.Repeat("a", 10))),
            new FakeDocument(string.Join('\n', Enumerable.Repeat("b", 20)))
        };
        var project = new FakeProject(docs);
        var solution = new FakeSolution(new[] { project });
        var workspace = new Workspace();
        var context = new MetricsContext(workspace, solution);

        var result = await context.CalculateMaintainabilityIndexAsync();

        Assert.True(result.IsSuccess);
        var expected1 = Math.Clamp(171 - 16.2 * Math.Log(10), 0, 171);
        var expected2 = Math.Clamp(171 - 16.2 * Math.Log(20), 0, 171);
        var expected = (expected1 + expected2) / 2;
        Assert.InRange(result.Value, expected - 0.1, expected + 0.1);
    }
}

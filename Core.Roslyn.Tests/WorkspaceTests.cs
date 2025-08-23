using System.Threading.Tasks;
using Core.Roslyn;
using Xunit;

namespace Core.Roslyn.Tests;

public class WorkspaceTests
{
    [Fact]
    public async Task OpenSolutionAsync_InvalidPath_ReturnsFailure()
    {
        var workspace = new Workspace();
        var result = await workspace.OpenSolutionAsync("nonexistent.sln");
        Assert.False(result.IsSuccess);
    }
}

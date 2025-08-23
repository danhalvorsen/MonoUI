using Core.Roslyn;
using Xunit;

namespace Core.Roslyn.Tests;

public class ResultTests
{
    [Fact]
    public void Success_ReturnsValue()
    {
        var result = Result.Success(5);
        Assert.True(result.IsSuccess);
        Assert.Equal(5, result.Value);
        Assert.Null(result.Error);
    }

    [Fact]
    public void Failure_ReturnsError()
    {
        var result = Result.Failure<int>("oops");
        Assert.False(result.IsSuccess);
        Assert.Equal("oops", result.Error);
        Assert.Equal(default, result.Value);
    }
}

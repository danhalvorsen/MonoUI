using Bdd;
using Xunit;

public class BddSpecificationTests
{
    [Fact]
    public void Scenario_evaluates_all_steps()
    {
        var spec = new BddSpecification<int>()
            .Given(x => x > 0)
            .AndGiven(x => x < 100)
            .When(x => x % 2 == 0)
            .Then(x => x == 42);

        Assert.True(spec.Evaluate(42));
        Assert.False(spec.Evaluate(41));
    }
}

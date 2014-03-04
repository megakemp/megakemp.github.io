---
layout: post
title:  "Keep your unit tests DRY with AutoFixture Customizations"
date:   2011-12-15
categories: programming autofixture
---

When I first incorporated [AutoFixture][1] as part of my daily unit testing workflow, I noticed how a consistent usage pattern had started to emerge.
This pattern can be roughly summarized in three steps:

  1. **Initialize** an instance of the `Fixture` class.
  2. **Configure** the way different types of objects involved in the test should be created by using the `Build` method.
  3. **Create** the actual objects with the `CreateAnonymous` or `CreateMany` methods.

As a result, my unit tests had started to look a lot like this:

```csharp
[Test]
public void WhenGettingAListOfPublishedPostsThenItShouldOnlyIncludeThose()
{
    // Step 1: Initialize the Fixture
    var fixture = new Fixture();

    // Step 2: Configure the object creation
    var draft = fixture.Build()
        .With(a => a.IsDraft = true)
        .CreateAnonymous();
    var publishedPost = fixture.Build()
        .With(a => a.IsDraft = false)
        .CreateAnonymous();
    fixture.Register(() => new[] { draft, publishedPost });

    // Step 3: Create the anonymous objects
    var posts = fixture.CreateMany();

   // Act and Assert...
}
```

In this particular configuration, AutoFixture will satisfy all requests for `IEnumerable` types by returning the same array with exactly two `Post` objects: one with the `IsDraft` property set to `True` and one with the same property set to `False`.

At that point I felt pretty satisfied with the way things were shaping up: I had managed to replace entire blocks of boring object initialization code with a couple of calls to the AutoFixture API, my unit tests were getting smaller and all was good.

### Duplication creeps in

After a while though, the configuration lines created in _Step 2_ started to repeat themselves across multiple unit tests. This was naturally due to the fact that *different unit tests sometimes shared a common set of object states in their test scenario*. Things weren’t so DRY anymore and suddenly it wasn’t uncommon to find code like this in the test suite:

```csharp
[Test]
public void WhenGettingAListOfPublishedPostsThenItShouldOnlyIncludeThose()
{
    var fixture = new Fixture();
    var draft = fixture.Build()
        .With(a => a.IsDraft = true)
        .CreateAnonymous();
    var publishedPost = fixture.Build()
        .With(a => a.IsDraft = false)
        .CreateAnonymous();
    fixture.Register(() => new[] { draft, publishedPost });
    var posts = fixture.CreateMany();

    // Act and Assert...
}

[Test]
public void WhenGettingAListOfDraftsThenItShouldOnlyIncludeThose()
{
    var fixture = new Fixture();
    var draft = fixture.Build()
        .With(a => a.IsDraft = true)
        .CreateAnonymous();
    var publishedPost = fixture.Build()
        .With(a => a.IsDraft = false)
        .CreateAnonymous();
    fixture.Register(() => new[] { draft, publishedPost });
    var posts = fixture.CreateMany();

    // Different Act and Assert...
}
```

See how these two tests share the same initial state even though they verify completely different behaviors? Such blatant duplication in the test code is a problem, since it inhibits the ability to make changes.
Luckily a solution was just around the corner as I discovered [customizations][2].

### Customizing your way out

A customization is a pretty general term. However, put in the context of AutoFixture it assumes a specific definition:

<div class="note">
<p>
<i class="fa fa-book fa-2x pull-left"></i>
A <strong>customization</strong> is a group of settings that, when applied to a given <code>Fixture</code>, control the way AutoFixture will create anonymous instances of the types requested through that <code>Fixture</code>.
</p>
</div>

What that means is that I could take all the boilerplate configuration code produced during **Step 2** and move it out of my unit tests into a single place, that is a customization. That allowed me to *specify only once how different objects needed to be created for a given scenario*, and reuse that across multiple tests.

```csharp
public class MixedDraftsAndPublishedPostsCustomization : ICustomization
{
    public void Customize(IFixture fixture)
    {
        var draft = fixture.Build()
            .With(a => a.IsDraft = true)
            .CreateAnonymous();
        var publishedPost = fixture.Build()
            .With(a => a.IsDraft = false)
            .CreateAnonymous();
        fixture.Register(() => new[] { draft, publishedPost });
    }
}
```

As you can see, `ICustomization` is nothing more than a [role interface][3] that describes how a `Fixture` should be set up. In order to apply a customization to a specific `Fixture` instance, you’ll simply have to call the `Fixture.Customize(ICustomization)` method, like shown in the example below.
This newly won encapsulation allowed me to rewrite my unit tests in a much more terse way:

```csharp
[Test]
public void WhenGettingAListOfDraftsThenItShouldOnlyIncludeThose()
{
    // Step 1: Initialize the Fixture
    var fixture = new Fixture();

    // Step 2: Apply the customization for the test scenario
    fixture.Customize(new MixedDraftsAndPublishedPostsCustomization());

    // Step 3: Create the anonymous objects
    var posts = fixture.CreateMany();

    // Act and Assert...
}
```

The configuration logic now exists only in one place, namely a class whose name clearly describes the kind of test data it will produce.
If applied consistently, this approach will in time *build up a library of customizations, each representative of a given situation or scenario*. Assuming that they are created at the proper level of granularity, these customizations could even be composed to form more complex scenarios.

### Conclusion

Customizations in [AutoFixture][1] are a pretty powerful concept in of themselves, but they become even more effective when *mapped directly to test scenarios*. In fact, they represent a natural place to specify which objects are involved in a given scenario and the state they are supposed to be in. You can use them to remove duplication in your test code and, in time, build up a library of self-documenting modules, which describe the different contexts in which the system’s behavior is being verified.

[1]: http://github.com/autofixture
[2]: http://blog.ploeh.dk/2011/03/18/EncapsulatingAutoFixtureCustomizations.aspx
[3]: http://martinfowler.com/bliki/RoleInterface.html

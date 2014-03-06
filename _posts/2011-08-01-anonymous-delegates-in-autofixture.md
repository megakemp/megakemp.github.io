---
layout: post
title:  "Anonymous delegates in AutoFixture"
date:   2011-08-01
categories: programming autofixture
---

I’m excited to announce that [AutoFixture][1] now officially supports delegates in the [main trunk][2] up on CodePlex.

If you aren’t familiar with AutoFixture, let me give you the pitch:

<div class="note">
<p>
<i class="fa fa-book fa-2x pull-left"></i>
<strong>AutoFixture</strong> is an open source framework for .NET designed to minimize the ‘<em>Arrange</em>’ phase of your unit tests. Its primary goal is to allow developers to focus on what is being tested rather than how to setup the test scenario, by making it easier to create object graphs containing test data.
</p>
</div>

Does this sound interesting to you? In that case head over to the [AutoFixture CodePlex site][1] and find out more. You’ll be glad you did.

For those of you already familiar with AutoFixture, the newly added support for delegates means that every time AutoFixture is asked to create an anonymous instance of a delegate type (or more precisely a _delegate specimen_), it will actually return one, instead of throwing an exception.

So, you’ll be able to say things like:

```csharp
public delegate void MyDelegate();

var fixture = new Fixture();
var delegateSpecimen = fixture.CreateAnonymous();
```

and get back **a delegate pointing to a dynamically generated method**, whose signature matches the one of the requested delegate type. In other words AutoFixture will satisfy the requests for delegates by providing a _method specimen_.

That’s cool, but it may leave you wondering: what on Earth does a method specimen do when it gets invoked? Well, in order to answer that question, we need to look at the signature of the delegate that was requested in the first place. The rule basically says:

  * If the signature of the requested delegate **has a return value** (i.e. it’s a _function_), the method specimen will always return an anonymous value of the return type.
  * If the signature of the requested delegate **doesn’t have a return value** (i.e. it’s an _action_) the returned method specimen will have an empty body.

This principle is best illustrated by examples. Consider the following code snippet:

```csharp
var fixture = new Fixture();
var funcSpecimen = fixture.CreateAnonymous();
var result = funcSpecimen();

// result = "fd95320f-0a37-42be-bd49-3afbbe089d9d"
```

In this example, since the signature of the requested delegate has a return value of type [String][3], the result variable will contain an anonymous string value, which in AutoFixture usually translates into a GUID.
On the other hand, if requested delegate didn’t have a return value, invoking the anonymous delegate would do just about nothing:

```csharp
var fixture = new Fixture();
var actionSpecimen = fixture.CreateAnonymous();
actionSpecimen("whatever"); // no-op
```

Note that in both cases **any input arguments passed to the anonymous delegate will be ignored**, since they don’t have any impact on the generated method specimen.

Now, if you’re using AutoFixture from [its NuGet package][4] (which, by the way, you should) you’ll have to wait until the next release to get this feature. However, taking advantage of it with the current version of AutoFixture requires a minimal amount of effort. Just [grab the DelegateGenerator.cs class from AutoFixture’s main trunk][5] on CodePlex and include it in your project. You’ll then be able to add support for delegates to your Fixture instance by simply saying:

```csharp
var fixture = new Fixture();
fixture.Customizations.Add(new DelegateGenerator());
```

You can even [wrap that up in a Customization][6] to make it more centralized and keep your test library [DRY][7]:

```csharp
public class DelegateCustomization : ICustomization
{
    public void Customize(IFixture fixture)
    {
        if (fixture == null)
        {
            throw new ArgumentNullException("fixture");
        }

        fixture.Customizations.Add(new DelegateGenerator());
    }
}
```

Before finishing this off, let me give you a more concrete example that shows how this is useful in a real world scenario. Keeping in mind that delegates offer a pretty terse way to implement the [Strategy Design Pattern][8] in .NET, consider this implementation of the [IEqualityComparer interface][9]:

```csharp
public class EqualityComparer : IEqualityComparer
{
    private readonly Func equalityStrategy;
    private readonly Func hashCodeStrategy;

    public EqualityComparer(Func equalityStrategy, Func hashCodeStrategy)
    {
        if (equalityStrategy == null)
        {
            throw new ArgumentNullException("equalityStrategy");
        }

        if (hashCodeStrategy == null)
        {
            throw new ArgumentNullException("hashCodeStrategy");
        }

        this.equalityStrategy = equalityStrategy;
        this.hashCodeStrategy = hashCodeStrategy;
    }

    public bool Equals(T x, T y)
    {
        return equalityStrategy(x, y);
    }

    public int GetHashCode(T obj)
    {
        return hashCodeStrategy(obj);
    }
}
```

That’s a nice flexible class that, by allowing to specify the comparison logic in the form of delegates, is suitable in different scenarios. Before the support for delegates was added, however, having AutoFixture play along with this class in the context of unit testing would be quite problematic. The tests would, in fact, fail consistently with a [NotSupportedException][10], since the constructor of the `EqualityComparer` class requires the creation of two delegates.
Luckily, this is not a problem anymore.

[1]: http://autofixture.codeplex.com
[2]: http://autofixture.codeplex.com/SourceControl/changeset/changes/48b0ea5a7f15
[3]: http://msdn.microsoft.com/en-us/library/system.string.aspx
[4]: http://nuget.org/List/Packages/AutoFixture
[5]: http://autofixture.codeplex.com/SourceControl/changeset/view/493eecec7784#Src%2fAutoFixture%2fKernel%2fDelegateGenerator.cs
[6]: http://blog.ploeh.dk/2011/03/18/EncapsulatingAutoFixtureCustomizations.aspx
[7]: http://en.wikipedia.org/wiki/Don't_repeat_yourself
[8]: http://sourcemaking.com/design_patterns/strategy
[9]: http://msdn.microsoft.com/en-us/library/ms132151.aspx
[10]: http://msdn.microsoft.com/en-us/library/system.notsupportedexception.aspx

[Source](http://megakemp.com/2011/09/06/behavior-changes-in-autofixture-2-2-anonymous-numbers/ "Permalink to Behavior changes in AutoFixture 2.2 – Anonymous numbers")

# Behavior changes in AutoFixture 2.2 – Anonymous numbers

Now that [AutoFixture 2.2 is approaching on the horizon][1], it’s a good time to start talking about some of the changes that were made to the underlying behavior of some existing APIs. I’ll start off this series of posts by focusing on the new generation strategy for anonymous numbers.

## The good old fashioned way

Before I jump into the details of what exactly has been changed and how, allow me to set up a little bit of stage:

A key part of AutoFixture’s mission statement is to make the process of authoring unit tests faster by providing an easy way of creating test values (or “_specimens_“) for the variables involved in the test. The goal of providing values that are as neutral as possible to the test scenario at hand is achieved by employing [“constrained non-deterministic”][2] generation algorithms.

Put in simple terms, this essentially means that **AutoFixture will come up with test values at run time that can be considered “random” within some predefined bounds**. These bounds are imposed at the lowest level by the variable’s own data type: a string is a string, a number is a number and so on. More constraints, however, can be added at a higher level, based on any semantics the variable may have in the specific test scenario. For example a string can’t be longer than 20 characters or a number must be between 1 and 100.

AutoFixture comes with a set of built-in generation algorithms that can produce test values for all the primitive types included in the .NET Framework. The algorithm for numeric types has historically been based on individually incremented sequences, one for each numeric data type. Let’s look at an example that illustrates this:



    var fixture = new Fixture();
    Console.WriteLine("Byte specimen is {0}, {1}",
        fixture.CreateAnonymous(),
        fixture.CreateAnonymous());
    Console.WriteLine("Int32 specimen is {0}, {1}",
        fixture.CreateAnonymous(),
        fixture.CreateAnonymous());
    Console.WriteLine("Single specimen is {0}, {1}",
        fixture.CreateAnonymous(),
        fixture.CreateAnonymous());

    // The output will be:
    // Byte specimen is 1, 2
    // Int32 specimen is 1, 2
    // Single specimen is 1, 2


The key point here is that **AutoFixture will only guarantee unique numeric specimens within the scope of a specific data type**. Now, you may wonder how this would be a problem. Well, it certainly isn’t in itself, but if you asked AutoFixture to give you an anonymous instance of a class with multiple properties of different numeric types, you would get something like this:



    public class NumericBag
    {
        public byte ByteValue { get; set; }
        public int Int32Value { get; set; }
        public float SingleValue { get; set; }
    }

    var fixture = new Fixture();
    var specimen = fixture.CreateAnonymous();
    Console.WriteLine("ByteValue property is {0}", specimen.ByteValue);
    Console.WriteLine("Int32Value property is {0}", specimen.Int32Value);
    Console.WriteLine("SingleValue property is {0}", specimen.SingleValue);

    // The output will be:
    // ByteValue property is 1
    // Int32Value property is 1
    // SingleValue property is 1


We can agree that the end result doesn’t exactly live up to the expectation of anonymous values being “random”. Starting from version 2.2, however, this behavior is due to change.

## The fresh new way

AutoFixture has taken a different approach to numeric specimen generation and **will now by default return unique values across all numeric types**. Running our first example in AutoFixture 2.2 will therefore yield a very different result:



    var fixture = new Fixture();
    Console.WriteLine("Byte specimen is {0}, {1}",
        fixture.CreateAnonymous(),
        fixture.CreateAnonymous());
    Console.WriteLine("Int32 specimen is {0}, {1}",
        fixture.CreateAnonymous(),
        fixture.CreateAnonymous());
    Console.WriteLine("Single specimen is {0}, {1}",
        fixture.CreateAnonymous(),
        fixture.CreateAnonymous());

    // The output will be:
    // Byte specimen is 1, 2
    // Int32 specimen is 3, 4
    // Single specimen is 5, 6


In other words, AutoFixture is being a little more “non-deterministic” when it comes to numeric test values. Take for example the following scenario:



    public class NumericBag
    {
        public byte ByteValue { get; set; }
        public int Int32Value { get; set; }
        public float SingleValue { get; set; }
    }

    var fixture = new Fixture();
    var specimen = fixture.CreateAnonymous();
    Console.WriteLine("ByteValue property is {0}", specimen.ByteValue);
    Console.WriteLine("Int32Value property is {0}", specimen.Int32Value);
    Console.WriteLine("SingleValue property is {0}", specimen.SingleValue);

    // The output will be:
    // ByteValue property is 1
    // Int32Value property is 2
    // SingleValue property is 3


See how all the numeric properties on the generated object have different values? That’s what I’m talking about.

Now, in theory, this shouldn’t be considered a breaking change. I say this because AutoFixture is all about [anonymous variables][3], which, by definition, can’t be expected to have specific values during a test run. So, as long as you’ve played by this rule, the new behavior shouldn’t impact any of your existing tests.

However, if this does turn out to be a problem or you simply prefer the old way of doing things, you shouldn’t feel left out in the cold. The **previous behavior is still in the box, packaged up in a nice customization** unambiguously named `NumericSequencePerTypeCustomization`. The simple act of adding it to a Fixture instance will restore things the way they were:



    var fixture = new Fixture();
    fixture.Customize(new NumericSequencePerTypeCustomization());


If you wish to try this out today, I encourage you to go head and grab the latest build off of [AutoFixture’s project page on Team City][4]. Enjoy.

   [1]: http://twitter.com/#!/ploeh/status/109005068581343232
   [2]: http://blog.ploeh.dk/2009/03/05/ConstrainedNonDeterminism.aspx
   [3]: http://blogs.msdn.com/b/ploeh/archive/2008/11/17/anonymous-variables.aspx
   [4]: http://teamcity.codebetter.com/project.html;jsessionid=C212815CFF41DFCD2E93DDDECABF1668?projectId=project129&tab=projectOverview

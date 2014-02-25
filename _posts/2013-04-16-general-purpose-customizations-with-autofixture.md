---
layout: post
title:  "General-purpose customizations with AutoFixture"
date:   2013-04-16
categories: AutoFixture
assets:
summary:
---

If you’ve been using [AutoFixture][1] in your tests for more than a while, chances are you’ve already come across the concept of customizations. If you’re not familiar with it, let me give you a quick introduction:

> A **customization** is a group of settings that, when applied to a given `Fixture` object, control the way AutoFixture will create instances for the types requested through that `Fixture`.

At this point you might find yourself feeling an irresistible urge to know everything there’s to know about customizations. If that’s the case, don’t worry. There are [a few resources][2] online where you learn more about them. For example, I wrote about [how to take advantage of customizations][3] to group together test data related to specific scenarios.

In this post I’m going to talk about something different which, in a sense, is quite the opposite of that: how to write _general-purpose customizations_.

### A (user) story about cooking

It’s hard to talk about test data without a bit of context. So, for the sake of this post, I thought we would pretend to be working on a somewhat realistic project. The system we’re going to build is an online catalogue of food recipies. The domain, at the very basic level, consists of three concepts:

  * **Cookbook**
  * **Recipes**
  * **Ingredients**

![Basic domain model for a recipe catalogue.][4]

Basic domain model for a recipe catalogue.

Now, let’s imagine that in our backlog of requirements we have one where the user wishes to be able to search for recepies that contain a specific set of ingredients. Or in other words:

> _As a foodie, I want to know which recipes I can prepare with the ingredients I have,
so that I can get the best value for my groceries._

### From the tests…

As usual, we start out by translating the requirement at hand into a set of acceptance tests. In order do that, we need to tell AutoFixture how we’d like the test data for our domain model to be generated.

For this particular scenario, we need every `Ingredient` created in the test fixture to be _randomly chosen from a fixed pool of objects_. That way we can ensure that all recepies in the cookbook will be made up of the _same set of ingredients_.

Here’s how such a customization would look like:

```csharp
public class RandomIngredientsFromFixedSequence : ICustomization
{
    private readonly Random randomizer = new Random();
    private IEnumerable sequence;

    public void Customize(IFixture fixture)
    {
        InitializeIngredientSequence(fixture);
        fixture.Register(PickRandomIngredientFromSequence);
    }

    private void InitializeIngredientSequence(IFixture fixture)
    {
        this.sequence = fixture.CreateMany();
    }

    private Ingredient PickRandomIngredientFromSequence()
    {
        var randomIndex = this.randomizer.Next(0, sequence.Count() - 1);
        return sequence.ElementAt(randomIndex);
    }
}
```

Here we’re creating a pool of ingredients and telling AutoFixture to randomly pick one of those every time it needs to create an `Ingredient` object by using the `Fixture.Register` method.

Since we’ll be using [Xunit][5] as our test runner, you can take advantage of the [AutoFixture Data Theories][6] to keep our tests succinct by using AutoFixture in a declarative fashion. In order to do so, we need to write an [xUnit Data Theory][7] attribute that tells AutoFixture to use our new customization:

```csharp
public class CookbookAutoDataAttribute : AutoDataAttribute
{
    public CookbookAutoDataAttribute()
        : base(new Fixture().Customize(
                   new RandomIngredientsFromFixedSequence())))
    {
    }
}
```

If you prefer to use AutoFixture directly in your tests, the imperative equivalent of the above is:

```csharp
var fixture = new Fixture();
fixture.Customize(new RandomIngredientsFromFixedSequence());
```

At this point, we can finally start writing the acceptance tests to satisfy our original requirement:

```csharp
public class When_searching_for_recipies_by_ingredients
{
    [Theory, CookbookAutoData]
    public void Should_only_return_recipes_with_a_specific_ingredient(
        Cookbook sut,
        Ingredient ingredient)
    {
        // When
        var recipes = sut.FindRecipies(ingredient);
        // Then
        Assert.True(recipes.All(r => r.Ingredients.Contains(ingredient)));
    }

    [Theory, CookbookAutoData]
    public void Should_include_new_recipes_with_a_specific_ingredient(
        Cookbook sut,
        Ingredient ingredient,
        Recipe recipeWithIngredient)
    {
        // Given
        sut.AddRecipe(recipeWithIngredient);
        // When
        var recipes = sut.FindRecipies(ingredient);
        // Then
        Assert.Contains(recipeWithIngredient, recipes);
    }
}
```

Notice that during these tests AutoFixture will have to create `Ingredient` objects in a couple of different ways:

  * **indirectly** when constructing `Recipe` objects associated to a `Cookbook`
  * **directly** when providing arguments for the test parameters

As far as AutoFixture is concerned, it doesn’t really matter which code path leads to the creation of ingredients. The algorithm provided by the `RandomIngredientsFromFixedSequence` customization will apply in all situations.

### …to the implementation

After a couple of [Red-Green-Refactor][8] cycles spawned from the above tests, it’s not completely unlikely that we might end up with some production code similar to this:

```csharp
// Cookbook.cs
public class Cookbook
{
    private readonly ICollection recipes;

    public Cookbook(IEnumerable recipes)
    {
        this.recipes = new List(recipes);
    }

    public IEnumerable FindRecipies(params Ingredient[] ingredients)
    {
        return recipes.Where(r => r.Ingredients.Intersect(ingredients).Any());
    }

    public void AddRecipe(Recipe recipe)
    {
        this.recipes.Add(recipe);
    }
}

// Recipe.cs
public class Recipe
{
    public readonly IEnumerable Ingredients;

    public Recipe(IEnumerable ingredients)
    {
        this.Ingredients = ingredients;
    }
}

// Ingredient.cs
public class Ingredient
{
    public readonly string Name;

    public Ingredient(string name)
    {
        this.Name = name;
    }
}
```

Nice and simple. But let’s not stop here. It’s time to take it a bit further.

### An opportunity for generalization

Given the fact that we started working from a very concrete requirement, it’s only natural that the `RandomIngredientsFromFixedSequence` customization we came up at with encapsulates a behavior that is specific to the scenario at hand. However, if we take a closer look we might notice the following:

The only part of the algorithm that is specific to the original scenario is the _type of the objects being created_. The rest can easily be applied whenever you want to create objects that are picked at random from a predefined pool.

> An opportunity for writing a **general-purpose customization** has just presented itself. We can’t let it slip.

Let’s see what happens if we extract the `Ingredient` type into a generic argument and remove all references to the word _“ingredient”_:

```csharp
public class RandomFromFixedSequence : ICustomization
{
    private readonly Random randomizer = new Random();
    private IEnumerable sequence;

    public void Customize(IFixture fixture)
    {
        InitializeSequence(fixture);
        fixture.Register(PickRandomItemFromSequence);
    }

    private void InitializeSequence(IFixture fixture)
    {
        this.sequence = fixture.CreateMany();
    }

    private T PickRandomItemFromSequence()
    {
        var randomIndex = this.randomizer.Next(0, sequence.Count() - 1);
        return sequence.ElementAt(randomIndex);
    }
}
```

Voilà. We just turned our scenario-specific customization into a pluggable algorithm that changes the way objects of **any type** are going to be generated by AutoFixture. In this case the algorithm will create items by _picking them at random from a fixed sequence of T_.

The `CookbookAutoDataAttribute` can easily changed to use the general-purpose version of the customization by closing the generic argument with the `Ingredient` type:

```csharp
public class CookbookAutoDataAttribute : AutoDataAttribute
{
    public CookbookAutoDataAttribute()
        : base(new Fixture().Customize(
                   new RandomFromFixedSequence())))
    {
    }
}
```

The same is true if you’re using AutoFixture imperatively:

```csharp
    var fixture = new Fixture();
    fixture.Customize(new RandomFromFixedSequence());
```

### Wrapping up

As I said before, customizations are a great way to set up test data for a specific scenario. Sometimes these configurations turn out to be useful in [more than just one situation][9].

When such opportunity arises, it’s often a good idea to separate out the parts that are specific to a particular context and turn them into parameters. This allows the customization to become a _reusable strategy_ for controlling AutoFixture’s behavior across entire test suites.

   [1]: https://github.com/AutoFixture/AutoFixture
   [2]: http://www.google.com/search?q=AutoFixture%2Bcustomizations
   [3]: http://megakemp.com/2011/12/15/keep-your-unit-tests-dry-with-autofixture-customizations
   [4]: http://megakemp.files.wordpress.com/2013/04/domain.png?w=480&h=55
   [5]: https://xunit.codeplex.com
   [6]: http://blog.ploeh.dk/2010/10/08/AutoDataTheorieswithAutoFixture
   [7]: http://stackoverflow.com/a/9110623/26396
   [8]: http://www.jamesshore.com/Blog/Red-Green-Refactor.html
   [9]: https://github.com/AutoFixture/AutoFixture/blob/master/Src/AutoFixture/FreezingCustomization.cs#L8-11

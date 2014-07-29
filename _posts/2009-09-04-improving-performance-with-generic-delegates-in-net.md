---
layout: post
title:  "Improving performance with generic delegates in .NET"
date:   2009-09-04
categories: programming .net
---

Lately I have been involved in the performance profiling work of a Windows client application, which customers had lamented to be way too slow for their taste.

The application was originally developed a couple of years ago on top of the .NET Framework 2.0. Its user interface is built using [Windows Forms][1] and it retrieves its data from a remote remote server through Web Services using [ASMX][2].

Everything worked just fine from a functionality standpoint. However customers complained over long delays as data was being retrieved from the Web Services and slowly populated the widgets on the screen.
Something had to be done to speed things up.

### Reflection is a bottleneck

A look with a .NET profiler tool such as **[JetBrains DotTrace][3]** revealed that a lot of time was spent sorting large collections of objects by the value of one of their properties. This would typically be done before binding them to various list controls in the UI.
The code would typically look like this and was spread out all over the code base:

```csharp
// Retrieves the entire list of customers from the DAL
List customerList = CustomerDAO.GetAll();

// Sorts the list of 'Customer' objects
// by the value of the 'FullName' property
customerList.Sort(new PropertyComparer("FullName"));

// Binds the list to a ComboBox control for display
cmbCustomers.DataSource = customerList;
```

Apparently **line 6** was the one that takes forever to execute. Now, since the sorting algorithm used in the [IList.Sort][4] method can’t be changed from outside the class, the weak link here must be the `PropertyComparer`. But what is it doing? Well, here it is:

```csharp
using System;
using System.Collections.Generic;
using System.Reflection;

namespace Thoughtology.Samples.Collections
{
    public class PropertyComparer : IComparer
    {
        private string propertyName;

        public PropertyComparer(string propertyName)
        {
            this.propertyName = propertyName;
        }

        public int Compare(T x, T y)
        {
            Type targetType = x.GetType();

            PropertyInfo targetProperty = targetType.GetProperty(propertyName);

            string xValueText = targetProperty.GetValue(x, null).ToString();
            string yValueText = targetProperty.GetValue(y, null).ToString();

            int xValueNumeric = Int32.Parse(xValueText);
            int yValueNumeric = Int32.Parse(yValueText);

            if (xValueNumeric < yValueNumeric)
            {
                return -1;
            }
            else if (xValueNumeric == yValueNumeric)
            {
                return 0;
            }
            else
            {
                return 1;
            }
        }
    }
}
```

Likely not the prettiest code you have ever seen. However, it’s pretty easy to see what it’s doing:

  1. Extracts the value of the specified property from the input objects using **[reflection][5].**
  2. Converts that value to a `String`.
  3. Parses the converted value to an `Integer`.
  4. Compares the numeric values to decide which one is bigger.

That seems like a lot of extra work for a simple value comparison to me.

I’m sure the method was built that way for a reason. This [IComparer][6] class is designed to be “_generic_” and work on any type of value on any object. However my guess is that it won’t work with anything but primitive types (numbers, strings and booleans). In fact the default implementation of the [Object.ToString()][7] (used in **lines 22-23**) method returns the fully qualified name of the class, and that usually doesn’t isn’t much of a sorting criteria in most cases.

<div class="note">
<p>
The real performance bottleneck here is caused by the use of <em>reflection</em> inside of a method that is called hundreds if not thousands of times from all over the application.
</p>
</div>

### Use delegates instead

At this point it is clear that we need to [refactor][9] this class to improve its performance and still retain its original functionality, that is to provide a generic way to compare object by the value of one of their properties.

The key is to find a better way to retrieve the value of a property from any type of object without having to use reflection.

Well, since we do know the type of the objects we are comparing through the generic parameter T, we could let the caller specify which value to compare the objects with by. This can be done by having the caller pass a reference to a method, which would return that value when invoked inside of the [Compare][10] method. Let’s try it and see how it works.

### Implementing the solution in .NET 2.0

Since the application was on .NET 2.0, we need to define our own delegate type that will allow callers to pass the reference to a method returning the comparable value . Here is the complete implementation of the refactored PropertyComparer class:

```csharp
using System;
using System.Collections.Generic;

namespace Thoughtology.Samples.Collections
{
    public class PropertyComparer : IComparer
    {
        public delegate IComparable ComparableValue(T arg);

        public PropertyComparer(ComparableValue propertySelector)
        {
            this.PropertySelector = propertySelector;
        }

        public ComparableValue PropertySelector { get; set; }

        public int Compare(T x, T y)
        {
            if (this.PropertySelector == null)
            {
                throw new InvalidOperationException("PropertySelector cannot be null");
            }

            IComparable firstValue = this.PropertySelector(x);
            IComparable secondValue = this.PropertySelector(y);

            return firstValue.CompareTo(secondValue);
        }
    }
}
```

Our delegate, called `ComparableValue`, takes an object of the generic type `T` as input and returns a value to compare that object by.

The comparison itself is than performed by the returned value itself, by invoking the [IComparable.CompareTo][11] method on it (see **line 27**).

<div class="note">
<p>
All primitive types in .NET implement the [IComparable][13] interface. Custom objects can easily be compared in a semantically meaningful way by manually implementing that same interface.
</p>
</div>

The caller can now invoke the Sort method by specifying the property to compare the items by with an **[anoymous delegate][14]**:

```csharp
customerList.Sort(new PropertyComparer(delegate(Customer c)
    {
        return c.FullName;
    });
```

Notice how the property name is no longer passed a a string. Instead it is actually invoked on the object providing compile-time type checking.

### Alternative implementation in .NET 3.5

This same solution can be implemented slightly differently in .NET 3.5 by taking advantage of the built in **[Func][15]** delegate type:

```csharp
using System;
using System.Collections.Generic;

namespace Thoughtology.Samples.Collections
{
    public class PropertyComparer : IComparer
    {
        public PropertyComparer(Func propertySelector)
        {
            this.PropertySelector = propertySelector;
        }

        public Func PropertySelector { get; set; }

        public int Compare(T x, T y)
        {
            if (this.PropertySelector == null)
            {
                throw new InvalidOperationException("PropertySelector cannot be null");
            }

            IComparable firstValue = this.PropertySelector(x);
            IComparable secondValue = this.PropertySelector(y);

            return firstValue.CompareTo(secondValue);
        }
    }
}
```

Great, this saved us exactly one line of code.
Don’t worry, things get much nicer on the caller’s side where the anonymous delegate is substituted by a much more compact **[lambda expression][16]**:

```csharp
customerList.Sort(new PropertyComparer(c => c.FullName));
```

### The results

Now that we put reflection out of the picture, it is a good time to run a simple test harness to see how the new comparison strategy performs. For this purpose we will sort an increasingly large collection of objects with the two `PropertyComparer` implementations and compare how long it takes to complete the operation. Here are the results in a graph:

<img alt="SortingPerformanceChart" src="http://megakemp.files.wordpress.com/2009/09/sortingperformancechart.png?w=461&h=310" class="screenshot-noshadow" />

As you see, by using delegates the sorting algorithm stays on the linear *O(n)*. On the other hand with reflection it quickly jumps over in the exponential *O(cn)* space, where *c* is the time it takes to make a single comparison.

### Lessons learned

This exercise teaches three general guidelines that can be applied when programming in .NET:

  * **Reflection is expensive**. Use it sparingly and avoid it whenever possible in code that is executed very often, such as loops.
  * **Generic delegates allow to build flexible code in a fast and strongly-typed fashion**. This can be achieved by letting callers “_inject_” custom code into an algorithm by passing a delegate as argument to a method. The code referred to by the delegate will then be executed at the appropriate stage in the algorithm inside the method.
  * When reflection is used to dynamically invoke members on a class, the same thing can be achieved by using generic delegates instead, like demonstrated in this article. This technique is widely used by modern isolation frameworks such as [Rhino Mocks][18], [Moq][19] and [TypeMock Isolator][20].

/Enrico

[1]: http://windowsclient.net/
[2]: http://msdn.microsoft.com/en-us/library/ba0z6a33(lightweight).aspx
[3]: http://www.jetbrains.com/profiler/
[4]: http://msdn.microsoft.com/en-us/library/234b841s(lightweight).aspx
[5]: http://msdn.microsoft.com/en-us/library/f7ykdhsy(lightweight).aspx
[6]: http://msdn.microsoft.com/en-us/library/8ehhxeaf(lightweight).aspx
[7]: http://msdn.microsoft.com/en-us/library/system.object.tostring(lightweight).aspx
[9]: http://en.wikipedia.org/wiki/Code_refactoring
[10]: http://msdn.microsoft.com/en-us/library/system.collections.icomparer.compare(lightweight).aspx
[11]: http://msdn.microsoft.com/en-us/library/system.icomparable.compareto(lightweight).aspx
[13]: http://msdn.microsoft.com/en-us/library/system.icomparable(lightweight).aspx
[14]: http://msdn.microsoft.com/en-us/library/0yw3tz5k(lightweight).aspx
[15]: http://msdn.microsoft.com/en-us/library/bb549151(lightweight).aspx
[16]: http://msdn.microsoft.com/en-us/library/bb397687(lightweight).aspx
[18]: http://ayende.com/projects/rhino-mocks.aspx
[19]: http://code.google.com/p/moq/
[20]: http://www.typemock.com/isolator-product-page

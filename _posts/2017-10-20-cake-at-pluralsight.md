---
layout: post
title: There Is Cake at Pluralsight
date: 2017-10-20
categories: programming
assets: cake-at-pluralsight
image: banner.png
excerpt: "I'm excited to announce that my new Pluralsight course is out! And yes, in case you're wondering, it really does contain Cake."
---

_I'm excited to announce that my [new Pluralsight course][CakeCourse] is out — and yes, there really will be Cake._[^1]

---

## Not Just Another Make

Kidding aside, I didn't make a Pluralsight course about baking; it's about a Make-inspired build tool that uses C# _called_ [Cake][].

If you've never heard of it, let me tell you a story.

When I first came across the [Cake project][CakeProject] it was the fall of 2014, almost exactly three years ago. [Patrik Svensson][PatrikSvensson] — a colleague of mine at [tretton37][] at the time — had been working on it for some time, and had reached a point where things were starting to shape up. So I took a quick look at the code and I remember being impressed by how well it was designed!

As for the tool itself, however, I remained skeptical and here's why. Back then, the software industry had just gone through a sort of _Make renaissance_ — a period of time during which we saw a large number of build tools, all inspired by the venerable [Make][], appear on the open source scene.

Each tool was characterized by the particular _programming language_ it would use for its [DSL][]; there was [Rake][] with Ruby, [Psake][] with PowerShell, [Fake][] with F# and [Gradle][] with Groovy, just to name a few. On top of that, you had all the JavaScript ones like [Grunt][] and [Gulp][]. All these tools were part of the _Make-renaissance_. Frankly, I thought we had seen them all and yet there I was, looking at [Cake][] — the one with the C# DSL. As much as I appreciated Cake's high standard and thoughtful design, I had trouble justifying its _raison d'être_.

<img alt="Build Tools"
     src="{{ site.url }}/assets/{{ page.assets }}/build-tools.png"
     class="screenshot-noshadow-caption" />
<span class="caption">Rake, Psake, Fake or Gradle? You must choose, but choose wisely.</span>

To be fair, none of the tools that came from the _Make-renaissance_ was a particularly good fit for a .NET project.[^2] But that had never stopped me from writing my build scripts. Before Cake, my tool of choice was Psake, for no reason other than that PowerShell is so well integrated with the Windows ecosystem.[^3] Believe me, when you're automating any sort of deployment process, _integration_ is what you're after.

Psake was good in that sense, but it was never _great_. You still had to manually make sure that every tool you invoked from your build script was present on the target machine (things like compilers, test runners and package managers). On top of that, you had the PowerShell syntax which — let's face it — isn't particularly fun to read and much less to write.

One day, I decided it was time to check on Cake to see how it was doing. And let me tell you, it was doing _really_ well; the [core team][CakeTeam] had expanded and the project was thriving with frequent [releases][CakeReleases] and a growing [community][CakeContributors]. Although I found the C#-based DSL to be absolutely _delightful_, it wasn't until I saw [this][CakeContrib] that I got really _excited_:

<img alt="Cake Addins on NuGet.org"
     src="{{ site.url }}/assets/{{ page.assets }}/cake-addins.png"
     class="screenshot-noshadow-caption" />
<span class="caption">These are only few of the many <a href="https://www.nuget.org/profiles/cake-contrib" target="_blank">Cake addins</a> available on the NuGet Gallery.</span>

See that list? Those are only a fraction of the third-party tools and libraries that you can interact with _directly_ from a Cake script — as if they were part of the DSL itself!

## How Cake Works

Let me give you a quick example. If you wanted to run all the tests in your project as part of your build process, you could do that with Cake by saying:

```csharp
Task("Run-Tests")
    .Does(() =>
{
    NUnit3("src/**/bin/Release/*Tests.dll");
});
```

Here, `NUnit3` is an [_alias_][CakeAlias] — a C# method that's part of the Cake DSL.[^4] When you invoke it, Cake will automatically resolve the path to the _NUnit 3 console runner's executable_ and convert your method call into this:

```sh
nunit3-console.exe "./src/UnitTests/bin/Release/MyProject.UnitTests.dll"
```

See how the `"src/**/bin/Release/*Tests.dll"` _glob pattern_ was expanded into an actual path to a DLL file? Yeah, Cake did that.

But how do you make sure that the NUnit 3 Console Runner is actually present on the target machine? Easy — you tell Cake to download the [NUnit.Console][NUnitConsole] package from the NuGet Gallery *before* it runs the script by adding a `#tool` [*preprocessor directive*][CakePreprocessorDirective]:

```csharp
#tool nuget:?package=NUnit.Console&version=3.7.0

Task("Run-Tests")
    .Does(() =>
{
    NUnit3("src/**/bin/Release/*Tests.dll");
});
```

That's it. Cake will download any tools and libraries you like as *NuGet packages*, unpack their contents and store them in a local directory that it manages itself. Oh — and it will also take care of [resolving the paths][CakeToolResolution] for you.

You see why I'm all fired up about Cake?

<img alt="The Cake Logo"
     src="{{ site.url }}/assets/{{ page.assets }}/cake-logo.png"
     class="screenshot-noshadow-caption" />
<span class="caption">The official Cake logo.</span>

## Pluralsight

After having used Cake for about a year in all my .NET projects, it occurred to me that not enough people knew about it. So, I drafted a proposal for a Cake course and sent it to my editor at [Pluralsight][]. A couple of emails went back and forth, and soon I was working on [*Building and Deploying Applications with Cake*][CakeCourse].

This time I was particularly excited, because that would become the _first_ Cake course to ever appear on Pluralsight. I felt no pressure whatsoever.[^5]

<img alt="The First Slide of Building and Deploying Applications with Cake"
     src="{{ site.url }}/assets/{{ page.assets }}/course-title.png"
     class="screenshot-noshadow-caption" />
<span class="caption">The very first slide in the course. I still wish the title would fit in one row.</span>

## Building and Deploying Applications with Cake

While Cake sports an elegant design fueled by some very smart ideas, there isn't really that much theory to go through. So, I decided to make a _practical course_ that teaches you how to use Cake in a real-world .NET application.

Also, since Cake is cross-platform, I thought it would be a good idea to demonstrate it both on Windows, using the .NET Framework, as well as on [.NET Core][NetCore] running on macOS.

<img alt="Overview of the Demo Application Used in the Course"
     src="{{ site.url }}/assets/{{ page.assets }}/demo-application.png"
     class="screenshot-noshadow-caption" />
<span class="caption">Overview of the demo application used in the course.</span>

The course is about creating a complete _build and deployment pipeline_ for that application — from source code to software running in the cloud — all using Cake. Along the way, you'll get to know Cake's features and how to use them to overcome the challenges of automating a build and deploy process, both on .NET and on .NET Core.

Here are some of the topics covered in the course:

- **Compiling** an ASP.NET web application on Windows and an ASP.NET Core one on macOS.
- **Testing** with xUnit.net while measuring code coverage.
- **Versioning** by generating a semantic version number.
- **Packaging** as a NuGet and Web Deploy package on Windows, and as a Zip archive on macOS.
- **Deploying** to an Azure Web App using Octopus Deploy, Web Deploy and the Kudu REST API.
- Doing **Continuous Integration** with TeamCity, Visual Studio Team Services and Travis CI.

My goal was to come up with as many scenarios as possible, throw them at Cake and see if it made my life easier or more difficult. The result? Not only was I able to complete many common tasks (like running the tests or packaging the application) in a matter of minutes, but the final build script came out remarkably short and — most importantly — _readable_.

[Cake][] is a great build automation tool — especially if you're a C# developer — and I really think it shows in the course. I'm very happy with how this course turned out, and I hope you'll enjoy [watching it][CakeCourse] as much as I did baking it. 🙂

<div class="note">
    <div style="display: inline-block; margin: 1em 0.3em 0 1em"><i class="fa fa-play-circle-o fa-2x"></i></div>
    <div style="display: inline-block; vertical-align: middle; margin: -0.9em 0 0 0">
        <a href="http://bit.ly/ps-cake-build-deploy">Building and Deploying Applications with Cake</a>
    </div>
</div>

[^1]: Just not the _kind_ of cake you're thinking about. OK, that was a bad [Portal joke][PortalCake].
[^2]: With the possible exception of [Fake][], but — then again — how many .NET developers do you know who feel comfortable writing a build script in F#? My guess is not so many.
[^3]: IIS, Azure, Active Directory and SQL Server — to give you an idea — can all be controlled _entirely_ from PowerShell.
[^4]: Cake comes with many [built-in][CakeDsl] aliases, but you can add even more with external [addins][CakeAddins].
[^5]: OK, not really. 😬

[PortalCake]: https://theportalwiki.com/wiki/Cake
[CakeCourse]: https://www.pluralsight.com/courses/cake-applications-deploying-building
[Cake]: https://cakebuild.net
[CakeProject]: https://github.com/cake-build/cake
[PatrikSvensson]: https://twitter.com/firstdrafthell
[tretton37]: https://tretton37.com
[DSL]: https://en.wikipedia.org/wiki/Domain-specific_language
[Rake]: https://github.com/ruby/rake
[Psake]: https://github.com/psake/psake
[Fake]: https://fake.build
[Gradle]: https://gradle.org
[Grunt]: https://gruntjs.com
[Gulp]: https://gulpjs.com
[Make]: https://en.wikipedia.org/wiki/Make_(software)
[CakeTeam]: https://github.com/orgs/cake-build/people
[CakeReleases]: https://github.com/cake-build/cake/releases
[CakeContributors]: https://github.com/cake-build/cake/graphs/contributors
[CakeAlias]: https://cakebuild.net/docs/fundamentals/aliases
[CakeDsl]: https://cakebuild.net/dsl
[CakeAddins]: https://cakebuild.net/addins
[CakeContrib]: https://www.nuget.org/profiles/cake-contrib
[NUnitConsole]: https://www.nuget.org/packages/NUnit.Console
[CakePreprocessorDirective]: https://cakebuild.net/docs/fundamentals/preprocessor-directives
[CakeToolResolution]: https://cakebuild.net/docs/tools/tool-resolution
[NetCore]: https://www.microsoft.com/net/core/platform
[Pluralsight]: https://www.pluralsight.com

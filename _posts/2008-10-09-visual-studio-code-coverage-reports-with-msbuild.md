---
layout: post
title:  "Visual Studio Code Coverage reports with MSBuild"
date:   2008-10-09
categories: .net
---

Recently I had a project where I was using Microsoft Visual Studio 2008 Team System for development and [CruiseControl.NET][1] for doing continuous integration. I <img alt="VisualStudioLogo" src="http://megakemp.files.wordpress.com/2008/10/visualstudiologo-thumb.jpg?w=104&h=67" class="article" /> usually care about code coverage when running unit tests, so I decided to integrate the code profiling tool included in Visual Studio Team System as part of my build process, in order to produce a code coverage report with each build.

I figured that wouldn’t be too hard, all I had to do in my build script was to invoke Visual Studio’s test runner’s executable (usually found in _C:\Program Files\Microsoft Visual Studio 9.0\Common7\IDE\MSTest.exe_) passing an option to enable code coverage profiling, and grab the output in a file that CruiseControl.NET would later use to produce the build report.

However, I quickly found out that Visual Studio’s test runner produces code coverage output in a binary proprietary format while CruiseControl.NET uses XML in order to generate its reports. Ouch!

Luckily, Microsoft distributes a .NET API that can be used to convert the content of code coverage files produced by Visual Studio into XML. Pheeew!

> The library is contained in the `Microsoft.VisualStudio.Coverage.Analysis.dll` assembly, which can be found in the Visual Studio 2008 Team System installation folder (usually in _C:\Program Files\Microsoft Visual Studio 9.0\Common7\IDE\PrivateAssemblies_). So all I had to do was to add an extra step in the build process to invoke that library and do the conversion.

Since I am using [MSBuild][2] to run the build, I encapsulated the code in an MSBuild task which you can find [over here][3] at the [MSDN Code Gallery][4]. There isn’t really much to it, the actual conversion is easily done in a couple of lines of code:

```csharp
// You need to specify the directory containing
// the binaries that have been profiled by MSTest
CoverageInfoManager.SymPath = symbolsDirPath;
CoverageInfoManager.ExePath = symbolsDirPath;

// The input file is the binary output produced by MSTest
CoverageInfo info = CoverageInfoManager.CreateInfoFromFile(inputFilePath);
CoverageDS dataSet = info.BuildDataSet(null);
dataSet.WriteXml(outputFilePath);
```

Then, the task can be invoked from the MSBuild script with:

```xml
<!-- Imports the task from the assembly -->
<UsingTask TaskName="ConvertVSCoverageToXml" AssemblyFile="CI.MSBuild.Tasks.dll" />

<!-- The values of the 'OutputPath' and 'TestConfigName' variables
     must be the same as the arguments passed to MSTest.exe
     with the /resultsfile and /runconfig options -->
<ConvertVSCoverageToXml
    CoverageFiles="$(OutputPath)\$(TestConfigName)\In\$(ComputerName)\data.coverage"
    SymbolsDirectory="$(OutputPath)\$(TestConfigName)\Out"
    OutputDirectory="$(OutputPath)" />
```

This could easily be achieved in much the same way with an [NAnt][5] task, if that’s your build tool of choice.

/Enrico

[1]: http://www.cruisecontrolnet.org/
[2]: http://channel9.msdn.com/wiki/msbuild/homepage/
[3]: http://code.msdn.microsoft.com/vscoveragetoxmltask
[4]: http://code.msdn.microsoft.com
[5]: http://nant.sourceforge.net/

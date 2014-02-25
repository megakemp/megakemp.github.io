[Source](http://megakemp.com/2008/10/09/visual-studio-code-coverage-reports-with-msbuild/ "Permalink to Visual Studio Code Coverage reports with MSBuild")

# Visual Studio Code Coverage reports with MSBuild

Recently I had a project where I was using Microsoft Visual Studio 2008 Team System for development and [CruiseControl.NET][1] for doing continuous integration. I ![VisualStudioLogo][2]usually care about code coverage when running unit tests, so I decided to integrate the code profiling tool included in Visual Studio Team System as part of my build process, in order to produce a code coverage report with each build.

I figured that wouldn’t be too hard, all I had to do in my build script was to invoke Visual Studio’s test runner’s executable (usually found in _C:\Program Files\Microsoft Visual Studio 9.0\Common7\IDE\MSTest.exe_) passing an option to enable code coverage profiling, and grab the output in a file that CruiseControl.NET would later use to produce the build report.

However, I quickly found out that Visual Studio’s test runner produces code coverage output in a binary proprietary format while CruiseControl.NET uses XML in order to generate its reports. Ouch!

Luckily, Microsoft distributes a .NET API that can be used to convert the content of code coverage files produced by Visual Studio into XML. Pheeew!

The library is contained in the _Microsoft.VisualStudio.Coverage.Analysis.dll_ assembly, which can be found in the Visual Studio 2008 Team System installation folder (usually in _C:\Program Files\Microsoft Visual Studio 9.0\Common7\IDE\PrivateAssemblies_). So all I had to do was to add an extra step in the build process to invoke that library and do the conversion.

Since I am using [MSBuild][3] to run the build, I encapsulated the code in an MSBuild task which you can find [over here][4] at the [MSDN Code Gallery][5]. There isn’t really much to it, the actual conversion is easily done in a couple of lines of code:


    // You need to specify the directory containing
    // the binaries that have been profiled by MSTest
    CoverageInfoManager.SymPath = symbolsDirPath;
    CoverageInfoManager.ExePath = symbolsDirPath;

    // The input file is the binary output produced by MSTest
    CoverageInfo info = CoverageInfoManager.CreateInfoFromFile(inputFilePath);
    CoverageDS dataSet = info.BuildDataSet(null);
    dataSet.WriteXml(outputFilePath);

Then, the task can be invoked from the MSBuild script with:


    
    

    
    

This could easily be achieved in much the same way with an [NAnt][6] task, if that’s your build tool of choice.

/Enrico

   [1]: http://ccnet.thoughtworks.org
   [2]: http://megakemp.files.wordpress.com/2008/10/visualstudiologo-thumb.jpg?w=104&h=67
   [3]: http://channel9.msdn.com/wiki/msbuild/homepage/
   [4]: http://code.msdn.microsoft.com/vscoveragetoxmltask
   [5]: http://code.msdn.microsoft.com
   [6]: http://nant.sourceforge.net/

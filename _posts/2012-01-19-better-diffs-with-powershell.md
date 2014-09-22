---
layout: post
title:  "Better Diffs with PowerShell"
date:   2012-01-19
categories: programming
assets: better-diffs-with-powershell
---

I love working with the command line. In fact, I love it so much that I even use it as my primary way of interacting with the source control repositories of all the projects I'm involved in. It's a matter of personal taste, admittedly, but there's also a practical reason for that.

Depending on what I'm working on, I regularly have to switch among several different source control systems. Just to give you an example, just in the last six months I've been using [Mercurial][1], [Git][2], [Subversion][3] and [TFS][4] on a weekly basis. Instead of having to learn and get used to different UIs (whether it be standalone clients or IDE plugins), I find that I can be more productive by sticking to the _uniform experience_ of the command line based tools.

To enforce my point, let me show you how to check in some code in the source control systems I mentioned above:

* **Mercurial:** `hg commit -m "Awesome feature"`
* **Git:** `git commit -m "Awesome feature"`
* **Subversion:** `svn commit -m "Awesome feature"`
* **TFS:** `tf checkin /comment:"Awesome feature"`

As you can see, it looks pretty much the same across the board.

Of course, you need to be aware of the fundamental differences in how [Distributed Version Control Systems (DVCS)][5] such as Mercurial and Git behave compared to traditional centralized [Version Control Systems (VCS)][6] like Subversion and TFS. In addition to that, each system tries to characterize itself by having its own set of features or by solving a common problem (like [branching][7]) in a unique way.
However, there aspects must be taken into consideration regardless of your client of choice. What I'm saying is that the command line interface *at least* offers a single point of entry into those systems, which in the end makes me more productive.

### Unified DIFFs

One of the most basic features of any source control system is the ability to compare two versions of the same file to see what's changed. The output of such comparison, or [DIFF][8], is commonly represented in text using the [Unified DIFF format][9], which looks something like this:

```diff
@@ -6,12 +6,10 @@
-#import <SenTestingKit/SenTestingKit.h>
-#import <UIKit/UIKit.h>
-
@interface QuoteTest : SenTestCase {
}

- (void)testQuoteForInsert_ReturnsNotNull;
+- (void)testQuoteForInsert_ReturnsPersistedQuote;

@end
```

In the Unified DIFF format changes are displayed at the line level through a set of well-known prefixes. The rule is simple:

A line can either be **added**, in which case it will be preceded by a `+` sign, or **removed**, in which case it will be preceded by a `-` sign. **Unchanged** lines are preceded by a whitespace.

In addition to that, each modified section, referred to as _hunk_, is preceded by a header that indicates the position and size of the section in the original and modified file respectively. For example this _hunk header_:

```diff
@@ -6,12 +6,10 @@
```

means that in **the original file** the modified lines start at `line 6` and continue for `12 lines`. In **the new file**, instead, that same change starts at `line 6` and includes a total of `10 lines`.

### True Colors

At this point, you may wonder what all of this has to do with PowerShell, and rightly so. Remember when I said that I prefer to work with source control from the command line? Well, it turns out that _scrolling through gobs of text_ in a console window isn't always the best way to figure out what has changed between two change sets.

Fortunately, since PowerShell allows to [print text in the console window using different colors][10], it only took a switch statement and a couple of regular expressions, to turn that [wall of text][11] into something more readable. That's how the **Out-Diff** cmdlet was born:

```powershell
function Out-Diff {
<#
.Synopsis
    Redirects a Universal DIFF encoded text from the pipeline to the host using colors to highlight the differences.
.Description
    Helper function to highlight the differences in a Universal DIFF text using color coding.
.Parameter InputObject
    The text to display as Universal DIFF.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
    [PSObject]$InputObject
)
    Process {
        $contentLine = $InputObject | Out-String
        if ($contentLine -match "^Index:") {
            Write-Host $contentLine -ForegroundColor Cyan -NoNewline
        } elseif ($contentLine -match "^(\+|\-|\=){3}") {
            Write-Host $contentLine -ForegroundColor Gray -NoNewline
        } elseif ($contentLine -match "^\@{2}") {
            Write-Host $contentLine -ForegroundColor Gray -NoNewline
        } elseif ($contentLine -match "^\+") {
            Write-Host $contentLine -ForegroundColor Green -NoNewline
        } elseif ($contentLine -match "^\-") {
            Write-Host $contentLine -ForegroundColor Red -NoNewline
        } else {
            Write-Host $contentLine -NoNewline
        }
    }
}
```

Let's break this function down into logical steps:

1. **Take** whatever input comes from [the PowerShell pipeline][12] and convert it to a string.
2. **Match** that string against a set of regular expressions to determine whether it's part of the [Unified DIFF format][9].
3. **Print** the string to the console with the appropriate color: green for added, red for removed and gray for the headers.

Pretty simple. And using it is even simpler: just load the script into your PowerShell session using [dot sourcing][13] or by [adding it to your profile][14] and _redirect the output of a 'diff' command to the Out-Diff cmdlet through piping_ to start enjoying colorized DIFFs. For example the following commands:

```powershell
. .\Out-Diff.ps1
git diff | Out-Diff
```

will generate this output in PowerShell:

<img src="{{ site.url }}/assets/{{ page.assets }}/out-diff-in-action.png"
     alt="The Out-Diff cmdlet in action"
     title="The Out-Diff cmdlet in action"
     class="screenshot-noshadow-caption" />
<span class="caption">The Out-Diff PowerShell cmdlet in action</span>

One thing I'd like to point out is that even if the output of `git diff` consists of many lines of text, PowerShell will redirect them to the `Out-Diff` function _one line at a time_. This is called a [streaming pipeline][15] and it allows PowerShell to be responsive and consume less memory even when processing large amounts of data. Neat.

### Wrapping up

PowerShell is an extremely versatile console. In this case, it allowed me to enhance a traditional command line tool (`diff`) through a simple script. Other projects, like [Posh-Git][16] and [Posh-Hg][17], take it even further and leverage PowerShell's rich programming model to provide a better experience on top of existing console based source control tools. If you enjoy working with the command line, I seriously encourage you to check them out.

<a id="downloads"></a>
<div class="note downloads">
<ul>
  <li class="github"><a href="https://gist.github.com/ecampidoglio/1635952">Source code for <strong>Out-Diff</strong></a></li>
</ul>
</div>

[1]: http://mercurial.selenic.com
[2]: http://git-scm.com
[3]: http://subversion.tigris.org
[4]: http://msdn.microsoft.com/en-us/vstudio/ff637362
[5]: http://en.wikipedia.org/wiki/Distributed_revision_control
[6]: http://en.wikipedia.org/wiki/Revision_control
[7]: http://en.wikipedia.org/wiki/Branching_(software)
[8]: http://en.wikipedia.org/wiki/Diff
[9]: http://en.wikipedia.org/wiki/Diff#Unified_format
[10]: http://technet.microsoft.com/en-us/library/dd347596.aspx
[11]: http://www.walloftext.net
[12]: http://powershell.com/cs/blogs/ebook/archive/2008/11/23/chapter-5-the-powershell-pipeline.aspx
[13]: http://technet.microsoft.com/en-us/library/ee176949.aspx#ECAA
[14]: http://powershell.com/cs/blogs/ebook/archive/2009/03/30/chapter-10-scripts.aspx#profile-autostart-scripts
[15]: http://powershell.com/cs/blogs/ebook/archive/2008/11/23/chapter-5-the-powershell-pipeline.aspx#streaming-real-time-processing-or-not
[16]: https://github.com/dahlbyk/posh-git
[17]: http://poshhg.codeplex.com


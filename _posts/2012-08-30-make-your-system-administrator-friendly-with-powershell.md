---
layout: post
title:  "Make your system administrator friendly with PowerShell"
date:   2012-08-30
categories: speaking
excerpt: Following up on my interest for PowerShell, I’ve found myself talking a fair deal about it both at conferences and user groups. In particular, during the last year or so, I’ve been giving a presentation about how to integrate PowerShell into your own applications.
---

I know I’ve said it before, but I love the command line. And being a command line junkie, I’m naturally attracted to all kinds of tools the involve a bright blinking square on a black canvas. Historically, I’ve always been a huge fan of the mighty [Bash][1]. PowerShell, however, came to change that.

<img alt="PowerShell" src="http://megakemp.files.wordpress.com/2012/08/powershell-cropped-small.png?w=480" class="article" />

Since PowerShell made its first appearance under the [codename “_Monad_”][3] back in 2005, it proposed itself as more than just a regular command prompt. It brought, in fact, something completely new to the table: _it combined the flexibility of a Unix-style console, such as Bash, with the richness of the .NET Framework and an [object-oriented pipeline][4]_, which in itself was totally unheard of.
With such a compelling story, it soon became apparent that PowerShell was aiming to become the official command line tool for Windows, replacing both the ancient [Command Prompt][5] and the often criticized [Windows Script Host][6]. And so it has been.

Seven years has passed since “_Monad_” [was officially released as PowerShell][7], and its presence is as pervasive as ever. Nowadays you can expect to find PowerShell in just about all of Microsoft’s major server products, from [Exchange][8] to [SQL Server][9]. It’s even become part of Visual Studio thorugh the [NuGet Package Manager Console][10]. Not only that, but tools such as [posh-git][11], make PowerShell a very nice, and arguably more natural, alternative to [Git Bash][12] when using Git on Windows.

Following up on my interest for PowerShell, I’ve found myself talking a fair deal about it both at conferences and user groups. In particular, during the last year or so, I’ve been giving a presentation about how to integrate PowerShell into your own applications.

<div class="note">
<p>
The idea is to leverage the <a href="http://msdn.microsoft.com/en-us/library/windows/desktop/ms714469(v=vs.85).aspx">PowerShell programming model</a> to provide a <em>rich set of administrative tools</em> that will (hopefully) improve the often stormy relationship between devs and admins.
</p>
</div>

Since I’m often asked about where to get the slides and the code samples from the talk, I thought I would make them all <a href="#downloads">available here</a> in one place for future reference.

So here it goes, I hope you find it useful.

### Abstract

> Have you ever been in a software project where the IT staff who would run the system in production, was accounted for right from the start? My guess is not very often. In fact, it’s far too rare to see functionality being built into software systems specifically to make the job of the IT administrator _easier_. It’s a pity, because pulling that off doesn’t require as much time and effort as you might think with tools like PowerShell.
>
> In this session I’ll show you how to enhance an existing .NET web application with a set of administrative tools, built using the PowerShell programming model. Once that is in place, I’ll demonstrate how common maintenance tasks can either be performed manually using a traditional GUI or be fully automated through PowerShell scripts using the same code base.
>
> Since the last few years, Microsoft itself has committed to making all of its major server products fully administrable both through traditional GUI based tools _as well as_ PowerShell. If you’re building a server application on the .NET platform, you will soon be expected to do the same.

<a id="downloads"></a>
<div class="note downloads">
<ul>
  <li class="slides"><a
  href="http://megakemp.files.wordpress.com/2012/08/sysadminfriendlywithpowershell-slides.pdf">Slides</a></li>
  <li class="pdf"><a
  href="http://megakemp.files.wordpress.com/2012/08/sysadminfriendlywithpowershell-codesamples.pdf">Code samples</a></li>
  <li class="github"><a href="https://github.com/ecampidoglio/Expresso">Expresso on GitHub</a></li>
</ul>
</div>

[1]: http://www.bash.org
[3]: http://blogs.msdn.com/b/monad/archive/2005/08/25/456590.aspx
[4]: http://powershell.com/cs/blogs/ebookv2/archive/2012/03/05/chapter-5-the-powershell-pipeline.aspx#object-oriented-pipeline
[5]: http://en.wikipedia.org/wiki/Command_Prompt
[6]: http://en.wikipedia.org/wiki/Windows_Script_Host
[7]: http://blogs.msdn.com/b/monad/archive/2006/04/25/583333.aspx
[8]: http://social.technet.microsoft.com/wiki/contents/articles/1823.exchange-2010-powershell-scripting-resources-en-us.aspx
[9]: http://msdn.microsoft.com/en-us/library/cc281954(v=sql.105)
[10]: http://docs.nuget.org/docs/start-here/using-the-package-manager-console
[11]: https://github.com/dahlbyk/posh-git
[12]: http://code.google.com/p/msysgit

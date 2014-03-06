---
layout: post
title:  "Grokking Git by seeing it"
date:   2013-01-22
categories: speaking
---

When I first started getting into [Git][1] a couple of years ago, one of the things I found most frustrating about the learning experience was the complete lack of guidance on how to interpret the myriad of commands and switches found in the documentation. On second thought, calling it _frustrating_ is actually an understatement. Utterly painful would be a better way to describe it. <img alt="Git logo" src="http://git-scm.com/images/logos/downloads/Git-Icon-1788C.png" class="article resize" />
What I was looking for, was a way to **represent the state of a Git repository in some sort of graphical format**. In my mind, if only I could have visualized how the different combinations of commands and switches impacted my repo, I would have had a much better shot at actually understand their meaning.

After a bit of research on the Git forums, I noticed that many people was using a simple text-based notation to describe the state of their repo. The actual symbols varied a bit, but they all essentially came down to something like this:

<pre>

                               C4--C5 (feature)
                              /
                C1--C2--C3--C4'--C5'--C6 (master)
                                       ^
</pre>

where the symbols mean:

  * **Cn** represents a single commit
  * **Cn’** represents a commit that has been moved from another location in history, i.e. it has been _rebased_
  * **(branch)** represents a branch name
  * **^** indicates the commit referenced by HEAD

This form of [graphical DSL][2] proved itself to be extremely useful not only as a learning tool but also as a universal Git language, useful for documentation as well as for communication during problem solving.

Now, keeping this idea in mind, imagine having a tool that is able to draw a similar diagram automatically. Sounds interesting? Well, let me introduce [SeeGit][3].

[SeeGit][3] is Windows application that, given the path to a Git repository on disk, will generate a diagram of its commits and references. Once done, it will keep watching that directory for changes and automatically update the diagram accordingly.

This is where the idea for my _Grokking Git by seeing it_ session came from. The goal is to **illustrate the meaning behind different Git operations** by going through a series of demos, while having the command line running on one half of the screen and SeeGit on the other. As I type away in the console you can see the Git history unfold in front of you, giving you an insight in how things work under the covers.

In other words, something like this:

<img alt="SeeGit session in progress." src="http://megakemp.files.wordpress.com/2013/01/seegitsession.png?w=480" class="screenshot-noshadow" />

So, this is just to give you a little background. Here you’ll find the session’s abstract, slides and demos. There’s also a recording from when I presented this talk at [LeetSpeak][5] in Malmö, Sweden back in October 2012. I hope you find it useful.

### Abstract

> In this session I’ll teach you the Git zen from the inside out. Working out of real world scenarios, I’ll walk you through Git’s fundamental building blocks and common use cases, working our way up to more advanced features. And I’ll do it by showing you graphically what happens under the covers, as we fire different Git commands.
>
> You may already have been using Git for a while to collaborate on some open source project or even at work. You know how to commit files, create branches and merge your work with others. If that’s the case, believe me, you’ve only scratched the surface. I firmly believe that a deep understanding of Git’s inner workings is the key to unlock its true power allowing you, as a developer, to take full control of your codebase’s history.

<a id="video"></a>
<iframe src="//player.vimeo.com/video/52633764?color=8dc63f"
        class="video"
        width="640"
        height="360"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen>
</iframe>

<a id="downloads"></a>
<div class="note downloads">
<ul>
  <li class="slides"><a
  href="http://megakemp.files.wordpress.com/2013/01/grokkinggitbyseeingit-slides.pdf">Slides</a></li>
  <li class="pdf"><a
  href="http://megakemp.files.wordpress.com/2013/01/grokkinggitbyseeingit-demos.pdf">Demos</a></li>
</ul>
</div>

[1]: http://git-scm.com
[2]: http://ayende.com/blog/2966/graphical-domain-specific-languages
[3]: https://github.com/Haacked/SeeGit
[5]: http://leetspeak.se

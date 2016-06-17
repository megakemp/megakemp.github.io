---
layout: post
title: On Being a Good .NET Developer
date: 2016-06-20
categories: programming
---

While reading [Rob Ashton](https://twitter.com/RobAshton)'s thought-provoking piece titled "[_Why you can't be a good .NET developer_](http://codeofrob.com/entries/why-you-cant-be-a-good-.net-developer.html)" over my morning cappuccino the other day, for the first few paragraphs I found myself nodding in agreement.

Having been a consultant for the past fifteen years, I've certainly come across more than a few teams where the "_lowest common denominator_" was without a doubt the driving force behind every decision. This isn't in any way unique to .NET, though. I have seen the exact same thing happen in other platforms as well: Java, JavaScript and — to some degree — even C, C++[^1].

What they all have in common is a _humongous_ active user base.

You see, it's simply a matter of statistics: the more popular the platform[^2], the higher the number of beginners. The two variables are directly proportional to each other — some might argue even exponential. If you're looking for a concrete example, consider the amount of novice JavaScript developers brought in by the popularity of [jQuery](https://jquery.com).

The problem is not that .NET has an _unusually_ high number of "_lowest common denominators_". That number is simply _higher_ compared to platforms with a narrower, mostly self-selected, audience.

The problem — and this is where I disagree with the underlying message in that article — is failing a platform based on the number of inexperienced programmers who work with it.

I also don't think that fleeing is the right way to handle the situation. I don't know about you, but I like to apply the [Boy Scout Rule](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule) in more than just code; when I join a team, I want to leave it in better shape than I found it. This means that if I join a team who is dominated by inexperienced programmers, I don't see it as an excuse to hold back on quality. Quite the opposite, I feel compelled to introduce the team to new ways of doing things, new perspectives. Note that I don't _force_ anything on anyone; instead, I try to lead by example.

For instance, if I see that the team is stuck using TFS, I will still use Git on my machine and add a bridge like [git-tfs](https://github.com/git-tfs/git-tfs) to collaborate. Sooner or later, without mistake, someone is going to wonder why I do that. Driven by curiosity, they'll ask me to explain how Git is better than TFS and I'll be more than happy to tell them all about it. After a while, that same person — or someone else on the team — is going to start using Git on their own machine and, soon enough, the entire team will be sitting in a console firing Git commands like there's no tomorrow, wondering why they hadn't learned it earlier.

I never compromise on excellence. It's just that with some teams, the way to get there is longer than with others.

To me the solution isn't to run away from beginners. It's to inspire and mentor them so that they won't stay beginners forever and instead go on to do the same for other people. That applies as much to .NET as it does to any other platform or language.

If you aren't the type of person who has the time or the interest to raise the lowest common denominator, that's perfectly fine. I do believe you're better off moving somewhere else where your ambitions aren't being held back by inexperienced team members. As for myself, I'll stay behind — teaching.

[^1]: C and C++ have a steep learning curve which forces programmers to move past the beginner stage far more quickly than with other languages in order to get anything done. So, while C and C++ are immensely widespread, the number of novices who work with them tends to stay relatively low.

[^2]: Just to be clear, by "platform" I mean a programming language together with its ecosystem of libraries, frameworks and tools.

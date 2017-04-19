---
layout: post
title: What's in a Branch
date: 2017-04-19
categories: programming
assets: what-is-in-a-git-branch
summary: "Regardless of how you choose to track your history, one of the things you often want to know is which commits are in what branch. Sounds easy enough, right? And yet, you wouldn't believe just how cumbersome certain version control systems make answering such a simple question. What I think you'll find even harder to believe, however, is the fact that with Git it's as easy as pie."
---

### Graphs and References

Before I tell you all about querying the state of your branches, let's back up for a second and remind ourselves of how Git views history.

Consider this graph:

![Directed acyclic graph]({{ site.url }}/assets/{{ page.assets }}/graph.png)

What you're seeing here is a [_directed acyclic graph_](https://en.wikipedia.org/wiki/Directed_acyclic_graph): a fancy name used to describe a group of nodes (_graph_) where the edges point to a certain direction (_directed_) and never loop back on themselves (_acyclic_).

Why is it relevant? Because this is how Git represents history.

In Git's parlance, each node represents a _commit_ and each commit has exactly one edge that connects it to its _parent_. In other words, the directed acyclic graph of a Git history can only go in one direction: _backwards_.

So far, so good. Now let's add one more piece of information to the mix:

![Branch]({{ site.url }}/assets/{{ page.assets }}/branch.png)

See that `master` label? That's a _branch_. Branches are simply [_references_](https://git-scm.com/docs/gitglossary#gitglossary-aiddefrefaref) that point to specific commits. In fact, a branch is a _41 bytes_ text file that contains the ID of the commit it references. Don't believe me? Try running this command in the root of your repository:[^1]

```bash
cat .git/refs/heads/master
```

You'll get back something like this:

```bash
514e6c9c96d27ab9eb776644c7c3cdadce61979f
```

That 41 characters string is the SHA-1 hash of the [_commit object_](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects) that's currently referenced by the `master` branch. Go ahead, verify it with:[^2]

```bash
git show 514e6c9
```

Hopefully, you'll believe me now. So, let's boil it all down to a single sentence to make it easier to remember:

<div class="note">
<p>
<i class="fa fa-code-fork fa-2x pull-left"></i>
In Git, a branch is a <a href="https://git-scm.com/docs/gitglossary#gitglossary-aiddefrefaref"><em>reference</em></a> to the latest commit in a sequence; the history of a branch is reconstructed starting from that latest commit going backwards, following the chain of parents.
</p>
</div>

### Reachability

Now that we have a good mental model for thinking about history, we can talk about the concept of _reachability_.

Imagine we have a history that looks like this:

![Fork]({{ site.url }}/assets/{{ page.assets }}/fork.png)

Here, we have two branches named `master` and `feature` that diverge on commit `B`. We can immediately observe two things at first glance:

* The `feature` branch contains commits `E` and `D` which are *not* in `master`.
* The `master` has commit `C` that's *not* in `feature`.

Sure, it's easy enough to tell when your history is this small—and you have a pretty graph to look at—but it might not be as obvious once you deal with more than two branches and a large number of commits.[^3]

But don't despair: everything becomes much clearer once you start thinking in terms of commits and what is _reachable_ from which branch. Let me explain:

<div class="note">
<p>
<i class="fa fa-hand-o-right fa-2x pull-left"></i>
A commit <code>A</code> is said to be <em>reachable</em> from another commit <code>B</code> if there exists a <em>contiguous</em> path of commits that lead from <code>B</code> to <code>A</code>.
</p>
</div>

In other words, `A` is _reachable_ from `B` if you can start from `B` and arrive at `A` just by following the chain of parents.

Easy, right? Now, combine this concept with the notion that branches are just _references_ to commits and you have all the pieces you need to solve the puzzle!

Reachability is a powerful concept because it allows us to take our initial question:

> Which commits are in a branch?

and turn it into:

> Which commits are reachable from a branch and not from another?

Git has a way to express this: it's called the [_double dot_](https://www.git-scm.com/book/id/v2/Git-Tools-Revision-Selection#_double_dot) notation. Consider this command:

```bash
git log --oneline master..feature
9b571c2 E
fa77581 D
```

This literally means: show me the commits that are _not reachable_ from the first reference in the range (`master`) but that _are reachable_ from the second reference (`feature`). The results is commits `E` and `D`:

![Reachable from feature]({{ site.url }}/assets/{{ page.assets }}/unmerged-right.png)

Observe what happens when we switch places between the two branch references:

```bash
git log --oneline feature..master
2eec656 C
```

That's right, we get commit `C`, that is the commit _not reachable_ from `feature` but _reachable_ from `master`:

![Reachable from master]({{ site.url }}/assets/{{ page.assets }}/unmerged-left.png)

This expression is so useful that I even made an [alias](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) for it:

```bash
git config --global alias.new "log master..HEAD"
```

Now, every time I want to know which commits are in my _current_ branch (referenced by `HEAD`) that I haven't yet merged into `master`, I simply say:

```bash
git new
```

### What Was Merged?

If your workflow involves a lot of merge commits (like [GitFlow](http://nvie.com/posts/a-successful-git-branching-model)), one of the questions that will pop up a lot is:

> Which commits were brought into a branch by a specific merge?

To answer that, let's consider our two sample branches; this time, we're going to merge feature `feature` into `master`:

![Merged feature into master]({{ site.url }}/assets/{{ page.assets }}/merged-before.png)

Let's play a bit of [Jeopardy](https://en.wikipedia.org/wiki/Jeopardy!)[^4]: if the answer is commits `E` and `D`, what's the Git command? Remember, we don't have a pretty graph to look at; all we have is the console and the concept of _reachability_ that we talked about before. Give it some thought. Can you guess it?

Let me give you a hint. Another way of phrasing the question we're looking for is:

> Which commits were _not reachable_ from `master` _before_ the merge commit but are _reachable_ now?

Considering that the _first parent_ of a merge commit is always the _destination_ branch—that is the branch that was _merged to_—one way to express that would be:

```bash
git log --oneline M^..M
cad1c97 M
9b571c2 E
fa77581 D
```

This is saying: show me the commits that are _not reachable_ from the first parent of the merge commit `M` (that is `C`) but that _are reachable_ from `M`.

![What was merged into master]({{ site.url }}/assets/{{ page.assets }}/merged-after.png)

As you would expect, we get back `M` itself followed by `E` and `D`, that is the commits merged into `master` 🎉

This expression is so common that it even has a shorter—albeit more unreadable—version [as of Git 2.11](https://github.com/git/git/blob/master/Documentation/RelNotes/2.11.0.txt#L106-L110):

```bash
git log M^-1
```

Just when you thought Git commands couldn't get any more cryptic, right? Anyway, this is the equivalent of `M^..M` where `^-1` refers to the _first parent_ of `M`.

Of course, we don't have to limit ourselves to just the list of commits. If we wanted, you could also get a patch containing _the collective changes_ that got merged into `master` by saying:

```bash
git diff M^-1
```

Git's syntax might be ridiculously opaque at times, but finding out what's in a branch is easier than ever thanks to Git's intuitive branching model.

<div class="note">
<p>
<i class="fa fa-play-circle-o fa-2x pull-left pull-left-three-lines"></i>
Was this helpful? If you like, you can find even more ways to slice and dice the history of your Git repository in my <a href="http://bit.ly/ps-enrico-campidoglio">Pluralsight</a> course <a href="http://bit.ly/git-tips-tricks">Advanced Git Tips and Tricks</a>.
</p>
</div>

[^1]: If you're on Windows and don't use Bash, you can replace that with: `notepad .git\refs\heads\master`.
[^2]: You don't have to use the entire SHA-1 hash here; just enough for Git to tell which object it belongs to. For most repositories, the first _7 characters_ are enough to uniquely identify an object. Git calls this the _abbreviated_ hash.
[^3]: Actually, it doesn't take much before this happens: imagine a typical [GitFlow](http://nvie.com/posts/a-successful-git-branching-model) scenario where you have multiple _feature_ and _bugfix_ branches running in parallel and you need to tell which commits are available in _develop_ and which aren't. 😰
[^4]: I'll tell you the answer and you'll have to guess the question.

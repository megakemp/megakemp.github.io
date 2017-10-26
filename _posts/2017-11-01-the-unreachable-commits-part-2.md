---
layout: post
title: Unreachable Commits (Part 2)
date: 2017-11-01
categories: programming
assets: the-unreachable-commits-part-two
image: card.png
excerpt: ""
---

_In this second part of the [invisible commits][InvisibleCommitsPartOne] series, we'll look at another kind of commit that you don't see but that you can get back if you need to: the ones without a [reference][References]. These are the unreachable commits._

---

## How To Lose a Commit

Let's start by looking at the ways you can lose a commit so that it becomes _unreachable_.

### Deleting a Branch

First, there's the simple one: deleting a branch.

Here, the `feature` branch contains work for a particular feature in the software. Now, Git already has some built-in protection against clumsiness, so, for example, it wouldn't let you delete a branch that hasn't yet been merged without at least warning you about it:

```sh
git branch -d feature
Branch 'feature' hasn't been merged.
```

But, assuming we really meant to delete `feature` and therefore passing the `-D` option to `git-branch`, we would end up without a way to reference those commits:

```sh
git branch -D feature
Branch 'feature' deleted.
```
This time, the `feature` branch really is gone.

### Clearing the Stash

[InvisibleCommitsPartOne]: {{ site.url }}/2017/10/19/the-invisible-commits-part-one/
[References]: https://git-scm.com/book/en/v2/Git-Internals-Git-References

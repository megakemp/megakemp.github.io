---
layout: post
title: The Case for Pull Rebase
date: 2019-03-20
categories: git
assets: the-case-for-pull-rebase
image: trunk.png
excerpt: "The standard `git pull` command doesn’t play well with the Trunk-based development workflow. Fortunately, there’s a somewhat obscure way to make things right."
---

_The standard `git pull` command doesn’t play well with the Trunk-based development workflow. Fortunately, there’s a somewhat obscure way to make things right._

---

I’m going to make a bold generalization here and say that most development teams would rather work on a single *shared* branch.

I’m putting the emphasis on *shared* because, while there may well be other kinds of branches being worked on at any given time (feature branches and Pull Request branches come to mind) there’s still only one *main branch* everyone commits to. The other branches are often focused on one specific task, so, naturally, they exist for a limited period of time.[^1]

When I say *single shared* branch, I also mean a [long-running branch](https://git-scm.com/book/it/v2/Git-Branching-Branching-Workflows#_long_running_branches), one that spans over the entire lifetime of the project.

<img alt="Trunk-Based Development"
     src="{{ site.url }}/assets/{{ page.assets }}/trunk.png"
     class="screenshot-noshadow-caption" />
<span class="caption">Everyone commits their work on a single shared branch, often called <code>Trunk</code>.</span>

This style of collaboration is called [Trunk-Based Development](https://paulhammant.com/2013/04/05/what-is-trunk-based-development/) or [Mainline development](https://gitversion.readthedocs.io/en/latest/reference/mainline-development/) and is, in my experience, the most common workflow you see around. That’s no coincidence: it's also the oldest style of development collaboration known to mankind (dating all the way back to [the dawn of version control systems](https://en.m.wikipedia.org/wiki/Source_Code_Control_System)) and one most programmers feel comfortable with. After all, there’s ever only *one version* of the code to worry about.

As much as I love Git’s [beautiful branching model](https://megakemp.com/2017/04/19/what-is-in-a-git-branch/), there’s no denying that sticking with the Mainline development workflow for as long as possible is often the smart thing to do in a project. In fact, that’s what the vast majority of open source projects do.[^2]

Having a single long-running shared branch isn’t the problem here; the default behaviour of the `git pull` command is. Here's why.

## Anatomy of a Git Pull

If you aren’t familiar with Git’s inner workings, it might come as a surprise to know that `git pull` isn’t actually a core command _per se_,[^3] but rather a combination of two other commands: `git fetch` and `git merge`; the former downloads any missing commits from a remote repository, while the latter *merges* them into your current branch.[^4]

Imagine you have a repository whose history looks like this:

<img alt="Initial repo"
     src="{{ site.url }}/assets/{{ page.assets }}/repo.png"
     class="screenshot-noshadow-caption" />
<span class="caption">A simple repo.</span>

Now, let's say that you make a new commit `C` on `master`. Meanwhile, someone else on your team commits `D` on their own version of `master`; now, here's the catch: they manage to push their commit to the project’s central shared repository *before* you.

<img alt="Repo with remote"
     src="{{ site.url }}/assets/{{ page.assets }}/repo-with-remote.png"
     class="screenshot-noshadow-caption" />
<span class="caption">You commit `C`, someone else pushes `D`.</span>

Unaware of that, you try to push your brand new commit `C` but are bluntly denied — Git lets you know that `B` no longer is the latest commit in the remote `master` branch:

```
! [rejected] master -> master (non-fast-forward)
error: failed to push some refs to '<remote-url>'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
```

You shrug and run `git pull` to get the latest commits. Now, keep in mind that `git pull` is actually `git fetch` followed by `git merge`, so here's what you end up with:

<img alt="Regular pull"
     src="{{ site.url }}/assets/{{ page.assets }}/pull-merge.png"
     class="screenshot-noshadow-caption" />
<span class="caption">The result of a regular pull.</span>

Git fetched the new commit `D` from the remote repository, updated your local reference to the remote `master` branch `origin/master`[^5] and _merged_ that into your local `master`, thus creating the merge commit `M`.

You're now finally ready to push your beloved commit `C`, along with commit `M`.

## Merge Clutter

At this point, you might think _so what, this is just business as usual_, and you'd be right — after all, this is what happens when you invoke the standard `pull` command without any fancy options.

However, consider the effect this has on your repo over time:

<img alt="Merge clutter"
     src="{{ site.url }}/assets/{{ page.assets }}/merge-clutter.png"
     class="screenshot-noshadow-caption" />
<span class="caption">Cluttered history.</span>

This is how history looks like in a project who uses Git together with the Trunk-based development workflow (which, as we established, is pretty common). You see all those merge commits cluttering the mainline? The only reason they exist is because someone on the team happened to push their commits before someone else.

> In other words, when everyone commits to a single shared branch, the standard `git pull` command is going to clutter your history with a bunch of merge commits, simply due to the asynchronous nature of collaboration.

A merge commit should represent a *significative event*: the point in time when two different lines of history came together. For example, a topic branch merged into a long-running branch (like a pull request), or a long-running branch merged into another (like a release). The merge commits created by `git pull`, on the other hand, don't represent anything — they’re just an artificial side-effect.

## Pull Rebase

Fortunately, it doesn't have to be that way. Here's a different approach.

We said that `git pull` is actually two separate operations: `git fetch` followed by `git merge`. Well, it turns out that if we pass the [-r (--rebase)](https://git-scm.com/docs/git-pull#Documentation/git-pull.txt--r) option to `git pull`, we can replace that `git merge` with `git rebase`. I know, a fine example of Git’s syntax at its best, right?

Let's go back to our previous example right before we did `git pull`.

<img alt="Initial repo"
     src="{{ site.url }}/assets/{{ page.assets }}/repo-with-remote.png"
     class="screenshot-noshadow-caption" />
<span class="caption">Back to square one.</span>

This time, we do `git pull -r` instead and look at what happens:

<img alt="Pull rebase"
     src="{{ site.url }}/assets/{{ page.assets }}/pull-rebase.png"
     class="screenshot-noshadow-caption" />
<span class="caption">The result of a pull rebase.</span>

Git still fetched commit `D` but instead of merging `origin/master` into our local `master`, it _rebased_ `C` on top of `origin/master`, thus giving us a linear history.

Now, if everyone on the team was doing `git pull --rebase` by default, we wouldn't have any of those artificial merge commits. That's a win in my book, but we are not done yet.

## Keeping The True Merges

There is one more scenario we need to consider: what if you have a local merge commit that you _do_ want to push to the remote — is `git pull -r` going to keep it?

Unfortunately, the answer is **no**.

Let's start once again with our previous example, only this time we have a legitimate merge commit `N` that we want to share with the world:

<img alt="Repo with remote"
     src="{{ site.url }}/assets/{{ page.assets }}/repo-with-local-merge.png"
     class="screenshot-noshadow-caption" />
<span class="caption">A locally merged pull request branch containing the `PR` commit.</span>

Just for the sake of the argument, let's see what would happen if we were to run the plain `git pull` first:

<img alt="Double merge"
     src="{{ site.url }}/assets/{{ page.assets }}/double-merge.png"
     class="screenshot-noshadow-caption" />
<span class="caption">One merge too many.</span>

Double-merge! 😱 Fortunately, we know better now, so let's run `git pull -r` instead:

<img alt="Lost local merge"
     src="{{ site.url }}/assets/{{ page.assets }}/lost-local-merge.png"
     class="screenshot-noshadow-caption" />
<span class="caption">Our merge commit `N` is gone after a pull rebase.</span>

Wait — where did `N` go? The answer is `git rebase` _removed it_ because, well, that’s what `rebase` does by default. Luckily for us, there is an option to keep the merge commits during a rebase: the [`--preserve-merges`](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt--p) parameter.[^6]

In the context of `git pull`, this translates to `git pull --rebase=preserve`. So, let’s run that instead:

<img alt="Rebased local merge"
     src="{{ site.url }}/assets/{{ page.assets }}/rebased-local-merge.png"
     class="screenshot-noshadow-caption" />
<span class="caption">Rebased merge.</span>

That’s more like it: our merge commit `N` was _rebased_ on top of the remote `origin/master` branch.[^7]

## The New Default

You'd be forgiven for not remembering to invoke `pull` with the right combination of arguments at any given time, so let's make it our new default, shall we? The way you tell Git to always do a _pull rebase_ instead of a _pull merge_ (while still keeping any local merge commits) is by setting the [`pull.rebase`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-pullrebase) configuration option:

```
git config --global pull.rebase preserve
git config --global pull.rebase merges   # if you're on Git 2.18 or later
```

Of course, you can omit the `--global` option if, for some reason, you only want this to apply to your current repository.

## In Conclusion

The combination of using a [Trunk-based development workflow](https://paulhammant.com/2013/04/05/what-is-trunk-based-development/) with the regular `git pull` command leads to a history cluttered with merge commits that you don't want. Fortunately, by simply replacing the `merge` part of `git pull` with `rebase`, you can enjoy a straightforward single-branch workflow without sacrificing the cleanness of your history.

<div class="note">
<p>
<i class="fa fa-play-circle-o fa-2x pull-left pull-left-three-lines"></i>
If you're interested in learning other techniques like the one described in this article, you should check out my <a href="http://bit.ly/ps-enrico-campidoglio">Pluralsight</a> course <a href="http://bit.ly/git-tips-tricks">Advanced Git Tips and Tricks</a>.
</p>
</div>

[^1]: In Git’s parlance, these are often called [topic branches](https://git-scm.com/book/it/v2/Git-Branching-Branching-Workflows#r_topic_branch).
[^2]: With a twist: external (and sometimes also internal) contributors can’t commit directly to the main branch, but instead have to submit their code a dedicated Pull Request branch. This workflow has become known as the [GitHub Flow](https://guides.github.com/introduction/flow/).
[^3]: In fact, like many other commands in Git, it used to be a [shell script](https://github.com/git/git/blob/master/builtin/pull.c#L4).
[^4]: Where by *current*, I mean the branch that reflects your working copy. In technical terms, that would be the branch *referenced* by `HEAD`.
[^5]: Git calls them [_tracking branches_](https://git-scm.com/book/en/v1/Git-Branching-Remote-Branches#Tracking-Branches) but you can think of them as _bookmarks_ that keep track of where a branch is on a remote repository.
[^6]: There's a interesting story behind the origin of the `--preserve-merges` option. If you have the time, I suggest you read it. It's all told inside of [a commit message](https://github.com/git/git/commit/8f6aed71d27f33096449d28c4711d3b68159632e).
[^7]: A short note: the `--preserve-merges` option has recently been replaced by a more robust implementation in the form of the [`--rebase-merges`](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt--r) option. If you're using Git 2.18 (Q2 2018) or later, you should use that instead by saying `git pull --rebase=merges`.

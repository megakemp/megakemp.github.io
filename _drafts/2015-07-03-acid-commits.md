---
layout: post
title:  "ACID Commits"
date:   2015-07-03
categories: programming
assets: acid-commits
summary: "If we look at version control systems as databases, it becomes natural to think about commits as a form of transactions. As it turns out, treating them as such has some nice side effects."
---

### Unforeseen consequences
Human beings we have a tendency to overlook small issues until they become huge problems. Programmers are especially good at that. Today's quick and dirty fix - a temporary solution - stays in the code for years, undetected[^1]. Until one day it ends up causing some kind of trouble, at which point everyone wonders how something like that could ever happen.

A place where this happens on a regular basis is source control history.

[^1]: Sometimes the turnaround is much shorter than that.

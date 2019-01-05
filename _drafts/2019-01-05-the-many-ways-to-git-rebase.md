# 📖 The Many Ways to Git Rebase
This is one of #blog/drafts in the #git series.

Rebase is probably the most polarizing of all Git commands, and that's saying something.

Synonymous with *rewriting history* has divided the Git community into two camps.

But creating controversy is not the only thing Rebase does. It has become the Swiss-army knife of Git command, doing way more than what it was originally intended to do.

In this article, I want to give an overview of the many ways you can use git-rebase.

## The Classic
Aligning diverging branches.

## The Editor
Amend a sequence of commits with interactive rebase.

## The Surgeon
Transplanting chunks of commits between different parts of history.

## The Consistent
Running a script after every commit in a sequence and stop at the commit where the script fails. Ensures that every commit is *consistent*, that is it doesn't break the build.

## The Nitpicker
Removes whitespace errors in a sequence of commits.
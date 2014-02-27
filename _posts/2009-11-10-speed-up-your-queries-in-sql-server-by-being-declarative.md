---
layout: post
title:  "Speed up your queries in SQL Server by being declarative"
date:   2009-11-10
categories: programming sql
---

It’s interesting how a lot of the work I’ve been doing lately has in some way involved a kind of performance tuning. Previously I’ve talked about [how to increase the performance of .NET applications][1] by using delegates instead of reflection in code that runs frequently.

This time it is all about performance in database processing.

### The scenario

Imagine an application that manages a **wait list**. Users of this application put themselves in line and wait for their turn to gain access to some kind of shared resource. Here are the basic rules of this system:

  * The same user can appear in the wait list multiple times, once for every resource she is queuing for.
  * The users’ position in the wait list at any given time is decided by a score.
  * This score is calculated based on the number of credits each user has in the system compared to the amount required by the resource they wish to access.

Let’s say that this wait list is modeled in a **[Microsoft SQL Server**][2] database with the following schema:

<a href="http://megakemp.files.wordpress.com/2009/11/waitlistschema1.png">
<img alt="WaitListSchema" src="http://megakemp.files.wordpress.com/2009/11/waitlistschema_thumb1.png?w=500&h=317" class="screenshot-noshadow" />
</a>

The position of the different users in the wait list is periodically updated by a **[Stored Procedure**][4] that calculates the current score for each and every row in the `WaitList` table.

So far so good. Now, imagine that this `WaitList` table contains somewhere around **30 millions rows**, and the Stored Procedure that updates all of the scores takes about **9 hours** to complete. And now we have problem.

### The imperative SQL approach

Before going into all kinds of general database optimization techniques, let’s start off by looking at how that Stored Procedure is implemented.

Here is a slightly simplified version of it:

```sql
CREATE PROCEDURE CalculateWaitListScores_Imperative
AS
BEGIN

DECLARE @rowsToCalculate INT

SELECT @rowsToCalcualte = COUNT(*)
FROM WaitList
AND Score IS NULL

WHILE ( @rowsToCalculate > 0 )
BEGIN

  DECLARE @userID INT
  DECLARE @resourceID INT
  DECLARE @score INT

  SELECT TOP 1 @userID = UserID, @resourceID = ResourceID
  FROM WaitList
  AND Score IS NULL

  -- The actual calculation of the score is omitted for clarity.
  -- Let's just say that it involves a SELECT query that joins
  -- the [WaitList] table with the [User] and [Resource] tables
  -- and applies a formula that associates the values
  -- of the [Credit] columns in each of them.
  -- For the sake of this example we just set it to a constant value
  SET @score = 150

  UPDATE WaitList
  SET Score = @score
  WHERE UserID = @userID
  AND ResourceID = @resourceID
  AND Score IS NULL

  SELECT @rowsToCalcualte = COUNT(*)
  FROM WaitList
  AND Score IS NULL

END

END
```

If you aren’t into the [Transact-SQL][5] language syntax, let me spell out the algorithm for you:

  1. Get the number of rows in the `WaitList` table where the score has never been calculated
  2. If there are any such rows, get the user and the resource IDs for the first row in the `WaitList` table where the score has never been calculated
  3. Calculate the score for that user and resource
  4. Update the score with the newly calculated value
  5. Go to Step 1

In the worst case, this set of operations will be repeated 30 millions times, that is once for every row in the `WaitList` table. Think about it for a moment.

While looking at this code, I immediately imagined this dialogue taking place between SQL Server and the developer(s) who wrote the Stored Procedure:

> Developer: _Listen up, SQL Server. I want you to calculate a new score and update all of those 3o millions rows, but **do it one row at a time**._
>
> SQL Server: _That’s easy enough, but I’m pretty sure I can find a faster way to do this, if you’ll let me._
>
> Developer: _No, no. I want you to do exactly what I said. That way it’s easier for me to understand what’s going on and debug if any problem occurs._
>
> SQL Server: _Alright, you’re the boss._

Jokes aside, the bottom line here is this:

<div class="note info">
<p>
By implementing database operations in an <em>imperative manner</em>, you effectively tie up the hands of the query execution engine, thus preventing it from performing a number of optimizations at runtime in order to speed things up.
</p>
</div>

And that basically means trading performance and scalability for more fine-grained control.

### The declarative SQL approach

Let’s see if we can make this Stored Procedure run any faster, by changing our approach to the problem altogether.

<div class="note">
<p>
This time, we’ll tell the database what we want done in a <em>declarative manner</em>, and we’ll let the query execution engine figure out the best way to get the job done.
</p>
</div>

Here is a rewritten version of the original Stored Procedure:

```sql
CREATE PROCEDURE CalculateWaitListScores_Declarative
AS
BEGIN

UPDATE WaitList
SET Score = dbo.CalculateScore(UserID, ResourceID)
WHERE Score IS NULL

END
```

What we did is basically removing the explicit loop and merging all operations into a **single UPDATE statement** executed on the `WaitList` table, which invokes a custom a **scalar function** named `CalculateScore` to calculate the score with the value of the current row.

Now, let’s look at some performance comparison:

<img alt="WaitListPerfChart" src="http://megakemp.files.wordpress.com/2009/11/waitlistperfchart.png?w=499&h=323" class="screenshot-noshadow" />

That’s a pretty significant leap in speed. How is that possible? A look at the CPU usage on the database server while running the two versions of the Stored Procedure pretty much explains it all:

CPU usage while executing `CalculateWaitListScores_Imperative`:

<img alt="CpuUsageWithImperativeSql" src="http://megakemp.files.wordpress.com/2009/11/cpuusagewithimperativesql.png?w=504&h=129" class="screenshot-noshadow" />

CPU usage while executing `CalculateWaitListScores_Declarative`:

<img alt="CpuUsageWithDeclarativeSql" src="http://megakemp.files.wordpress.com/2009/11/cpuusagewithdeclarativesql.png?w=504&h=129" class="screenshot-noshadow" />

As you see, in the first picture the CPU is steadily at 9-10% and is basically using only one out of four available cores. This is because SQL Server is forced to do its work sequentially and has to wait until the score for the current row has been calculated and updated before proceeding to the next.

In the second picture, we are simply telling SQL Server our intent, rather than dictating exactly how it should be done. This allows SQL Server to parallelize the workload than can now be executed on multiple CPU/Cores at once leveraging the full power of the hardware.

### Lessons learned

Here are a couple of getaways I learned from this exercise:

  1. SQL is a declarative language at its core, designed to work with sets of rows. That’s what it does best and that’s how you should use it.
  2. Whenever possible, try to avoid applying an imperative programming mindset when implementing database operations, even if  the constructs available in SQL-derived languages like T-SQL make it easy to do so
  3. Don’t be afraid to give up some control over what happens at runtime when your database code runs. Let the database find out the best way to do things, and get ready to experience some great performance improvements.

Hope this helps.

/Enrico

[1]: http://megakemp.com/2009/09/04/improving-performance-with-generic-delegates-in-net/
[2]: http://www.microsoft.com/sqlserver/2008/en/us/default.aspx
[4]: http://en.wikipedia.org/wiki/Stored_procedure
[5]: http://en.wikipedia.org/wiki/Transact-SQL

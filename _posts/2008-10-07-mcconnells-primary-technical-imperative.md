[Source](http://megakemp.com/2008/10/07/mcconnells-primary-technical-imperative/ "Permalink to McConnell’s Primary Technical Imperative | Thoughtology")

# McConnell’s Primary Technical Imperative | Thoughtology

I’ve recently picked up reading (again) my all-time favorite book about software development: _Code Complete_ by Steve McConnell. The book was first published in 1993 and has been a timeless guide for anyone in this industry about the science and art of software development. A craftsman’s handbook, if you will.

In 2004 McConnell published _[Code Complete Second Edition_][1], updated to cover the  advancements in the software development practices that has happen![cc2-cover][2]ed since the first release, like object-oriented programming, agile and test-driven development to name a few. All the code examples have also been updated to modern languages like C%2B%2B and Visual Basic, which substitute C and Pascal. However the main topic of the book remains unchanged, and that’s the whole point really. Software development concepts and best practices are a foundation whose principles are independent of specific technologies and programming languages.

Once I read the original Code Complete and now I am going through the Second Edition. My plan is to write here about some of the **gems of wisdom** kept in these tomes, based on the opinion that is extremely valuable to keep track of and share precious knowledge.

Last night I read about the fundamental concepts of developing software systems, and I was fascinated by one of them in particular. McConnell calls it _“The Primary Technical Imperative”_, and in order to explain it he refers to a famous essay published in 1987 by Fred Brooks called “No Silver Bullets – Essence and Accident in Software Engineering” (_Computer_, April 1987). In his paper Brooks argues that everything in the world as two kinds of characteristics, **accidental** and **essential**.
Accidental characteristics are those that can be attributed to a thing, but that do not define it. For example, a car could have a V8 engine and have 15 inch tires. These characteristics belong to that specific car but, if it had a different engine or tires it would still be a car. Essential characteristics, on the contrary, are those that are distinctive for a specific thing and cannot be eliminated. A car must have an engine and four wheels in order to be a car, otherwise it would be something else.

In the same way software development has both accidental and essential difficulties. The accidental difficulties are related to specific technologies and programming tools used to develop the software, and can be made easier through evolution. For example, the difficulty in programming with assembly language has been addressed by creating higher level programming languages and compilers. Also programmers no longer have to write code in basic text editors, but instead can take advantage of integrated development environments with aids like syntax highlighting and statements auto-completion.
However, the essential difficulty in software development comes from the goal of software itself, which is to solve real world problems with the aid of the computer.
In order to do that, we need to represent reality in a way that is manageable by a computer, and this is exactly where the essential difficulty lies:

> To define and constraint the unpredictable and approximate interactions that happen among things in the real world, in order to make them fit inside a predictable and exact computer program.

Developing software is therefore a matter of **managing the complexity** that arises when bringing order and structure to the chaos of reality.
With this principle in mind, it becomes obvious why all software development practices traditionally aim at achieving control and predictability. Their goal is to prevent complexity from getting out of hands.
Modern practices like agile development take a different approach. They recognize that change is an essential characteristic of reality and therefore, instead of fighting it by putting limits and constraints, they adjust the process of developing software to cope with change by simply becoming more flexible. But that’s for a whole other story.

/Enrico

   [1]: http://cc2e.com/
   [2]: http://megakemp.files.wordpress.com/2008/10/cc2e-cover-small-thumb.png?w=154&h=187

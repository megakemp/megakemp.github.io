[Source](http://megakemp.com/2008/10/22/microsoft-oslo-and-the-evolution-of-programming/ "Permalink to Microsoft "Oslo" and the evolution of programming")

# Microsoft "Oslo" and the evolution of programming

##  Microsoft "Oslo" and the evolution of programming

### 22/10/2008

The other day I was reading about one of the most talked about future Microsoft technologies code-named “Oslo”. The details of what “Oslo” is are still pretty vague, at  least until [PDC 2008][1]. In short it’s a set of technologies aimed at creating Domain Specific Languages (DSL) that can then be used to build executable programs. Yes, I know that still sounds vague, but that’s really all Microsoft has reveled about the whole project so far.![dsl][2]

According to a [recent interview on .NET Rocks!][3] with Don Box and Doug Purdy, two of the main architects behind “Oslo”, Microsoft’s goal is to:

> enable people with knowledge on a specific domain, to create software in order to solve a problem in that domain, without having to know the technical details of software construction.

To me, “Oslo” represents the next big step in **the evolution of programming styles.**

**Imperative Programming**

Traditionally computer programming has always been about “telling” the machine what to do by specifying a set of instructions to execute in a particular order. This is known as **imperative programming**. The way programmers expressed these instructions has evolved over time from being commands directly interpreted by CPU to higher level structured languages that used abstracted concepts instead of processor-specific instructions, and let another program, the compiler, produce the appropriate code executable by the machine. The goal of programming languages has always been to **give programmers new metaphors to interact with the computer in a more intuitive and natural way**. Here are a few important milestones in this evolution:

  * Structured Programming: introduced natural language-like constructs to control the execution flow of program, like selection (“_IF_“, “_ELSE_“) and iteration (“_WHILE_“, “_FOR_“). Before that programmers used to construct programs by explicitly pointing to the next instruction to execute (“_GOTO_“).
  * Procedural Programming: introduced the concept of a “_routine_“, an ordered set of instructions that could be executed as a group by referring to them with a name (_procedure call_). Routines could take input data through parameters and output results through return values. Related routines could be grouped into _modules_ to better organize them.
  * Object-Oriented Programming: focuses on the shape of the data being processed in a program. Introduced the concepts of “_objects_“, data structures that contain both data and the functions (_methods_) that operate on that data in a single unit. Objects and the interactions among them are modeled to represent real-world entities inside of a program, which allows programmers to think about a problem in a more natural way.

**Declarative Programming**

At the same time another style of programming has evolved over the years, known as **declarative programming**. Instead of telling the computer what to do, declarative programming** **focuses on telling what results are expected, and letting the computer figure out which steps it has to go through to obtain those results. Declarative programming expresses intent without issuing commands. Key milestones in the evolution include:

  * Functional Programming: describes a program as a set of mathematical functions that operate on immutable data. Functions can have data or other functions as their input and return the result of the computation.
  * Logic Programming: describes a program as a set of mathematical logic expressions. These expressions often take the form of _premises_ and _conclusions_ composed by _logical statements_ (for example, “_IF A AND B THEN C_” where A, B, and C are logical statements). The program output is produced by evaluating these expressions on set of data called _facts_.
  * Language Oriented Programming: focuses on constructing a **domain-specific language** to describe the problem in the terms of its domain, and then using that language to describe a program to solve that problem.

**Microsoft “Oslo”**

The technologies delivered with “Oslo” fall clearly in this last category. In “Oslo” a compiler will translate a program expressed with a domain-specific language into an imperative general-purpose programming language such as C# or Visual Basic, which in its turn gets compiled into executable machine code. This way programmers can think using even more natural metaphors, and let the computer take care of the details of how to translate their intent into running software.

/Enrico

   [1]: http://www.microsoftpdc.com
   [2]: http://megakemp.files.wordpress.com/2008/10/dsl-thumb.gif?w=184&h=181
   [3]: http://www.dotnetrocks.com/default.aspx?showNum=385

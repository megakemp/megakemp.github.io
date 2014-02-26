---
layout: post
title:  "SQL Injections"
date:   2008-11-12
categories: programming
---

When discussing web development, the subject of security inevitably comes up. <img alt="Security" src="http://megakemp.files.wordpress.com/2008/11/security-thumb.jpg?w=80&h=80" class="article" /> Last week while I was teaching a class in ASP.NET, we had a sample login page that,   although being quite trivial in nature, was exposing a serious vulnerability to SQL injections attacks.

### Does it hurt?

Well, it might. But let’s first start off by defining the concepts. An SQL Injection is a term used to define a type of attack that exploits a vulnerability in the data access layer (DAL) of an application to embed arbitrary SQL statements in properly crafted user input, that will get executed at runtime. Let me show you how this works with an example.

### Vulnerability and exploit

Suppose we have a web site that prompts users to enter their username and password credentials in order to authenticate their identity. Typically, somewhere in the DAL of the application, there will be a chunk of code looking not to different than this:

```csharp
using (SqlConnection connection = new SqlConnection("ConnectionString"))
{
    string query = "SELECT EXISTS FROM Users WHERE Username='"
        + username + "' AND Password='" + password + "'";
    SqlCommand command = new SqlCommand(connection, query);
    bool isAuthenticated = (bool)command.ExecuteScalar();
}
```

This code exposes a serious vulnerability whenever the content of the ‘username’ and ‘password’ strings coming from the UI are not properly validated. Now, a malicious user could exploit this vulnerability by entering the following value in the username input field:

```sql
SomeUser' OR 1=1 -- 
```

What we have done is effectively extended the SQL query that will be run against the database by appending an additional condition to it that will cause it to always evaluate to ‘true’ and commented out the rest of the original query. Here is how the ‘query’ variable will look like when executed at runtime:

```sql
SELECT EXISTS FROM Users WHERE username='SomeUser' OR 1=1 --'AND Password=''
```

Yes folks, this will let us login to the web site without actually possessing a valid user account.

In other scenarios SQL Injections can be used to steal information. Suppose our web site has a page displaying a list of products. The URL then could more then likely look like this:

```
http://unsafewebsite.com/products.aspx?category=books
```

Then the page would run the following piece of code to retrieve and return the appropriate rows from the database table:

```csharp
using (SqlConnection connection = new SqlConnection("ConnectionString"))
{
    string query = "SELECT * FROM Products WHERE Category='"
        + category + "'";
    SqlCommand command = new SqlCommand(connection, query);
    return command.ExecuteReader();
}
```

An attacker could exploit the fact that the URL parameter is not properly validated and enter the following value in the browser’s address bar:

```
http://unsafewebsite.com/products.aspx?category=Something';SELECT * FROM Users --
```

Here we embedded a new SQL statement that will run after the first one during the same database connection. Again, without proper validation of the user input, the final command that will get executed at runtime will look like this:

```sql
SELECT * FROM Products WHERE Category='Something';SELECT * FROM Users --'
```

Which will display all information about the users of the web site on the products page. Ouch!

### The solution

So, how can we prevent this from happening? Well, there are a couple of security golden rules you should keep in mind:

  1. **Never trust user input:** this means you should always assert that every single piece of data coming from the user interface is what you expect it to be, and nothing else. In some places like for example web site URLs it is a good idea to **sanitize** all strings by **encoding** them, which will replace all special characters with HTML or ASCII values. This will prevent maliciously crafted strings from being evaluated at runtime and executed as code.
  2. **Always use parameters in SQL statements**: avoid dynamically generating SQL statements in code by concatenating hard-coded strings and variables, like I showed you in the examples above. Instead you should use **strongly-typed** parameters that will be assigned a value at runtime. For example the following code will prevent SQL injections by only accepting numeric values for the parameter:

```csharp
using (SqlConnection connection = new SqlConnection("ConnectionString"))
{
    string query = "SELECT * FROM Products WHERE ProductId=@id";
    SqlCommand command = new SqlCommand(connection, query);
    // Valid parameter values are only integers
    command.Parameters.Add("id", SqlDbType.Int, productId);
    return command.ExecuteReader();
}
```

### Bringing it all together

SQL injections are a relatively simple way of attacking an application by embedding SQL statements in the user input and having them execute unexpectedly. When in the wrong hands they can indeed be used for great evil. Fortunately it’s not too hard to guard ourselves from this kind of vulnerability by always validating incoming data and  using parameters in all our SQL commands.

/Enrico

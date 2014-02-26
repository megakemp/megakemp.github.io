---
layout: post
title:  "REST web services"
date:   2008-11-21
categories: programming web
---

If you have followed the latest advancements in the technologies and standards around web services, you must have come across the term “REST” at least more than once.
In rough terms REST is a way of building web services by relying <img alt="webservices" src="http://megakemp.files.wordpress.com/2008/11/webservices-thumb.jpg?w=100&h=100" class="article" /> exclusively on the infrastructure of the World Wide Web to define operations and exchange messages. This is an alternative to “traditional” web services, which instead use a set of standardized XML dialects, [WSDL][1] and [SOAP][2] to achieve the same goals.
The reason I’m writing about REST is that if you, like me, have prematurely judged it as some kind of toy technology, you are in for a real eye-opener!

### The history

First of all, let’s be clear about the origin of REST. As a term it means **Re**presentational **S**tate **T**ransfer, as a concept it stands completely separate from web services.
It was first defined in the year 2000 by a PhD student at the University of California by the name Roy Fielding. Fielding, in his [doctoral dissertation][3] entitled _Architectural Styles and the Design of Network-based Software Architectures_, sought to define the architectural principles that make up the infrastructure of the most successful large-scale distributed system created by mankind: the World Wide Web.
Fielding thought that by studying the Web, he would be able to identify some key design principles that would be beneficial to any kind of distributed application with similar needs of scalability and efficiency. He referred to the result of his research as “REST”.

### So, what is REST?

REST is an architectural style for building distributed systems.

> _The key design principle of a REST-based architecture is that its components use a **uniform interface** to exchange data._

Uniform interface means that all components expose the same set of operations to interact with one another. In this interface data is referred to as _resources_ and contains three main concepts:

  * A naming scheme for globally **identifying** resources
  * A set of operations to **manipulate** resources
  * A format to **represent** resources

The idea is that generalizing and standardizing the components interface reduces the overall system complexity by making it easier to identify the interactions among different parts of the system.
As of today, the Web is the only system that fully embraces the principle of unified interfaces, and it does it in the following way:

  * **URI** is used as a naming scheme for globally identifying resources
  * **HTTP verbs** define the available operations to manipulate resources
  * **HTML** is the textual format used to represent resources

### Applying REST to web services

Now, it is a known fact that the Web was created in order to provide a worldwide network for distributing static documents. However, it has been proven that the Web holds a potential that goes far beyond its original goal. Imagine if we could leverage the REST infrastructure of the Web to build web services. Wouldn’t that be cool?

First of all, let’s take a look at what web services are used for:

  * Define a set of operations to manipulate resources
  * Uniquely identify these operations so that they can be globally accessed by clients
  * Use a common format to represent the resources exchanged between web services and their consumers

Well, the Web seems to have the entire infrastructure we need to accomplish all of those goals already in place. In fact the HTTP protocol defines a pretty rich interface to manipulate data. Moreover this interface maps surprisingly well to the kind of operations usually exposed by web services.

HTTP verb | CRUD operation
:-------: | :------------:
PUT       | Create
GET       | Read
POST      | Update
DELETE    | Delete

Also, web services contracts are inherently accessed through URLs, it isn’t too much of a stretch to use URLs to access single operations in a contract.

Finally, web services encode the contents of their messages using SOAP, which is a XML dialect. But why do we need a whole new protocol to represent resources, when we could simply use XML as is instead?

What we just did, was applying the design principles dictated by REST to web services. The result of this process is commonly referred to as “**RESTful” web services**.

### Wrapping up

This is how REST web services compare to the ones based on the WS-* standard:

Goal of web services                | WS-* | REST
----------------------------------- | :--: | :-------------:
Addressing resources and operations | SOAP | URL
Defining supported operations       | WSDL | HTTP
Representing resources              | XML  | XML/JSON/Binary

As you can see, REST web services leverage the stability, scalability and reach offered by the same technologies and standards that power the Web today. What’s most fascinating with REST is the huge potential that comes out such a simple design.

However, don’t think even for a moment that REST will ever replace SOAP-based web services. Both architectures have their strengths and weaknesses, and REST is certainly not the right answer for all kinds of applications. I am especially thinking about corporate environments, where the needs for security and reliability are better addressed by the standards incorporated in WSDL and SOAP.
As always, the solution lies in using the right tool for the job.

/Enrico

[1]: http://www.w3.org/TR/wsdl
[2]: http://www.w3.org/TR/soap/
[3]: http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm

---
layout: post
title:  "Isolating WCF through Dependency Injection – Part II"
date:   2009-07-02
categories: programming .net
---

In [my previous post][1], I talked about how to design a class that uses a WCF client proxy in such a way to make it **testable in unit tests, without having to spin up a real service to answer the requests**.
The technique I illustrated uses a particular **Inversion of Control** (IoC) principle called **Dependency Injection** (DI), in which objects that a given class depends on get pushed into it from the outside rather than being created internally.

In this particular case, the external dependency is represented by a WCF client proxy targeting a particular service. This approach enables me to swap the real proxy objects used in production with [test doubles][2] while running unit tests, making it possible to assert the class’s behavior in a completely isolated and controlled environment.

### Moving from concrete classes to interfaces

Last time we left off with a `MailClient` class that takes an instance of `ChannelFactory` in the constructor and uses it internally every time it needs to download Email messages by following three steps:

  1. Creating a new proxy instance configured to communicate with the remote `MailService` service
  2. Invoking the `GetMessages` operation on the service
  3. Disposing the proxy

However, as I pointed out before, being the [ChannelFactory][3] a concrete class, creating a [test double][2] for it isn’t very convenient. A much better approach would be having the MailClient class** interact with an interface instead**. This way it would be easy to create a **fake factory object** in unit tests and have the class use that instead of the real one.

After a quick look in the online MSDN Documentation I found that the [ChannelFactory][3] class indeed implements the [IChannelFactory][4] interface. “_Sweet, I can use that!_” I thought. But there’s a catch:

<div class="note">
<p>
The <code>IChannelFactory&lt;TChannel&gt;.CreateChannel</code> factory method requires the caller
to pass along an <code>EndpointAddress</code> object, which contains information about where
and how to reach the service, like the <em>URI</em> and the <em>Binding</em>.
</p>
</div>

This isn’t really what I wanted, since it forced the `MailClient` class to have knowledge of where the remote service is located or at the very least how to obtain that piece of information. This doesn’t really conform to the Dependency Injection principle, since these details naturally belong to the dependent object, and should therefore be handled outside the scope of the class.

### The ChannelFactory adapter

The solution I came up with is to create an [adapter interface][5] to hide these details from my class. The implementation of this interface would then wrap a properly configured instance of [ChannelFactory][3] and delegate all the calls it receives to it.

Here is the definition of the adapter interface:

```csharp
using System.ServiceModel;

public interface IClientChannelFactory<TChannel>
    where TChannel : IClientChannel
{
    void Open();

    void Close();

    void Abort();

    TChannel CreateChannel();
}
```

And here is the default implementation:

```csharp
using System;
using System.ServiceModel;

public class ClientChannelFactory<TChannel> : IClientChannelFactory<TChannel>
    where TChannel : IClientChannel
{
    private ChannelFactory<TChannel> factory;

    public ClientChannelFactory(string endpointConfigurationName)
    {
        this.factory = new ChannelFactory<TChannel>(endpointConfigurationName);
    }

    public void Open()
    {
        this.factory.Open();
    }

    public void Close()
    {
        this.factory.Close();
    }

    public void Abort()
    {
        this.factory.Abort();
    }

    public TChannel CreateChannel()
    {
        return this.factory.CreateChannel();
    }
}
```

As you can see by using generics we are able to create an implementation that works for different types of proxies.

Notice also that the class requires the callers to specify the name of the configuration element used to describe the service endpoint in the constructor. This way the MailClient class  is completely isolated from having to know about WCF configuration details, and can instead concentrate on its core responsibility, that is to invoke operations on the service and work with the results.

Here is the final `MailClient` implementation:

```csharp
public class MailClient
{
    private IClientChannelFactory<IMailServiceClientChannel> proxyFactory;

    public MailClient(IClientChannelFactory<IMailServiceClientChannel> proxyFactory)
    {
        this.proxyFactory = proxyFactory;
    }

    public EmailMessage[] DownloadMessages(string smtpAddress)
    {
        // Validate the specified Email address

        IMailServiceClientChannel proxy;

        try
        {
            proxy = proxyFactory.CreateChannel();

            Mailbox request = new Mailbox(smtpAddress);
            EmailMessage[] response = proxy.GetMessages(request)

            // Do some processing on the results

            proxy.Close();

            return response;
        }
        catch(Exception e)
        {
            proxy.Abort();

            throw new MailClientException(&quot;Failed to download Email messages&quot;, e);
        }
    }
}
```

The only modification is in the type of the argument declared in the constructor, which is now an interface.

### Finally unit testing

We are now able to test our class in isolation by creating fake objects that implement the `IClientChannelFactory` and `IMailServiceClientChannel` interfaces respectively, and inject them into our object under test.

In this particular example I am using [Rhino Mocks][6] as an isolation framework to create and manage test doubles, but I could as well used just about any other isolation framework out there, such as [Typemock Isolator][7], with the same result.

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Rhino.Mocks;

[TestClass]
public class MailClientTest
{
    [TestMethod]
    public void DownloadMessages_WithValidEmailAddress_ReturnsOneMessage()
    {
        // Fakes out the WCF proxy
        var stubProxy = MockRepository.CreateStub<IMailServiceClientChannel>();

        // Stubs the service operation invoked by the class under test
        stubProxy
            .Stub(m => m.GetMessages(Arg.Is.Anything))
            .Returns(new EmailMessage[0]);

        // Fakes out the WCF proxy factory
        var stubProxyFactory = MockRepository.CreateStub<IClientChannelFactory<IMailServiceClientChannel>>();

        // Stubs the factory method to return the mocked proxy
        stubProxyFactory
            .Stub(s => s.CreateChannel())
            .Return(stubProxy);

        var testObject = new MailClient(stubProxyFactory);

        EmailMessage[] results = testObject.DownloadMessages("test@test.com");

        Assert.AreEqual(0, results.Length, "The method was not supposed to return any results");
    }
}
```

This concludes this short series of posts on how to apply Dependency Injection to classes that consume WCF services in order to easily test them in isolation with unit tests. I hope this helps.

/Enrico

[1]: http://megakemp.com/2009/06/25/isolating-wcf-through-dependency-injection-part-i/
[2]: http://www.martinfowler.com/bliki/TestDouble.html
[3]: http://msdn.microsoft.com/en-us/library/ms576132.aspx
[4]: http://msdn.microsoft.com/en-us/library/ms405876.aspx
[5]: http://sourcemaking.com/design_patterns/adapter
[6]: http://ayende.com/projects/rhino-mocks.aspx
[7]: http://www.typemock.com/

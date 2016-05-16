---
layout: post
title:  "Managing shared cookies in WCF"
date:   2009-02-06
categories: programming .net
excerpt: The ASMX Web Services framework, as obsolete as it may feel, still supports HTTP cookies in the exact same way as you would normally expect. WCF, on the other hand, broke that tradition in the name of a higher level API. This article explains how the two programming models handle cookies and suggests a solution to the problem of sharing a common cookie across multiple Web Service requests.
image: http://megakemp.files.wordpress.com/2009/02/wcfmessageinspectors.png
ranking: 3
---

Managing state across the HTTP protocol has always been one of the major challenges faced by developers when building applications on the web. Of course web services are no exception.

One way to overcome the stateless nature of HTTP without putting to much load on the web server, is to offload some of the information that has to be saved in the context of a particular conversation over to the client. The HTTP specification provides a native mechanism to do just that, by allowing web servers to bundle small pieces of textual data in a dedicated header of the response messages sent to the clients. These recognize the special payload, extract it, and store it in a local cache on disk to have it ready to be sent with every subsequent request. These small texts are technically known as “cookies”.

### Cookies are opaque in ASMX

Cookies go back a long time in the history of HTTP, and have served the Internet (fairly) well so far. Sure they brought some serious security issues with them, but for the most part they have been a conventient way for developers of web sites/web  applications to save temporary pieces of information off the server and have it transparently sent back by the client with each request.
This guarantee comes from the fact <img alt="AsmxWs" src="http://megakemp.files.wordpress.com/2009/02/asmxws-thumb.jpg?w=80&h=93" class="article" /> that every web browser on Earth has had the notion of cookies since web browser have had built-in support for cookies for the last 15 years or so.    

However, when it comes to web services, this assumption is no longer valid, since the client isn’t necessarily a web browser and doesn’t have to know how to handle cookies.

In the ASMX programming model, this problem has a quite simple solution. The client objects used to invoke operations on a web service can optionally reference an instance of a *cookie container*, were all cookies passed back by the web server are automatically stored and sent with each request.

```csharp
using System.Net;

public class Program
{
    private static void Main(string[] args)
    {
        // Creates a new instance of a client proxy for an ASMX Web service
        MyWebServiceClient client = new MyWebServiceClient();

        // Creates the cookie container and assigns it to the proxy
        CookieContainer cookieJar = new CookieContainer();
        client.CookieContainer = cookieJar;

        // From now on cookies returned by any of the web service operations
        // are automatically handled by the proxy
        client.DoSomething();
    }
}
```

The advantage with this approach is that it is fairly opaque to the developer, which can inspect the contents of the cookie container at any time. As a bonus, it allows the same cookie container to easily be shared between multiple clients, enabling the scenarios when same cookie is required by multiple web services.

### But they are transparent in WCF

In the WCF world, things are a little bit different. WCF, being a transport-agnostic technology, doesn’t allow the concept of a cookie to be directly reflected in the high level API, since it is specific to the HTTP protocol. This translate in practice in the web service client objects not having any **CookieContainer** property to set and retrieve.

However this isn’t necessarily a problem, since Microsoft did put a the possibility to enable **automatic “behind the scenes” cookie management** for HTTP clients. This of course is implemented at the **[WCF binding][2]** level, and can be switched on with a configuration setting:

```xml
<system.ServiceModel>
    <bindings>
        <basicHttpBinding allowCookies="true">
    </bindings>
    <client>
        <endpoint address="http://localhost/myservice"
                  binding="basicHttpBinding"
                  contract="IMyService" />
    </client>
</system.ServiceModel>
```

When this option is enabled the client will make sure all cookies received from a given web service are stored and properly sent on each subsequent request in a transparent fashion. But there is a catch: **the cookie is only handled in the conversation with one web service**. What if you need to send the same cookies to different web services?

Well, you’ll have to **explicitly set the `EnableCookies` setting to `false`**  (kind of counter-intuitive I know, but required nonetheless) and start managing the cookies yourself. Luckily, there are a couple of solutions.

### Ad-hoc cookie management

If you wish to manually retrieve, store and send a the same given set of cookies from two different web service client objects in WCF, you could do this ad-hoc this way:

```csharp
using System.ServiceModel;
using System.ServiceModel.Channels;

public class Program
{
    private static void Main(object[] args)
    {
        string sharedCookie;

        MyWebServiceClient client = new MyWebServiceClient();

        using (new OperationContextScope(client.InnerChannel))
        {
            client.DoSomething();

            // Extract the cookie embedded in the received web service response
            // and stores it locally
            HttpResponseMessageProperty response = (HttpResponseMessageProperty)
            OperationContext.Current.IncomingMessageProperties[
                HttpResponseMessageProperty.Name];
            sharedCookie = response.Headers["Set-Cookie"];
        }

        MyOtherWebServiceClient otherClient = new MyOtherWebServiceClient();

        using (new OperationContextScope(otherClient.InnerChannel))
        {
            // Embeds the extracted cookie in the next web service request
            // Note that we manually have to create the request object since
            // since it doesn't exist yet at this stage
            HttpRequestMessageProperty request = new HttpRequestMessageProperty();
            request.Headers["Cookie"] = sharedCookie;
            OperationContext.Current.OutgoingMessageProperties[
                HttpRequestMessageProperty.Name] = request;

            otherClient.DoSomethingElse();
        }
    }
}
```

Here we are interacting directly with the HTTP messages exchanged with the web services, reading and writing the cookies as a string in appropriate headers. In order to accomplish the task we need to use the “transport-agnostic” WCF API, which indeed makes the code more verbose compared with the ASMX example.

### Centralized cookie management

In situations were cookies must be managed in the same way for all web services invoked from a client applications, your best bet is to opt for a centralized solution by applying a very useful feature in WCF: **[message inspectors][3]**.

Message inspectors provide a hook in the WCF messaging pipeline offering the chance to look at and possibly modify all incoming or outgoing messages that transit on the server-side as well as on the client-side. The inspectors that are registered with the WCF runtime receive the messages before they are passed on to the application or sent to the wire, depending on whether it is an incoming or outgoing message.

<img alt="WcfMessageInspectors" src="http://megakemp.files.wordpress.com/2009/02/wcfmessageinspectors.png?w=500&h=88" class="screenshot-noshadow" />

This way, it is possible to catch all HTTP responses coming from the web server, extract any cookies contained within the messages, and manually inject them in all subsequent HTTP requests on their way out. Here is a simplified view of the solution:

```csharp
using System.ServiceModel;
using System.ServiceModel.Channels;

public class CookieManagerMessageInspector : IClientMessageInspector
{
    private string sharedCookie;

    public void AfterReceiveReply(ref Message reply, object correlationState)
    {
        HttpResponseMessageProperty httpResponse =
            reply.Properties[HttpResponseMessageProperty.Name]
            as HttpResponseMessageProperty;

        if (httpResponse != null)
        {
            string cookie = httpResponse.Headers[HttpResponseHeader.SetCookie];

            if (!string.IsNullOrEmpty(cookie))
            {
                this.sharedCookie = cookie;
            }
        }
    }

    public object BeforeSendRequest(ref Message request, IClientChannel channel)
    {
        HttpRequestMessageProperty httpRequest;

        // The HTTP request object is made available in the outgoing message only
        // when the Visual Studio Debugger is attacched to the running process
        if (!request.Properties.ContainsKey(HttpRequestMessageProperty.Name))
        {
            request.Properties.Add(
                HttpRequestMessageProperty.Name,
                new HttpRequestMessageProperty());
        }

        httpRequest = (HttpRequestMessageProperty)
            request.Properties[HttpRequestMessageProperty.Name];
        httpRequest.Headers.Add(HttpRequestHeader.Cookie, this.sharedCookie);

        return null;
    }
}
```

Message inspectors are enabled through the WCF extensibility mechanism called **behaviors** for single web service operations, entire web service contracts, or even specific endpoint URLs, depending on the scope the will operate in.

[Here you can download a sample application][5] showing how to implement a client-side message inspector to share the same cookies across multiple web services.

<div class="note downloads">
<p>
The <strong>WCF Cookie Manager</strong> sample application is also <a href="http://wcfcookiemanager.codeplex.com">available on CodePlex</a>. Thanks to <a href="https://twitter.com/rayd/status/371328033975570432">Ray Dixon</a> for creating the project.
</p>
</div>

/Enrico

[2]: http://msdn.microsoft.com/en-us/library/ms733027.aspx
[3]: http://msdn.microsoft.com/en-us/library/aa717047.aspx
[5]: http://code.msdn.microsoft.com/wcfcookiemanager/Release/ProjectReleases.aspx?ReleaseId=2240

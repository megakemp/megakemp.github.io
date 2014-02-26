---
layout: post
title:  "Migrating ASP.NET Web Services to WCF"
date:   2008-11-27
categories: programming .net
---

I am currently in the middle of a project where we are migrating a (large) amount of web services built on top of [ASP.NET][1] in .NET 2.0 (commonly referred to as [ASMX Web Services][2]) over to the [Windows Communication Foundation (WCF)][3] platform available in .NET 3.0.
The primary reason we want to do that, is because we would like to take advantage of the binary message serialization support available in WCF to speed <img alt="aspnetlogo" src="http://megakemp.files.wordpress.com/2008/11/aspnetlogo-thumb.png?w=160&h=48" class="article" /> up communication  between the services and their clients. This same technique was possible in earlier versions of the .NET Framework thanks to a technology called [Remoting][4], which is now superceded by WCF. In both cases it requires that both the client and server run on .NET in order to work. But I digress.

Since the ASMX model has been for a long time the primary Microsoft technology for building web services on the .NET platform, I figured they must have laid out a nice migration path to bring all those web services to the new world of WCF. It turned out, [they did][5]!

### The quick way

If you built your ASMX web services with code separation (that is, all programming logic resided in a separate _code-behind_ file instead of being embedded in the ASMX file) it is possible to get an ASMX web service up and running in WCF pretty quickly by going through a few easy steps:

  * Your WCF web service class no longer inherits from the `System.Web.Services.WebService` class so remove it.
  * Change the `System.Web.Services.WebService` attribute on the web service class to the `System.ServiceModel.ServiceContract` attribute.
  * Change the `System.Web.Services.WebMethod` attribute on each web service method to the `System.ServiceModel.OperationContract` attribute.
  * Substitute the **.ASMX** file with a new **.SVC** file with the following header:

```
<% @ServiceHost Service="MyNamespace.MyService" %>
```

  * Modify the application configuration file to create a WCF endpoint that clients will use to send their requests to:

```xml
<system.serviceModel>
  <behaviors>
      <serviceBehaviors>
          <behavior name="MetadataEnabled">
              <serviceMetadata httpGetEnabled="true" />
              <serviceDebug includeExceptionDetailInFaults="true" />
          </behavior>
      </serviceBehaviors>
  </behaviors>
  <services>
      <service name="MyNamespace.MyService"
               behaviorConfiguration="MetadataEnabled">
          <endpoint name="HttpEndpoint"
                    address=""
                    binding="wsHttpBinding"
                    contract="MyNamespace.IMyService" />
          <endpoint name="HttpMetadata"
                    address="contract"
                    binding="mexHttpBinding"
                    contract="IMetadataExchange" />
          <host>
              <baseAddresses>
                  <add baseAddress="http://localhost/myservice" />
              </baseAddresses>
          </host>
      </service>
  </services>
</system.serviceModel>
```
  * Decorate all classes that are exchanged by the web service methods as parameters or return values with the `System.RuntimeSerialization.DataContract` attribute to allow them to be serialized on the wire.
  * Decorate each field of the data classes with the `System.RuntimeSerialization.DataMember` attribute to include it in the serialized message.

Here is a summary of the changes you’ll have to make to your ASMX web service:

Where the change applies       | ASMX                | WCF
:----------------------------: | :-----------------: | :------------------------:
Web service class inheritance  | WebService          | -
Web service class attribute    | WebServiceAttribute | ServiceContractAttribute
Web service method attribute   | WebMethodAttribute  | OperationContractAttribute
Data class attribute           | XmlRootAttribute    | DataContractAttribute
Data class field attribute     | XmlElementAttribute | DataMemberAttribute
HTTP endpoint resource         | .ASMX               | .SVC

As a side note, if you are using [.NET 3.5 SP1][6] the porting process gets a little easier, since [WCF will automatically serialize any object that is part of a service interface][7] without the need of any special metadata attached to it. This means you no longer have to decorate the classes and members exposed by a WCF service contract with the **DataContract** and **DataMember** attributes.

### Important considerations

The simple process I just described works well for relatively simple web services, but in any real-world scenario you will have to take into consideration a few number of aspects:

  * WCF services are not bound to the HTTP protocol as ASMX web services are. This means you can host them in any process you like, whether it be a Windows Service or a console application. In other words using [Microsoft IIS][8] is no longer a requirement, although it is a valid possibility in many situations.
  * Even if WCF services are executed by the ASP.NET worker process when hosted in IIS, they do not participate in the ASP.NET HTTP Pipeline. This means that in your WCF services you no longer have access to the ASP.NET infrastructure services, such as:
    - `HttpContext`
    - `HttpSessionState`
    - `HttpApplicationState`
    - **ASP.NET Authorization**
    - **Impersonation**

So what if your ASMX web services are making extensive use of the ASP.NET session store or employ the ASP.NET security model? Is it a show-stopper?
Luckily enough, no. There is a solution to keep all that ASP.NET goodness working in WCF. It is called **ASP.NET Compatibility Mode**.

### Backwards compatibility

Running WCF services with the ASP.NET Compatibility Mode enabled will integrate them in the ASP.NET HTTP Pipeline, which of course means all ASP.NET infrastructure will be back in place and available from WCF at runtime.
You can enable this mighty mode from WCF by following these steps:

  * Decorate your web service class with the `System.ServiceModel.Activation.AspNetCompatibilityRequirements` attribute as following:

```csharp
[AspNetCompatibilityRequirements(
    RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
public class MyService : IMyService
{
    // Service implementation
}
```

  * Add the following setting to the application configuration file:

```xml
<system.serviceModel>
  <serviceHostingEnvironment aspNetCompatibilityEnabled="true" />
</system.serviceModel>
```

Remember that this will effectively tie the WCF runtime to the HTTP protocol, just like with ASMX web services, which means it becomes prohibited to add any non-HTTP endpoints for your WCF services.

Good luck and please, let me know your feedback!

/Enrico

[1]: http://www.asp.net/get-started/
[2]: http://msdn.microsoft.com/en-us/library/ms972326.aspx
[3]: http://msdn.microsoft.com/en-us/netframework/aa663324.aspx
[4]: http://msdn.microsoft.com/en-us/library/kwdt6w2k(VS.80).aspx
[5]: http://msdn.microsoft.com/en-us/library/ms730214(VS.85).aspx
[6]: http://www.microsoft.com/downloads/details.aspx?FamilyID=ab99342f-5d1a-413d-8319-81da479ab0d7&displaylang=en
[7]: http://www.pluralsight.com/community/blogs/aaron/archive/2008/05/13/50934.aspx
[8]: http://www.iis.net/getstarted

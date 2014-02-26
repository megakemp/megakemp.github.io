---
layout: post
title:  "A quick tour of Internet Explorer 8 beta 2"
date:   2008-09-12
categories: technology web
---

If Google is focusing on making the browser’s UI transparent to the user, Microsoft apparently wants to make it opaque. At first look, the most striking new feature in Internet Explorer 8 is, in fact, the way the browser is integrating web content into its own UI. This becomes apparent when looking at functionalities like_ _**Web Slices** and **Accelerators**. Internet Explorer 8 offers more than just that. The browser now caught up with the competitors and now sports a “smart” address bar with integrated search, as well as a “private-browsing” mode. Here are IE 8′s new features in a quick tour.

### Web slices

This are basically RSS-feeds embedded in a dedicated drop-down window in the browser. It reminds me a lot of Firefox’s [Live Bookmarks][1], except that in IE the feed items are simply not presented as a list of text entrie, but instead display images as well as hyperlinks.

<img alt="LiveBookmarks" src="http://megakemp.files.wordpress.com/2008/09/livebookmarks-thumb1.png?w=204&h=134" class="screenshot-noshadow" />
<img alt="webslice2" src="http://megakemp.files.wordpress.com/2008/09/webslice2-thumb.png?w=304&h=170" class="screenshot-noshadow" />

### Accelerators

Accelerators are yet another way of integrating various Web 2.0 services, typically search engines, maps and e-mail clients, directly into the browser. Particularly, they allow to select any text in a web page and pass that text on to a service to use it as search terms or as body of an e-mail.

<img alt="accellerators" src="http://megakemp.files.wordpress.com/2008/09/accellerators-thumb1.png?w=354&h=190" class="screenshot-noshadow" />

### Private browsing

Essentially, this means having a browsing session that does not leave traces of the websites you have visited, without having to manually clear the history, web page cache or cookies afterwards. Google Chrome has this feature already built-in and is called [Incognito mode][2] while Firefox users can achieve it through the [Stealther][3] add-on.

<img alt="inprivate" src="http://megakemp.files.wordpress.com/2008/09/inprivate-thumb1.png?w=354&h=270" class="screenshot-noshadow" />

### Tab groups

This is probably the first real innovative feature of IE 8, and with that I mean I personally haven’t seen it in any other browser. When ever you open a link in a new tab, that tab will have the same color as the tab the link originates from. It is indeed useful to visually associate tabs that are somehow related to each other, like for example the results page from a search engine and a group of pages the results link to.

<img alt="tabgroups" src="http://megakemp.files.wordpress.com/2008/09/tabgroups-thumb1.png?w=354&h=180" class="screenshot-noshadow" />

### Multi-process architecture

Internet Explorer 8 and Google Chrome are right now the only browsers that isolate each tab in a separate process. The obvious advantages of such an architecture over single process browsers is of course isolation, meaning a tab can crash or hang without taking down the whole browser, better memory management because when a tab is closed all data that’s in memory gets immediately clean up, and and sometimes performance whenever the tabs can run on multiple CPU cores.
What’s interesting here thought, is the fact that Chrome and IE 8 have slightly different approaches to this architecture. In fact, while Chrome spins off a new process for every new tab you open, IE 8 manages multiple tabs in a few number of processes. The exact relation between the number of tabs and the number of processes is not clear, however the goal is obviously to limit memory consumption by avoiding to have an excessive number of running processes.

<img alt="multiproc" src="http://megakemp.files.wordpress.com/2008/09/multiproc-thumb1.png?w=454&h=156" class="screenshot-noshadow" />

### Smart address bar

Last but not least, IE 8 integrates search into the address bar, just like a modern web browser should do. Nothing specially exciting to report here, a part from the fact that the drop-down box is taking a lot of space in my opinion, but I hope that’s something that will be adjusted by the time Internet Explorer 8 gets released.

<img alt="addressbar" src="http://megakemp.files.wordpress.com/2008/09/addressbar-thumb1.png?w=504&h=126" class="screenshot-noshadow" />

In conclusion, I would say Internet Explorer 8 is doing much better that its predecessor, providing many of the features modern web users have come to expect, and even innovating in some areas, like the tab groups and the multi-process architecture.
In any case I personally doubt the IE 8, once released in the wild, will be a so good product to make people switch away from their currently favorite browser.
However it will certainly make current IE users happy, and let’s not forget that they still represent the majority of Internet users on the planet.

/Enrico

[1]: http://www.mozilla.com/en-US/firefox/livebookmarks.html
[2]: http://www.google.com/support/chrome/bin/answer.py?answer=95464&hl=en-US
[3]: https://addons.mozilla.org/en-US/firefox/addon/1306

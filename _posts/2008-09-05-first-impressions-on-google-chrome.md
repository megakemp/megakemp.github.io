---
layout: post
title:  "First impressions on Google Chrome"
date:   2008-09-05
categories: technology web
---

I’ve been using Google Chrome as my primary browser for a few days now. As a side note, I almost feel bad about having abandoned Firefox so quickly. I mean, I’ve been using Firefox since version 0.5 (back when it was still called _Phoenix_), for all my daily browsing, both at work and at home. For 4 years, I’ve always been satisfied with the experience. Then Google comes out with its own browser, and in a blink of an eye away goes Firefox and Chrome suddenly gets to be my default browser. Incredible!

To be honest, I am not really sure why that is. Maybe it’s the fact the perception that everything Google touches becomes gold, or maybe it’s because I am particularly attracted by the idea of a browser built from scratch, free from the burden of design choices made in legacy code bases, and instead designed with the modern Internet in mind.

Anyway, I thought I would share some of my initial impressions about Chrome. And since I’m still a big fan of Mozilla’s browser, I am going to make an (implicit) comparison with Firefox 3.0.

### Speed

The first thing that became obvious to me after just a few minutes of using Chrome, is that it’s **fast** at rendering web pages. I mean, really fast. Faster than Firefox! It kind of reminded me of Safari, and maybe that’s not too strange, since Google chose to use Apple’s [WebKit][1] as HTML rendering engine.

### Minimalistic design

I really like the way Chrome’s looks and feels. The browser’s tries not to occupy too much space with its own UI, giving web pages the largest possible display area. The team’s mission statement is to _“make the browser invisible”_, meaning the user should focus on the web content when browsing, rather than the browser itself. And I have to say they have partially succeeded with that. I say partially because in my opinion the download bar really doesn’t have to be that big.

### Smart features

Google Chrome offers many of those features, standardized by other browsers, that make navigating the Web a more pleasant experience. Among these I especially like the possibility to search through the browser’s history and bookmarks when typing in the address bar (Google calls it **Omnibar**, Mozilla **Awesome Bar**). But Google goes a step further and integrates search through a search engine of choice (by default [www.google.com][2], of  course) right into the address bar. It’s even possible to receive Google’s suggestions about which keywords I might want to type in order to get highest number of matches as possible.

### Multi-threading

In Google Chrome basically every tab you open runs in a separate thread process with its own memory space, but is still able to communicate with the browser’s main process. This leads to better memory management since each tab cleans up after itself when closed. It also makes the browser more stable since a buggy web page or JavaScript only affects a single tab and not the whole application. In Chrome there is also a **Task Manager**, that shows the amount of memory, CPU and network bandwidth used by each tab. While I think this is extremely cool from a _geeky_ point of view, I haven’t had the chance to notice any of its advantages yet. A part from the fact that Chrome allocates more memory up front in order to achieve this separation, than, for example, Firefox.

### What I’m missing

After my initial (and slightly exaggerated) enthusiasm for Chrome had cooled down, I started to realize that my new default browser is missing some features I really appreciated in my old one, like:

  * Integrated support to view and subscribe to RSS/Atom feeds on a web page

<img alt="feeds" src="http://megakemp.files.wordpress.com/2008/09/feeds-thumb.jpg?w=244&h=26" class="screenshot-noshadow" />

  * A bookmark manager to organize, tag and export/import my bookmarks

<img alt="bookmarks" src="http://megakemp.files.wordpress.com/2008/09/bookmarks-thumb.jpg?w=244&h=102" class="screenshot-noshadow" />

  * History in a sidebar, where the URLs can be grouped and collapsed by day

<img alt="history" src="http://megakemp.files.wordpress.com/2008/09/history-thumb.jpg?w=202&h=134" class="screenshot-noshadow" />

Google Chrome is still a (incredibly good) beta product, so I expect the development team to fill in the gaps sooner rather then later. It will be interesting to see which impact Chrome will have on the browser market, once it has matured a bit.

/Enrico

[1]: http://webkit.org/
[2]: http://www.google.com

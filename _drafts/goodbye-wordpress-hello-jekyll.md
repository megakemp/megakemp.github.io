---
layout: post
title:  "Goodbye WordPress, Hello Jekyll"
date:   2014-03-14
categories: web musings
assets: goodbye-wordpress-hello-jekyll
summary: The story of why I, one day, decided to migrate my personal blog from WordPress to Jekyll, and what I learned on the way.
---

After almost [6 years](http://megakemp.com/2008/08/27/hello-world) with [WordPress](http://wordpress.com), I finally moved my blog to a different platform. After considering a few different options, I decided to go with [Jekyll](http://jekyllrb.com).

### Why Jekyll?
It would be easy to sit here and rant about all the little annoyances I've had with WordPress over the years. However, that wouldn't bring much to the table, not to mention most likely bore you to sleep.

<img src="/assets/{{ page.assets }}/jekyll-logo-light.png" alt="Jekyll logo" class="article" />

So, instead of doing that, I thought I would describe what I actually _wanted_ for my blog but couldn't easily get from WordPress.com:

-	Complete **control** over the functionality and layout
-	Writing posts with **Markdown**
-	**Free hosting** with as few limitations as possible and no gimmicks

Let's take a closer look at each of them separately.

### Control
Let's start with control. [WordPress](http://wordpress.com) is optimized to get you up and running with your block quickly and without too much effort. You also don't need any particular knowledge of any web technologies, like HTML, CSS or JavaScript. You simply choose a [_theme_](http://en.support.wordpress.com/themes) that comes prepackaged with a layout and style and off you go. You can include additional pieces of functionality by choosing among the available [_widgets_](http://en.support.wordpress.com/widgets), like for example [Twitter integration](http://en.support.wordpress.com/widgets/twitter-timeline-widget) or a [tag cloud](http://en.support.wordpress.com/widgets/tag-cloud-widget). Would you want to customize any aspect of the layout, you can do so by paying an [yearly fee of $30](http://en.support.wordpress.com/custom-design) and WordPress.com will let you edit the built-in CSS files.

This approach has served my well enough for the past years, since I didn't want to spend time fiddling around with CSS but rather focus on content.
However, being a programmer, I wanted to be have total control over how my blogs looks and works. This includes stuff like the ability to include any JavaScript library or [font](http://fontawesome.io) of my choice, as well as making my blog [_responsive_](http://en.wikipedia.org/wiki/Responsive_web_design) to adapt to different devices.

<img src="/assets/{{ page.assets }}/megakemp-com-on-iphone.png" alt="megakemp.com as seen on an iPhone" title="megakemp.com as seen on an iPhone" class="screenshot-noshadow-cropped" />

With Jekyll, all you got is a blank slate. The blog engine doesn't restrict you to any particular layout or style. It doesn't have _widgets_. In fact, you could built an entire website [like it's 1996](http://www2.warnerbros.com/spacejam/movie/jam.htm) using only HTML tables and animated GIFs and Jekyll wouldn't stop you from doing that.
However, if your skills in graphic design are somewhat lacking, you might do like me and start with a freely available theme and build up from there.

Jekyll has, in fact, a built-in template engine called [Liquid](https://github.com/Shopify/liquid), which you can leverage to have a consistent look en feel throughout your site while still keeping your code tidy and organized.

Liquid is very simple to use, yet it's [powerful enough](http://jekyllrb.com/docs/templates/) to not get in your way when you're structuring your web site. Take a look at a sample page that uses Liquid's [output tags and filters](http://docs.shopify.com/themes/liquid-basics/output):

```html
{% raw %}
<html>
    <head>
        <title>{{ page.title | capitalize }}</title>
        <link rel="stylesheet" href="/styles/main.css">
    </head>
    <body>
        <div class="container">
            <div class="header">
                {{ page.date | date: "%-d %B %Y" }}
            </div>

            <div class="content">
                {{ content }}
            </div>

            <div class="footer">
                {% include footer.html %}
            </div>
        </div>
    </body>
</html>
{% endraw %}
```

Notice how you can easily bring in portions of layout from separate files with the `include` statement. What's even cooler, though, is the fact that you can **pipe any dynamic content through a series of [built-in functions](http://docs.shopify.com/themes/liquid-basics/output)** in order to manipulate it before including it in the final output.

Here's another example that takes the URL of the current page and prints it in a simplified format:

```html
{% raw %}
<p>{{ page.url | remove_first: '/' | replace: '/', '-' }}</p>
{% endraw %}
```

If run on this very page, the output would be:

```html
<p>2014-03-14-goodbye-wordpress-hello-jekyll</p>
```

### Markdown
I wanted to write my posts using Markdown.

### Hosting

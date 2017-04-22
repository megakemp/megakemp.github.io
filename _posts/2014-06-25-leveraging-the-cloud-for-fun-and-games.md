---
layout: post
title:  "Leveraging the cloud for fun and games"
date:   2014-06-25
categories: gaming
assets: leveraging-the-cloud-for-fun-and-games
summary: "The story of a group of programmers, who one day decided to have a <a href=\"http://store.steampowered.com/app/730\">Counter-Strike: Global Offensive</a> deathmatch, but didn't have the hardware to host their own game. So they took it to the cloud, learning a few lessons along the way."
---

<a href="https://twitter.com/tretton37/status/436790174014791680">Friday night, February 21, 2014</a>. That's when the [tretton37](http://tretton37.com) Counter-Strike: Global Offensive [fragfest](http://www.urbandictionary.com/define.php?term=fragfest) was bound to start. Avid gamers looking to share virtual blood together, were eager to join in from our offices in Lund and Stockholm. A few more would play over the Internet.

<img src="{{ site.url }}/assets/{{ page.assets }}/counter-strike-global-offensive-by-griddark.png"
     alt="CS:GO icon by griddark"
     title="CS:GO icon by griddark"
     class="article" />

The time and place were set. Pizzas were ordered. Everything was ready to go. Except for one thing:

> We didn't have a dedicated Counter-Strike server to host the game on.

Finding a spare machine to dedicate for that one night wasn't an easy task, given our requirements:

 - The host should be reachable from the Internet
 - The machine should have enough hardware to handle a CS:GO game with 15+ players
 - The machine should be able to scale up as more players join the game
 - The whole thing should be a breeze to setup

For days I pondered my options when, suddenly, it hit me:

<div class="note">
<p>
<i class="fa fa-lightbulb-o fa-2x pull-left"></i>
Where's the place to find commodity hardware that's available <em>for rent</em>, is <em>on the Internet</em> and <em>can scale</em> at will?
</p>
</div>

**The cloud**, of course! This realization fell on my head like the proverbial apple from the tree.

### Step 1: Getting a machine in the cloud

Valve puts out their [Source Dedicated Server](https://developer.valvesoftware.com/wiki/Source_Dedicated_Server) software both for Windows and Linux. The Windows version has a GUI and is generally what you'd call "user friendly". The Linux version, on the other hand, is *lean & mean* and is managed entirely from the command line. Programmers being programmers, I decided to go for the Linux version.

Now, having established that I needed a Linux box, the next question was: which of the available clouds was I going to entrust with our gaming night? Since [tretton37](http://tretton37.com) is mainly a Microsoft shop, it felt natural to go for [Microsoft Azure](http://azure.microsoft.com). However, I wasn't holding any high hopes that they would allow me to install Linux on one of their virtual machines.

As it turned out, I had to [eat my hat](http://english.stackexchange.com/questions/150159/origin-of-eat-my-hat) on that one. Azure does, in fact, offer [pre-installed Linux virtual machines](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-tutorial) ready to go. To me, this is proof that the cloud division at Microsoft totally gets how things are supposed to work in the 21st century. Kudos to them.

<a href="{{ site.url }}/assets/{{ page.assets }}/azure-create-vm.png">
<img src="{{ site.url }}/assets/{{ page.assets }}/azure-create-vm.png"
     alt="Creating a Linux VM on Azure"
     title="Creating a Linux VM on Azure"
     class="screenshot" />
</a>

After literally 2 minutes, I had an [Ubuntu Server](http://www.ubuntu.com/server) machine with root access via SSH running in the cloud.

<img src="{{ site.url }}/assets/{{ page.assets }}/azure-create-vm-progress.png"
     alt="Creating a Linux VM on Azure"
     title="Creating a Linux VM on Azure"
     class="screenshot" />

If I hadn't already eaten my hat, I would take it off for Azure.

### Step 2: Installing the Steam Console Client

Hosting a CS:GO server implies setting up a so called [Source Dedicated Server](https://developer.valvesoftware.com/wiki/Source_Dedicated_Server), also known as **SRCDS**. That's Valve's server software used to run all their games that are based on the [Source Engine](http://source.valvesoftware.com). The list includes Half Life 2, Team Fortress, Counter-Strike and so on.

A SRCDS is easily installed through the Steam Console Client, or [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD). The easiest way to get it on Linux, is to download it and unpack it from a [tarball](http://www.computerhope.com/jargon/t/tarball.htm). But first things first.

It's probably a good idea to run the Source server with a dedicated user account that doesn't have root privileges. So I went ahead and created a `steam` user, switched to it and headed to its home directory:

```bash
adduser steam
su steam
cd ~
```

Next, I needed to install a few libraries that SteamCMD depends on, like the [GNU C compiler and its friends](http://gcc.gnu.org/onlinedocs/gccint/Libgcc.html). That's where I hit the first roadblock.

> steamcmd: error while loading shared libraries: libstdc++.so.6: cannot open shared object file: No such file or directory

Uh? A quick search on the Internet revealed that SteamCMD [doesn't like to run on a 64-bit OS](https://developer.valvesoftware.com/wiki/SteamCMD#32-bit_libraries_on_64-bit_Linux_systems). In fact:

<div class="note oneline">
<p>
SteamCMD is a 32-bit binary, so it needs <em>32-bit libraries</em>.
</p>
</div>

On the other hand:

<div class="note oneline">
<p>
The prepackaged Linux VMs available in Azure come in <em>64 bit only</em>.
</p>
</div>

Ouch. Luckily, the issue was easily solved by installing the right version of [Libgcc](http://gcc.gnu.org/onlinedocs/gccint/Libgcc.html):

```bash
apt-get install lib32gcc1
```

Finally, I was ready to download the SteamCMD binaries and unpack them:

```bash
wget http://media.steampowered.com/installer/steamcmd_linux.tar.gz
tar xzvf steamcmd_linux.tar.gz
```

The client itself was kicked off by a Bash script:

```bash
cd ./steamcmd
./steamcmd.sh
```

That brought down the necessary updates to the client tools and started an interactive prompt from where I could install any of Valve's Source games servers.

At this point, I could have continued down the same route and install the **CS:GO Dedicated Server** (CSGO DS) by using SteamCMD.

However, a few intricate problems would be waiting further down the road. So, I decided to back out and find a better solution.

```bash
Steam> quit
```

### Step 3: Installing the CS:GO Dedicated Server

Remember that thing about SteamCMD being a 32-bit binary and the Linux VM on Azure being only available in 64-bit?

Well, that turned out to be a bigger issue than I thought. Even after having successfully installed the CS:GO server, getting it to run became a nightmare. The server was constantly complaining about the wrong version of some obscure libraries. Files and directories were missing. Everything was a mess.

Salvation came in the form of a meticulously crafted script, designed to take care of those nitty-gritty details for me.

<div class="note">
<p>
<i class="fa fa-gears fa-2x pull-left"></i>
Thanks to <a href="https://twitter.com/dangibbsuk">Daniel Gibbs</a>' hard work, I could use his fabulous <a href="https://gameservermanagers.com/lgsm/csgoserver/"><strong>csgoserver script</strong></a> to install, configure and, above all, manage our CS:GO Dedicated Server without pain.
</p>
</div>

You can find a detailed description how to use the **csgoserver** [up on his site](https://gameservermanagers.com/lgsm/csgoserver/), so I'm just gonna report how I configured it to suit our deathmatch needs.

<img src="{{ site.url }}/assets/{{ page.assets }}/csds-shell.png"
     alt="The status of the CS:GO Dedicated server as reported by csgoserver"
     title="The status of the CS:GO Dedicated server as reported by csgoserver"
     class="screenshot" />

### Step 4: Configuration

The CS:GO server can be configured in a few different ways and it's all done in the **[server.cfg](https://developer.valvesoftware.com/wiki/Counter-Strike:_Global_Offensive_Dedicated_Servers#server.cfg)** configuration file. In it, you can set up things like the [game mode](http://en.wikipedia.org/wiki/Counter-Strike:_Global_Offensive#Game_modes) (Arms Race, Classic, Competitive to name a few) the maximum number of players and so on.

Here's how I configured it for the tretton37 deathmatch:

```bash
sv_password "secret" # Requires a password to join the server
sv_cheats 0 # Disables hacks and cheat codes
sv_lan 0 # Disables LAN mode
```

### Step 5: Gold plating

The final touch was to provide an appropriate [Message of the Day (or MOTD)](http://css.gamebanana.com/tuts/5484#Motd) for the occasion. That would be the screen that greets the players as they join the game, setting the right tone.

Once again, the whole thing was done by simply editing a text file. In this case, the file contained some HTML markup and a few stylesheets and was located in */home/steam/csgo/motd.txt*.

Here's how it looked like in action:

<a href="{{ site.url }}/assets/{{ page.assets }}/motd_hires.jpg">
<img src="{{ site.url }}/assets/{{ page.assets }}/motd.jpg"
     alt="The tretton37 Message of the Day in action"
     title="The tretton37 Message of the Day in action"
     class="screenshot-noshadow-fullwidth" />
</a>

### Step 6: Deathmatch!

This article is primarily meant as a reference on how to configure a dedicated CS:GO server on a Linux box hosted on Microsoft Azure. Nonetheless, I figured it would be interesting to follow up with some information on how the server itself held up during [that glorious game night](https://twitter.com/tretton37/status/436917080739573760).

<a href="{{ site.url }}/assets/{{ page.assets }}/stats_hires.png">
<img src="{{ site.url }}/assets/{{ page.assets }}/stats.png"
     alt="The CS:GO Dedicated server stats while running on Azure during game night"
     title="The CS:GO Dedicated server stats while running on Azure during game night"
     class="screenshot-noshadow-fullwidth" />
</a>

Here's a few stats taken both from the [Azure Dashboard](https://manage.windowsazure.com) as well as from the operating system itself. Note that the server was running on a **Large VM** sporting a *quad core 1.6 GHz CPU* and *7 GB* of RAM:

- Number of simultaneous players: **16**
- Average CPU load: **15 %**
- Memory usage: **2.8 GB**
- Total outbound network traffic served: **1.18 GB**

In retrospect, that configuration was probably a little overkill for the job. A **Medium VM** with a *dual 1.6 GHz CPU* and *3.5 GB* of RAM would have probably sufficed. But hey, elastic scaling is exactly what the cloud is for.

### One final thought

Oddly enough, this experience opened up my eyes to the **great potential of cloud computing**.

<div class="note">
<p>
The CS:GO server was only intended to run for the duration of the event, which would last for a few hours. During that short period of time, I needed it to be <em>as fast and responsive as possible</em>. Hence, I went <em>all out</em> on the hardware.
</p>
</div>

As soon as the game night was over, I immediately shut down the virtual machine. The total cost for borrowing that awesome hardware for a few hours? Literally [peanuts](http://azure.microsoft.com/en-us/pricing/details/virtual-machines/#linux).

Amazing.

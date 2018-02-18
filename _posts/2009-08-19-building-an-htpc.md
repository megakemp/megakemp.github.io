---
layout: post
title:  "Building an HTPC"
date:   2009-08-19
categories: technology
---

Almost exactly one year ago, I seriously started considering the problem of having the digital content I care about, mostly made up of music and pictures, scattered around different computers. <img alt="htpc" src="http://megakemp.files.wordpress.com/2009/08/htpc.jpg?w=200&h=94" class="article" />
At home I often found myself thinking “_I wish I could watch this movie on the TV instead of sitting in front of a tiny monitor_”. At a friend’s house I would sometimes say “_I can’t show you the pictures of our last trip right now because they are on my other laptop_”.
On top of that I started to have the creepy feeling that that not everything was backed up properly and on a regular basis, since it resided on different machines. This had become both annoying and worrying.

That’s how I got interested in **Home Theater PC** or **HTPC** for short.

My goal was to be able collect and organize all of my digital content in the form of music, pictures and movies *in one central place*, more precisely the living room, and to make it available to other PCs in the house as well as enjoying it on the TV’s big screen.

After looking at a couple of commercial products in that category (particularly [Apple Mac mini][2] and [Apple TV][3]) I realized the most common thing to do for a geek like me was to go off and build my own HTPC. This way I could pick and choose the hardware parts to build a machine that matches my specific needs.

### The requirements

A computer that wishes to rightfully be called an HTPC must have the following basic characteristics:

  * Silent
  * Low power consumption
  * TV connectivity
  * Large storage capacity

On top of that, my personal requirements were:

  * Be able to play High Definition (HD) movies at high resolution (1080p)
  * Be able to play some occasional 3D game
  * Do not look like a computer but rather like some Audio-Video piece of equipment

### The hardware

Based on these requirements and my budget, I came up with the following hardware configuration:

Component     | Part
:------------ | :------------------------------------
Motherboard   | Gigabyte GA-MA69GM-S2H
CPU           | AMD Athlon X2 Dual-Core 4850e 2.5 GHz
Cooling       | Scythe Ninja Mini CPU Cooler
Memory        | Kingston DDR2 PC6400 2048MB
Storage       | Western Digital 500 GB SATA
Graphics Card | MSI GeForce 8600GT 256MB DDR3
Sound Card    | Integrated
Case          | Antec Fusion 430 Silver

There are some key points here that lead my decisions I should probably explain.

First of all I decided to go with the cheaper [AMD Athlon X2][4] CPU over an [Intel Core 2 Duo][5], since the performance gain I would get from the Intel processor wasn’t really that important to me to justify the higher price.
Moreover the [4850e][6] uses *just 45W of electricity*, which contributes in keeping the CPU cool and the power consumption low.

My choice of motherboard was based on a couple of factors:

  * The Antec Fusion V2 case (really slick by the way), has only room for a **Mini-ATX** size motherboard
  * It has integrated **High Definition Audio** sound chip with support for 7.1 channels and DTS (Digital Theater Systems), which basically means great audio for music and movies
  * It also has a decent **ATI Radeon X1250** graphics chip with HDMI and TV-out ports integrated, which is nice to have in case my graphics card fails

I wanted this computer to be *silent*, and since I’m not a huge fan of [water cooling][7], I figured the best way to keep the volume down would be to keep as few fans as possible.
For this reason I substituted the stock CPU cooler that comes with the AMD processor with a [Scythe Ninja Mini][8] heat sink (shown in the picture below). This would allow me to cool the CPU without needing a fan. Moreover its low profile fits well in the Antec Fusion case.

<a href="http://megakemp.files.wordpress.com/2009/08/htpccpucooler.jpg">
<img alt="HtpcCpuCooler" src="http://megakemp.files.wordpress.com/2009/08/htpccpucooler_thumb.jpg?w=384&h=308" class="screenshot-noshadow" />
</a>

As a matter of personal preference, the graphics card had to be an [NVIDIA GeForce][10]. This particular <img alt="MsiGeForce8600GTHeatpipe" src="http://megakemp.files.wordpress.com/2009/08/msigeforce8600gtheatpipe_thumb.jpg?w=200&h=133" class="article" /> model not only provides a nice price/performance balance, but is also extremely silent thanks to its **fan-less passive cooling** through a [heat pipe][12].
The downside is that once installed in the case it takes up the equivalent space of two cards, due to the large heat sink on the backside.

The case was the most important (and expensive) piece of the whole configuration. I have to say the [Antect Fusion 430][13] is a great case for an HTPC. <img alt="AntecFusion430" src="http://megakemp.files.wordpress.com/2009/08/antecfusion430_thumb.jpg?w=250&h=91" class="article" />
As far as aesthetics go, it makes a computer look like a fancy hi-fi amplifier with a shiny aluminum front panel. Moreover it has some nice features like an LCD screen with support for IR remotes and even a volume nod, contributing to the overall experience.

On the inside, it is designed to keep the hardware cool without being loud. It has two big fans positioned on one side of the case blowing cool air from the outside on the CPU and the graphics card, which are the hottest components in the system.

<a href="http://megakemp.files.wordpress.com/2009/08/htpccpugpu.jpg">
<img alt="HtpcCpuGpu" src="http://megakemp.files.wordpress.com/2009/08/htpccpugpu_thumb.jpg?w=404&h=277" class="screenshot-noshadow" />
</a>

In this picture you can see the two fans on the left side directing the air flow towards the two giants heat sinks mounted on the CPU and GPU.

### The software

After the build was done, I immediately installed Windows Vista Home Premium and the required device drivers on it to see how it performed.

Here is how Vista rates the system:

<a href="http://megakemp.files.wordpress.com/2009/08/vistarating.png">
<img alt="VistaRating" src="http://megakemp.files.wordpress.com/2009/08/vistarating_thumb.png?w=454&h=242" class="screenshot-noshadow" />
</a>

Playing HD movies encoded with the H.264 codec at 1080p on to a 40’’ flat HDTV is no problem at all. I use [Cyberlink PowerDVD 9][17] which supports the [NVIDIA PureVideo®][18] feature to offload part of the rendering off to the GPU.

I have to admit I was a little worried that the two fans mounted in the Antec case weren’t enough to keep the system from overheating, especially when HTPC is inside of a closet under the TV.

So I decided to run the excellent [Prime95][19] tool to stress test the system and watch the CPU and GPU temperature with [CPU-Z][20] and [GPU-Z][21] respectively. The screenshots below show the temperature measured at the two CPU cores when the system is idle (on top) and when running under load (below):

<img alt="CoreTempIdle" src="http://megakemp.files.wordpress.com/2009/08/coretempidle_thumb.png?w=384&h=379" class="screenshot-noshadow" />
<img alt="CoreTempLoad" src="http://megakemp.files.wordpress.com/2009/08/coretempload_thumb.png?w=384&h=381" class="screenshot-noshadow" />

It seems that the passive cooling is doing a pretty good job at keeping the CPU and GPU at low temperatures, even when the system is put under heavy load.

### Conclusion

So far I’ve been pretty satisfied with the HTPC I’ve built. It fits well into the living room thanks to its specially designed case and it’s silent enough that I can’t even tell when it’s turned on or off (OK, I can always look at the power led on the front panel). Also it does everything I need it to without issues.

Having a PC working as media center instead of a proprietary custom device such as the Apple TV, definitely is the most flexible choice in terms of what software you can run. It also allows you to tweak the system to your preference, which is a requirement in itself for anyone with a passion for technology.

/Enrico

[2]: http://www.apple.com/macmini/
[3]: http://www.apple.com/appletv/
[4]: http://www.amd.com/us/products/desktop/processors/athlon-x2/Pages/amd-athlon-x2-dual-core-processors-desktop.aspx
[5]: http://www.intel.com/cd/products/services/emea/eng/processors/core2duo/300131.htm
[6]: http://products.amd.com/en-us/DesktopCPUDetail.aspx?id=426
[7]: http://www.youtube.com/watch?v=We9xGpP1RWw
[8]: http://www.scythe-usa.com/product/cpu/032/scmnj1000_detail.html
[10]: http://www.nvidia.com/object/geforce_family.html
[12]: http://en.wikipedia.org/wiki/Heat_pipe
[13]: http://www.antec.com/Believe_it/product1.php?Type=Mg==&id=NDk=
[17]: http://www.cyberlink.com/products/powerdvd/overview_en_US.html
[18]: http://www.nvidia.com/page/purevideo.html
[19]: http://www.mersenne.org/freesoft/
[20]: http://www.cpuid.com/cpuz.php
[21]: http://www.techpowerup.com/gpuz/

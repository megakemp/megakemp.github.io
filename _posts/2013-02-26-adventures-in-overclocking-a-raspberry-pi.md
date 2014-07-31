---
layout: post
title:  "Adventures in overclocking a Raspberry Pi"
date:   2013-02-26
categories: technology programming
summary: This article sums up my experience when overclocking a Raspberry Pi computer. It doesn’t provide a <em>step-by-step</em> guide on how to do the actual overclocking, since that kind of resources can easily be found <a href="http://lifehacker.com/5971395/overclock-your-raspberry-pi">elsewhere on the Internet</a>. Instead, it gathers the pieces of information that I found most interesting during my research, while diving deeper on some exquisitely <a href="http://geekalabama.files.wordpress.com/2014/02/12739272345_6a50e7edaa_o.png">geeky details</a> on the way.
excerpt: This article sums up my experience when overclocking a Raspberry Pi computer. It doesn’t provide a step-by-step guide on how to do the actual overclocking. Instead, it gathers the pieces of information that I found most interesting during my research, while diving deeper on some exquisitely geeky details on the way.
image: http://megakemp.files.wordpress.com/2013/02/raspberrypi-closet.jpg
ranking: 1
---

### A little background

For the past couple of months I’ve been running a [Raspberry Pi][2] as my primary NAS at home. It wasn’t something that I had planned. On the contrary, it all started by chance when I received a Raspberry Pi as a conference gift at last year’s [Leetspeak][3].
But why using it as a NAS when there are [much better products][4] on the market, you might ask. Well, because I happen to have a small network closet at home and the Pi is a pretty good fit for a device that’s capable of acting like a NAS while at the same time taking _very_ little space.

<img alt="My Raspberry Pi in the network closet." title="My Raspberry Pi in the network closet." src="http://megakemp.files.wordpress.com/2013/02/raspberrypi-closet.jpg?w=300&h=300" class="article" />

Much like the size, the setup itself also strikes with its simplicity: I plugged in an external [1 TB WD Element USB drive][6] that I had lying around (the black box sitting above the Pi in the picture on the right), installed [Raspbian][7] on a SD memory card and went to town. Once booted, the little Pi exposes the storage space on the local network through 2 channels:

  * As a Windows file share on top of the **SMB** protocol, through [Samba][8]
  * As an Apple file share on top of the **AFP** protocol, through [Nettalk][9]

On top of that it also runs a [headless version][10] of the [CrashPlan Linux client][11] to backup the contents of the external drive to the cloud. So, the Pi not only works as a central storage for all my files, but it also manages to [fool Mac OS X into thinking that it’s a Time Capsule][12]. Not too bad for a tiny ARM11 700 MHz processor and 256 MB of RAM.

### The need for (more) speed

A Raspberry Pi needs **5 volts** of electricity to function. On top of that, depending on the number and kind of devices that you connect to it, it’ll draw approximately between **700** and **1400 milliamperes (mA)** of current. This gives an average consumption of roughly 5 watts, which makes it ideal to work as an appliance that’s on 24/7. However, as impressive as all of this might be, it’s not all sunshine and rainbows. In fact, as the expectations get higher, the Pi’s limited hardware resources quickly become a frustrating bottleneck.

Luckily for us, the folks at the [Raspberry Pi Foundation][13] have made it fairly easy to squeeze more power out of the little piece of silicon by officially allowing overcloking. Now, there are a few different [combinations of frequencies][14] that you can use to boost the CPU and GPU in your Raspberry Pi.

The amount of _stable_ overclocking that you’ll be able to achieve, however, depends on a number of physical factors, such as the quality of the soldering on the board and the amount of output that’s supported by the power supply in use. In other words, [YMMV][15].

There are also at least a couple of [different ways][16] to go about overclocking a Raspberry Pi. I found that the most suitable one for me is to manually edit the [configuration file][17] found at `/boot/config.txt`. This will not only give you fine-grained control on what parts of the board to overclock, but it will also allow you to change other aspects of the process such as voltage, temperature thresholds and so on.

In my case, I managed to work my way up from the stock **700 MHz** to **1 GHz** through a number of small incremental steps. Here’s the final configuration I ended up with:

```bash
arm_freq=1000
core_freq=500
sdram_freq=500
over_voltage=6
force_turbo=0
```

One thing to notice is the `force_turbo` option that’s currently turned off. It’s there because, until September of last year, modifying the CPU frequencies of the Raspberry Pi would set a permanent bit inside the [chip][18] that voided the warranty.

However, having recognized the widespread interest in overclocking, the Raspberry Foundation decided to give it their blessing by building a feature into their own version of the Linux kernel called [Turbo Mode][19]. This allows the operating system to automatically increase and decrease the speed and voltage of the CPU based on much load is put on the system, thus reducing the impact on the hardware’s lifetime to [effectively zero][19].

Setting the `force_turbo` option to `1` will cause the CPU to run at its full speed all the time and will apparently also contribute to setting the dreaded warranty bit in [some configurations][20].

### Entering Turbo Mode

When Turbo Mode is enabled, the CPU speed and voltage will switch between two values, a **minimum** one and a **maximum** one, both of which are configurable. When it comes to speed, the default minimum is the stock **700 MHz**. The default voltage is **1.20 V**. During my overclocking experiments I wanted to keep a close eye on these parameters, so I wrote [a simple Bash script][21] that fetches the current state of the CPU from different sources within the system and displays a brief summary. Here’s how it looks like when the system is idle:

<a href="http://megakemp.files.wordpress.com/2013/02/cpustatus-idle.png">
<img alt="Output of my cpustatus script when the CPU is idle." title="Output of my cpustatus script when the CPU is idle." src="http://megakemp.files.wordpress.com/2013/02/cpustatus-idle.png?w=300&h=113" class="screenshot" />
</a>

See how the current speed is equal to the minimum one? Now, take a look at how things change on full blast with the Turbo mode kicked in:

<a href="http://megakemp.files.wordpress.com/2013/02/cpustatus-load.png">
<img alt="Output of my cpustatus script with Turbo Mode enabled." title="Output of my cpustatus script with Turbo Mode enabled." src="http://megakemp.files.wordpress.com/2013/02/cpustatus-load.png?w=300&h=113" class="screenshot" />
</a>

As you can see, the CPU is running hot at the maximum speed of **1 GHz** fed with **0,15 extra volts**.

The last line shows the `governor`, which is a piece of the Linux kernel driver called [cpufreq][24] that’s responsible for adjusting the speed of the processor. The governor is the [_strategy_][25] that regulates exactly when and how much the CPU frequency will be scaled up and down. The one that’s currently in use is called `ondemand` and it’s the foundation upon which the entire Turbo Mode is built.

It’s interesting to notice that the choice of `governor`, contrary to what you would expect, isn’t fixed. The cpufreq driver can, in fact, be configured to use a different governor during boot simply by modifying a file on disk. For example, changing from the `ondemand` governor to the one called `powersave` would block the CPU speed to its minimum value, effectively disabling Turbo Mode:

```bash
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
# Prints ondemand

"powersave" | /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
# Prints powersave
```

Here’s a list of available governors as seen in [Raspbian][7]:

```bash
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors
# Prints conservative ondemand userspace powersave performance
```

If you’re interested in seeing how they work, I encourage you to check out the [cpufreq source code][26] on GitHub. It’s very well written.

### Fine tuning

I’ve managed to get a pretty decent performance boost out of my Raspberry Pi just by applying the settings shown above. However, there are still a couple of nods left to tweak before we can settle.

The `ondemand` governor used in the Raspberry Pi will increase the CPU speed to the maximum configured value whenever it finds it to be busy more than **95%** of the time. That sounds fair enough for most cases, but if you’d like that extra speed bump even when the system is performing somewhat lighter tasks, you’ll have to lower the load threshold. This is also easily done by writing an integer value to a file:

```bash
60 > /sys/devices/system/cpu/cpufreq/ondemand/up_threshold
```

Here we’re saying that we’d like to have the Turbo Mode kick in when the CPU is busy at least **60%** of the time. That is enough to make the Pi feel a little snappier during general use.

### Wrap up

I have to say that I’ve been positively surprised by the capabilities of the Raspberry Pi. Its exceptional form factor and low power consumption makes it ideal to work as a NAS in very restricted spaces, like my network closet. Add to that the flexibility that comes from running Linux and the possibilities become [ truly endless][27]. In fact, the more stuff I add to my Raspberry Pi, the more I’d like it to do. What’s next, a [Node.js server][28]?

<a id="downloads"></a>
<div class="note downloads">
<ul>
  <li class="github"><a href="https://gist.github.com/ecampidoglio/5009512">Source code for <strong>cpustatus.sh</strong></a></li>
</ul>
</div>

[2]: https://en.wikipedia.org/wiki/Raspberry_pi
[3]: http://leetspeak.se
[4]: http://www.synology.com/products
[6]: http://www.wdc.com/en/products/products.aspx?id=470
[7]: http://www.raspbian.org
[8]: http://www.samba.org
[9]: http://netatalk.sourceforge.net
[10]: https://twitter.com/ecampidoglio/status/273913939996332032
[11]: http://www.crashplan.com/consumer/download.html?os=Linux
[12]: https://twitter.com/ecampidoglio/status/265176614315380736
[13]: http://www.raspberrypi.org/about
[14]: http://www.elinux.org/RPiconfig#Overclocking
[15]: http://www.urbandictionary.com/define.php?term=YMMV
[16]: http://www.jeremymorgan.com/tutorials/raspberry-pi/how-to-overclock-raspberry-pi/
[17]: http://www.elinux.org/RPiconfig
[18]: https://en.wikipedia.org/wiki/System_on_chip
[19]: http://www.raspberrypi.org/archives/2008
[20]: http://www.raspberrypi.org/phpBB3/viewtopic.php?p=176865#p176865
[21]: https://gist.github.com/ecampidoglio/5009512
[24]: https://wiki.archlinux.org/index.php/CPU_Frequency_Scaling
[25]: http://sourcemaking.com/design_patterns/strategy
[26]: https://github.com/raspberrypi/linux/tree/rpi-3.6.y/drivers/cpufreq
[27]: http://www.raspberrypi.org/phpBB3/viewtopic.php?f=36&t=14804
[28]: http://jeelabs.org/2013/01/06/node-js-on-raspberry-pi

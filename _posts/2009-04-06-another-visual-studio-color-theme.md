[Source](http://megakemp.com/2009/04/06/another-visual-studio-color-theme/ "Permalink to Another Visual Studio Color Theme")

# Another Visual Studio Color Theme

An interesting trend has emerged in the .NET community during the past couple of years, which involves [developers sharing their favorite color theme for the Visual Studio code editor][1] with their peers.![VSSettingsDialog][2]

It seems the origin of this trend is somehow related to the introduction of a new feature in Visual Studio 2005 that makes it really easy to export/import all or a subset of the customizations made to the IDE’s into a single XML file. These **settings files** (*.vssettings) include  every configurable aspect of Visual Studio, from font colors and window sizes to keyboard shortcuts.
Useful for backups as well as for [keeping Visual Studio the way you like it every time you switch to work on a different computer][3].

What developers are most excited about, however, is exchanging the color combinations they use for the text editor included in the IDE, referred to as **“themes”**.

It’s interesting to notice how a fair amount of developers seem to prefer light text on a dark background, as opposed to the traditional “black on white” paper metaphor  ![VimEmacsEffect][4] introduced by the word processors. These themes mimic the colors used by the classic programmer text editors of the past, like [VIM][5] and [EMACS][6] running on DOS or UNIX, which used to sport dark gray or bright blue backgrounds.

Colors are entirely a matter of personal taste, and in this regard I prefer the clean contrast of  white text on black background.
Some people even argue that dark backgrounds are easier on the eyes than white ones, due to the reduced amount of bright light emitted by the computer screens. However I don’t know of any official study conducted to scientifically prove this statement.

Being a developer myself, I also tweaked my own color theme for the text editor I use to write code on a daily basis, which in my case is [Microsoft Visual Studio 2008][7].
I took inspiration from other themes I’ve seen around on the Internet and adjusted them to my taste. In the end, I settled for the following:

  * Font: [Consolas][8] (the best-looking monospaced font when using [ClearType][9])
  * Font size: 11 pt
  * Background: **Black** (#000000)
  * Text: **White** (#FFFFFF)
  * Keywords: **Light Blue** (#4B96FF)
  * Classes: **Orange** (#E4732B)
  * Interfaces: **Yellow** (#E5CA32)
  * Value types/Enumerations: **Pink** (#CA95FF)
  * Numbers: **Green** (#559762)
  * Strings: **Red** (#E83123)
  * Comments: **Dark Grey** (#696969)

It’s a high contrast scheme, but I feel comfortable with it since the colors are not as sharp as other similar ones like [John Lam’s Vibrant Ink][10].

Here is how a C# file looks like with it:

![VSSettingsCSEditor][11]

And here is how an XML file looks like:

![VSSettingsXMLEditor][12]

You can [download my Visual Studio color theme here][13]. I have used it for quite a while now and I am pretty satisfied with it. However, I fell I’ll probably tweak it some more in the future. After all, there is always room for improvements.

**Update 2010-04-20:** I’ve modified my dark theme to work in Visual Studio 2010. Most of the settings worked straight way, so I only needed to make some minor changes like adding support for T-SQL keywords. By the way, the custom colours for user types and interfaces now finally work in Visual Basic too.
You can download the Visual Studio 2010 theme from the link below.

/Enrico

   [1]: http://www.hanselman.com/blog/VisualStudioProgrammerThemesGallery.aspx
   [2]: http://megakemp.files.wordpress.com/2009/04/vssettingsdialog1.png?w=190&h=117 (VSSettingsDialog)
   [3]: http://msdn.microsoft.com/en-us/library/1x6229t8.aspx
   [4]: http://megakemp.files.wordpress.com/2009/04/vimemacseffect.png?w=240&h=240 (VimEmacsEffect)
   [5]: http://www.vim.org/
   [6]: http://www.gnu.org/software/emacs/
   [7]: http://www.microsoft.com/visualstudio/en-gb/default.mspx
   [8]: http://www.microsoft.com/downloads/details.aspx?familyid=22e69ae4-7e40-4807-8a86-b3d36fab68d3&displaylang=en
   [9]: http://www.microsoft.com/typography/cleartype/tuner/step1.aspx
   [10]: http://www.iunknown.com/2007/06/vibrant_ink_vis.html
   [11]: http://megakemp.files.wordpress.com/2009/04/vssettingscseditor-thumb2.png?w=504&h=308 (VSSettingsCSEditor)
   [12]: http://megakemp.files.wordpress.com/2009/04/vssettingsxmleditor-thumb2.png?w=504&h=342 (VSSettingsXMLEditor)
   [13]: https://cid-3e060a4c9d48a446.skydrive.live.com/self.aspx/Public/Megakemp%20Visual%20Studio%20Settings.zip

---
layout: post
title:  "GDI memory leak in Windows Forms"
date:   2009-02-25
categories: programming
---

A while ago I run into a rather interesting and insidious bug, which I thought I would share.

### The scenario

We had a desktop application developed on the **.NET Framework 2.0** using **Windows Forms**. Part of the requirements for this application was that the standard Windows controls had to be modified to have a custom appearance, to suite the customer’s needs. Since classes that are part of Windows Forms are really nothing more than thin <img alt="winlogo" src="http://megakemp.files.wordpress.com/2009/02/winlogo.gif?w=80&h=66" class="article" /> managed wrappers around [Windows’ graphic subsystem GDI][2], many customizations that required  the use of functions not directly exposed through .NET, forced us to invoke the Win32 API directly.

Now, for someone who has been developing on a virtual machine for a long time (whether it be the CLR or Java), commodities like garbage collection are quickly taken for granted. And when the time comes to step out of the safe and cozy managed world, it is easy to forget that those assumptions are no longer valid. And that’s where problems usually start. <img alt="wpf" src="http://megakemp.files.wordpress.com/2009/02/wpf.png?w=80&h=80" class="article" />

As a side note, if we were to build the same application today we would definitely [choose Windows Presentation Foundation (WPF) over Windows Forms][4] as UI technology,  since WPF allows to easily define the controls’ visual layout separately from their functionality without leaving the CLR.

### The bug

Back to our case. Our Windows Forms application would run fine under normal operations, for about 3 hours until it suddenly crashed reporting a `System.OutOfMemoryException` (OOM). We also noticed that the application would survive for a shorter period of time if it was used more “intensively” (meaning opening and closing a lot of forms).

By looking at the log files we could determine that the exception was always originated from the constructor of a **Bitmap **object, which lead us to think that we were looking at a [memory leak of some sort of unmanaged graphic resources][5].
Like everything else in the [System.Drawing][6] and [System.Windows.Forms][7] namespaces, also the [Bitmap class][8] holds a reference to a corresponding GDI object, which is a resource allocated outside of the CLR and as such it [must explicitly be released][9] when no longer in use.
Oddly enough, a through examination of the source code confirmed that all bitmap objects were correctly released from memory by calling the [Dispose][10] method on them. So what was leaking?

To further investigate exactly what was being used and left hanging around, we used a free tool called [GDIUsage][11], which shows exactly how many and which kinds of GDI objects are being allocated by an application. On the left picture you can see how memory looked like at application startup compared to after a couple of minutes of normal usage.

<a href="http://megakemp.files.wordpress.com/2009/02/gdileaksbefore.png">
    <img alt="GDILeaksBefore" src="http://megakemp.files.wordpress.com/2009/02/gdileaksbefore-thumb.png?w=244&h=409" class="screenshot-noshadow" />
</a>
<a href="http://megakemp.files.wordpress.com/2009/02/gdiusageafter.png">
    <img alt="GDIUsageAfter" src="http://megakemp.files.wordpress.com/2009/02/gdiusageafter-thumb.png?w=244&h=410" class="screenshot-noshadow" style="display: inline" />
</a>

It was apparent that we were creating an awful lot of **font objects** and forgetting to delete them! But why would it take a long time for the application to crash? Were we hitting some kind of threshold?

It turned out Windows puts a limit on the number of total GDI objects that can be created inside of a process. And [that limit is exactly of 10.000 GDI objects in Windows XP][14]. This means that  allocating GDI object number 10.001 will always cause an error. You can use Task Manager to see how many GDI resources each process has currently allocated by selecting the **GDI Objects** column.

<a href="http://megakemp.files.wordpress.com/2009/02/taskmanagergdiobjects.png">
    <img alt="TaskManagerGDIObjects" src="http://megakemp.files.wordpress.com/2009/02/taskmanagergdiobjects-thumb.png?w=404&h=437" class="screenshot-noshadow" />
</a>

### The solution

At this point it was a matter of tracking down where in the source code we were creating [System.Drawing.Font][16] objects. Considering the rate of growth of these fonts instinct suggested it ought to be in some kind of global function that was being called from different places in the application. Here is what we found:

```csharp
[DllImport("gdi32.dll")]
private static extern IntPtr SelectObject(IntPtr hDC, IntPtr hObject);

[DllImport("gdi32.dll")]
private static extern bool DeleteObject(IntPtr hObject);

[DllImport("gdi32.dll", EntryPoint = "GetTextExtentPoint32A")]
private static extern bool GetTextExtentPoint32(
IntPtr hDC, string lpString, int cbString, ref SIZE lpSize);

[StructLayout(LayoutKind.Sequential)]
private struct SIZE
{
    int cx;
    int cy;
}

///
/// Gets the width and height of a string with the specified font.
///
/// The graphic context to measure the string.
/// The string to be measured.
/// The font used to display the string.
/// The size of the string in width and height.
public static SizeF MeasureString(Graphics g, string text, Font font)
{
    SIZE sz = new SIZE();
    IntPtr hdc = g.GetHdc();
    IntPtr prevFont = SelectObject(hdc, font.ToHfont());

    GetTextExtentPoint32(hdc, text, text.Length, ref sz);

    DeleteObject(SelectObject(hdc, font.ToHfont()));
    g.ReleaseHdc(hdc);

    return new SizeF((float)sz.cx, (float)sz.cy);
}
```

Sure enough the `MeauseString` method was being called from all over the application (don’t ask why). Do you notice anything particularly odd in the code? Let me show you the offending line:

```csharp
// The Font.ToHFont() method creates a new Font GDI object
// whose reference is being passed as argument
// to the SelectObject Win32 function
// but is never explicitly deleted
IntPtr prevFont = SelectObject(hdc, font.ToHfont());
```

And here is how we fixed it:

```csharp
public static SizeF MeasureString(Graphics g, string text, Font font)
{
    IntPtr hdc = IntPtr.Zero;
    IntPtr f = IntPtr.Zero;
    IntPtr prevFont = IntPtr.Zero;
    SIZE sz;

    try
    {
        sz = new SIZE();
        hdc = g.GetHdc();
        f = font.ToHfont();
        prevFont = SelectObject(hdc, f);
        GetTextExtentPoint32(hdc, text, text.Length, ref sz);
    }
    finally
    {
        DeleteObject(f);
        DeleteObject(prevFont);
        g.ReleaseHdc(hdc);
    }

    return new SizeF((float)sz.cx, (float)sz.cy);
}
```

As you can see we made sure the `DeleteObject` Win32 function is called to release the Font object created by the `Font.ToHFont()` method.

### Lessons learned

So, what did we learn from this experience? We can summarize it in **3 rules of thumb** when dealing with unmanaged code in .NET, whether it be Win32, COM, you name it:

  * Pay attention if any of unmanaged functions you are calling goes out and creates a new instance of some resource in memory. Carefully **reading the specific API documentation** is vital.
  * Every time you allocate memory it is your responsibility to explicitly free it when it is no longer needed by the program. **No Garbage Collector** will do this for you, you are on your own.
  * When creating a new unmanaged object, **save a reference** to it in a variable that you can use to reach that same object at a later time and remove it from memory. If you lose the reference before the object is explicitly destroyed, you have no way to reach that memory and it leaks.

I hope this rules will help you avoid some of the most common pitfalls leading to memory leaks in your own applications.

/Enrico

[2]: http://msdn.microsoft.com/en-us/library/dd145203(VS.85).aspx
[4]: http://windowsclient.net/wpf/white-papers/when-to-adopt-wpf.aspx
[5]: http://msdn.microsoft.com/en-us/magazine/cc301756.aspx
[6]: http://msdn.microsoft.com/en-us/library/system.drawing.aspx
[7]: http://msdn.microsoft.com/en-us/library/system.windows.forms.aspx
[8]: http://msdn.microsoft.com/en-us/library/system.drawing.bitmap.aspx
[9]: http://blogs.msdn.com/scottholden/archive/2006/08/22/713056.aspx
[10]: http://msdn.microsoft.com/en-us/library/system.idisposable.aspx
[11]: http://msdn.microsoft.com/en-us/magazine/cc188782.aspx
[14]: http://msdn.microsoft.com/en-us/library/ms724291(VS.85).aspx
[16]: http://msdn.microsoft.com/en-us/library/system.drawing.font.aspx

OS X Tuned for 1337 H4XX
========
![image](http://i.imgur.com/8ypR4jn.gif)


Installation
========
No bootstrap script yet :/
Just clone and make necessary symlinks.

My setup
========
* Terminal emulator: [iTerm2](https://github.com/gnachman/iTerm2)
* Shell: [ridiculous fish](https://github.com/fish-shell/fish-shell)
* Editor: [Vim](http://www.vim.org)
* Terminal multiplexor: [tmux](http://tmux.sourceforge.net)
* Package manager: [Homebrew](http://brew.sh)

Tips and tricks
========
###Make iTerm2 Borderless
Download source code from [official repo](https://github.com/gnachman/iTerm2). 
Remove `NSTitledWindowMask |` from [PseudoTerminal.m](https://github.com/gnachman/iTerm2/blob/master/PseudoTerminal.m#L326) `NSUInteger styleMask =`

Or just download [Compiled binary for the lazy](http://cl.ly/2T0s370K0s44). (A little bit outdated) Don't update it, otherwise borders will appear.

Install [afloat](https://github.com/millenomi/afloat) to be able to drag and resize window.

###Hide menu and dock
Install [Menu and dockless](http://myownapp.com/manuals/mad_manual/)




Screenshots
========

###Typical seesion
![image](http://i.imgur.com/pFYFq4I.png)


##Code editing

###Ruby
![image](http://i.imgur.com/7tjTXEf.png)


###Coffeescript
![image](http://i.imgur.com/W8WbyQY.png)


###Jade, Full Screen
![image](http://i.imgur.com/Du1lWZR.png)

Scripts used in demonstration
========
[H4XX](https://github.com/t3chnoboy/rice) (very dangerous! Use at your own risk)

[Color tests](https://github.com/t3chnoboy/colorscripts)
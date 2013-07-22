vim-rspec

ABOUT
------
Beautiful, colorized RSpec tests in Vim with direct access to
the line where the error occurred.

![GreenScreenshot](http://i.imgur.com/PWutK.png)

HISTORY
-------
 * Original by Eustáquio Rangel (https://github.com/taq), development ended 11/2010
 * Modularized rewrite by Yan Pritzker (http://github.com/skwp) 12/2011. I am actively maintaining this fork.

INSTALL
-------
 * Requires: gem install hpricot
 * Install with pathogen: clone/submodule into vim/bundle
 * **rbenv** users will need to install hpricot using system ruby `RBENV_VERSION=system sudo gem install hpricot`

USAGE
-----
 * :RunSpec for current file
 * :RunSpecLine for current line (current 'it' block)
 * :RunSpecs for all files in spec dir
 * A split will open vertically on the right (if you prefer vertical, let g:RspecSplitHorizontal=0)
 * You can hit 'n' to go to the next error, or navigate to it and hit Enter to go to the line in the file.

Enhancements
-----
 * Run rspec on current line (execute a single 'it' block)
 * Failures and Success is now displayed prominently at the top in green or red
 * Improved colors (for Solarized, specifically)
 * Run in same window, do not create a new window for every run
 * When browsing errors in rspec window, hitting enter takes you to the code in other split (do not create new window)
 * Ability to hit 'n' in the rspec output to go to the next error (and the corresponding code in the split)
 * Unescape html so that brackets in stacktraces are correctly displayed
 * Took out xslt support to focus the project on a ruby-based formatter
 * Default to horizontal split, use "let g:RspecSplitHorizontal=0" in vimrc to split vertical 
 * Support for RSpec1 and RSpec2 (@thenoseman)
 * Automatically find the window with the spec (@thenoseman)

Suggested Key Mappings
-----
By default you get these keymappings. If you don't want them, turn them off with:

    let g:RspecKeymap=0

Run using Cmd-Shift-R:

    map <D-R> :RunSpec<cr>

Run on current line (current 'it' block) Cmd-Shift-L:

    map <D-L> :RunSpecLine<cr>

TODO
-------
 * Further refactoring to improve maintainability
 * Custom paths for RunSpecs (e.g. fast_specs dir)
 * Support for other testing frameworks (test/unit, shoulda), maybe

NOTE: This version is drastically different from the original taq/vim-rspec
fork due to a large refactoring of the main codebase into a modularized
form. If you have an old fork with custom changes, you may want to look
at what's been done here.

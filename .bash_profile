#enables color in the terminal bash shell export
CLICOLOR=1
#sets up the color scheme for list export
LSCOLORS=gxfxcxdxbxegedabagacad
#enables color for iTerm
export TERM=xterm-color
#sets up proper alias commands when called
alias ls='ls -G'
alias ll='ls -hl'

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

#powerline
. /usr/local/lib/python2.7/site-packages/powerline/bindings/bash/powerline.sh

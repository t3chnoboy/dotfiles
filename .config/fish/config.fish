# Path to your oh-my-fish.
set fish_path $HOME/.oh-my-fish

# Theme
set fish_theme bobthefish
# set fish_theme agnoster

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-fish/plugins/*)
# Custom plugins may be added to ~/.oh-my-fish/custom/plugins/
# Example format: set fish_plugins autojump bundler
set fish_plugins autojump brew node rails rbenv z tmux extract gi
# Path to your custom folder (default path is $FISH/custom)
#set fish_custom $HOME/dotfiles/oh-my-fish

# Load oh-my-fish configuration.
. $fish_path/oh-my-fish.fish

# Powerline
# . /usr/local/lib/python2.7/site-packages/powerline/bindings/fish/powerline.fish

# Private stuff
. ~/.dotfiles/.private.fish

# Aliases
alias :q=exit
alias :wq=exit
alias :e=vim
alias gs="git st"
alias gc="git commit"
alias gl="git lg"
alias ga="git add"
alias gd="git diff"
alias gp="git push"
alias node="node --harmony"
alias hcoffee="~/Developer/Projects/JavaScript/coffee-script-harmony/bin/coffee"

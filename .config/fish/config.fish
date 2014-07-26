# Path to your oh-my-fish.
set fish_path $HOME/.oh-my-fish

# Theme
# set fish_theme l
set fish_theme greenfish
# set fish_theme agnoster

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-fish/plugins/*)
# Custom plugins may be added to ~/.oh-my-fish/custom/plugins/
# Example format: set fish_plugins autojump bundler
set fish_plugins brew node rails rbenv z tmux extract
# Path to your custom folder (default path is $FISH/custom)
#set fish_custom $HOME/dotfiles/oh-my-fish

# Load oh-my-fish configuration.
. $fish_path/oh-my-fish.fish

#editor
set -x EDITOR vim

# Private stuff
. ~/.dotfiles/.private.fish

# Aliases
alias :q=exit
alias :wq=exit
alias :e=vim
alias gs="git st"
alias gc="git commit -m"
alias gl="git lg"
alias ga="git add"
alias gd="git diff"
alias gp="git push"
alias node="node --harmony"
alias elementExplorer="node /usr/local/lib/node_modules/protractor/bin/elementexplorer.js"

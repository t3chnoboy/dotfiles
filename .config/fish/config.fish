# Path to your oh-my-fish.
set fish_path $HOME/.oh-my-fish

# Theme
if test $TERM = eterm-color
  set fish_theme l
else
  set fish_theme greenfish
end

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-fish/plugins/*)
# Custom plugins may be added to ~/.oh-my-fish/custom/plugins/
# Example format: set fish_plugins autojump bundler
set fish_plugins brew node z tmux extract theme rbenv
# Path to your custom folder (default path is $FISH/custom)
#set fish_custom $HOME/dotfiles/oh-my-fish

# Load oh-my-fish configuration.
source $fish_path/oh-my-fish.fish

#editor
set -x EDITOR vim

# Private stuff
source ~/.dotfiles/.private.fish

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
alias rm!="rm -rf"
alias json="underscore print --outfmt pretty"
alias v="vim ."
alias l="ls -f"

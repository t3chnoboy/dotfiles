# Theme
# if test $TERM = eterm-color
#   Theme "l"
# else
#   Theme 'cbjohnson'
# end

#editor
set -x EDITOR emacs

set -g __fish_git_prompt_char_dirtystate '+'

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
alias gcm="git checkout master"
alias gst="git stash"
alias gcb="git checkout -b"
alias gpu="git pull"
alias node="node --harmony"
alias elementExplorer="node /usr/local/lib/node_modules/protractor/bin/elementexplorer.js"
alias rm!="rm -rf"
alias json="underscore print --outfmt pretty"
alias v="vim ."
alias l="ls -f"

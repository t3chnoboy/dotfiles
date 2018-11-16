#editor
set -x EDITOR emacs

# set -g __fish_git_prompt_char_dirtystate '+'

# Private stuff
source ~/.dotfiles/.private.fish

# Aliases
alias emacs="emacs -nw"
alias :q=exit
alias :wq=exit
alias :e=emacsclient
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
alias rm!="rm -rf"
alias v="vim ."
alias l="ls -f"
alias k=kubectl
alias getpod="kubectl get --no-headers=true pods -o custom-columns=:metadata.name | fzf"
alias copypod="kubectl get --no-headers=true pods -o custom-columns=:metadata.name | fzf | pbcopy"
alias gitsha="git rev-parse HEAD"
alias watchpods="watch kubectl get pods"

# GPG
set -x GPG_TTY (tty)

set fish_greeting

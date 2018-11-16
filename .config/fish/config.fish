#editor
set -x EDITOR emacsclient

# set -g __fish_git_prompt_char_dirtystate '+'

# Private stuff
source ~/.dotfiles/.private.fish

# Aliases
alias emacs="emacsclient -nw"
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

# GPG
set -x GPG_TTY (tty)

alias kubenv="eval (minikube docker-env)"
status --is-interactive; and source (rbenv init -|psub)

#editor
set -x EDITOR emacs

# set -g __fish_git_prompt_char_dirtystate '+'

# Private stuff
source ~/.dotfiles/.private.fish

fish_add_path /opt/homebrew/bin
fish_add_path /Users/dmazuro/.emacs.d/bin


# Aliases
# alias emacs="emacs -nw"
alias :q=exit
alias :wq=exit
alias :e=emacsclient
alias gs="git st"
alias gc="git commit -m"
alias gll="git lg"
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

# minikube
# alias kubenv="eval (minikube docker-env)"

# rbenv
status --is-interactive; and source (rbenv init -|psub)

# fzf
set -U FZF_COMPLETE 2
set -U FZF_ENABLE_OPEN_PREVIEW 1
set -U FZF_PREVIEW_FILE_CMD 'bat --style=numbers --color=always'

# remove fish greeting
set fish_greeting

# enable vim mode
status --is-interactive; and fish_vi_key_bindings

set fish_cursor_default     underscore blink
set fish_cursor_insert      line       blink
set fish_cursor_replace_one underscore blink
set fish_cursor_visual      block

if type -q fizzygit
    fizzygit
end



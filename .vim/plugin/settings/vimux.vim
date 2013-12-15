" Run last command executed by RunVimTmuxCommand
map rl :VimuxRunLastCommand<CR>

" Prompt for a command to run
map rc :VimuxPromptCommand<CR>

" send text from v buffer to tmux
map rs :call VimuxSendText(@v)<CR>

" Close vim tmux runner
map rq :call VimuxCloseRunner()<CR>


" Select current paragraph and send it to tmux
nmap rp "vyaprs

" Select current paragraph and send it to tmux
nmap r} "vy}rs

" send text below the cursor to tmux
nmap rG "vyGrs

" send text above the cursor to tmux
nmap rgg "vyggrs

" send current line to tmux
nmap rr "vyyrs

"  send opened buffer to tmux
nmap ra gg"vyGrs

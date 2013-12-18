nmap <silent> r :set opfunc=SendToTmux<CR>g@
vmap <silent> r :<C-U>call SendToTmux(visualmode(), 1)<CR>

function! SendToTmux(type, ...)
  let sel_save = &selection
  let &selection = "inclusive"
  let reg_save = @@

  if a:0  " Invoked from Visual mode, use '< and '> marks.
    silent exe "normal! `<" . a:type . "`>y"
  elseif a:type == 'line'
    silent exe "normal! '[V']y"
  elseif a:type == 'block'
    silent exe "normal! `[\<C-V>`]y"
  else
    silent exe "normal! `[v`]y"
  endif

  call VimuxSendText(@@)

  let &selection = sel_save
  let @@ = reg_save
endfunction

" Run last command executed by RunVimTmuxCommand
nmap rl :VimuxRunLastCommand<CR>

" Prompt for a command to run
nmap rc :VimuxPromptCommand<CR>

" Close vim tmux runner
nmap rq :call VimuxCloseRunner()<CR>

" send current line to tmux
nmap rr "vyy :call VimuxSendText(@v)<CR>

" =====================TURBUX======================"
let g:turbux_runner  = 'vimux'
let g:no_turbux_mappings = 1
map rt <Plug>SendTestToTmux
map rT <Plug>SendFocusedTestToTmux

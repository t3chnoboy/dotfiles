if $THEME == "day"
  let g:airline_theme='luna'
  hi CursorLine   cterm=NONE ctermbg=159
  set cursorline
elseif $THEME == "night"
  let g:airline_theme='powerlineish'
  let g:airline#extensions#tmuxline#enabled = 0
  hi CursorLine   cterm=NONE ctermbg=235
  set cursorline
endif

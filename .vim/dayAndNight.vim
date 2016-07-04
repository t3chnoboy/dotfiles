" if $THEME == "day"
"   let g:airline_theme='luna'
"   hi CursorLine   cterm=NONE ctermbg=159
"   set cursorline
" elseif $THEME == "night"
"   let g:airline_theme='powerlineish'
"   let g:airline#extensions#tmuxline#enabled = 0
"   hi CursorLine   cterm=NONE ctermbg=235
"   set cursorline
" elseif $THEME == "minimal"
"   colorscheme satori2
"   let g:airline_theme='murmur'
"   set cursorline
" endif

if $THEME == "day"
  let g:airline_theme='luna'
  hi CursorLine   cterm=NONE ctermbg=159
  set cursorline
elseif $THEME == "minimal"
  colorscheme satori2
  let g:airline_theme='murmur'
  set cursorline
else
  let g:airline_theme='powerlineish'
  let g:airline#extensions#tmuxline#enabled = 0
  hi CursorLine   cterm=NONE ctermbg=235
  set cursorline
endif

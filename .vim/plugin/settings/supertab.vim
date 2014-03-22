let g:SuperTabDefaultCompletionType = "context"
let g:SuperTabContextDefaultCompletionType="<C-X><C-O>"

" let g:SuperTabContextDefaultCompletionType="<c-p>"

autocmd FileType ruby,eruby set omnifunc=rubycomplete#Complete
autocmd FileType ruby,eruby let g:rubycomplete_buffer_loading=1
autocmd FileType ruby,eruby let g:rubycomplete_classes_in_global=1
autocmd FileType ruby,eruby let g:rubycomplete_rails = 1
autocmd FileType css setlocal omnifunc=csscomplete#CompleteCSS
autocmd FileType html,markdown setlocal omnifunc=htmlcomplete#CompleteTags
autocmd FileType javascript,coffee setlocal omnifunc=javascriptcomplete#CompleteJS
autocmd FileType python setlocal omnifunc=pythoncomplete#Complete
autocmd FileType xml setlocal omnifunc=xmlcomplete#CompleteTags
set ofu=syntaxcomplete#Complete

" inoremap <expr> <CR> pumvisible() ? "\<C-y>" : "\<C-g>u\<CR>"

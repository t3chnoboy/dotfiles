" Run Tests
map <buffer> rt :call VimuxRunCommand('cabal test')<CR>
map <buffer> rT :call VimuxRunCommand('cabal test')<CR>

" Completion
setlocal omnifunc=necoghc#omnifunc

" Insert type signature
map <buffer> gt :call ghcmod#command#type_insert(0)<CR>

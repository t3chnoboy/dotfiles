" Run Tests
map <buffer> rt :call VimuxRunCommand('runhaskell -isrc -itest test/Spec.hs')<CR>
map <buffer> rT :call VimuxRunCommand('cabal test')<CR>

" Completion
setlocal omnifunc=necoghc#omnifunc

" Insert type signature
map <buffer> <leader>t :call ghcmod#command#type_insert(0)<CR>

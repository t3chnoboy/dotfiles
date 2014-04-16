let g:turbux_runner  = 'vimux'
let g:no_turbux_mappings = 1
map <buffer> rt <Plug>SendTestToTmux
map <buffer> rT <Plug>SendFocusedTestToTmux
compiler ruby
let ruby_operators = 1
let ruby_space_errors = 1

" Vim indent file
" Language: Erlang
" Author:   Ricardo Catalinas Jiménez <jimenezrick@gmail.com>
" License:  Vim license
" Version:  2012/11/26

if exists('b:did_indent')
	finish
else
	let b:did_indent = 1
endif

setlocal indentexpr=ErlangIndent()
setlocal indentkeys=!^F,o,O,=),=},=],=>>,=of,=catch,=after,=end

if exists('*ErlangIndent')
	finish
endif

let s:erlang_indent_file = expand('<sfile>:p:h') . '/erlang_indent.erl'
if filewritable(expand('<sfile>:p:h')) == 2
	let s:in_fifo  = expand('<sfile>:p:h') . '/vimerl_in_fifo.' . getpid()
	let s:out_fifo = expand('<sfile>:p:h') . '/vimerl_out_fifo.' . getpid()
else
	let s:in_fifo  = '/tmp/vimerl_in_fifo.' . getpid()
	let s:out_fifo = '/tmp/vimerl_out_fifo.' . getpid()
endif

execute 'silent !mkfifo' s:in_fifo
execute 'silent !mkfifo' s:out_fifo
execute 'silent !' . s:erlang_indent_file s:out_fifo s:in_fifo '&'

autocmd VimLeave * call <SID>StopIndenter()

function s:StopIndenter()
	call writefile([], s:out_fifo)
	call delete(s:in_fifo)
	call delete(s:out_fifo)
endfunction

function ErlangIndent()
	if v:lnum == 1
		return 0
	else
		call writefile([v:lnum] + getline(1, v:lnum), s:out_fifo)
		let indent = split(readfile(s:in_fifo)[0])

		if len(indent) == 1 || !&expandtab
			return indent[0] * &shiftwidth
		else
			return indent[1]
		endif
	endif
endfunction

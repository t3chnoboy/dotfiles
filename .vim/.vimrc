" ================ General Config ====================

set nocompatible
set number                      "Line numbers are good
set ruler                       "Show line and column number
set backspace=indent,eol,start  "Allow backspace in insert mode
set history=1000                "Store lots of :cmdline history
set showcmd                     "Show incomplete cmds down the bottom
"set showmode                    "Show current mode down the bottom
"set gcr=a:blinkon0              "Disable cursor blink
"set visualbell                  "No sounds
set autoread                    "Reload files changed outside vim
set encoding=utf-8              "Set default encoding to UTF-8
set shell=/bin/bash

" This makes vim act like all other editors, buffers can
" exist in the background without being in a window.
" http://items.sjbach.com/319/configuring-vim-right
set hidden

" Enable mouse use in all modes
set mouse=a
set ttyfast
set ttymouse=xterm2

"turn on syntax highlighting
syntax on

" Change leader to <space> because the backslash is too far away
" That means all \x commands turn into <space>x
let mapleader=" "

" ================ Search =====================
set hlsearch    " highlight matches
set incsearch   " incremental searching
set ignorecase  " searches are case insensitive...
set smartcase   " ... unless they contain at least one capital letter

" =============== Plugins Initialization ===============
" This loads all the plugins specified in ~/.vim/plugins.vim
" Use vim-plug plugin to manage all other plugins
if filereadable(expand("~/.vim/plugins.vim"))
  source ~/.vim/plugins.vim
endif

" ================ Color Scheme =====================

colorscheme anotherdark2

if filereadable(expand("~/.vim/dayAndNight.vim"))
  source ~/.vim/dayAndNight.vim
endif

" ================ Powerline ====================

set laststatus=2 " Always display the statusline in all windows
set noshowmode " Hide the default mode text (e.g. -- INSERT -- below the statusline)

" ================ Key Mappings =====================

"remap esc
ino jj <esc>
cno jj <c-c>
"for visual mode
vno v <esc>

"open new line without entering insert mode
nmap <Enter> o<Esc>

"fast switching between tabs
map <leader><leader> :bn<cr>
"" Shift space is mapped to '_' in iTerm
map __ :bp<cr>
map <leader>d :bd<cr>

"semicolon to colon
map ; :
noremap ;; ;

"magic :)
:nnoremap / /\v
:cnoremap %s/ %s/\v

" toggle paste mode
map <leader>P :set paste!<Bar>set paste?<CR>

" ================ Turn Off Swap Files ==============

"set noswapfile
"set nobackup
"set nowb

" ================ Persistent Undo ==================
" Keep undo history across sessions, by storing in file.
" Only works all the time.

silent !mkdir ~/.vim/backups > /dev/null 2>&1
set undodir=~/.vim/backups
set undofile

" ================ Indentation ======================

set autoindent
set smartindent
set smarttab
set shiftwidth=2
set softtabstop=2
set tabstop=2
set expandtab

filetype plugin on
filetype indent on

" Display tabs and trailing spaces visually
set list listchars=tab:\ \ ,trail:·

set nowrap       "Don't wrap lines
set linebreak    "Wrap lines at convenient points

" ================ Folds ============================

set foldmethod=indent   "fold based on indent
set foldnestmax=3       "deepest fold is 3 levels
set nofoldenable        "dont fold by default

" ================ Completion =======================

"set wildmode=list:longest
set wildmenu                "enable ctrl-n and ctrl-p to scroll thru matches
set wildignore=*.o,*.obj,*~ "stuff to ignore when tab completing
set wildignore+=*vim/backups*
set wildignore+=*sass-cache*
set wildignore+=*DS_Store*
set wildignore+=vendor/rails/**
set wildignore+=vendor/cache/**
set wildignore+=node_modules/**
set wildignore+=*.gem
set wildignore+=log/**
set wildignore+=tmp/**
set wildignore+=*.png,*.jpg,*.gif

" ================ Scrolling ========================

set scrolloff=8         "Start scrolling when we're 8 lines away from margins
set sidescrolloff=15
set sidescroll=1

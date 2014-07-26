call plug#begin('~/.vim/plugged')

" Javascript/Coffeescript
Plug 'pangloss/vim-javascript'
Plug 'kchmck/vim-coffee-script'
Plug 'moll/vim-node'
Plug 'burnettk/vim-angular'
Plug 'rsludge/vim-sails'
Plug 'othree/javascript-libraries-syntax.vim'
Plug 'matthewsimo/angular-vim-snippets'
Plug 'mxw/vim-jsx'
" Plug 'marijnh/tern_for_vim'
" Plug 'jelera/vim-javascript-syntax'
" Plug 'myhere/vim-nodejs-complete'
" Plug 'jamescarr/snipmate-nodejs'
" Plug 'claco/jasmine.vim'
" Plug 'itspriddle/vim-jquery'

" Ruby, Rails, Rake...
Plug 'tpope/vim-rails'
Plug 'tpope/vim-rake'
Plug 'vim-ruby/vim-ruby'
Plug 'tpope/vim-bundler'
Plug 'jgdavey/vim-turbux', {'for': 'ruby'}
" Plug 'ecomba/vim-ruby-refactoring'
" Plug 'tpope/vim-rvm'
" Plug 'astashov/vim-ruby-debugger'

" λ
Plug 't3chnoboy/vim-haskellConceal', {'for': 'haskell'}
Plug 'eagletmt/ghcmod-vim', {'for': 'haskell'}
Plug 'dag/vim2hs', {'for': 'haskell'}
Plug 'eagletmt/neco-ghc', {'for': 'haskell'}
" Plug 'vim-scripts/Superior-Haskell-Interaction-Mode-SHIM', {'for': 'haskell'}
" Plug 'lukerandall/haskellmode-vim', {'for': 'haskell'}

" ><)))*>
Plug 'dag/vim-fish', {'for': 'fish'}

" Html, Xml, Css, Markdown
Plug 'groenewege/vim-less', {'for': 'less'}
Plug 'mattn/emmet-vim', {'for': ['html', 'css']}
Plug 'tpope/vim-haml', {'for': 'haml'}
Plug 'tpope/vim-markdown', {'for': 'markdown'}
Plug 'digitaltoad/vim-jade', {'for': 'jade'}
Plug 'wavded/vim-stylus', {'for': 'stylus'}
" Plug 'briancollins/vim-jst'
" Plug 'ap/vim-css-color'

" Git related...
Plug 'mattn/gist-vim'
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-git'
Plug 'gregsexton/gitv'
Plug 'airblade/vim-gitgutter'
Plug 'junegunn/vim-github-dashboard', { 'on': ['GHDashboard', 'GHActivity'] }

" autocompletion, snippets
Plug 'ervandew/supertab'
Plug 'SirVer/ultisnips'
Plug 'honza/vim-snippets'
" Plug 'Valloric/YouCompleteMe'
" Plug 'garbas/vim-snipmate'
" Plug 'Shougo/neocomplete.vim'

" General text editing improvements...
Plug 'Raimondi/delimitMate'
Plug 'godlygeek/tabular'
Plug 'tpope/vim-commentary'
Plug 'tpope/vim-surround'
Plug 'tpope/vim-endwise'
Plug 'tpope/vim-repeat'
Plug 'AndrewRadev/splitjoin.vim'
" Plug 'vim-scripts/AutoTag'
" Plug 'scrooloose/nerdcommenter'
" Plug 'tomtom/tcomment_vim'
" Plug 'vim-scripts/matchit.zip'
" Plug 'align'
" Plug 'terryma/vim-multiple-cursors'

" motions
" Plug 'justinmk/vim-sneak'
" Plug 'Lokaltog/vim-easymotion'
" Plug 'vim-scripts/camelcasemotion'

" General vim improvements
Plug 'scrooloose/syntastic'
Plug 'sjl/gundo.vim'
" Plug 'jistr/vim-nerdtree-tabs'
" Plug 'tpope/vim-ragtag'
" Plug 'tpope/vim-unimpaired'
" Plug 'xsunsmile/showmarks'
" Plug 'nathanaelkane/vim-indent-guides'

" File system/Project navigation/Search
Plug 'kien/ctrlp.vim'
Plug 'majutsushi/tagbar'
Plug 'scrooloose/nerdtree'
Plug 'rking/ag.vim', {'on': 'Ag'}
" Plug 'mileszs/ack.vim'
" Plug 'tpope/vim-vinegar'

" TMUX
Plug 'benmills/vimux'
Plug 'christoomey/vim-tmux-navigator'
Plug 'edkolev/tmuxline.vim'
Plug 'tpope/vim-dispatch'
" Plug 'jpalardy/vim-slime'

" Text objects
Plug 'kana/vim-textobj-user'
Plug 'kana/vim-textobj-indent'
Plug 'nelstrom/vim-textobj-rubyblock', {'for': 'ruby'}
Plug 'thinca/vim-textobj-function-javascript', {'for': 'javascript'}
" Plug 'kana/vim-textobj-function'
" Plug 'vim-scripts/argtextobj.vim'

" Cosmetics, color scheme, Powerline...
Plug 'bling/vim-airline'
Plug 'ScrollColors', {'on': 'COLORSCROLL' }
" Plug 'vim-scripts/TagHighlight'

" SuperTab dependencies
Plug 'MarcWeber/vim-addon-mw-utils'
Plug 'tomtom/tlib_vim'
Plug 'Shougo/vimproc.vim'
Plug 'mattn/webapi-vim'

" Misc
Plug 'tpope/vim-heroku', {'on': 'Heroku'}

call plug#end()
" ========================================
" Vim plugin configuration
" ========================================
"
" This file contains the list of plugin installed using vundle plugin manager.
" Once you've updated the list of plugin, you can run vundle update by issuing
" the command :PluginInstall from within vim or directly invoking it from the
" command line with the following syntax:
" vim --noplugin -u vim/vundles.vim -N "+set hidden" "+syntax on" +PluginClean! +BundleInstall +qall
" Filetype off is required by vundle
filetype off

set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

" let Vundle manage Vundle (required)
Plugin 'gmarik/vundle'

" All your bundles here

" Javascript/Coffeescript
Plugin 'pangloss/vim-javascript'
Plugin 'kchmck/vim-coffee-script'
Plugin 'moll/vim-node'
Plugin 'burnettk/vim-angular'
Plugin 'rsludge/vim-sails'
Plugin 'othree/javascript-libraries-syntax.vim'
Plugin 'matthewsimo/angular-vim-snippets'
Plugin 'mxw/vim-jsx'
" Plugin 'marijnh/tern_for_vim'
" Plugin 'jelera/vim-javascript-syntax'
" Plugin 'myhere/vim-nodejs-complete'
" Plugin 'jamescarr/snipmate-nodejs'
" Plugin 'claco/jasmine.vim'
" Plugin 'itspriddle/vim-jquery'

" Ruby, Rails, Rake...
Plugin 'tpope/vim-rails'
Plugin 'tpope/vim-rake'
Plugin 'vim-ruby/vim-ruby'
Plugin 'tpope/vim-bundler'
" Plugin 'jgdavey/vim-turbux'
" Plugin 'ecomba/vim-ruby-refactoring'
" Plugin 'tpope/vim-rvm'
" Plugin 'astashov/vim-ruby-debugger'

" λ
Plugin 't3chnoboy/vim-haskellConceal'
Plugin 'eagletmt/ghcmod-vim'
Plugin 'dag/vim2hs'
Plugin 'eagletmt/neco-ghc'
" Plugin 'vim-scripts/Superior-Haskell-Interaction-Mode-SHIM'
" Plugin 'lukerandall/haskellmode-vim'

" ><)))*>
Plugin 'dag/vim-fish'

" Html, Xml, Css, Markdown
Plugin 'groenewege/vim-less'
Plugin 'mattn/emmet-vim'
Plugin 'tpope/vim-haml'
Plugin 'tpope/vim-markdown'
Plugin 'digitaltoad/vim-jade'
Plugin 'wavded/vim-stylus'
" Plugin 'briancollins/vim-jst'
" Plugin 'ap/vim-css-color'

" Git related...
Plugin 'mattn/gist-vim'
Plugin 'tpope/vim-fugitive'
Plugin 'tpope/vim-git'
Plugin 'gregsexton/gitv'
Plugin 'airblade/vim-gitgutter'
Plugin 'junegunn/vim-github-dashboard'

" autocompletion, snippets
Plugin 'ervandew/supertab'
Plugin 'SirVer/ultisnips'
Plugin 'honza/vim-snippets'
" Plugin 'Valloric/YouCompleteMe'
" Plugin 'garbas/vim-snipmate'
" Plugin 'Shougo/neocomplcache'

" General text editing improvements...
Plugin 'Raimondi/delimitMate'
Plugin 'godlygeek/tabular'
Plugin 'tpope/vim-commentary'
Plugin 'tpope/vim-surround'
Plugin 'tpope/vim-endwise'
Plugin 'tpope/vim-repeat'
Plugin 'AndrewRadev/splitjoin.vim'
" Plugin 'vim-scripts/AutoTag'
" Plugin 'scrooloose/nerdcommenter'
" Plugin 'tomtom/tcomment_vim'
" Plugin 'vim-scripts/matchit.zip'
" Plugin 'align'
" Plugin 'terryma/vim-multiple-cursors'

" motions
" Plugin 'justinmk/vim-sneak'
" Plugin 'Lokaltog/vim-easymotion'
" Plugin 'vim-scripts/camelcasemotion'

" General vim improvements
Plugin 'scrooloose/syntastic'
Plugin 'sjl/gundo.vim'
" Plugin 'jistr/vim-nerdtree-tabs'
" Plugin 'tpope/vim-ragtag'
" Plugin 'tpope/vim-unimpaired'
" Plugin 'xsunsmile/showmarks'
" Plugin 'nathanaelkane/vim-indent-guides'

" File system/Project navigation/Search
Plugin 'kien/ctrlp.vim'
Plugin 'majutsushi/tagbar'
Plugin 'scrooloose/nerdtree'
Plugin 'rking/ag.vim'
" Plugin 'mileszs/ack.vim'
" Plugin 'tpope/vim-vinegar'

" TMUX
Plugin 'benmills/vimux'
Plugin 'christoomey/vim-tmux-navigator'
Plugin 'edkolev/tmuxline.vim'
Plugin 'tpope/vim-dispatch'
" Plugin 'jpalardy/vim-slime'

" Text objects
Plugin 'kana/vim-textobj-user'
Plugin 'kana/vim-textobj-indent'
Plugin 'nelstrom/vim-textobj-rubyblock'
Plugin 'thinca/vim-textobj-function-javascript'
" Plugin 'kana/vim-textobj-function'
" Plugin 'vim-scripts/argtextobj.vim'

" Cosmetics, color scheme, Powerline...
Plugin 'bling/vim-airline'
Plugin 'ScrollColors'
" Plugin 'vim-scripts/TagHighlight'

" SuperTab dependencies
Plugin 'MarcWeber/vim-addon-mw-utils'
Plugin 'tomtom/tlib_vim'
Plugin 'Shougo/vimproc.vim'
Plugin 'mattn/webapi-vim'
" Plugin 'tomtom/tlib_vim'

" Misc
Plugin 'tpope/vim-heroku'

" Filetype plugin indent on is required by vundle
filetype plugin indent on

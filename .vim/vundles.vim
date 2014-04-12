" ========================================
" Vim plugin configuration
" ========================================
"
" This file contains the list of plugin installed using vundle plugin manager.
" Once you've updated the list of plugin, you can run vundle update by issuing
" the command :BundleInstall from within vim or directly invoking it from the
" command line with the following syntax:
" vim --noplugin -u vim/vundles.vim -N "+set hidden" "+syntax on" +BundleClean! +BundleInstall +qall
" Filetype off is required by vundle
filetype off

set rtp+=~/.vim/bundle/vundle/
call vundle#rc()

" let Vundle manage Vundle (required)
Bundle 'gmarik/vundle'

" All your bundles here

" Javascript/Coffeescript
Plugin 'pangloss/vim-javascript'
Bundle 'kchmck/vim-coffee-script'
Bundle 'moll/vim-node'
Bundle 'burnettk/vim-angular'
Bundle 'rsludge/vim-sails'
" Bundle 'marijnh/tern_for_vim'
" Bundle 'othree/javascript-libraries-syntax.vim'
" Bundle 'jelera/vim-javascript-syntax'
" Bundle 'myhere/vim-nodejs-complete'
" Bundle 'jamescarr/snipmate-nodejs'
" Bundle 'claco/jasmine.vim'
" Bundle 'itspriddle/vim-jquery.git'

" Ruby, Rails, Rake...
Plugin 'ecomba/vim-ruby-refactoring'
Plugin 'tpope/vim-rails.git'
Plugin 'tpope/vim-rake.git'
Plugin 'vim-ruby/vim-ruby.git'
Plugin 'tpope/vim-bundler'
Plugin 'jgdavey/vim-turbux'
" Plugin 'tpope/vim-rvm.git'
" Plugin 'astashov/vim-ruby-debugger'

" λ
Plugin 'vim-scripts/Superior-Haskell-Interaction-Mode-SHIM'
Plugin 't3chnoboy/vim-haskellConceal'
Plugin 'eagletmt/ghcmod-vim'
Plugin 'dag/vim2hs'
Plugin 'eagletmt/neco-ghc'
Plugin 'Shougo/vimproc.vim'
" Plugin 'lukerandall/haskellmode-vim'

" ><)))*>
Plugin 'dag/vim-fish'

" Html, Xml, Css, Markdown
Plugin 'groenewege/vim-less.git'
Plugin 'mattn/emmet-vim'
Plugin 'tpope/vim-haml'
Plugin 'tpope/vim-markdown'
Plugin 'digitaltoad/vim-jade'
Plugin 'wavded/vim-stylus'
Plugin 'briancollins/vim-jst'
" Plugin 'ap/vim-css-color'

" Git related...
Plugin 'mattn/gist-vim'
Plugin 'tpope/vim-fugitive'
Plugin 'tpope/vim-git'
Plugin 'gregsexton/gitv'
Plugin 'airblade/vim-gitgutter'

" autocompletion, snippets
Plugin 'ervandew/supertab'
Plugin 'SirVer/ultisnips'
Plugin 'honza/vim-snippets'
" Plugin 'Valloric/YouCompleteMe'
" Plugin 'garbas/vim-snipmate.git'
" Plugin 'Shougo/neocomplcache.git'

" General text editing improvements...
Plugin 'Raimondi/delimitMate'
Plugin 'godlygeek/tabular'
Plugin 'tpope/vim-commentary'
Plugin 'tpope/vim-surround.git'
Plugin 'vim-scripts/AutoTag.git'
" Plugin 'scrooloose/nerdcommenter'
" Plugin 'tomtom/tcomment_vim.git'
" Plugin 'vim-scripts/matchit.zip.git'
" Plugin 'align'
" Plugin 'terryma/vim-multiple-cursors'

" motions
Plugin 'justinmk/vim-sneak'
Plugin 'Lokaltog/vim-easymotion'
" Plugin 'vim-scripts/camelcasemotion.git'

" General vim improvements
Plugin 'scrooloose/syntastic.git'
Plugin 'tpope/vim-endwise.git'
Plugin 'tpope/vim-repeat.git'
Plugin 'sjl/gundo.vim'
Plugin 'mattn/webapi-vim.git'
" Plugin 'jistr/vim-nerdtree-tabs.git'
" Plugin 'tomtom/tlib_vim.git'
" Plugin 'tpope/vim-ragtag'
" Plugin 'tpope/vim-unimpaired'
" Plugin 'xsunsmile/showmarks.git'
" Plugin 'nathanaelkane/vim-indent-guides'

" File system/Project navigation/Search
Plugin 'kien/ctrlp.vim'
Plugin 'majutsushi/tagbar.git'
Plugin 'scrooloose/nerdtree.git'
Plugin 'rking/ag.vim'
" Plugin 'mileszs/ack.vim'
" Plugin 'tpope/vim-vinegar'

" TMUX
Plugin 'benmills/vimux'
Bundle 'christoomey/vim-tmux-navigator'
Bundle 'tpope/vim-dispatch'
Bundle 'edkolev/tmuxline.vim'
" Plugin 'jpalardy/vim-slime'

" Text objects
Plugin 'kana/vim-textobj-user'
Plugin 'kana/vim-textobj-indent'
Plugin 'nelstrom/vim-textobj-rubyblock'
Plugin 'thinca/vim-textobj-function-javascript'
" Plugin 'kana/vim-textobj-function'
" Plugin 'vim-scripts/argtextobj.vim'

" Cosmetics, color scheme, Powerline...
Plugin 'bling/vim-airline.git'
Plugin 'ScrollColors'
" Plugin 'vim-scripts/TagHighlight.git'
" Plugin 'altercation/vim-colors-solarized'

" SuperTab dependencies
Plugin 'MarcWeber/vim-addon-mw-utils'
Plugin 'tomtom/tlib_vim'

" Misc
Plugin 'tpope/vim-heroku'

" Filetype plugin indent on is required by vundle
filetype plugin indent on

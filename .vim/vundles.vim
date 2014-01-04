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
Bundle "gmarik/vundle"

" All your bundles here

" Javascript/Coffeescript
Bundle "pangloss/vim-javascript"
Bundle "itspriddle/vim-jquery.git"
Bundle "kchmck/vim-coffee-script"
Bundle "moll/vim-node"
Bundle "othree/javascript-libraries-syntax.vim"
Bundle "jelera/vim-javascript-syntax"
Bundle "marijnh/tern_for_vim"
Bundle "ahayman/vim-nodejs-complete"
Bundle "jamescarr/snipmate-nodejs"
Bundle "claco/jasmine.vim"

" Ruby, Rails, Rake...
Bundle "ecomba/vim-ruby-refactoring"
Bundle "tpope/vim-rails.git"
Bundle "tpope/vim-rake.git"
Bundle "tpope/vim-rvm.git"
Bundle "vim-ruby/vim-ruby.git"
Bundle "tpope/vim-bundler"
Bundle "jgdavey/vim-turbux"
" Bundle "astashov/vim-ruby-debugger"


" Html, Xml, Css, Markdown
Bundle "groenewege/vim-less.git"
Bundle "mattn/emmet-vim"
Bundle "tpope/vim-haml"
Bundle "tpope/vim-markdown"
Bundle "digitaltoad/vim-jade"
Bundle "wavded/vim-stylus"
Bundle "briancollins/vim-jst"
" Bundle "ap/vim-css-color"

" Git related...
Bundle "mattn/gist-vim"
Bundle "tpope/vim-fugitive"
Bundle "tpope/vim-git"
Bundle "gregsexton/gitv"
Bundle "airblade/vim-gitgutter"

" autocompletion, snippets
Bundle "ervandew/supertab"
Bundle "garbas/vim-snipmate.git"
Bundle "honza/vim-snippets"
" Bundle "Shougo/neocomplcache.git"
" Bundle "Valloric/YouCompleteMe"

" General text editing improvements...
Bundle "Raimondi/delimitMate"
Bundle "godlygeek/tabular"
Bundle "tpope/vim-commentary"
Bundle "scrooloose/nerdcommenter"
Bundle "tpope/vim-surround.git"
Bundle "vim-scripts/AutoTag.git"
" Bundle "tomtom/tcomment_vim.git"
" Bundle "vim-scripts/matchit.zip.git"
" Bundle "align"
" Bundle "terryma/vim-multiple-cursors"

" motions
Bundle "justinmk/vim-sneak"
Bundle "Lokaltog/vim-easymotion"
" Bundle "vim-scripts/camelcasemotion.git"

" General vim improvements
Bundle "scrooloose/syntastic.git"
Bundle "tpope/vim-endwise.git"
Bundle "tpope/vim-repeat.git"
Bundle "sjl/gundo.vim"
Bundle "mattn/webapi-vim.git"
" Bundle "jistr/vim-nerdtree-tabs.git"
" Bundle "tomtom/tlib_vim.git"
" Bundle "tpope/vim-ragtag"
" Bundle "tpope/vim-unimpaired"
" Bundle "xsunsmile/showmarks.git"
" Bundle "nathanaelkane/vim-indent-guides"

" File system/Project navigation/Search
Bundle "kien/ctrlp.vim"
Bundle "majutsushi/tagbar.git"
Bundle "scrooloose/nerdtree.git"
Bundle "mileszs/ack.vim"
Bundle "rking/ag.vim"
" Bundle "tpope/vim-vinegar"

" TMUX
Bundle "benmills/vimux"
Bundle 'christoomey/vim-tmux-navigator'
" Bundle "jpalardy/vim-slime"

" Text objects
" Bundle "kana/vim-textobj-function"
" Bundle "kana/vim-textobj-user"
" Bundle "nelstrom/vim-textobj-rubyblock"
" Bundle "thinca/vim-textobj-function-javascript"
" Bundle "vim-scripts/argtextobj.vim"

" Cosmetics, color scheme, Powerline...
Bundle "bling/vim-airline.git"
Bundle "ScrollColors"
" Bundle "vim-scripts/TagHighlight.git"
" Bundle "altercation/vim-colors-solarized"

" SuperTab dependencies
Bundle "MarcWeber/vim-addon-mw-utils"
Bundle "tomtom/tlib_vim"

" Filetype plugin indent on is required by vundle
filetype plugin indent on

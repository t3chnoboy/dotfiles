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

" Ruby, Rails, Rake...
Bundle "ecomba/vim-ruby-refactoring"
Bundle "tpope/vim-rails.git"
Bundle "tpope/vim-rake.git"
Bundle "tpope/vim-rvm.git"
Bundle "vim-ruby/vim-ruby.git"
"Bundle "astashov/vim-ruby-debugger"
Bundle "tpope/vim-bundler"


" Html, Xml, Css, Markdown, javascript...
Bundle "groenewege/vim-less.git"
Bundle "pangloss/vim-javascript"
Bundle "itspriddle/vim-jquery.git"
Bundle "kchmck/vim-coffee-script"
Bundle "mattn/emmet-vim"
Bundle "tpope/vim-haml"
Bundle "skammer/vim-css-color"
Bundle "tpope/vim-markdown"

" Git related...
Bundle "mattn/gist-vim"
Bundle "tpope/vim-fugitive"
Bundle "tpope/vim-git"
"Bundle "gregsexton/gitv"
"Bundle "airblade/vim-gitgutter"

" General text editing improvements...
Bundle "Raimondi/delimitMate"
"Bundle "Shougo/neocomplcache.git"
Bundle "garbas/vim-snipmate.git"
Bundle "godlygeek/tabular"
Bundle "honza/vim-snippets"
Bundle "Lokaltog/vim-easymotion"
Bundle "tpope/vim-commentary"
"Bundle "terryma/vim-multiple-cursors"
Bundle "scrooloose/nerdcommenter"
"Bundle "Valloric/YouCompleteMe"
"Bundle "tomtom/tcomment_vim.git"
"Bundle "vim-scripts/camelcasemotion.git"
"Bundle "vim-scripts/matchit.zip.git"
Bundle "ervandew/supertab"
Bundle "align"

" General vim improvements
Bundle "MarcWeber/vim-addon-mw-utils.git"
Bundle "kien/ctrlp.vim"
Bundle "majutsushi/tagbar.git"
Bundle "scrooloose/nerdtree.git"
Bundle "scrooloose/syntastic.git"
Bundle "tpope/vim-endwise.git"
Bundle "tpope/vim-repeat.git"
Bundle "tpope/vim-surround.git"
Bundle "sjl/gundo.vim"
Bundle "vim-scripts/AutoTag.git"
"Bundle "jistr/vim-nerdtree-tabs.git"
"Bundle "mattn/webapi-vim.git"
"Bundle "tomtom/tlib_vim.git"
"Bundle "tpope/vim-ragtag"
"Bundle "tpope/vim-unimpaired"
"Bundle "xsunsmile/showmarks.git"
"Bundle "nathanaelkane/vim-indent-guides"

" Text objects
"Bundle "kana/vim-textobj-function"
"Bundle "kana/vim-textobj-user"
"Bundle "nelstrom/vim-textobj-rubyblock"
"Bundle "thinca/vim-textobj-function-javascript"
"Bundle "vim-scripts/argtextobj.vim"

" Cosmetics, color scheme, Powerline...
"Bundle "bling/vim-airline.git"
"Bundle "vim-scripts/TagHighlight.git"
Bundle "altercation/vim-colors-solarized"
Bundle "ScrollColors"

"SuperTab dependencies
Bundle "MarcWeber/vim-addon-mw-utils"
Bundle "tomtom/tlib_vim"

"Filetype plugin indent on is required by vundle
filetype plugin indent on

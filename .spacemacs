;; -*- mode: emacs-lisp -*-
;; This file is loaded by Spacemacs at startup.
;; It must be stored in your home directory.

(defun dotspacemacs/layers ()
  "Configuration Layers declaration.
You should not put any user code in this function besides modifying the variable
values."
  (setq-default
   ;; Base distribution to use. This is a layer contained in the directory
   ;; `+distribution'. For now available distributions are `spacemacs-base'
   ;; or `spacemacs'. (default 'spacemacs)
   dotspacemacs-distribution 'spacemacs
   ;; List of additional paths where to look for configuration layers.
   ;; Paths must have a trailing slash (i.e. `~/.mycontribs/')
   ;; dotspacemacs-configuration-layer-path '("~/.dotfiles/.emacs.d/private/")
   ;; List of configuration layers to load. If it is the symbol `all' instead
   ;; of a list then all discovered layers will be installed.
   dotspacemacs-configuration-layers '(
                                       csv
                                       t3chnoboy ;; k8s, thrift
                                       python
                                       ;; prodigy-config
                                       ;; evil-snipe
                                       purescript
                                       typescript
                                       java
                                       kotlin
                                       parinfer
                                       osx
                                       helm
                                       (auto-completion :variables
                                                        auto-completion-return-key-behavior 'complete
                                                        auto-completion-enable-snippets-in-popup t
                                                        auto-completion-enable-help-tooltip t
                                                        auto-completion-enable-sort-by-usage t
                                                        auto-completion-tab-key-behavior 'cycle)
                                       emacs-lisp
                                       ;; org
                                       syntax-checking
                                       docker
                                       shell-scripts
                                       ;; vim-empty-lines  - causes lags :(
                                       protobuf
                                       version-control
                                       evil-commentary
                                       better-defaults
                                       ;; xkcd
                                       (haskell :variables
                                                haskell-process-type 'stack-ghci
                                                haskell-enable-ghci-ng-support t)
                                       erlang
                                       elixir
                                       javascript
                                       ;; (javascript :variables
                                       ;;             javascript-disable-tern-port-files nil)
                                       react
                                       (scala :variables
                                              scala-auto-start-ensime nil)
                                       (shell :variables
                                              shell-default-term-shell "/usr/local/bin/fish")
                                       ;; games
                                       ;; emoji
                                       ;; latex
                                       ;; ess
                                       html
                                       (go :variables go-tab-width 2)
                                       tmux
                                       (ruby :variables
                                             ruby-version-manager 'rbenv
                                             ruby-test-runner 'rspec)
                                       ruby-on-rails
                                       ;; finance
                                       ;; prodigy
                                       (markdown :variables markdown-live-preview-engine 'vmd)
                                       clojure
                                       sql
                                       (git :variables
                                            git-magit-status-fullscreen t
                                            git-enable-github-support t
                                            git-gutter-use-fringe t)
                                       github
                                       restclient
                                       colors
                                       ;; vim-powerline
                                       ;; evil-cleverparens
                                       yaml
                                       terraform
                                       ;; vagrant
                                       nginx
                                       ;; extra-langs
                                       ;; major-modes
                                       themes-megapack)

   ;; dotspacemacs-enable-lazy-installation 'all
   ;; List of additional packages that will be installed without being
   ;; wrapped in a layer. If you need some configuration for these
   ;; packages then consider to create a layer, you can also put the
   ;; configuration in `dotspacemacs/config'.
   dotspacemacs-additional-packages '(all-the-icons
                                      evil-terminal-cursor-changer)
   ;; visual-regexp
   ;; visual-regexp-steroids

   ;; A list of packages and/or extensions that will not be install and loaded.
   ;; dotspacemacs-excluded-packages '(pbcopy)
   ;; dotspacemacs-excluded-packages '(pbcopy evil-unimpaired)
   dotspacemacs-excluded-packages '(evil-unimpaired
                                    tronesque-theme
                                    wolfram-mode
                                    zonokai-theme)
   ;; If non-nil spacemacs will delete any orphan packages, i.e. packages that
   ;; are declared in a layer which is not a member of
   ;; the list `dotspacemacs-configuration-layers'. (default t)
   dotspacemacs-delete-orphan-packages t))

(defun dotspacemacs/init ()
  "Initialization function.
This function is called at the very startup of Spacemacs initialization
before layers configuration.
You should not put any user code in there besides modifying the variable
values."
  ;; This setq-default sexp is an exhaustive list of all the supported
  ;; spacemacs settings.
  (setq-default
   ;; If non nil ELPA repositories are contacted via HTTPS whenever it's
   ;; possible. Set it to nil if you have no way to use HTTPS in your
   ;; environment, otherwise it is strongly recommended to let it set to t.
   ;; This variable has no effect if Emacs is launched with the parameter
   ;; `--insecure' which forces the value of this variable to nil.
   ;; (default t)
   dotspacemacs-elpa-https t
   ;; Maximum allowed time in seconds to contact an ELPA repository.
   dotspacemacs-elpa-timeout 10
   ;; If non nil then spacemacs will check for updates at startup
   ;; when the current branch is not `develop'. (default t)
   dotspacemacs-check-for-update t
   ;; One of `vim', `emacs' or `hybrid'.
   ;; `hybrid' is like `vim' except that `insert state' is replaced by the
   ;; `hybrid state' with `emacs' key bindings. The value can also be a list
   ;; with `:variables' keyword (similar to layers). Check the editing styles
   ;; section of the documentation for details on available variables.
   ;; (default 'vim)
   dotspacemacs-editing-style 'vim
   ;; If non nil output loading progress in `*Messages*' buffer. (default nil)
   dotspacemacs-verbose-loading nil
   ;; Specify the startup banner. Default value is `official', it displays
   ;; the official spacemacs logo. An integer value is the index of text
   ;; banner, `random' chooses a random text banner in `core/banners'
   ;; directory. A string value must be a path to an image format supported
   ;; by your Emacs build.
   ;; If the value is nil then no banner is displayed. (default 'official)
   dotspacemacs-startup-banner 'official
   ;; List of items to show in startup buffer or an association list of of
   ;; the form `(list-type . list-size)`. If nil it is disabled.
   ;; Possible values for list-type are:
   ;; `recents' `bookmarks' `projects' `agenda' `todos'."
   dotspacemacs-startup-lists '((recents . 5)
                                (projects . 7))
   ;; Default major mode of the scratch buffer (default `text-mode')
   dotspacemacs-scratch-mode 'text-mode
   ;; List of themes, the first of the list is loaded when spacemacs starts.
   ;; Press <SPC> T n to cycle to the next theme in the list (works great
   ;; with 2 themes variants, one dark and one light)
   dotspacemacs-themes '(
                         majapahit-dark
                         molokai
                         tronesque
                         zonokai-blue
                         twilight-bright
                         fogus
                         underwater
                         apropospriate-light
                         gotham
                         flatui
                         hemisu-light
                         hc-zenburn
                         spolsky
                         spacemacs-dark
                         spacemacs-light
                         solarized-light
                         solarized-dark
                         leuven
                         monokai
                         zenburn)
   ;; If non nil the cursor color matches the state color in GUI Emacs.
   dotspacemacs-colorize-cursor-according-to-state t
   ;; Default font, or prioritized list of fonts. `powerline-scale' allows to
   ;; quickly tweak the mode-line size to make separators look not too crappy.
   ;; dotspacemacs-default-font '("Source Code Pro"
   ;;                             :size 13
   ;;                             :weight normal
   ;;                             :width normal
   ;;                             :powerline-scale 1.1)
   dotspacemacs-default-font '("Pragmata Pro"
                               :size 14
                               :weight normal
                               :width normal)
   ;; The leader key
   dotspacemacs-leader-key "SPC"
   ;; The leader key accessible in `emacs state' and `insert state'
   ;; (default "M-m")
   dotspacemacs-emacs-leader-key "M-m"
   ;; Major mode leader key is a shortcut key which is the equivalent of
   ;; pressing `<leader> m`. Set it to `nil` to disable it. (default ",")
   dotspacemacs-major-mode-leader-key ","
   ;; Major mode leader key accessible in `emacs state' and `insert state'.
   ;; (default "C-M-m)
   dotspacemacs-major-mode-emacs-leader-key "C-M-m"
   ;; The key used for Emacs commands (M-x) (after pressing on the leader key).
   ;; (default "SPC")
   dotspacemacs-emacs-command-key "SPC"
   ;; These variables control whether separate commands are bound in the GUI to
   ;; the key pairs C-i, TAB and C-m, RET.
   ;; Setting it to a non-nil value, allows for separate commands under <C-i>
   ;; and TAB or <C-m> and RET.
   ;; In the terminal, these pairs are generally indistinguishable, so this only
   ;; works in the GUI. (default nil)
   dotspacemacs-distinguish-gui-tab nil
   ;; If non nil `Y' is remapped to `y$' in Evil states. (default nil)
   dotspacemacs-remap-Y-to-y$ t
   ;; If non-nil, the shift mappings `<' and `>' retain visual state if used
   ;; there. (default t)
   dotspacemacs-retain-visual-state-on-shift t
   ;; If non-nil, J and K move lines up and down when in visual mode.
   ;; (default nil)
   dotspacemacs-visual-line-move-text t
   ;; If non nil, inverse the meaning of `g' in `:substitute' Evil ex-command.
   ;; (default nil)
   dotspacemacs-ex-substitute-global t
   ;; Name of the default layout (default "Default")
   dotspacemacs-default-layout-name "Default"
   ;; If non nil the default layout name is displayed in the mode-line.
   ;; (default nil)
   dotspacemacs-display-default-layout nil
   ;; If non nil then the last auto saved layouts are resume automatically upon
   ;; start. (default nil)
   dotspacemacs-auto-resume-layouts nil
   ;; Size (in MB) above which spacemacs will prompt to open the large file
   ;; literally to avoid performance issues. Opening a file literally means that
   ;; no major mode or minor modes are active. (default is 1)
   dotspacemacs-large-file-size 1
   ;; Location where to auto-save files. Possible values are `original' to
   ;; auto-save the file in-place, `cache' to auto-save the file to another
   ;; file stored in the cache directory and `nil' to disable auto-saving.
   ;; (default 'cache)
   dotspacemacs-auto-save-file-location 'cache
   ;; Maximum number of rollback slots to keep in the cache. (default 5)
   dotspacemacs-max-rollback-slots 5
   ;; If non nil, `helm' will try to minimize the space it uses. (default nil)
   dotspacemacs-helm-resize nil
   ;; if non nil, the helm header is hidden when there is only one source.
   ;; (default nil)
   dotspacemacs-helm-no-header nil
   ;; define the position to display `helm', options are `bottom', `top',
   ;; `left', or `right'. (default 'bottom)
   dotspacemacs-helm-position 'bottom
   ;; If non nil the paste micro-state is enabled. When enabled pressing `p`
   ;; several times cycle between the kill ring content. (default nil)
   dotspacemacs-enable-paste-transient-state t
   ;; Which-key delay in seconds. The which-key buffer is the popup listing
   ;; the commands bound to the current keystroke sequence. (default 0.4)
   dotspacemacs-which-key-delay 0.4
   ;; Which-key frame position. Possible values are `right', `bottom' and
   ;; `right-then-bottom'. right-then-bottom tries to display the frame to the
   ;; right; if there is insufficient space it displays it at the bottom.
   ;; (default 'bottom)
   dotspacemacs-which-key-position 'bottom
   ;; If non nil a progress bar is displayed when spacemacs is loading. This
   ;; may increase the boot time on some systems and emacs builds, set it to
   ;; nil to boost the loading time. (default t)
   dotspacemacs-loading-progress-bar t
   ;; If non nil the frame is fullscreen when Emacs starts up. (default nil)
   ;; (Emacs 24.4+ only)
   dotspacemacs-fullscreen-at-startup nil
   ;; If non nil `spacemacs/toggle-fullscreen' will not use native fullscreen.
   ;; Use to disable fullscreen animations in OSX. (default nil)
   dotspacemacs-fullscreen-use-non-native nil
   ;; If non nil the frame is maximized when Emacs starts up.
   ;; Takes effect only if `dotspacemacs-fullscreen-at-startup' is nil.
   ;; (default nil) (Emacs 24.4+ only)
   dotspacemacs-maximized-at-startup nil
   ;; A value from the range (0..100), in increasing opacity, which describes
   ;; the transparency level of a frame when it's active or selected.
   ;; Transparency can be toggled through `toggle-transparency'. (default 90)
   dotspacemacs-active-transparency 90
   ;; A value from the range (0..100), in increasing opacity, which describes
   ;; the transparency level of a frame when it's inactive or deselected.
   ;; Transparency can be toggled through `toggle-transparency'. (default 90)
   dotspacemacs-inactive-transparency 90
   ;; If non nil show the titles of transient states. (default t)
   dotspacemacs-show-transient-state-title t
   ;; If non nil show the color guide hint for transient state keys. (default t)
   dotspacemacs-show-transient-state-color-guide t
   ;; If non nil unicode symbols are displayed in the mode line. (default t)
   dotspacemacs-mode-line-unicode-symbols t
   ;; If non nil smooth scrolling (native-scrolling) is enabled. Smooth
   ;; scrolling overrides the default behavior of Emacs which recenters point
   ;; when it reaches the top or bottom of the screen. (default t)
   dotspacemacs-smooth-scrolling t
   ;; If non nil line numbers are turned on in all `prog-mode' and `text-mode'
   ;; derivatives. If set to `relative', also turns on relative line numbers.
   ;; (default nil)
   dotspacemacs-line-numbers nil
   ;; Code folding method. Possible values are `evil' and `origami'.
   ;; (default 'evil)
   dotspacemacs-folding-method 'evil
   ;; If non-nil smartparens-strict-mode will be enabled in programming modes.
   ;; (default nil)
   dotspacemacs-smartparens-strict-mode nil
   ;; If non-nil pressing the closing parenthesis `)' key in insert mode passes
   ;; over any automatically added closing parenthesis, bracket, quote, etc…
   ;; This can be temporary disabled by pressing `C-q' before `)'. (default nil)
   dotspacemacs-smart-closing-parenthesis t
   ;; Select a scope to highlight delimiters. Possible values are `any',
   ;; `current', `all' or `nil'. Default is `all' (highlight any scope and
   ;; emphasis the current one). (default 'all)
   dotspacemacs-highlight-delimiters 'all
   ;; If non nil advises quit functions to keep server open when quitting.
   ;; (default nil)
   dotspacemacs-persistent-server nil
   ;; List of search tool executable names. Spacemacs uses the first installed
   ;; tool of the list. Supported tools are `ag', `pt', `ack' and `grep'.
   ;; (default '("ag" "pt" "ack" "grep"))
   dotspacemacs-search-tools '("rg" "ag" "pt" "ack" "grep")
   ;; The default package repository used if no explicit repository has been
   ;; specified with an installed package.
   ;; Not used for now. (default nil)
   dotspacemacs-default-package-repository nil
   ;; Delete whitespace while saving buffer. Possible values are `all'
   ;; to aggressively delete empty line and long sequences of whitespace,
   ;; `trailing' to delete only the whitespace at end of lines, `changed'to
   ;; delete only whitespace for changed lines or `nil' to disable cleanup.
   ;; (default nil)
   dotspacemacs-whitespace-cleanup 'all
   ))

(defun dotspacemacs/user-init ()
  "Initialization function for user code.
It is called immediately after `dotspacemacs/init'.  You are free to put any
user code."
  (setq configuration-layer-elpa-archives '(("melpa" . "melpa.org/packages/")
                                            ("org" . "orgmode.org/elpa/") ("gnu" . "elpa.gnu.org/packages/")))

  ;; (add-hook 'react-mode-hook 'emmet-mode)
  (setq cider-cljs-lein-repl
        "(do (require 'figwheel-sidecar.repl-api)
           (figwheel-sidecar.repl-api/start-figwheel!)
           (figwheel-sidecar.repl-api/cljs-repl))")

  (setq-default org-agenda-files '("~/Documents/org"))
  ;; Persistent undo
  (setq undo-tree-auto-save-history t)
  (setq undo-tree-auto-save-history t
        undo-tree-history-directory-alist
        `(("." . ,(concat spacemacs-cache-directory "undo"))))
  (unless (file-exists-p (concat spacemacs-cache-directory "undo"))
    (make-directory (concat spacemacs-cache-directory "undo")))

  ;; (push '("melpa-stable" . "stable.melpa.org/packages/") configuration-layer--elpa-archives)
  ;; (push '(ensime . "melpa-stable") package-pinned-packages)

  (setq magithub-api-timeout 30)
  )

(defun dotspacemacs/user-config ()
  "Configuration function for user code.
 This function is called at the very end of Spacemacs initialization after
layers configuration. You are free to put any user code."

  (setq require-final-newline t
        mode-require-final-newline t)

  ;; (require 'ensime)
  (setq magit-repository-directories '("~/Developer/"))
  (global-git-commit-mode t)

  (setq vc-follow-symlinks t)

  (setq powerline-default-separator nil)

  (setq neo-theme (if (display-graphic-p) 'icons 'arrow))
  ;; (setq neo-theme 'icons)
  (setq neo-show-hidden-files nil)
  (define-key evil-normal-state-map "+" 'evil-numbers/inc-at-pt)
  (define-key evil-normal-state-map "-" 'evil-numbers/dec-at-pt)
  (fancy-battery-mode)
  (setq-default
   ;; js2-mode
   js2-basic-offset 2
   js2-highlight-level 3
   js2-strict-missing-semi-warning nil
   js2-strict-trailing-comma-warning nil
   ;; web-mode
   css-indent-offset 2
   web-mode-markup-indent-offset 2
   web-mode-css-indent-offset 2
   web-mode-code-indent-offset 2
   web-mode-attr-indent-offset 2)

  (setq
   ensime-startup-notification nil
   ensime-startup-snapshot-notification nil
   )

  (setq-default flycheck-scalastylerc "/usr/local/etc/scalastyle_config.xml")

  (with-eval-after-load 'web-mode
    (add-to-list 'web-mode-indentation-params '("lineup-args" . nil))
    (add-to-list 'web-mode-indentation-params '("lineup-concats" . nil))
    (add-to-list 'web-mode-indentation-params '("lineup-calls" . nil)))
  ;; (spacemacs/toggle-automatic-symbol-highlight-on)
  (add-to-list 'auto-mode-alist '("\\.js\\'" . react-mode))

  (add-to-list 'auto-mode-alist '("\\.libsonnet\\'" . jsonnet-mode))

  (setq evil-visual-state-cursor 'box); █
  (setq evil-insert-state-cursor 'bar); ⎸
  (setq evil-normal-state-cursor 'hbar); _

  (unless (display-graphic-p)
    (require 'evil-terminal-cursor-changer)
    (evil-terminal-cursor-changer-activate) ; or (etcc-on)
    )

  (spacemacs/set-leader-keys
    "bk"  'ido-kill-buffer)

  (unless (display-graphic-p (selected-frame))
    (set-face-background 'default "unspecified-bg" (selected-frame)))

  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;STATUSLINE CI;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  ;; (require 'magithub-ci)

  ;; (spacemacs/set-leader-keys "oci" 'magithub-ci-visit)

  ;; (defvar ci-last-status nil
  ;;   "Last ci status")

  ;; (defface ci-status-failure-face '((t :inherit error))
  ;;   "Face for critical battery status"
  ;;   :group 'ci-status)

  ;; (defface ci-status-success-face '((t :inherit success))
  ;;   "Face for charging battery status."
  ;;   :group 'ci-status)

  ;; (defface ci-status-pending-face '((t :inherit warning))
  ;;   "Face for charging battery status."
  ;;   :group 'ci-status)

  ;; (defun ci-status-face (ci-status)
  ;;   "Returns face for ci status"
  ;;   (pcase ci-status
  ;;     ('success 'ci-status-success-face)
  ;;     ('pending 'ci-status-pending-face)
  ;;     ('failure 'ci-status-failure-face)
  ;;     ('error   'ci-status-failure-face)
  ;;     (_        'bold)))

  ;; (defun ci-status-message (ci-status)
  ;;   "Returns face for ci status"
  ;;   (pcase ci-status
  ;;     ('success "✔")
  ;;     ('pending "●")
  ;;     ('failure "✖")
  ;;     ('error   "✖")
  ;;     (_        "-")))

  ;; (defun ci-status-applicable (ci-status)
  ;;   (member ci-status '(success pending error failure)))

  ;; (spaceline-define-segment ci-status
  ;;   "Displays current commit ci status"
  ;;   (when ci-last-status
  ;;     (let* ((status-message (ci-status-message ci-last-status))
  ;;            (status-face (ci-status-face ci-last-status)))
  ;;       (propertize
  ;;        (concat "ci:" status-message) 'face status-face))))

  ;; (defun ci-status-update ()
  ;;   "Update ci-status"
  ;;   (when (and (magithub-ci-enabled-p)
  ;;              (magithub-usable-p)))
  ;;   (let* ((checks (magithub-ci-status))
  ;;          (status (if (consp checks) (plist-get (car checks) :status) checks)))
  ;;     (setq ci-last-status
  ;;           (if (ci-status-applicable status) status nil))))

  ;; (spaceline-spacemacs-theme 'ci-status)

  ;; (run-with-timer 0 30 'ci-status-update)
  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

  ;; (define-key evil-normal-state-map "p" 'spacemacs/paste)
  ;; (define-key evil-normal-state-map "P" 'spacemacs/paste-transient-state/evil-paste-before)
  (spacemacs|define-transient-state my-paste
    :title "Pasting Transient State"
    :doc "\n[%s(length kill-ring-yank-pointer)/%s(length kill-ring)] \
[_C-n_/_C-p_] cycles through yanked text, [_p_/_P_] pastes the same text above or \
below. Anything else exits."
        :bindings
        ("C-n" evil-paste-pop)
        ("C-p" evil-paste-pop-next)
        ("p" evil-paste-after)
        ("P" evil-paste-before)
        ("0" spacemacs//transient-state-0))
(define-key evil-normal-state-map "p" 'spacemacs/my-paste-transient-state/evil-paste-after)
(define-key evil-normal-state-map "P" 'spacemacs/my-paste-transient-state/evil-paste-before)

(defun on-frame-open (&optional frame)
  "If the FRAME created in terminal don't load background color."
  (unless (display-graphic-p frame)
    (set-face-background 'default "unspecified-bg" frame)))

(add-hook 'after-make-frame-functions 'on-frame-open)

(custom-theme-set-faces
 'majapahit-dark
 '(font-lock-comment-face ((t (:foreground "#DFAF8F")))))
)

;; Do not write anything past this comment. This is where Emacs will
;; auto-generate custom variable definitions.
(defun dotspacemacs/emacs-custom-settings ()
  "Emacs custom settings.
This is an auto-generated function, do not modify its content directly, use
Emacs customize menu instead.
This function is called at the very end of Spacemacs initialization."
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
   (quote
    (terraform-mode hcl-mode ob-elixir godoctor go-tag go-rename go-guru go-eldoc flycheck-mix flycheck-credo counsel-projectile counsel swiper ivy company-go go-mode alchemist elixir-mode zenburn-theme zen-and-art-theme yasnippet-snippets yapfify yaml-mode xterm-color ws-butler winum white-sand-theme which-key web-mode web-beautify volatile-highlights vmd-mode vi-tilde-fringe uuidgen use-package unfill underwater-theme ujelly-theme twilight-theme twilight-bright-theme twilight-anti-bright-theme toxi-theme toc-org tide thrift tao-theme tangotango-theme tango-plus-theme tango-2-theme tagedit symon sunny-day-theme sublime-themes subatomic256-theme subatomic-theme string-inflection sql-indent spaceline-all-the-icons spacegray-theme soothe-theme solarized-theme soft-stone-theme soft-morning-theme soft-charcoal-theme smyx-theme smeargle slim-mode shell-pop seti-theme scss-mode sayid sass-mode rvm ruby-tools ruby-test-mode ruby-refactor ruby-hash-syntax rubocop rspec-mode robe reverse-theme reveal-in-osx-finder restclient-helm restart-emacs rebecca-theme rbenv rainbow-mode rainbow-identifiers rainbow-delimiters railscasts-theme pyvenv pytest pyenv-mode py-isort purple-haze-theme pug-mode psci psc-ide protobuf-mode projectile-rails professional-theme popwin planet-theme pippel pip-requirements phoenix-dark-pink-theme phoenix-dark-mono-theme persp-mode pbcopy password-generator parinfer paradox overseer osx-trash osx-dictionary organic-green-theme org-bullets open-junk-file omtose-phellack-theme oldlace-theme occidental-theme obsidian-theme ob-restclient ob-http noflet noctilux-theme nginx-mode neotree naquadah-theme nameless mwim mvn mustang-theme multi-term move-text monokai-theme monochrome-theme molokai-theme moe-theme mmm-mode minitest minimal-theme meghanada maven-test-mode material-theme markdown-toc majapahit-theme magit-gitflow magit-gh-pulls madhat2r-theme macrostep lush-theme lorem-ipsum livid-mode live-py-mode linum-relative link-hint light-soap-theme less-css-mode launchctl kubernetes-evil kotlin-mode jsonnet-mode js2-refactor js-doc jbeans-theme jazz-theme ir-black-theme intero insert-shebang inkpot-theme info+ indent-guide importmagic impatient-mode hy-mode hungry-delete hlint-refactor hl-todo hindent highlight-parentheses highlight-numbers highlight-indentation hide-comnt heroku-theme hemisu-theme help-fns+ helm-themes helm-swoop helm-pydoc helm-purpose helm-projectile helm-mode-manager helm-make helm-hoogle helm-gitignore helm-flx helm-descbinds helm-css-scss helm-company helm-c-yasnippet helm-ag hc-zenburn-theme haskell-snippets gruvbox-theme gruber-darker-theme groovy-mode groovy-imports grandshell-theme gradle-mode gotham-theme google-translate golden-ratio github-search github-clone gitconfig-mode gitattributes-mode git-timemachine git-messenger git-link git-gutter-fringe git-gutter-fringe+ gist gh-md gandalf-theme fuzzy flycheck-pos-tip flycheck-kotlin flycheck-haskell flycheck-bashate flx-ido flatui-theme flatland-theme fish-mode fill-column-indicator feature-mode farmhouse-theme fancy-battery eyebrowse expand-region exotica-theme exec-path-from-shell evil-visualstar evil-visual-mark-mode evil-tutor evil-terminal-cursor-changer evil-surround evil-search-highlight-persist evil-numbers evil-mc evil-matchit evil-magit evil-lisp-state evil-lion evil-indent-plus evil-iedit-state evil-exchange evil-escape evil-ediff evil-commentary evil-cleverparens evil-args evil-anzu espresso-theme eshell-z eshell-prompt-extras esh-help erlang ensime emmet-mode elisp-slime-nav editorconfig dumb-jump dracula-theme dockerfile-mode docker django-theme diminish diff-hl darktooth-theme darkokai-theme darkmine-theme darkburn-theme dante dakrone-theme cython-mode cyberpunk-theme csv-mode company-web company-tern company-statistics company-shell company-restclient company-quickhelp company-ghci company-ghc company-emacs-eclim company-cabal company-anaconda column-enforce-mode color-theme-sanityinc-tomorrow color-theme-sanityinc-solarized color-identifiers-mode coffee-mode cmm-mode clues-theme clojure-snippets clojure-cheatsheet clj-refactor clean-aindent-mode cider-eval-sexp-fu chruby cherry-blossom-theme busybee-theme bundler bubbleberry-theme browse-at-remote birds-of-paradise-plus-theme badwolf-theme auto-yasnippet auto-highlight-symbol auto-compile apropospriate-theme anti-zenburn-theme ample-zen-theme ample-theme alect-themes aggressive-indent afternoon-theme adaptive-wrap ace-window ace-link ace-jump-helm-line ac-ispell)))
 '(paradox-github-token t))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(default ((t (:background nil)))))
)

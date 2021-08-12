;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-

;; Place your private configuration here! Remember, you do not need to run 'doom
;; sync' after modifying this file!


;; Some functionality uses this to identify you, e.g. GPG configuration, email
;; clients, file templates and snippets.
(setq user-full-name "not dmitry"
      user-mail-address "")

;; Doom exposes five (optional) variables for controlling fonts in Doom. Here
;; are the three important ones:
;;
;; + `doom-font'
;; + `doom-variable-pitch-font'
;; + `doom-big-font' -- used for `doom-big-font-mode'; use this for
;;   presentations or streaming.
;;
;; They all accept either a font-spec, font string ("Input Mono-12"), or xlfd
;; font string. You generally only need these two:
;; (setq doom-font (font-spec :family "monospace" :size 12 :weight 'semi-light)
;;       doom-variable-pitch-font (font-spec :family "sans" :size 13))

;; There are two ways to load a theme. Both assume the theme is installed and
;; available. You can either set `doom-theme' or manually load a theme with the
;; `load-theme' function. This is the default:
(setq doom-theme 'doom-one)

;; If you use `org' and don't want your org files in the default location below,
;; change `org-directory'. It must be set before org loads!
(setq org-directory "~/org/")

;; This determines the style of line numbers in effect. If set to `nil', line
;; numbers are disabled. For relative line numbers, set this to `relative'.
(setq display-line-numbers-type nil)

;; Here are some additional functions/macros that could help you configure Doom:
;;
;; - `load!' for loading external *.el files relative to this one
;; - `use-package!' for configuring packages
;; - `after!' for running code after a package has loaded
;; - `add-load-path!' for adding directories to the `load-path', relative to
;;   this file. Emacs searches the `load-path' when you load packages with
;;   `require' or `use-package'.
;; - `map!' for binding new keys
;;
;; To get information about any of these functions/macros, move the cursor over
;; the highlighted symbol at press 'K' (non-evil users must press 'C-c c k').
;; This will open documentation for it, including demos of how they are used.
;;
;; You can also try 'gd' (or 'C-c c d') to jump to their definition and see how
;; they are implemented.

(setq confirm-kill-emacs nil)

(global-subword-mode 1)

(after! evil-snipe
  (map! :v "s" #'evil-surround-region))

(after! ivy
  (setq ivy-use-virtual-buffers t))

(after! evil-terminal-cursor-changer
  (setq evil-visual-state-cursor 'box); █
  (setq evil-insert-state-cursor 'bar); ⎸
  (setq evil-normal-state-cursor 'hbar); _
  )

(custom-set-faces!
  '(flycheck-error  :foreground "red" :underline (:color "red") :weight bold))

;; (use-package! tmux-pane
;;   :init (tmux-pane-mode))

(defun spacemacs/alternate-buffer (&optional window)
  "Switch back and forth between current and last buffer in the
current window."
  (interactive)
  (let ((current-buffer (window-buffer window))
        (buffer-predicate
         (frame-parameter (window-frame window) 'buffer-predicate)))
    ;; switch to first buffer previously shown in this window that matches
    ;; frame-parameter `buffer-predicate'
    (switch-to-buffer
     (or (cl-find-if (lambda (buffer)
                       (and (not (eq buffer current-buffer))
                            (or (null buffer-predicate)
                                (funcall buffer-predicate buffer))))
                     (mapcar #'car (window-prev-buffers window)))
         ;; `other-buffer' honors `buffer-predicate' so no need to filter
         (other-buffer current-buffer t)))))

(map! :leader
      :desc    "Previous buffer"     "TAB"   #'spacemacs/alternate-buffer
      :desc    "Project search"      "/"     #'+default/search-project
      :desc    "Toggle file tree"    "f t"   #'neotree-toggle
      :desc    "Command search"      "SPC"   #'counsel-M-x
      :desc    "Switch buffer"       "b b"   #'+ivy/switch-buffer
      :desc    "Open in browser"     "g l l" #'browse-at-remote
      :desc    "Git blame"           "g b"   #'magit-blame
      :desc    "Switch git branch"   "g B"   #'magit-checkout
      )

(setq typescript-indent-level              2
      typescript-expr-indent-offset        2
      web-mode-code-indent-offset          2
      web-mode-markup-indent-offset        2
      indent-tabs-mode nil
      js-indent-level 2
      )
(setq +format-with-lsp nil)

(custom-set-variables
 '(git-gutter:modified-sign "~"))

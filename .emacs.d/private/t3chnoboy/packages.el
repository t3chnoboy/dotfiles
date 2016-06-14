(defconst t3chnoboy-packages
  '(
    ;; osx-clipboard
    ;; skewer-mode
    ;; know-your-http-well
    ;; hackernews
    ;; clojure-cheatsheet
    ;; dockerfile-mode
    ;; sx
    ;; jade-mode
    ;; speed-type
    ;; helm-itunes
    ;; flycheck-clojure
    ;; org-jira
    ;; sass-mode
    ;; xkcd
    ;; clojure-snippets
    )
  "The list of Lisp packages required by the t3chnoboy layer.

Each entry is either:

1. A symbol, which is interpreted as a package to be installed, or

2. A list of the form (PACKAGE KEYS...), where PACKAGE is the
    name of the package to be installed or loaded, and KEYS are
    any number of keyword-value-pairs.

    The following keys are accepted:

    - :excluded (t or nil): Prevent the package from being loaded
      if value is non-nil

    - :location: Specify a custom installation location.
      The following values are legal:

      - The symbol `elpa' (default) means PACKAGE will be
        installed using the Emacs package manager.

      - The symbol `local' directs Spacemacs to load the file at
        `./local/PACKAGE/PACKAGE.el'

      - A list beginning with the symbol `recipe' is a melpa
        recipe.  See: https://github.com/milkypostman/melpa#recipe-format")

;; (defun t3chnoboy/init-osx-clipboard ()
;;        (use-package osx-clipboard
;;          :config
;;          (progn
;;            (osx-clipboard-mode +1)
;;                  (diminish 'osx-clipboard-mode))))
;;; packages.el ends here

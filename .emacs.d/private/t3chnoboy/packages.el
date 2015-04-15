(defvar t3chnoboy-packages
  '(
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
  "List of all packages to install and/or initialize. Built-in packages
which require an initialization must be listed explicitly in the list.")

(defvar t3chnoboy-excluded-packages '()
  "List of packages to exclude.")

;; For each package, define a function t3chnoboy/init-<package-my-config>
;;
;; (defun t3chnoboy/init-my-package ()
;;   "Initialize my package"
;;   )
;;
;; Often the body of an initialize function uses `use-package'
;; For more info on `use-package', see readme:
;; https://github.com/jwiegley/use-package

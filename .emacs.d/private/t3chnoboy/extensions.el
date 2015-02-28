(defvar t3chnoboy-pre-extensions
  '(
    ;; pre extension go here
    )
  "List of all extensions to load before the packages.")

(defvar t3chnoboy-post-extensions
  '(
    ;; post extension go here
    )
  "List of all extensions to load after the packages.")

;; For each extension, define a function t3chnoboy/init-<extension-t3chnoboy>
;;
;; (defun t3chnoboy/init-my-extension ()
;;   "Initialize my extension"
;;   )
;;
;; Often the body of an initialize function uses `use-package'
;; For more info on `use-package', see readme:
;; https://github.com/jwiegley/use-package

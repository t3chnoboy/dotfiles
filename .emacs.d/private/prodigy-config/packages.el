;;; packages.el --- prodigy-config layer packages file for Spacemacs.
;;
;; Copyright (c) 2012-2016 Sylvain Benner & Contributors
;;
;; Author: Dmitry Mazuro <t3chnoboy@MacBook-Pro-2.local>
;; URL: https://github.com/syl20bnr/spacemacs
;;
;; This file is not part of GNU Emacs.
;;
;;; License: GPLv3

;;; Commentary:

;; See the Spacemacs documentation and FAQs for instructions on how to implement
;; a new layer:
;;
;;   SPC h SPC layers RET
;;
;;
;; Briefly, each package to be installed or configured by this layer should be
;; added to `prodigy-config-packages'. Then, for each package PACKAGE:
;;
;; - If PACKAGE is not referenced by any other Spacemacs layer, define a
;;   function `prodigy-config/init-PACKAGE' to load and initialize the package.

;; - Otherwise, PACKAGE is already referenced by another Spacemacs layer, so
;;   define the functions `prodigy-config/pre-init-PACKAGE' and/or
;;   `prodigy-config/post-init-PACKAGE' to customize the package as it is loaded.

;;; Code:

(defconst prodigy-config-packages
  '(prodigy)
  "The list of Lisp packages required by the prodigy-config layer.

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

(defun prodigy-config/post-init-prodigy ()

  (prodigy-define-tag
    :name 'thin
    :ready-message "Listening on 0\\.0\\.0\\.0:[0-9]+, CTRL\\+C to stop")

  (prodigy-define-tag
    :name 'rails
    :tags '(thin))

  (prodigy-define-tag
    :name 'webpack
    :ready-message "webpack: bundle is now VALID")

  (prodigy-define-service
    :name "Postgres"
    :command "postgres"
    :args '("-D" "/usr/local/var/postgres")
    :ready-message "database system is ready to accept connections")

  (prodigy-define-service
    :name "Platform"
    :command "./run_platform.sh"
    :cwd "~/Developer/Projects/Work/expedite-scala"
    :ready-message "Flag log.async.maxsize already defined!")

  (prodigy-define-service
    :name "Redis"
    :command "redis-server"
    :cwd "~/Developer/Projects/Work/expedite-rails"
    :ready-message "The server is now ready to accept connections on port 6379")

  (prodigy-define-service
    :name "sidekiq"
    :command "bundle"
    :args '("exec" "sidekiq")
    :cwd "~/Developer/Projects/Work/expedite-rails"
    :ready-message "Starting processing, hit Ctrl-C to stop")

  (prodigy-define-service
    :name "Borrower rails server"
    :command "bundle"
    :args '("exec" "rails" "server" "-p" "3000" "-b" "0.0.0.0")
    :cwd "~/Developer/Projects/Work/expedite-rails"
    :env '(("USE_PLATFORM" "true"))
    :tags '(rails))

(prodigy-define-service
  :name "Borrower portal front-end"
  :command "npm"
  :args '("start")
  :cwd "~/Developer/Projects/Work/expedite-rails/front-end-packages/portal-borrower"
  :env '(("DEV_SERVER_PORT" "3001"))
  :tags '(webpack)))
;;; packages.el ends here

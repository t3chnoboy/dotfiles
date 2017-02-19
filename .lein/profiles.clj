{:repl {:plugins [[cider/cider-nrepl "0.14.0"]
                  [com.cemerick/piggieback "0.2.1"]
                  [refactor-nrepl "2.2.0"]]
        :dependencies [[alembic "0.3.2"]
                       [figwheel-sidecar "0.5.9"]
                       [com.cemerick/piggieback "0.2.1"]
                       [org.clojure/tools.nrepl "0.2.12"]]
        :nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}}

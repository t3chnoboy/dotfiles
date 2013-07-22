VERSION = `git tag | sort -r| head -n1`

zip:
	git archive --format=zip HEAD plugin/* syntax/* > vim-rspec-$(VERSION).zip
install:
	cp -vR plugin/* ~/.vim/plugin/
	cp -v  syntax/* ~/.vim/syntax/

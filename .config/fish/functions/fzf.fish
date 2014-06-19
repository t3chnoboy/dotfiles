function fzf
  /usr/bin/ruby --disable-gems /Users/macuser/.fzf/fzf $argv
end

function vimf
  if fzf > $TMPDIR/fzf.result
    vim (cat $TMPDIR/fzf.result)
  end
end

function fe
  set tmp $TMPDIR/fzf.result
  fzf --query="$argv[1]" --select-1 --exit-0 > $tmp
  if [ (cat $tmp | wc -l) -gt 0 ]
    vim (cat $tmp)
  end
end

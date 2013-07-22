module StringUtil
  def strip_html_spans(code)
    code.gsub(/<span class=[^>]+>/,'').gsub(/<\/span>/,'')
  end

  def unescape(html)
    CGI.unescapeHTML(html)
  end
end

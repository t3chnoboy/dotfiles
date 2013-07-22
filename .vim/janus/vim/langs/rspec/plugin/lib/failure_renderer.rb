# -*- encoding : utf-8 -*-
class FailureRenderer
  include StringUtil

  def initialize(failure)
    @failure = failure
    puts failure_message
    puts failure_location
    puts backtrace_details
  end

  private

  def indent(msg)
    "  #{msg}"
  end

  def failure_location
    unescape(
      (@failure/"div[@class='backtrace']/pre").inner_html.split("\n").map { |line| "#{indent(line.strip)}" }.join("\n")
    )
  end

  def failure_message
    indent(unescape((@failure/"div[@class~='message']/pre").inner_html.gsub(/\n/,'').gsub(/\s+/,' ')))
  end

  def backtrace_details
    unescape(
      backtrace_lines.map do |elem|
        linenum = elem[1]
        code = elem[3].chomp
        code = strip_html_spans(code)
        "  #{linenum}: #{code}\n"
      end.join
    )
  end

  def backtrace_lines
    (@failure/"pre[@class='ruby']/code").inner_html.scan(/(<span class="linenum">)(\d+)(<\/span>)(.*)/).reject { |line| line[3] =~ ignore_line_if_matches }
  end

  def ignore_line_if_matches
    /install syntax to get syntax highlighting/
  end

end

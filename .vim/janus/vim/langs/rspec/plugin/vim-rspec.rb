# -*- encoding : utf-8 -*-
require "rubygems"
require "hpricot"
require 'cgi'
require "#{File.join(File.dirname(__FILE__), "lib/string_util")}"
require "#{File.join(File.dirname(__FILE__), "lib/failure_renderer")}"
require "#{File.join(File.dirname(__FILE__), "lib/context_renderer")}"

class RSpecOutputHandler

  def initialize(doc)
    @doc=doc
    @counts={
      :passed => 0,
      :failed => 0,
      :not_implemented => 0
    }
    render_header
    render_examples
  end

  private

  def render_header
    stats = (@doc/"script").select {|script| script.innerHTML =~ /duration|totals/ }
    stats.map! do |script|
      script.inner_html.scan(/".*"/).first.gsub(/<\/?strong>/,"").gsub(/\"/,'')
    end
    # results in ["Finished in 0.00482 seconds", "2 examples, 1 failure"]
    failure_success_messages,other_stats = stats.partition {|stat| stat =~ /failure/}
    render_red_green_header(failure_success_messages.first)
    other_stats.each do |stat|
      puts stat
    end
    puts " "
  end

  def render_red_green_header(failure_success_messages)
    total_count = failure_success_messages.match(/(\d+) example/)[1].to_i rescue 0
    fail_count = failure_success_messages.match(/(\d+) failure/)[1].to_i rescue 0
    pending_count = failure_success_messages.match(/(\d+) pending/)[1].to_i rescue 0

    if fail_count > 0
      puts "------------------------------"
      puts " FAIL: #{fail_count} PASS: #{total_count - (fail_count + pending_count)} PENDING: #{pending_count}"
      puts "------------------------------"
    else
      puts "++++++++++++++++++++++++++++++"
      puts "+ PASS: All #{total_count} Specs Pass!"
      puts "++++++++++++++++++++++++++++++"
    end

  end

  def render_examples
    (@doc/"div[@class~='example_group']").each do |context|
      RSpecContextRenderer.new(context, @counts)
    end
  end

end

renderer = RSpecOutputHandler.new(Hpricot(STDIN.read))

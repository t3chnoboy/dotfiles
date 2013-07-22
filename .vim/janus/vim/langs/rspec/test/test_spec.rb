# -*- encoding : utf-8 -*-
class TestVimRspec
  def testme
    true
  end
end
describe "vim-rspec" do
  it "shows failures in red" do
    false.should == TestVimRspec.new.testme
  end

  it "shows successes in green" do
    true.should be_true
  end

  xit "shows pending specs in yellow"
end

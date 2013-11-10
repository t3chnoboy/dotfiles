// Copyright 2013 Google Inc. All Rights Reserved.

function toggle(id) {
  var style = document.getElementById(id).style;
  style.display = style.display ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  if (navigator.platform.toLowerCase().indexOf('win') != 0) {
    document.getElementById('nonWinWarning').style.display = '';
  }
  document.getElementById('autoDisplayMoreLink').addEventListener(
      'click', function() {
    toggle('autoDisplayMoreDiv');
  });
  document.getElementById('autoTransLink').addEventListener(
      'click', function() {
    toggle('autoTransDiv');
  });
  new OptionsControl().init();
});

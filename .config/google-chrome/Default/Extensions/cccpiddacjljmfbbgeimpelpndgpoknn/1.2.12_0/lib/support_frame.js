window.addEventListener('DOMContentLoaded', function() {
  chrome.extension.sendMessage({
    _messageType: 'frame-load',
    result: document.body.getAttribute('data-yieldsquare')
  });
});

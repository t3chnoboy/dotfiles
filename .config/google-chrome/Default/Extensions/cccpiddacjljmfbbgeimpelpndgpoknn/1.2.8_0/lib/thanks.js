document.addEventListener('DOMContentLoaded', function() {
  var extensionId = chrome.i18n.getMessage('@@extension_id');

  var storeLinks =  document.getElementsByClassName('store-page'),
      optionLinks = document.getElementsByClassName('options-page'),
      reviewLinks = document.getElementsByClassName('review-page'),
      feedbackLinks = document.getElementsByClassName('feedback-page'),
      i;

  for (i=0; i<optionLinks.length; i++) {
    optionLinks[i].href = chrome.extension.getURL('pages/options.html');
  }

  for (i=0; i<storeLinks.length; i++) {
    storeLinks[i].href = 'https://chrome.google.com/webstore/detail/' + extensionId;
  }

  for (i=0; i<reviewLinks.length; i++) {
    reviewLinks[i].href = 'https://chrome.google.com/webstore/detail/' + extensionId + '/reviews';
  }

  for (i=0; i<feedbackLinks.length; i++) {
    feedbackLinks[i].href = 'https://chrome.google.com/webstore/support/' + extensionId;
  }

  document.getElementById('disable-support').addEventListener('click', function(event) {
    chrome.extension.sendMessage({_messageType: 'disable-support'});
    document.getElementById('disable-plea').innerHTML = 'Ads disabled, please consider donating!';
  });
});

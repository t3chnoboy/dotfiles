// Copyright 2013 Google Inc. All Rights Reserved.

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    translate.getTranslateManager().attach(tabId, tab, 'page_load');
  }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  translate.getTranslateManager().detach(tabId);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  translate.getTranslateManager().attach(tab.id, tab, 'user_click');
});

chrome.extension.onRequest.addListener(function(request) {
  if (request.disabledLang) {
    translate.getUserOptions().disabledLangs().add(request.disabledLang);
  }
});

// Copyright 2010 Google Inc. All Rights Reserved.

function injection() {
  var pageLang = '{{$pageLang}}';
  var userLang = '{{$userLang}}';
  var autoTrans = 'true' == '{{$autoTrans}}';

  var uid = '1E07F158C6FA4460B352973E9693B329';
  var teId = 'TE_' + uid;
  var cbId = 'TECB_' + uid;

  function show() {
    window.setTimeout(function() {
      window[teId].showBanner(autoTrans);
    }, 10);
  }

  function newElem() {
    var elem = new google.translate.TranslateElement({
      autoDisplay: false,
      floatPosition: 0,
      multilanguagePage: true,
      pageLanguage: pageLang
    });
    elem.onTurnOffLanguageClick = function() {
      var event = document.createEvent('Event');
      event.initEvent('te_disable_lang', true, true);
      document.body.dispatchEvent(event);
    };
    return elem;
  }

  if (window[teId]) {
    show();
  } else {
    if (!window.google || !google.translate ||
        !google.translate.TranslateElement) {
      if (!window[cbId]) {
        window[cbId] = function() {
          window[teId] = newElem();
          show();
        };
      }
      var s = document.createElement('script');
      s.src = 'https://translate.google.com/translate_a/element.js?cb=' +
              encodeURIComponent(cbId) + '&client=tee&hl=' + userLang;
      document.getElementsByTagName('head')[0].appendChild(s);
    }
  }
}

function injector() {
  var s = document.createElement('script');
  s.innerHTML = '{{$content}}';
  document.getElementsByTagName('head')[0].appendChild(s);

  if (!'{{$noEvents}}') {
    document.body.addEventListener('te_disable_lang', function(e) {
      chrome.extension.sendRequest({disabledLang: '{{$pageLang}}'});
    });
  }
}

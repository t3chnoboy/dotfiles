// Copyright 2011 Google Inc. All Rights Reserved.

/**
 * @fileoverview Google Analytics for Google Dictionary extension.
 * @author sadovsky@google.com (Adam Sadovsky)
 */

'use strict';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-23514435-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();

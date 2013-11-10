"use strict";

// common template function (private to templates)
function href (p,a) {
	return ['a ', 'href="', devhd.utils.FeedlyUtils.homeURL,'#',p ,'/',encodeURIComponent( a ),'" ',
    	          '" data-uri="', p, '/',devhd.str.toSafeAttr(a)+'"' ].join("")
}

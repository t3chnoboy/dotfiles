
	var b = chrome.extension.getBackgroundPage();

	Array.prototype.diff = function(a) {
		return this.filter(function(i) {return !(a.indexOf(i) > -1);});
	};

	Array.prototype.toObject = function() {
		var rv = {};
		for (var i = 0; i < this.length; ++i)
			if (this[i] !== undefined) rv[i] = this[i];
		return rv;
	}

	Object.size = function(obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};

	function getHostname(url) {

		if( typeof url != "undefined" && url.indexOf('chrome-extension')<0 && url.indexOf('http')>-1 ) {
			return url.split(/\/+/g)[1];
		}
		else {
			return;
		}
	}

	function validateUrl(url) {

		var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    	return pattern.test(url);

	}

	// http://phpjs.org/functions/strstr:551
	function strstr (haystack, needle, bool) {
		var pos = 0;

		haystack += '';
		pos = haystack.indexOf(needle);
		if (pos == -1) {
			return false;
		} else {
			if (bool) {
				return haystack.substr(0, pos);
			} else {
				return haystack.slice(pos);
			}
		}
	}

	function loadScript(path) {

		if ( $('script[src="'+path+'"]').length==0 )  {
			var script = document.createElement( 'script' );
			script.type = 'text/javascript';
			script.src = path;
			document.body.appendChild(script);
			console.log('script '+path+' loaded dynamically');
		}
	}

	function prettyDate(time){
		var date = new Date(1000*time),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
		return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "Yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
	}

	function safestr(str) {
	  if (jQuery !== undefined) {
	    // Create an empty div to use as a container,
	    // then put the raw text in and get the HTML
	    // equivalent out.
	    return jQuery('<div/>').text(str).html();
	  }

	  // No jQuery, so use string replace.
	  return str
	    .replace(/&/g, '&amp;')
	    .replace(/>/g, '&gt;')
	    .replace(/</g, '&lt;')
	    .replace(/"/g, '&quot;');
	}



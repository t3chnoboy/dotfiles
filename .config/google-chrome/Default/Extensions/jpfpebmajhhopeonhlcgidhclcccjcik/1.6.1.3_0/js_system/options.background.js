	
	// canvas.toBlob is not implemented in Chrome yet! So we have to build the blob ourselves.
	// http://mustachified.com/master.js
	// via http://lists.whatwg.org/pipermail/whatwg-whatwg.org/2011-April/031243.html
	// via https://bugs.webkit.org/show_bug.cgi?id=51652
	// via http://code.google.com/p/chromium/issues/detail?id=67587

	function dataURItoBlob(dataURI, callback) {

		// convert base64 to raw binary data held in a string
		// doesn't handle URLEncoded DataURIs
		var byteString = atob(dataURI.split(',')[1]);

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to an ArrayBuffer
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
		}

		// write the ArrayBuffer to a blob, and you're done
		var bb = new window.WebKitBlobBuilder();
		bb.append(ab);
		return bb.getBlob(mimeString);
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

	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
	function fileErrorHandler(e) {
		var msg = '';
		var securityErr = 0;
		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'Speed Dial 2\'s thumbnail file storage limit has been reached.';
				break;
			case FileError.NOT_FOUND_ERR:
				msg = 'Speed Dial 2 is unable to access one or more thumbnail files.\n\nYou may need to reinstall Speed Dial 2 and/or Chrome.';
				break;
			case FileError.SECURITY_ERR:
				//msg = 'Speed Dial 2 has encountered a security error. Unable to access thumbnail files.';
			securityErr = 1;
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'Speed Dial 2 is unable to modify its thumbnail files.';
				break;
			case FileError.INVALID_STATE_ERR:
				msg = 'Speed Dial 2 is unable to access its thumbnail files (invalid state).';
				break;
			default:
				msg = 'Speed Dial 2 has encountered an unknown thumbnail file error.';
				break;
		}
		if (securityErr == 1) {
			window.webkitNotifications.createHTMLNotification('/html/notification_fileSecurityErr.html').show();
			return;
		}
		if (localStorage.option_alert == 1) {
			alert(msg);
		}
		console.log(msg);
	}

	// Save background image from user's computer
	$("#backgroundFile").live("change",function(e){
		var file = e.target.files[0];
		if (!strstr(file.type, "image/")) {
			alert("Error: File is not an image.");
			return;
		}
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			return function(e) {
				window.requestFileSystem(window.PERSISTENT, 50*1024*1024, function(fs){
					fs.root.getFile('/background.image', {create:true}, function(fileEntry) {
						fileEntry.createWriter(function(fileWriter) {
							fileWriter.write(dataURItoBlob(e.target.result));
							setTimeout(function(){
								$("#backgroundFile").val("");
								setValue('options.background','filesystem:'+chrome.extension.getURL("persistent/background.image"));
								setValue('options.backgroundPattern', '' );
								show_message('Background set.');
							},1);
							//window.location.reload();
						}, fileErrorHandler);
					}, fileErrorHandler);
				}, fileErrorHandler);
			};
		})(file);
		reader.readAsDataURL(file);
	});

	
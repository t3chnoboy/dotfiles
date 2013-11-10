window.addEventListener('keydown',function(e) {
if (e.which == 68 && e.altKey) {
  var c = encodeURIComponent;
  var url = 'http://delicious.com/save?v=5&amp;noui&amp;jump=close&amp;url='+ c(document.location.toString())+'&amp;title='+c(document.title);
	chrome.extension.sendRequest({
		type: 'saveToDelicious',
		url: url
	});
}
if (e.which == 68 && e.altKey) {
  var c = encodeURIComponent;
  var url = "http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk="+c(document.location.toString())+"&title="+c(document.title);
	chrome.extension.sendRequest({
		type: 'saveToGoogleBookmarks',
		url: url
	});
}
if (e.which == 68 && e.altKey) {
  var c = encodeURIComponent;
  var url = "https://pinboard.in/add?jump=close&url="+c(document.location.toString())+"&title="+c(document.title);
	chrome.extension.sendRequest({
		type: 'saveToPinboard',
		url: url
	});
}
},false);
/*
*/
function googleBookmarks() {

	var gb = this;

	gb.req = new XMLHttpRequest();
	gb.bookmarks = new Array();
	gb.labels = new Array();
	gb.qLabels = new Array();
	gb.noLoggedIn = false;
	gb.docXML;
	gb.initial = true;
	
	var container     = document.getElementById('googlebookmarks');
	var dom_title     = document.getElementById('googlebookmarks-title');
	var dom_query     = document.getElementById('googlebookmarks-query');
	var dom_labels    = document.getElementById('googlebookmarks-labels');
	var dom_bookmarks = document.getElementById('googlebookmarks-bookmarks');
	var dom_tags      = document.getElementById('googlebookmarks-tags');
	var dom_clear     = document.getElementById('googlebookmarks-clear');
	

	gb.labelSort = function(inputArray, start, rest) {
		for (var i = rest - 1; i >= start;  i--) {
			for (var j = start; j <= i; j++) {
				if (inputArray[j+1].name < inputArray[j].name) {
					var tempValue = inputArray[j];
					inputArray[j] = inputArray[j+1];
					inputArray[j+1] = tempValue;
				}	
			}
		}
		return inputArray;
	}	


	gb.login = function() 
	{

		dom_bookmarks.innerHTML = "Not Logged to Google Bookmarks<br/><a href=\"javascript:showUrl('http://www.google.com/bookmarks')\">Click here to sign in</a>";
		dom_query.style.display = 'none';
		dom_clear.style.display = 'none';
		
	}

	gb.fill = function() 
	{
		if (req.readyState != 4)
			return;	

		if (req.responseXML != null)
		{
			docXML = req.responseXML.documentElement;
			var nodes = docXML.getElementsByTagName("bookmark");

			if(!nodes || nodes == null || nodes.length == 0) 
				{ } 
			else
			{
				for (var i = 0; i < nodes.length; i++) 
					bookmarks[i] = gb.getInfo(i, nodes[i]);
				labels = gb.labelSort(labels, 0, labels.length-1);
			}
		}
		else
		{
			noLoggedIn = true;
			gb.login();
			return;
		}
		
		gb.showLabels();
		gb.showBookmarks(localStorage.lastQuery);
	}	

	gb.getBookmarks = function() 
	{
		var url = "http://www.google.com/bookmarks/?output=xml&num=10000";
		bookmarks = new Array();
		labels = new Array();
		req.open("GET", url, true);
		req.onreadystatechange = gb.fill;
		req.send(null);
	}

	gb.addLabel = function(label, idx) {
		var found = 0;
		
		for (var i=0; i < labels.length; i++) {
			if (labels[i].name == label) {
				found = 1;
				labels[i].bidx.push(idx);
				labels[i].n++;
				break;
			}
		}
		if (!found) {
			_label = new Object();
			_label.name = label;
			_label.bidx = new Array();
			_label.bidx.push(idx);
			_label.n = 1;
			labels.push(_label);
		}
	}

	gb.getBooksFromLabel = function() {
		var books = new Array();
		var n = qLabels.length;

		for (var i=0; i<bookmarks.length; i++) {
			var total=0;
			for (var k=0; k<n; k++) {
				for (var j=0; j<bookmarks[i].labels.length; j++) {
					if (bookmarks[i].labels[j].toLowerCase() == qLabels[k].toLowerCase()) {
						total++;
						break;
					}
				}
				if (total == n) break;
			}
			if (total == n) {
				books.push(i);
			}
		}	
		return books;
	}


	gb.getBooksFromString = function(str) {

		var books = new Array();
		var ls = str.toLowerCase();
		
		for (var i=0; i<bookmarks.length; i++) {
			if (bookmarks[i].title.toLowerCase().indexOf(ls) != -1 || bookmarks[i].url.toLowerCase().indexOf(ls) != -1) {
				books.push(i);
			}
		}
		
		return books;
	}

	gb.getInfo = function(idx, xmlnode)
	{
		var bookmarkObj = new Object();	
		bookmarkObj.url = xmlnode.getElementsByTagName("url")[0].firstChild.nodeValue;
		bookmarkObj.domain = bookmarkObj.url.split(/\/+/g)[1];
		bookmarkObj.title = (xmlnode.getElementsByTagName("title")[0] != null)?(xmlnode.getElementsByTagName("title")[0].firstChild.nodeValue):bookmarkObj.url;
		bookmarkObj.timestamp = xmlnode.getElementsByTagName("timestamp")[0].firstChild.nodeValue;
		bookmarkObj.id = xmlnode.getElementsByTagName("id")[0].firstChild.nodeValue;

		var nodes = xmlnode.getElementsByTagName("label");
		var nrnodes = (!nodes || nodes == null || nodes.length == 0)?0:nodes.length;
		bookmarkObj.labels = new Array(nrnodes);
		for (var i = 0; i < nrnodes; i++)
			bookmarkObj.labels[i] = nodes[i].firstChild.nodeValue;
		bookmarkObj.labels = bookmarkObj.labels.sort();
		for (var i = 0; i < bookmarkObj.labels.length; i++)
			addLabel(bookmarkObj.labels[i], idx);

		return bookmarkObj;
	}

	gb.setBadge = function(n)
	{	
		if (n != -1 && localStorage['badge'] == 1) {
			var sn = n + "";
			//chrome.browserAction.setBadgeText({ text: sn });
			//chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
		} else {
			//chrome.browserAction.setBadgeText({ text: "" });
		}
	}

	gb.showUrl = function(url)
	{
		chrome.tabs.update(null,{url: url});
	}

	/*
	gb.addBookmark = function()
	{
		//chrome.tabs.getSelected(null, fCallback);
	}
	*/

	gb.fCallback = function(tab) 
	{
		var a = window, b = document, c = encodeURIComponent;
		
		d=a.open("http://www.google.com/bookmarks/mark?op=edit&output=popup&bkmk="+c(tab.url)+"&title="+c(tab.title),"bkmk_popup","left="+((a.screenX||a.screenLeft)+10)+",top="+((a.screenY||a.screenTop)+10)+",height=420px,width=550px,resizable=1,alwaysRaised=1");	
		a.setTimeout(function() {
	    	d.focus();
	  	}, 300);
	}

	gb.addToList = function()
	{
		chrome.tabs.getSelected(null, fCallback2);
	}

	gb.fCallback2 = function(tab)
	{
		var a=window,b=document,c=encodeURIComponent,cc=encodeURI;
		
		d=a.open("https://www.google.com/bookmarks/api/bookmarklet?output=popup&srcUrl="+c(tab.url)+ "&snippet="+c(des(b))+"&title="+c(tab.title),"bkmk_popup","left="+((a.screenX||a.screenLeft)+10)+",top="+((a.screenY||a.screenTop)+10)+",height=320px,width=550px,resizable=1,alwaysRaised=1");
		a.setTimeout(function() {
	    	d.focus();
	  	}, 300);
	}

	gb.des = function(doc)
	{
		var mes = doc.getElementsByTagName("meta");
		for (var i=0,me;me=mes[i];i++) {
			mea=me.getAttribute("name");
			if (mea && mea.toUpperCase()=="DESCRIPTION") {
				return me.getAttribute("content");
			}
		}
		return "";
	}	

	gb.changeClass = function(elem, className1, className2)
	{
	    elem.className = (elem.className == '') ? className2 : className1;
		//document.getElementById("query").value = "";
	}

	gb.setLabels = function(cl)
	{
		var ul = document.getElementById("googlebookmarks-tags");
		var listItems = ul.getElementsByTagName("li")
		for (var i=1; i<listItems.length; i++) {
			listItems[i].firstChild.className = cl;
		}
	}

	gb.findLabel = function(label, eraseQuery)
	{	
		if (eraseQuery)
			document.getElementById("googlebookmarks-query").value = "";
		
		var ul = document.getElementById("googlebookmarks-tags");
		var listItems = ul.getElementsByTagName("li")
		for (var i=1; i<listItems.length; i++) {
			if (listItems[i].firstChild.firstChild.nodeValue == label) {
				changeClass(listItems[i].firstChild, '', 'sel');
			}
		}
	}

	gb.showLabels = function()
	{
		if (noLoggedIn) {

			//content = "Not Logged to Google Bookmarks<br/><a href=\"javascript:showUrl('http://www.google.com/bookmarks')\">Click here to sign in</a>"
			content = $('<div />').html("Not Logged to Google Bookmarks<br/><a href=\"javascript:showUrl('http://www.google.com/bookmarks')\">Click here to sign in</a>");

		} else {
			
			content = $('<ul />').attr('id','googlebookmarks-tags').addClass('tag-chain');
		    for (var i=0; i<labels.length; i++) {
		    	li = $('<li />');
		    	span = $('<span />').text(labels[i].name);
			    $(span).click(function(){

					gb.changeClass(this,'','sel'); 
					gb.showBookmarks(''); 
					gb.setLabelSearch();

			    })
			    span.appendTo(li);
			    li.appendTo(content);
			}
		}
		
		$(content).appendTo($('#googlebookmarks-labels'));
		var h = document.getElementById("googlebookmarks-labels").offsetHeight;
		h += 10;
		document.getElementById("googlebookmarks-labels").style.minHeight = h + "px";
	}

	gb.setTitle = function(n)
	{
		var str;
		
		if (n < 0)
			str = "&nbsp;";
		else if (n == 0)
			str = "not found";
		else if (n < 2)
			str = n + " bookmark";
		else
			str = n + " bookmarks";
		
		document.getElementById("googlebookmarks-title").innerHTML = str;
	}

	gb.showBookmarks = function(query)
	{
		if (noLoggedIn) {
			setTitle(-1);
			return;
		}
		
		if (query != '') {
			var queryString = document.getElementById("googlebookmarks-query").value.toLowerCase();
			localStorage.lastQuery = queryString;
			
			var pattern = /l:(.+)$/i;
			var res = queryString.match(pattern);
			if (res == null)
				_books = getBooksFromString(queryString);
			else {
				qLabels.splice(0, qLabels.length);
				var labs = res[1].split(",");
				for (var i=0; i<labs.length; i++) {
					qLabels.push(labs[i].trim());
					findLabel(labs[i].trim(), false);
				}
				_books = getBooksFromLabel();
			}

		} else {
			qLabels.splice(0, qLabels.length);
		
			var ul = document.getElementById("googlebookmarks-tags");
			var listItems = ul.getElementsByTagName("li")
			for (var i=0; i<listItems.length; i++) {
				if (listItems[i].firstChild.className == "sel")
					qLabels.push(listItems[i].firstChild.firstChild.nodeValue); // li/span
			}
		
			_books = getBooksFromLabel();


		}

		content = "";

		if (query == '' && qLabels=='') {
			max = _books.length > 10 ? 10 : _books.length;
		} else {
			max = _books.length;
		} 

		content = $("<ul />");

		for (var i=0; i<max; i++) {
		
			idx = _books[i];

	    	var li = $('<li />').attr('style',"background-image:url(chrome://favicon/"+ bookmarks[idx].url +")");
	    	var link = $('<a />').attr('href',bookmarks[idx].url).text(bookmarks[idx].title);
	    	var domain = $('<span />').addClass('domain').text(bookmarks[idx].domain);

	    	link.appendTo(li);
	    	domain.appendTo(li);

			for (var j=0; j<bookmarks[idx].labels.length; j++) {
				
				var span = $('<a />').addClass('tagspan').text(bookmarks[idx].labels[j]).attr('data-find',bookmarks[idx].labels[j]);
			    span.appendTo(li);
			}

			li.appendTo(content);
		}


		$('#googlebookmarks-bookmarks').html(content.html());
		$('.tagspan').click(function(){
			gb.findLabel( $(this).data('find'), true); 
			gb.showBookmarks(''); 
			gb.setLabelSearch();
		})

		setTitle(_books.length);
	}
		
	gb.clearSearch = function(show)
	{
		if (show) {
			var pattern = /l:.+$/i;
			var res = dom_query.value.match(pattern);
			if (res != null) {
				// unselect labels
				setLabels('');
			}
			showBookmarks('');
		}
		dom_query.value = "";
		//document.getElementById("googlebookmarks-query").value = "";
		localStorage.lastQuery = "";
	}

	gb.setLabelSearch = function() {
		var str = (qLabels.length > 0) ? "l:" : "";
		str += qLabels.join(',');
		//document.getElementById("googlebookmarks-query").value = str;
		dom_query.value = str;
	}

	gb.init = function()
	{
		if (!localStorage.lastQuery)
			localStorage.lastQuery = "";

		getBookmarks();
	}

	gb.init();
}

window.onload = googleBookmarks;


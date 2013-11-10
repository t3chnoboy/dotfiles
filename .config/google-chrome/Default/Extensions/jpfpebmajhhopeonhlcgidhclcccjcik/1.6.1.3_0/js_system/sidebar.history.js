
	function restoreTabs() {
		if (localStorage["_restore_tabs"] && typeof localStorage["_restore_tabs"]!= 'undefined') {
		restore_tabs = JSON.parse(localStorage["_restore_tabs"]);
			var re = /^(http:|https:|ftp:|file:)/;
		for (var i in restore_tabs) {
				if (restore_tabs[i].url && re.test(restore_tabs[i].url) && !restore_tabs[i].pinned) window.open(restore_tabs[i].url);
			}
		}
	}

	function renderHistory(item) {
		var visit_date = new Date ( item.lastVisitTime );
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.setAttribute('href',item.url);
		a.innerHTML = ( item.title ? '<b>'+( safestr(item.title) )+'</b>' : '<b>No title</b>' ) + '<br />'+ visit_date.toDateString()+' '+visit_date.toLocaleTimeString();
		li.style.backgroundImage = 'url(chrome://favicon/'+ item.url +')';
		li.setAttribute('class','openurl');
		li.setAttribute('rel',item.url);
		li.appendChild(a);
		return li;
	}

	function renderHistoryItems() {

	  $('#history ul#history_items').html('');

	  if (localStorage["_restore_tabs"] && typeof localStorage["_restore_tabs"]!= 'undefined') {
	    restore_tabs = JSON.parse(localStorage["_restore_tabs"]);
      var restore_tabs_count = 0;
      var re = /^(http:|https:|ftp:|file:)/;
	    for (var i in restore_tabs) {
        if (restore_tabs[i].url && re.test(restore_tabs[i].url) && !restore_tabs[i].pinned) restore_tabs_count++;
      }
	    if (restore_tabs_count > 0) { $('#history ul#history_items').append('<li class="openurl" style="background:url(images/sidebar.restore-tabs.png) 6px 6px #FAFF75 no-repeat"><a style="font-weight:bold;color:#000;display:block;margin-top:3px;" id="click-restore-tabs">Restore '+restore_tabs_count+' tabs.</a></li>'); }
	  }

	  	if (localStorage["_closed_tabs"] && typeof localStorage["_closed_tabs"]!= 'undefined') {

        var closedTabs = JSON.parse(localStorage["_closed_tabs"]);
        if (!closedTabs) return false;

	      for (var i=closedTabs.length-1; i >= 0; i--) {

	      	var li = document.createElement('li');
	      	var a = document.createElement('a');
	      	a.setAttribute('href',closedTabs[i].url);
	      	a.innerHTML = ( closedTabs[i].title ? '<b>'+ ( safestr(closedTabs[i].title)) +'</b>' : '<b>No title</b>' ) + '<br />';
	      	li.style.backgroundImage = 'url(chrome://favicon/'+ closedTabs[i].url +')';
            li.setAttribute('class','openurl');
            li.setAttribute('rel',closedTabs[i].url);
            li.appendChild(a);
            $('#history ul#history_items').append(li);

	      };

	    var clear_history = document.createElement('li');
	  	var a = document.createElement('a');
	  	a.innerHTML = 'Clear recently closed tabs list';
	  	a.setAttribute('id','clear-history');
	  	a.addEventListener('click',function(){
	  	  localStorage.removeItem("_closed_tabs");
	  	  localStorage.removeItem("_opened_tabs");
	  	  localStorage.removeItem("_restore_tabs");
	  	  $('#history ul#history_items').html('');
	  	});
	  	clear_history.appendChild(a);
      $('#history ul#history_items').append(clear_history);
	  }
	}

  $(function(){

	  $('#history #history-search').keyup(function(e){

	  	query = $('#history #history-search').val();
	  	if ( query.length < 3 ) return false;

	  	chrome.history.search( { text:query, maxResults:25}, function(history) {

	  		$('#history ul').html('');
	  		for (var i=0; i < history.length; i++) {
	  			$('#history ul').append( renderHistory(history[i]) )
	  		};
	  	})
	  })

	  renderHistoryItems();

  })
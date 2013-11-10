
	function bookmarksLoad(folder) {
		if (folder) 
		{
			$('#bookmarks').addClass('loading');
			$('#bookmarks ul').html('');

			chrome.bookmarks.get(folder, function(result) 
			{
				if (result[0].parentId > -1) {
					$('#bookmarks ul').append('<li class="bookmark_folder bookmark_back" parent="'+(result[0].parentId)+'" rel="'+(result[0].parentId)+'">Back</li>');		
				}
			})

			chrome.bookmarks.getChildren(folder, function(result) { for (var i=0; i < result.length; i++) { renderBookmark(result[i]); };	})
			$('#bookmarks').removeClass('loading');
		}
	}
	
	function renderBookmark(item) 
	{
		var li = document.createElement('li');
		var a = document.createElement('a');
		if (item.url) 
		{
			// link
			li.style.backgroundImage = 'url(chrome://favicon/'+ item.url +')';
			li.setAttribute('class','bookmark_link openurl');
			li.setAttribute('rel',item.url);
			a.setAttribute('href',item.url);
			if (item.title == '') item.title = item.url;
			a.innerHTML = (getValue('options.sidebar.showBookmarksURL')==1) ? '<b>' + safestr(item.title) + '</b><span>' + item.url +' </span> ' : '<b>' + safestr(item.title) + '</b>';
		} else {
			// folder
			li.setAttribute('class','bookmark_folder');
			li.setAttribute('rel',item.id);
			li.addEventListener('click',function(){ bookmarksLoad(item.id); });
			if (item.title == '') item.title = item.url;
			a.innerHTML = safestr(item.title);
		}
		li.appendChild(a);
		$('#bookmarks ul').append(li)
	}

	$(function(){
	
		// open folder / go back
		$('.bookmark_back').live('click',function() { bookmarksLoad($(this).attr('rel')); });
	
		// search
		$('#bookmarks-search').keyup(function(e){
			if (e.keyCode == 27) { bookmarksLoad('1'); $(this).val(''); return false }
			query = $(this).val();
			if ( query.length < 3 ) return false;
			$('#bookmarks ul').html('').append('<li class="bookmark_folder bookmark_back" rel="0">Back</li>');
			chrome.bookmarks.search( query, function(result) { for (var i=0; i < result.length; i++) { renderBookmark(result[i]); }	});
		})
	})
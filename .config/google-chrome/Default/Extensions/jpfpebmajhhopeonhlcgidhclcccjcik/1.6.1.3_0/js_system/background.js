	try {

	var _browser_start_ = true;

	speeddial.storage.open();
	// create table bookmarks if not exists
	speeddial.storage.createTable();

/* sync happens on background page */

	sync_add_group = function(id, group) {
		return speeddial.storage.sync_add_group(id, group);
	}
	sync_edit_group = function(id, group) {
		return speeddial.storage.sync_edit_group(id, group);
	}
	sync_remove_group = function(id) {
		return speeddial.storage.sync_remove_group(id);
	}
	sync_order_groups = function(groups) {
		return speeddial.storage.sync_order_groups(groups);
	}
	sync_add_bookmark = function(id, bookmark) {
		return speeddial.storage.sync_add_bookmark(id, bookmark);
	}
	sync_edit_bookmark = function(id, bookmark) {
		return speeddial.storage.sync_edit_bookmark(id, bookmark);
	}
	sync_move_bookmark = function(id, group) {
		return speeddial.storage.sync_move_bookmark(id, group);
	}
	sync_remove_bookmark = function(id) {
		return speeddial.storage.sync_remove_bookmark(id);
	}
	sync_order_bookmarks = function(bookmarks) {
		return speeddial.storage.sync_order_bookmarks(bookmarks);
	}
	sync_to_server = function(callback) {
		return speeddial.storage.sync_to_server(callback);
	}
	sync_settings = function() {
		return speeddial.storage.sync_settings();
	}
	import_settings = function(settings, callback) {
		return speeddial.storage.import_settings(settings,callback);
	}
	test_sync_account = function(callback) {
		return speeddial.storage.test_sync_account(callback);
	}
	sync = function(callback) {
		return speeddial.storage.sync(callback);
	}
	backup_and_sync = function(callback) {
		return speeddial.storage.backup_and_sync(callback);
	}

	setTimeout(function(){sync()},1000);

	function makeThumbnail(url,captureDelay) {
		setTimeout(function() {
			try {
			chrome.tabs.captureVisibleTab(null,{format:'png'},function(dataurl)
			{
				var canvas = document.createElementNS( "http://www.w3.org/1999/xhtml", "html:canvas" );
				var ctx = canvas.getContext('2d');
				var img = document.createElement('img');
				img.onload = function()
				{
					try
					{
						resized_width = 460;
						quality = 0.65;

						if 			(localStorage['options.thumbnailQuality']=='low')	    { resized_width = 360; quality = 0.65;  }
						if 			(localStorage['options.thumbnailQuality']=='high') 		{ resized_width = 720; quality = 0.65;  }

						resized_height =  Math.ceil((resized_width/img.width)*img.height);
						canvas.width=resized_width
						canvas.height=resized_height
						ctx.drawImage(img,0,0,resized_width,resized_height);
						speeddial.storage.db.transaction(function(tx) {
							tx.executeSql('DELETE FROM thumbnails WHERE url = ?', [url],function(){
								tx.executeSql('INSERT INTO thumbnails (url, thumbnail) values (?, ?)', [url, canvas.toDataURL("image/jpeg",quality)], null ,function(tx, e){alert('Something unexpected happened: ' + e.message ) });
							});
						});
						img = null;
					}
					catch(e){console.log(e)}
				}
				img.src=dataurl;
			});
			} catch(e){console.log(e)}
		}, captureDelay);
	}

	// UPDATE THUMBNAIL ON REQUEST
	chrome.tabs.onUpdated.addListener(function(id,object,tab)
	{
		try
		{
			if (tab.selected && tab.url)
			{
				/* make thumbnail */
				if (localStorage['requestThumbnail'] && localStorage['requestThumbnail']!='' && localStorage['requestThumbnail']!="undefined" && typeof localStorage["requestThumbnail"]!='undefined') {
					var requestThumbnail = localStorage['requestThumbnail'].split('|||');
					if (requestThumbnail[0] == tab.id) {
						if ( tab.status=="complete" )
						{
							if (tab.url.indexOf('mail.google.com')>-1 || tab.url.indexOf('twitter.com')>-1)
							{
								if (validateUrl(tab.url)) makeThumbnail(requestThumbnail[1],1000);
							}
							else
							{
								if (validateUrl(tab.url)) makeThumbnail(requestThumbnail[1],135);
							}
							localStorage['requestThumbnail']='';
						}
						requestThumbnail = null;
					}
				}
			}
		} catch(e){console.log(e)}
	});

	chrome.tabs.onCreated.addListener(function(tab)
	{
		if (localStorage['refresh_create']=='true') {
			localStorage['refresh_url'] = '';
			localStorage['refresh_create'] = 'false';
			localStorage['refresh_id'] = '';
			localStorage['refreshThumbnail'] = '';
		}
		if (localStorage['refreshThumbnail']!='') {
			localStorage['refresh_url'] = localStorage['refreshThumbnail'];
			localStorage['refresh_create'] = 'true';
			localStorage['refresh_id'] = tab.id;
			localStorage['refreshThumbnail'] = '';
		}
	});

	chrome.tabs.onUpdated.addListener(function(id,object,tab)
	{
		if (localStorage['refreshThumbnail']!='')
		{
			localStorage['refresh_url'] = localStorage['refreshThumbnail'];
			localStorage['refresh_create'] = 'true';
			localStorage['refresh_id'] = tab.id;
			localStorage['refreshThumbnail'] = '';
		}
	})

	chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo)
	{
		if (tabId)
		{
			try
			{
				chrome.tabs.getSelected(null, function(tab)
				{
					if (tab)
					{
						if (localStorage['refresh_create']=='true')
						{
							if (tab.selected && tab.url && tab.id == localStorage['refresh_id'])
							{
								/* refresh thumbnail */
								var url = localStorage['refresh_url'];
								if ( tab.status=="complete" )
								{
									localStorage['refresh_url'] = '';
									localStorage['refresh_create'] = 'false';
									localStorage['refresh_id'] = '';
									localStorage['refreshThumbnail'] = '';
									if (url.indexOf('mail.google.com')>-1 || url.indexOf('twitter.com')>-1)
									{
										if (validateUrl(url)) makeThumbnail(url,1000);
									} else {
										if (validateUrl(url)) makeThumbnail(url,145);
									}
								}
							}
						}
					}
				})
			} catch(e){console.log(e)}
		}
	});

	chrome.tabs.onUpdated.addListener(function(id,object,tab) {

		if (localStorage['refresh_create']=='true') {
		if (tab) {
		if (tab.selected && tab.url && tab.id == localStorage['refresh_id']) {
			/* refresh thumbnail */
				var url = localStorage['refresh_url'];
				if ( tab.status=="complete" ) {
					localStorage['refresh_url'] = '';
					localStorage['refresh_create'] = 'false';
					localStorage['refresh_id'] = '';
					localStorage['refreshThumbnail'] = '';
					if (url.indexOf('mail.google.com')>-1 || url.indexOf('twitter.com')>-1)
					{
						if (validateUrl(url)) makeThumbnail(url,1000);
					} else {
						if (validateUrl(url)) makeThumbnail(url,135);
					}
				}
		}
		}
		}
	})

	function contextmenu_addGroup(row, tab) {
		var value = [];
		value['title'] = tab.title;
		value['url'] = encodeURI(tab.url);
		value['idgroup'] = row.id;
		speeddial.storage.addItem(value, function(){});
		if (tab.url && validateUrl(tab.url)) makeThumbnail(tab.url,0);
	}

	function contextmenu_createGroup(row) {
		chrome.contextMenus.create({
			title: row.title,
			contexts:["all"],
			"parentId": selectGroups,
			type: "normal",
			onclick: function(info, tab) {
				contextmenu_addGroup(row, tab);
			}
		});
	}

	function contextmenu_loadGroups() {

			speeddial.storage.db.transaction(function(tx) {
				tx.executeSql('SELECT * FROM groups ORDER BY position ASC', [],function(tx,rs){
					if (rs.rows.length > 0) {
						chrome.contextMenus.create({"type": "separator","parentId": rootElement});
						selectGroups = chrome.contextMenus.create({
							title: "Add to group",
							contexts:["all"],
							"parentId": rootElement,
							type: "normal",
						});
						for (var i=0; i < rs.rows.length; i++) {
							contextmenu_createGroup(rs.rows.item(i));
						}
					}
				});
			});
	}

		if (localStorage['options.showContextMenu']=='1')
		{
			var selectGroups;

			var rootElement = chrome.contextMenus.create({
				"contexts": ["all"],
				"title": "Speed dial 2",
				"type": "normal"
			});

			chrome.contextMenus.create({
				title: "Add current page",
				contexts:["all"],
				"parentId": rootElement,
				type: "normal",
				onclick: function(info, tab) {

					var value = [];
					value['title'] = tab.title;
					value['url'] = encodeURI(tab.url);
					value['thumbnail'] = '';
					value['idgroup'] = 0;
					speeddial.storage.addItem(value, function(){});
					if (tab.url && validateUrl(tab.url))
					{ makeThumbnail(tab.url,0) }

				}
			});
			chrome.contextMenus.create({"type": "separator","parentId": rootElement});
			chrome.contextMenus.create({
				title: "Add all opened pages",
				contexts:["all"],
				"parentId": rootElement,
				type: "normal",
				onclick: function(info, tab) {
					chrome.tabs.getAllInWindow(null,function(tabs){
						for (var i=0; i < tabs.length; i++) {
							if (tabs[i].title!='New tab') {

								var value = [];
								value['title'] = tabs[i].title;
								value['url'] = encodeURI(tabs[i].url);
								value['idgroup'] = 0;
								speeddial.storage.addItem(value, function(){});

							}
						};
					})
				}
			});
			contextmenu_loadGroups();
		}

		if (typeof localStorage["_opened_tabs"]!= 'undefined' ) {
			localStorage["_restore_tabs"] = localStorage["_opened_tabs"];
		}
		localStorage.removeItem("_opened_tabs");

		chrome.tabs.onUpdated.addListener(function(tabId,changeInfo, tab) {

			if (tab && tab.url && tab.title && tab.incognito === false) {

				if (typeof localStorage["_opened_tabs"]!= 'undefined' )
				{
					var obj = JSON.parse(localStorage["_opened_tabs"]);
				} else {
					var obj = {};
				}

				obj[tabId] = {} // tab.url+'|||'+tab.title;
				obj[tabId].url = tab.url;
				obj[tabId].title = tab.title;
				obj[tabId].pinned = tab.pinned;

				localStorage["_opened_tabs"] = JSON.stringify(obj, null, 2);
			}

		});

		chrome.tabs.onRemoved.addListener(function(tabId, tabInfo) {

			if (typeof localStorage["_opened_tabs"]!='undefined')
			{
				var obj = JSON.parse(localStorage["_opened_tabs"]);
				if (!obj[tabId]) return false;

					var tab = obj[tabId];
					delete obj[tabId];
					localStorage["_opened_tabs"] = JSON.stringify(obj, null, 2);

					var url = tab.url;
					var title = tab.title;
					var re = /^(http:|https:|ftp:|file:)/;
					if (url && re.test(url)) {
						if (typeof localStorage["_closed_tabs"]!='undefined') {

							closedTabs = JSON.parse(localStorage["_closed_tabs"]);

							for (var i=0; i < closedTabs.length; i++) {
								if (closedTabs[i].url == url) {
										closedTabs.splice(i,1);
								}
							}

							closedTabs.push( {'url':url,'title':title} );

							while (closedTabs.length > 25) { closedTabs.shift(); }

							localStorage["_closed_tabs"] = JSON.stringify(closedTabs, null, 2);

						} else {

							closedTabs = [];
							closedTabs.push( {'url':url,'title':title} );
							localStorage["_closed_tabs"] = JSON.stringify(closedTabs, null, 2);

						}
					}
					obj = null;
			}
		});

	chrome.extension.onRequest.addListener(
		function(request, sender, sendResponse) {
			if (request.type === 'saveToDelicious' && localStorage['options.useDeliciousShortcut']==1 && localStorage['options.sidebar.showDelicious']==1) {
				window.open(request.url,'deliciousuiv5','location=yes,links=no,scrollbars=no,toolbar=no,width=600,height=600');
			}
			if (request.type === 'saveToGoogleBookmarks' && localStorage['options.useGoogleBookmarksShortcut']==1 && localStorage['options.sidebar.showGooglebookmarks']==1) {
				window.open(request.url,'bkmk_popup','location=yes,links=no,scrollbars=no,toolbar=no,width=800,height=600'+'left='+((window.screenX||window.screenLeft)+10)+',top='+((window.screenY||window.screenTop)+10)+',resizable=1,alwaysRaised=1');
			}
			if (request.type === 'saveToPinboard' && localStorage['options.usePinboardShortcut']==1 && localStorage['options.sidebar.showPinboard']==1) {
				window.open(request.url,"pinboad.in","location=no,links=no,scrollbars=no,toolbar=no,width=700,height=350");
			}
		}
	);
	// Record if we should restart the Helper next time it's disabled
	chrome.management.onDisabled.addListener(function(extension) {
		if (window.doEnable && extension.name == "Speed Dial 2 Memory Helper") {
			var eId = extension.id;
			setTimeout(function(){
				chrome.management.setEnabled(eId, true, function(){
					window.doEnable = false;
				});
			}, 100);
		}
	});
	// Reload Fauxbar Memory Helper if it's running
	chrome.management.getAll(function(extensions){
		for (var e in extensions) {
			if (extensions[e].name == "Speed Dial 2 Memory Helper" && extensions[e].enabled) {
				window.doEnable = true;
				var eId = extensions[e].id;
				setTimeout(function(){
					chrome.management.setEnabled(eId, false);
				}, 100);
			}
		}
	});

	// If Helper detects computer is idle, Fauxbar will report back to restart Fauxbar IF no Fauxbar tabs are open.
	chrome.extension.onRequestExternal.addListener(function(request){
		if (request == "restart-speeddial2?") {
			console.log("Memory Helper would like to restart Speed Dial 2.");
			chrome.windows.getAll({populate:true}, function(windows){
				var okayToRestart = true;
				for (var w in windows) {
					for (var t in windows[w].tabs) {
						// Don't reload if tab is open
						if (strstr(windows[w].tabs[t].title, "New tab") || strstr(windows[w].tabs[t].title, "Speed Dial 2")) {
							okayToRestart = false;
						}
					}
				}
				if (okayToRestart) {
					chrome.management.getAll(function(extensions){
						for (var e in extensions) {
							if (extensions[e].name == "Speed Dial 2 Memory Helper" && extensions[e].enabled) {
								chrome.extension.sendRequest(extensions[e].id, "restart-speeddial2");
							}
						}
					});
				}
			});
		}
	});

	localStorage.removeItem('_tmp_pinboard.tags');

	} catch(e){console.log(e)}

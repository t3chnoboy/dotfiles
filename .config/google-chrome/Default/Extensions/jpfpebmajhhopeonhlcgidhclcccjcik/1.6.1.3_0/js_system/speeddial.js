$(function(){

	$('.settings-icon').click(function(){
		$('#quick-options').show();$('#overlay').fadeIn(250);
	})

	$('.click-switch-dialog-null').click(function(){
		switchDialog(null);
	})

	$('.click-clear-value').click(function(){
		$(this).val('');
	})

	$('.click-clear-search').click(function(){
		clearSearch(true);
	})

	$('.click-open').click(function(){
		openInCurrent($(this).data('url'));
	})

	$('.click-open-extension-page').click(function(){
		top.location.href=chrome.extension.getURL( $(this).data('url'));
	})

	$('.click-close-notice').click(function(){
		close_notice()
	})

	$('.click-quick-options-save').click(function(){
		b.sync_settings();
		$(this).parents('.dialog').hide();
		$('#overlay').fadeOut(250);
	})

	$('.click-set-value').click(function(){
		var p = $(this).data('option');
		var v = $(this).data('value');
		setValue(p,v);
		reload();
	})

	$('#options-centervertically').change(function(){
		toggleValue('options.centerVertically');reload();
	})

	$('#options-showAddButton').change(function(){
		toggleValue('options.showAddButton');reload();
	})

	$('#delicious_close').click(function(){
		$(this).parent().hide()
	})

	$('#click-restore-tabs').live('click',function(){
		restoreTabs()
	})

	

})

//var list = "<% _.each(people, function(name) { %> <li><%= name %></li> <% }); %>";
//alert(_.template(list, {people : ['moe', 'curly', 'larry']}));

	var version_notice = 'v1590';

// AJAX CACHE

	$.ajaxSetup({ cache: false });

// USING APPS?

	if (localStorage['options.apps.show']==1 || localStorage['options.sidebar.showApps']) {
		document.write('<script type="text/javascript" charset="utf-8" src="'+chrome.extension.getURL('js_system/apps.js')+'"></script>');
	}

// USING SIDEBAR?

	if (localStorage['options.sidebar']==1)
	{
			document.write('<script src="'+chrome.extension.getURL('js_system/sidebar.js')+'"></script>');

		if ( localStorage['options.sidebar.showBookmarks']==1 )
		{
			document.write('<script src="'+chrome.extension.getURL('js_system/sidebar.bookmarks.js')+'"></script>');
		}
		if ( localStorage['options.sidebar.showHistory']==1 )
		{
			document.write('<script src="'+chrome.extension.getURL('js_system/sidebar.history.js')+'"></script>');
		}
		if ( localStorage['options.sidebar.showDelicious']==1 && localStorage['options.sidebar.deliciousUsername']!='' )
		{
			document.write('<script src="'+chrome.extension.getURL('js_system/sidebar.delicious.js')+'"></script>');
		}
		if ( localStorage['options.sidebar.showPinboard']==1 && localStorage['options.sidebar.pinboardUsername']!='' )
		{
			document.write('<script src="'+chrome.extension.getURL('js_system/sidebar.pinboard.js')+'"></script>');
		}
		if ( localStorage['options.sidebar.showGooglebookmarks']==1 )
		{
			document.write('<script src="'+chrome.extension.getURL('js_system/sidebar.gbookmarks.js')+'"></script>');
		}
	}


// CTRL & COMMAND KEY

	var isCtrl = false;

	$(window).keydown(function(e) {

		if(e.ctrlKey)
		isCtrl = true;

	}).keyup(function(e) {

		isCtrl = false;

	})

// UPON INSTALLATION AND UPDATE

	if (localStorage['firstTime']!='false')
	{
		// skip update notice
		localStorage[version_notice] = 'false';
		localStorage['firstTime'] = 'false';
		// redirect to welcome screen
		chrome.tabs.getSelected(null, function (tab) { chrome.tabs.update(tab.id, {url : chrome.extension.getURL('welcome.html')} ) });
	}

// WINDOW FUNCTION

	function openInCurrent(url)	{
		chrome.tabs.getSelected(null, function (tab) {
			chrome.tabs.update(tab.id, {url : url} )
		})
	}
	function openInNew(url) {
		// keep track of part of a day
		speeddial.storage.trackVisits( url );
		chrome.tabs.create({url: url, selected:false });
	}
	function openurl(url,e) {
		if ( localStorage['options.alwaysNewTab'] == '1' && (isCtrl == true || e.which == 2)) {
			openInCurrent( url );
			e.preventDefault();
			e.stopPropagation();
		} else if ( localStorage['options.alwaysNewTab'] == '1' ) {
			chrome.tabs.create({url: url, selected:true });
			e.preventDefault();
		}
	}

// THUMBNAILS

	function getThumbnail(url, showInfoWarning) {
		chrome.tabs.getSelected( null, function(tab) {
			speeddial.storage.removeThumbnail(url);
			// db_url localStorage.removeItem('thumbnail_'   + encodeURIComponent(url));
			localStorage['requestThumbnail'] = tab.id+'|||'+url;
			openInCurrent(url);
		});
	}

// ADD / REMOVE / EDIT DIAL&GROUPS

	var dialog_mode;

	function removeDial() {

		var id = $('#url-dialog #bookmark_id').val();
		var li = $('li#'+id);
		resetDialog();
		return removeBookmark(li);

	}
	function removeBookmark(li) {

		url 	= li.attr('url');
		id  	= li.attr('id');
		speeddial.storage.removeThumbnail(url);
		speeddial.storage.deleteItem(id);
		li.animate({opacity:0},300,function(){
			li.remove();
		})
	}

	function removeGroup() {

		var groupid = $('#url-dialog #bookmark_id').val();

		speeddial.storage.deleteGroup(groupid);
		resetDialog();

		show_message(i18n('new_tab_group_removed'));

		$('[loadgroup='+groupid+']').remove();

		if (GROUP == groupid) {
			GROUP = 0;
			if (localStorage['options.keepActiveGroup']==1) {
				localStorage['options.activeGroup'] = 0;
			}
			window.location.hash='';
			reload();
		}
	}

	function clearDialog() {

		dialog_mode = '';

		$('#url-dialog #name').val('');
		$('#url-dialog #url').val('');
		$('#url-dialog #bookmark_id').val('');
		$('#url-dialog #color').val('FFFFFF').css('background-color','#FFFFFF')
		$('#url-dialog #thumbnail').val('');
		$('#url-dialog #newGroupColor').val('FFFFFF');
		$('#url-dialog #newGroupName').val('');
		$('#url-dialog #newGroup').hide();
		$('#url-dialog-groups').val(GROUP);
	}

	function suggestUrl() {

		chrome.history.search({ text: "", maxResults: 5000, startTime: 0  }, function(results) {
		var h = new Array();
		var chart = [];
		var trends = [];
		var trends_used = [];
		var domain;
		for(var i = 0;  i < results.length; ++i) {
			if(typeof results[i].url != "undefined" && results[i].url.indexOf('chrome-extension')<0) {

				domain = getHostname(results[i].url);
				if (domain) {
					if (!trends_used[domain]) {
						trends_used[domain] = 1;
						trends.push( [ domain ] );
					}
				}
			}
		}
		$("#url").autocomplete(
			trends,
			{
				max:7, autoFill:false, selectFirst:false, matchContains:true,
				formatItem: function(item) {
					return item[0];
				},
				formatResult: function(item) {
					return item[0];
				}
			})
		});
	}

	function resetDialog() {
		return switchDialog(null);
	}

	function switchDialog(mode) {

		$('.uipart').hide(0);

		switch (mode) {

			case 'add':
				clearDialog();
				$('.add_dialog_label').show();
				$('.url-dialog-url').show();
				$('#overlay').fadeIn(250);
				$('#url-dialog').show();
				$('#url-dialog-thumbnail').show();
				$('#url-dialog-group').show();
				$('#url-dialog-name').show();
				$('#url-dialog #url').focus();
			suggestUrl();
			break;

			case 'edit':
				$('#overlay').fadeIn(250);
				$('.url-dialog-url').show();
				$('#url-dialog-thumbnail').show();
				$('#url-dialog-group').show();
				$('#url-dialog-name').show();
				$('.edit_dialog_label').show();
				suggestUrl();
			break;

			case 'editgroup':
				$('#overlay').fadeIn(250);
				$('#url-dialog .group_edit').show();
				$('#url-dialog-color').show();
				$('#url-dialog-name').show();
				$('#url-dialog').show(0);
			break;

			case 'removegroup':
				$('#overlay').fadeIn(250);
				$('#url-dialog .group_delete').show();
				$('#url-dialog-name').hide();
				$('#url-dialog').show(0);
			break;

			case 'removedial':
				$('#overlay').fadeIn(250);
				$('#url-dialog .bookmark_delete').show();
				$('#url-dialog-name').hide();
				$('#url-dialog').show(0);
			break;

			case 'create_group':
				$('#overlay').fadeIn(250);
				$('#url-dialog .group_add').show();
				$('#url-dialog-color').show();
				$('#url-dialog-name').show();
				$('#url-dialog').show(0);
			break;

			default:
				$('#overlay').fadeOut(100);
				$('#url-dialog').hide(0);
				clearDialog();
			break;
		}
		dialog_mode = mode;
	}

	function prepareDialog(mode,bookmark_id) {

		// clears dialog values
		clearDialog();
		// prepares dialog inputs (add|edit)
		switchDialog(mode);

		// load bookmark if in edit mode
		switch (mode) {

			case 'edit':
			speeddial.storage.getItem(bookmark_id,editDialog);
			break;

			case 'editgroup':
			speeddial.storage.getGroup(bookmark_id,editGroupDialog);
			break;

			case 'removegroup':
			$('#url-dialog #bookmark_id').val(bookmark_id)
			break;

			case 'removedial':
			$('#url-dialog #bookmark_id').val(bookmark_id)
			break;

		}
	}

// EDITING BOOKMARK

	// tmp var to check if url of a bookmark was changed
	var previous;
	var previous_thumbnail;

	function editDialog(tx,rs) {

		current = rs.rows.item(0)
		previous = current['url']
		previous_thumbnail = current['thumbnail']

		$('#url-dialog #name').val(current['title'])
		$('#url-dialog #url').val(decodeURI(current['url']))
		$('#url-dialog #thumbnail').val(current['thumbnail'])
		$('#url-dialog #bookmark_id').val(current['id'])
		$('#url-dialog').fadeIn(0)
		$('#url-dialog #url').focus()
	}
	function editGroupDialog(tx,rs) {

		current = rs.rows.item(0)
		$('#url-dialog #name').val(current['title'])
		$('#url-dialog #bookmark_id').val(current['id'])
		$('#url-dialog #color').val(current['color']).css('background-color','#'+current['color'])
		$('#url-dialog #name').focus()
	}

	/* todo */
	function createGroupDialog() {

		$('#url-dialog #name').val('')
		$('#url-dialog #color').val('FFFFFF').css('background-color','#FFFFFF')
		$('#url-dialog #name').focus()
	}

// ADDING BOOKMARK

	function fixUrl(url) {
	if (
		(url.indexOf("http://")!=0)  &&
		(url.indexOf("https://")!=0) &&
		(url.indexOf("smtp://")!=0)  &&
		(url.indexOf("ftp://")!=0)   &&
		(url.indexOf("rtp://")!=0)   &&
		(url.indexOf("irc://")!=0)   &&
		(url.indexOf("file://")!=0)  &&
		(url.indexOf("chrome://")!=0)&&
		(url.indexOf("chrome-extension")<0) &&
		(url.indexOf("snmp://")!=0)) {
			url = "http://" + url;
		}
		return url;
	}

// OPEN ALL LINKS FROM A SPECIFIC GROUP

	function openAllLinks(tx,rs) {
		for (var i=0; i < rs.rows.length; i++) {
			speeddial.storage.trackVisits( rs.rows.item(i).url );
			chrome.tabs.create({url: rs.rows.item(i).url,	selected:false });
		}
	}

	function openAllFromGroup(idGroup)
	{
		GROUP = idGroup;
		speeddial.storage.getAllItems(openAllLinks, idGroup);
	}

	function encodeInNeed(url) {
		if (url.indexOf('%') > -1)
		{
			return url;
		}
		return encodeURI(url);
	}

	function addBookmark() {

		insert = new Array();

		insert['title'] 					= $('#add-edit-dialog #name').val();
		insert['url'] 						= encodeInNeed($('#add-edit-dialog #url').val());
		insert['thumbnail'] 			= $('#add-edit-dialog #thumbnail').val();
		insert['ts_created'] 			= Math.round(new Date().getTime() / 1000);
		insert['visits'] 					= 0;
		insert['visits_morning'] 	= 0;
		insert['visits_afternoon']= 0;
		insert['visits_evening'] 	= 0;
		insert['visits_night'] 		= 0;
		insert['position'] 				= 999;

		if ( parseInt($('#url-dialog-groups').val()) >= 0 ) {
			insert['idgroup'] = parseInt($('#url-dialog-groups').val());
		} else {
			insert['idgroup'] = 0;
		}

		insert['url'] = fixUrl(insert['url']);

		if (!insert['title'] || !insert['url'])
		{
			show_message(i18n('new_tab_add_dial_error'));
			return false;
		}

			// create group and save
			if ( $('#url-dialog-groups').val()=='-1' ) {
				var newgroup = new Array();
				newgroup['title'] = $('#newGroupName').val();
				newgroup['color'] = $('#newGroupColor').val();
				if (!newgroup['title'])
				{
					show_message(i18n('new_tab_enter_group_name'));
					return false;
				}
				speeddial.storage.addGroup(newgroup,function(tx,rs) {
					insert['idgroup'] = rs.insertId;
					speeddial.storage.addItem(insert);
					reload();
				})
			} else {
				speeddial.storage.addItem(insert,reload);
			}
		resetDialog();
		if ($('.first-dial')) $('.first-dial').remove();
	}

// EDITING BOOKMARK

	function editBookmark() {

		id				= parseInt($('#add-edit-dialog #bookmark_id').val());
		title 		= $('#add-edit-dialog #name').val();
		url 			= encodeInNeed($('#add-edit-dialog #url').val());
		thumbnail = $('#add-edit-dialog #thumbnail').val();
		if ( parseInt($('#url-dialog-groups').val()) >= 0 ) {
			var thisgroup = parseInt($('#url-dialog-groups').val());
		}

		var clearVisitsData;

		if ( id < 0 || !title || !url ) {
			show_message(i18n('new_tab_add_dial_error'));
			return false;
		}

		if (previous!=url) {
			// db_url localStorage.removeItem( 'thumbnail_'+encodeURIComponent(previous) );
			speeddial.storage.removeThumbnail(previous);
			clearVisitsData = true;
		}
		if (previous_thumbnail=='' && thumbnail!='') {
			// db_url localStorage.removeItem( 'thumbnail_'+encodeURIComponent(previous) );
			speeddial.storage.removeThumbnail(previous);
		}
		else {clearVisitsData = false;}

		var editBookmark = new Array();

		editBookmark['id'] = id;
		editBookmark['title'] = title;
		editBookmark['url'] = url;
		editBookmark['thumbnail'] = thumbnail;
		editBookmark['url'] = fixUrl(editBookmark['url']);
		editBookmark['idgroup'] = thisgroup;
		speeddial.storage.editItem(editBookmark, clearVisitsData);
		resetDialog();
		show_message(i18n('new_tab_dial_saved'));
	}

	function editGroup() {

		id				= parseInt($('#url-dialog #bookmark_id').val());
		title 		= $('#url-dialog #name').val();
		color 		= $('#url-dialog #color').val();

		if ( parseInt(id) < 0 || !title ) { show_message(i18n('new_tab_enter_group_name')); return false; }

		var group = new Array();
		group['id'] = id;
		group['title'] = title;
		group['color'] = color;

		speeddial.storage.editGroup(group, true);
		resetDialog();
		show_message(i18n('new_tab_group_edited'));
	}

	function addGroup() {

		title 		= $('#url-dialog #name').val();
		color 		= $('#url-dialog #color').val();

		if ( !title ) {  show_message(i18n('new_tab_enter_group_name')); return false; }

		var group = new Array();

		group['title'] = title;
		group['color'] = color;

		speeddial.storage.addGroup(group, function(){ resetDialog(); show_message(i18n('new_tab_group_edited')); reload() });


	}

	function moveToGroup(idDial,idGroup) {
		speeddial.storage.moveToGroup(idDial,idGroup, reload);
	}

// --------------------------------------------------------

// REORDER BOOKMARKS

	function reorderBookmarks() {
		var items = $('#pages li.link');
		var neworder = {};
		for (var i=0; i < items.length; i++) {
			id = $(items[i]).attr('id');
			pos = i;
			speeddial.storage.updateItemOrder(id,pos);
			neworder[id] = pos;
		};
		b.sync_order_bookmarks(neworder);
	}

// --------------------------------------------------------

	function check_notice() {
		if (localStorage[version_notice]!='false') { $('#notice').show(); }
	}

	function close_notice()
	{
		setValue(version_notice,'false');
		$('#notice').remove();
	}

// --------------------------------------------------------

// PAGES ON LOAD

	function pagesOnLoad() {

		// fix for scrolling issue on a Mac
		if ( navigator.appVersion.indexOf("Mac")!=-1 )
		{
 			if (!window.location.hash)
 			{
 				chrome.tabs.getSelected(null, function (tab) { chrome.tabs.update(tab.id, {url : chrome.extension.getURL('newtab.html#'+GROUP)} ) })
			}
		}


		$('[rel=tooltip]').tooltip({animation:true});

		$('#groups li').click(function(e){

			if (SORTINGGROUPS === false) {

				//if (isCtrl === true || e.which=='2') {
				if (e.which=='2') {
					openAllFromGroup( $(this).attr('loadgroup') );
					e.preventDefault();
					e.stopPropagation();
					return false;

				} else {

					GROUP = $(this).attr('loadgroup');
					window.location.hash = '#'+GROUP;
					scroll(0,0);

					if (localStorage['options.keepActiveGroup']==1) {
						localStorage['options.activeGroup'] = GROUP;
					}

					reload();

					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			}
		})

		$('.link').click(function(e){

			$this = $(this);

			if (SORTING === false) {

				localStorage['refreshThumbnail'] = '';

				// create thumbnail for the firsttime
				if ($this.hasClass('no-thumbnail'))
				{
					speeddial.storage.trackVisits( $this.attr('url') );
					getThumbnail( $this.attr('url'), false );
					e.preventDefault();
					e.stopPropagation();
					return false;
				}

				// refresh thumbnail?
				if ( localStorage['options.alwaysNewTab']==1 || (localStorage['options.alwaysNewTab'] != '1' && (isCtrl != true || e.which != 2)) ) {
					if ( localStorage['options.refreshThumbnails']>0) {
						if ($this.attr('custom_thumbnail')!='true' && ($this.attr('visits'))%(localStorage['options.refreshThumbnails'])==0) {
							localStorage['refreshThumbnail'] = $this.attr('url');
						}
					}
				}

				// normal click - +1 to url visits
				if (e.which!=3) {
					speeddial.storage.trackVisits( $this.attr('url') );
				}

				// always open in new tab + ctrl|middleclick
				if ( localStorage['options.alwaysNewTab'] == '1' && (isCtrl == true || e.which == 2)) {
					openInCurrent( $this.attr('url') );
					e.preventDefault();
					e.stopPropagation();

				// always open in new tab
				} else if ( localStorage['options.alwaysNewTab'] == '1' ) {
					chrome.tabs.create({url: $this.attr('url'),	selected:true });
					e.preventDefault();
				}

				// normal click event is handled by <a> tag in each dial
				// command+click doesn't seem to work correctly in chrome(mac)
				if ( navigator.appVersion.indexOf("Mac")!=-1 ) {
					if ( ( isCtrl == true || e.which == 2 ) &&  localStorage['options.alwaysNewTab']!=1 ) {
						openInNew( $this.attr('url') );
	          e.preventDefault();
  	        e.stopPropagation();
					}
				}

			} else {
				return false;
			}
		})

		// create context menu
		$('.link:not(.folder)').contextMenu('editlinkmenu', {
			menuStyle : {
				border : "1px solid #ccc"
			},
			onContextMenu: function(e) {
				page_edit_id = $(e.target).attr('rel');
				return true;
			},
			bindings: {
				'opennewwindow': 		function(t) { openInNew( $(t).attr('url') ); 						},
				'refresh': 				function(t) { getThumbnail( $(t).attr('url'), true ); 	},
				'delete': 				function(t) { removeBookmark( $(t) ); 				},
				'edit':   				function(t) { prepareDialog('edit', $(t).attr('id') ); 	},
			}
		});

		// create context menu
		$('#groups li:not(".home")').contextMenu('editgroupmenu', {
			menuStyle : {
				border : "1px solid #ccc"
			},
			onContextMenu: function(e) {
				page_edit_id = $(e.target).attr('rel');
				return true;
			},
			bindings: {
				'editgroup':   				function(t) { prepareDialog('editgroup', $(t).attr('loadgroup') ); 	},
				'openallgroup':   			function(t) { openAllFromGroup( $(t).attr('loadgroup') ); },
				'deletegroup':   			function(t) { prepareDialog('removegroup', $(t).attr('loadgroup')) 	}
			}
		});

		// create context menu
		$('#groups li.home').contextMenu('edithomegroupmenu', {
			menuStyle : {
				border : "1px solid #ccc"
			},
			bindings: {
				'openallgroup':	function(t) { openAllFromGroup( $(t).attr('loadgroup') ); }
			}
		});

		// create context menu for apps
		$('.app, #appspanel li').not('no-uninstall').contextMenu('editappmenu', {
			menuStyle : {
				border : "1px solid #ccc"
			},
			onContextMenu: function(e) {
				$this = $(e.target).parents('li');
				app_edit_id = $this.attr('rel');
				if ($this.data('uninstall')==false) {
					$('#app_uninstall').hide()
				} else {
					$('#app_uninstall').show()
				}
				if ($this.data('options')!='') {
					$('#app_options').css('color','#000')
				} else {
					$('#app_options').css('color','#999')
				}
				return true;
			},
			bindings: {
				'app_launch': 	      function(t) { launchApp($(t).attr('rel'))},
				'app_options': 	      function(t) { if ($(t).data('options')!='' ) {openInCurrent($(t).data('options'))}  },
				'app_uninstall': 	    function(t) { appUninstall($(t).attr('rel'),t)}
			}
		});

		$('#container').contextMenu('newitemmenu', {
			menuStyle : {
				border : "1px solid #ccc"
			},
			bindings: {
				'add': 					function(t) { prepareDialog('add',null); },
				'create_group': function(t) { prepareDialog('create_group',null); },
				'options': 			function(t) { top.location.href=chrome.extension.getURL('options.html'); },
				'statistics': 	function(t) { top.location.href=chrome.extension.getURL('statistics.html'); },
				'help': 				function(t) { top.location.href=chrome.extension.getURL('help.html'); }
			}
		});

		// wait 10ms hack
		$('#message').animate({opacity:'1'},10,function(){

			if (localStorage['options.order']=='position') {
				var revert = false
			} else {
				var revert = true
			}

			// ADD remove-icon
			$("#pages li .thumbnail_container").hover(function() {
				if (SORTING == true) return;
				var $this = $(this);
				var id = $this.parents('li').attr('id');
				$this.find('.remove-icon').remove();
				var remove_icon = document.createElement('span');
				remove_icon.setAttribute('class','remove-icon');
				remove_icon.innerHTML = "&#10005;";
				$this.append(remove_icon);
				$(remove_icon).animate({size:1},800,function(){
					$(remove_icon).fadeIn(250,'swing');
					$(remove_icon).click(function(e){
						prepareDialog('removedial',id);
						e.preventDefault();
						e.stopPropagation();
					})
				})
			}, function(){
				$('.remove-icon').stop().remove();
			})

			if (localStorage['options.order']=='visits')
			{
				var v = $('#pages li');
				for (var i = v.length - 1; i >= 0; i--) {

					var position = $(v[i]).offset();
					console.log(position);
					$(v[i]).css('position','absolute');
					$(v[i]).css('top',position.top);
					$(v[i]).css('left',position.left);
					$(v[i]).attr('top',position.top);
					$(v[i]).attr('left',position.left);

				};
			}

			// sortable groups
			if ($('#groups li').length>0 || localStorage['options.order'] == 'position')
			{

				$("#pages").sortable(
				{
					delay:100,
					tolerance:'pointer',
					connectWith: '.group',
					appendTo: 'body',
					placeholder: 'pagesplaceholder',
					forcePlaceholderSize: true,
					start: function(event, ui) {
						SORTING = true;
						$(ui.item).addClass('beingdragged');
						if ($('#groups li').length>0)
						{
							var position = $('#pages').offset();
							$('#pages').css({'position':'absolute','top':$('#groups').height(),'left':position.left});
							$('#groups').css('position','fixed');
						}
					},
					stop: function(event, ui)  {
						$(ui.item).removeClass('beingdragged');
						$(ui.item).css('top' , $(ui.item).attr('top'));
						$(ui.item).css('left', $(ui.item).attr('left'));
						// save new positions
						setTimeout(function(){SORTING = false;},200);
						if ($('#groups li').length>0)
						{
							$('#groups').css('position','relative');
							$('#pages').css({'position':'relative','top':0,'left':0});
						}
						if (localStorage['options.order']=='position') reorderBookmarks();
					}
				})

				$(".group").droppable({
					accept: '.link',tolerance: 'pointer',
					over: function(event, ui) {
						$(".group").removeClass('hovered');
						$(this).addClass('hovered');
					},
					out: function(event, ui) {
						$(".group").removeClass('hovered');
					},
					drop:function(event,ui) {
						var movetogroup = $(this).parent().attr('loadgroup');
						var item_id = $(ui.draggable).attr('id');
						if (parseInt(movetogroup) >= 0) {
							moveToGroup(item_id,movetogroup)
							$(ui.draggable).remove();
						}
						$('footer').animate({opacity:1},50,function(){SORTING = false})
					},
				})


			// sortable groups
			$("#groups").sortable({

				delay:100, axis: 'x', placeholder: 'groupsplaceholder', tolerance: 'intersect',
				start: function(event, ui) { SORTINGGROUPS = true; },
				stop: function(event, ui)  {
					$('#message').animate({opacity:1},50,function(){SORTINGGROUPS = false})
					var groups_list = $('#groups li');
					var neworder = {};
					for (var i = 0; i < groups_list.length; i++)
					{
						neworder[$(groups_list[i]).attr('loadgroup')] = i+1;
						speeddial.storage.setGroupPosition( $(groups_list[i]).attr('loadgroup'), i+1 );
					};
					b.sync_order_groups(neworder);
					return true;
				}
			});

			}

			//b._browser_start_ = false;

		})
}

/* END BOOKMARKS */

$(function() {

	init();

	$('*[i18n]').each(function(){
		$(this).html(i18n($(this).attr('i18n')));
	})

	// update notices
	check_notice();

	$('#add_bookmark').click(function(){ addBookmark(); return false; })
	$('#edit_bookmark').click(function(){ editBookmark(); return false; })
	$('#new-bookmark-link').click( function() { prepareDialog('add',null); })
	$('#logo').change(function(){if ($(this).val()!='') $('#thumbnail').val($(this).val()); })
	$('#save_group').click(function(){ addGroup(); return false; })
	$('#edit_group').click(function(){ editGroup(); return false; })
	$('#add_group').click(function(){ addGroup(); return false; })
	$('#delete_group').click(function(){ removeGroup(); return false; })
	$('#delete_dial').click(function(){ removeDial(); return false; })
	$('.close').click( function() { resetDialog(); $(this).parents('.dialog').hide() })
	$('#url-dialog .close').click( function() { resetDialog(); })
	$('input').attr('autocomplete','off')
	$('a.ext').attr('target','_blank')
	$('.openurl').live('click',function(e){openurl($(this).attr('rel'),e)})
	$('#url-dialog-groups').change(function(){
		if ($(this).val()==-1) {
			$('#newGroup').show();
		} else {
			$('#newGroup').hide()
		}
	})
	// Esc and Enter on url-dialog
	$('#add-edit-dialog').keyup(function(e)
	{
		if ( e.keyCode == 13 ){

			if ( $('#url:focus').length > 0 ) return false;

			if (dialog_mode == 'add')
				$('#add_bookmark').click()
			else if (dialog_mode == 'edit')
				$('#edit_bookmark').click()
		}
		else if ( e.keyCode == 27 ) { resetDialog(); }
	})

	// Name suggestion
	$('#add-edit-dialog #url').blur(function(){
		if (dialog_mode=='add')
		{
			$('#add-edit-dialog #name').val('')
		}
	})
	$('#add-edit-dialog #name').focus(function(){
		if (dialog_mode=='add')
		{
			if ($(this).val() == '' && $('#add-edit-dialog #url').val().length < 20) {
				var suggested_name = $('#add-edit-dialog #url').val();
				suggested_name = suggested_name.replace('http://','').replace('.org','').replace('.com','').replace('.net','').replace('www.','').replace('/','.');
				suggested_name = suggested_name.charAt(0).toUpperCase() + suggested_name.slice(1);
				$('#add-edit-dialog #name').val(suggested_name);
			}
		}
	})

// SIDEBAR

	var wiw = window.innerWidth;
	var wih = window.innerHeight;

	$('footer').animate({zoom:1},100,function(){

		window.addEventListener("resize", function() {
			if ( Math.abs(window.innerWidth - wiw) > 100 || Math.abs(window.innerHeight - wih) > 100 ) {
				reload();
				wiw = window.innerWidth;
				wih = window.innerHeight;
			}
		}, false);

	})

});


// quick settings

$(function(){

	if (getValue('options.columns')>=0) {
		$('#options-columns').val(getValue('options.columns'));
		$('#options-columns-val').val(getValue('options.columns'));
	}
	$('#options-columns').change(function(){
		$('#options-columns-val').val($(this).val())
		setValue('options.columns', $(this).val() )
		reload();
	});

	if (getValue('options.dialspacing')>=0) {
		$('#options-dialspacing').val(getValue('options.dialspacing'));
		$('#options-dialspacing-val').val(getValue('options.dialspacing'));
	}
	$('#options-dialspacing').change(function(){
		$('#options-dialspacing-val').val($(this).val())
		setValue('options.dialspacing', $(this).val() )
		reload();
	});
	if (getValue('options.dialSpace')>=0) {
		$('#options-dialspace').val(getValue('options.dialSpace'));
		$('#options-dialspace-val').val(getValue('options.dialSpace'));
	}
	$('#options-dialspace').change(function(){
		$('#options-dialspace-val').val($(this).val())
		setValue('options.dialSpace', $(this).val() )
		reload();
	});
	if (getValue('options.showAddButton')==1) {
		$('#options-showAddButton').attr('checked',true);
	}
	if (getValue('options.centerVertically')==1) {
		$('#options-centervertically').attr('checked',true);
	}

	switch(getValue('options.scrollLayout'))
	{
	case '0':
		$('#options-scrollLayout0').attr('checked',true);
		break;
	default:
		$('#options-scrollLayout1').attr('checked',true);
	}

	$('.save_settings_button').click(function(){
		b.sync_settings();
	})

	/* PRETTY CHECKBOXES */

	$('.on_off').iphoneStyle({
		checkedLabel: '&#10004;',
		uncheckedLabel: '&#10006;'
	});

	$( ".radio" ).buttonset();

})

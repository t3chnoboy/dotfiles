
  $.ajaxSetup({
		cache: false
	});

// PRELOAD
	// var b = chrome.extension.getBackgroundPage();

// USER SETTINGS
	var SORTING = false;
	var SORTINGGROUPS = false;
	var COLS = localStorage.getItem('options.columns');
	var EXPERIMENTAL_THUMBNAIL_CACHE = false;
	var GROUPS = new Array();
	var GROUP = 0;

	if(window.location.hash) {
		GROUP = window.location.hash.replace('#','');
		if (localStorage['options.keepActiveGroup']==1) {
			localStorage['options.activeGroup'] = GROUP;
		}
	}

	if (localStorage['options.activeGroup'] >= 0) {
		GROUP = localStorage['options.activeGroup'];
	}


// SPEED DIAL
	var speeddial = {};
	speeddial.storage = {};
	speeddial.storage.db = null;

// FUNCTIONS
	speeddial.storage.open = function() {
		var dbSize = 1 * 1024 * 1024; // 2MB
		speeddial.storage.db = null;
		speeddial.storage.db = openDatabase('bookmarks', '1.0', 'Speeddial2', dbSize);
	}
// DEFAULT ERROR TX FUNCTION
	speeddial.storage.onError = function(tx, e) {
		alert('Something unexpected happened: ' + e.message );
	}
// DEFAULT SUCCESS TX FUNCTION
	speeddial.storage.onSuccess = function(tx, r) {
		speeddial.storage.getAllItems(loadItems, GROUP);
	}

	speeddial.storage.is_sync = function() {
		if (localStorage['options.sync.username'] && localStorage['options.sync.password']) return true;
		return false;
	}

	speeddial.storage.sync = function(callback) {

		if (!speeddial.storage.is_sync()) return false;

		var current=[], sync=[];
		var currentgroups=[], syncgroups=[];
		var sync_url = speeddial.storage.sync_url();

		console.log('Sync started for '+localStorage.getItem('options.sync.username'));

		$.getJSON(
			sync_url+'/sync2/get',
			{
				'username':localStorage.getItem('options.sync.username'),
				'password':localStorage.getItem('options.sync.password')
			},
			function(obj) {

				if (obj) {

				//obj = JSON.parse(response);

				// is this a valid json with settings?
				if (obj!='' && obj.settings && obj.dials) {

				var number_of_bookmarks = Object.size(obj.dials);

				// create array of bookmark ids to sync
				$.each(obj.dials,function(key,value) {
					sync.push(parseInt(value.id))
				})

				/* SYNC DIALS */
				speeddial.storage.getAllItems(function(tx,rs)
				{

					// create array of my current bookmark ids
					for (var i=0; i < rs.rows.length; i++) {
						current.push(rs.rows.item(i).id);
					}
					// console.log(current);

					// to be deleted
					var to_remove = current.diff(sync);
					//console.log(to_remove);

					// to be inserted
					var to_insert = sync.diff(current);
					// console.log(to_insert);

					$.each(obj.dials,function(key,value)
					{
						// insert
						if ( $.inArray(parseInt(value.id), to_insert) > -1 ) {
							console.log('create bookmark - '+value.title);
							speeddial.storage.addItem(value, function(){});
						}
						// modify
						else {
							//console.log('modify bookmark - '+value.title);
							speeddial.storage.editItem(value, false, function(){}, false);
						}
					});

					for (var i=0; i < rs.rows.length; i++) {
						// remove
						if ( $.inArray(parseInt(rs.rows.item(i).id), to_remove) > -1 ) {
							console.log('remove bookmark - '+rs.rows.item(i).title);
							speeddial.storage.deleteItem(rs.rows.item(i).id);
						}
					}
				});

			/* END:SYNC DIALS */
			/* SYNC GROUPS */

				// create array of bookmark ids to sync
				$.each(obj.groups,function(key,value) {
					syncgroups.push(parseInt(value.id))
				})

				speeddial.storage.getGroups(function(tx,rs)
				{

					// create array of my current bookmark ids
					for (var i=0; i < rs.rows.length; i++) {
						currentgroups.push(rs.rows.item(i).id);
					}

					// to be deleted
					var groups_to_remove = currentgroups.diff(syncgroups);

					// to be inserted
					var groups_to_insert = syncgroups.diff(currentgroups);

					$.each(obj.groups,function(key,value)
					{
						// insert
						if ( $.inArray(parseInt(value.id), groups_to_insert) > -1 ) {
							console.log('create group - '+value.title);
							speeddial.storage.addGroup(value,function(){});
						}
						// modify
						else {
							//console.log('modify group - '+value.title);
							speeddial.storage.editGroup(value,false,function(){});
						}
					});

					for (var i=0; i < rs.rows.length; i++) {
						// remove
						if ( $.inArray(parseInt(rs.rows.item(i).id), groups_to_remove) > -1 ) {
							console.log('remove group - '+rs.rows.item(i).title);
							speeddial.storage.deleteGroup(rs.rows.item(i).id, true)
						}
					}

				});

			/* END: SYNC GROUPS */
			/* SYNC SETTINGS */

				if (obj.settings) {
					$.each(obj.settings,function(key,value){
						localStorage.setItem(key,value);
					});
				}

			/* END: SYNC SETTINGS */

			}
			if (callback) callback();

		}});
	}

	speeddial.storage.backup_and_sync = function(callback) {

		if (!speeddial.storage.is_sync()) return false;

		var sync_url = speeddial.storage.sync_url();
		var export_settings = {};
		export_settings.settings = {}
		export_settings.dials = {}
		export_settings.groups = {}

		speeddial.storage.open();
		speeddial.storage.getGroups(function(tx,rs){

			for (var i=0; i < rs.rows.length; i++) {
				export_settings.groups[i] = rs.rows.item(i);
			}
			speeddial.storage.getAllItems(function(tx, rs) {

					console.log('making backup of your setting on server...');

					// export settings
					for (var i=0; i < window.localStorage.length; i++) {

						key = localStorage.key(i);

						// no thumbnails
						if (
							key.indexOf('sync.password')==-1
							&& key.indexOf('sync.username')==-1
							&& key.indexOf('thumbnail_')==-1
							&& key.indexOf('_opened_tabs')==-1
							&& key.indexOf('_restore_tabs')==-1
							&& key.indexOf('_closed_tabs')==-1
							&& key.indexOf('options.activeGroup')==-1
						   ) {
							value = localStorage.getItem(localStorage.key(i));
							export_settings.settings[key] = value;
						}

					};

					// export dials
					for (var i=0; i < rs.rows.length; i++) {
						export_settings.dials[i] = rs.rows.item(i);
					}

					//console.log(export_settings);

					$.post(sync_url+'/sync2/backup',{

						'username':localStorage.getItem('options.sync.username'),
						'password':localStorage.getItem('options.sync.password'),
						'sync':JSON.stringify(export_settings, null, 2)

					},function(response){

						return speeddial.storage.sync(callback);

					},"json");

			});
		}, false)		

	}

	speeddial.storage.import_settings = function(settings, callback) {

		if (!settings) return false;
		var obj = JSON.parse(settings);
		if (obj)
		{
			// set new settings
			if (obj.settings) {
				$.each(obj.settings,function(key,value){
					localStorage.setItem(key,value);
				});
			}

			// clear and import groups
			speeddial.storage.dropTableGroups(function() {
				speeddial.storage.createTable(function(){
					if (obj.groups) {
						$.each(obj.groups,function(key,value){
							console.log('importing group - '+value.title);
							speeddial.storage.addGroup( value, function() {} );
						});
					}
				});
			});

			// clear and import dials
			speeddial.storage.dropTableBookmarks(function(){
				speeddial.storage.createTable(function(){
					if (obj.dials) {

						var number_of_dials = Object.size(obj.dials);
						$.each(obj.dials,function(key,value)
						{
							if (value.title && value.url) {
								console.log('importing bookmark - '+value.title);
								speeddial.storage.addItem(value, function() {});
							}
							if (key == (number_of_dials - 1)) {

								speeddial.storage.optimizeThumbnailCache();
								// sync!
								setTimeout(function(){b.sync_to_server()},5000);
								// callback
								if (callback) callback();

							}
						});
					}
				})
			});

		}
	}

	speeddial.storage.sync_to_server = function(callback) {

		if (!speeddial.storage.is_sync()) return false;

		var sync_url = speeddial.storage.sync_url();
		var export_settings = {};
		export_settings.settings = {}
		export_settings.dials = {}
		export_settings.groups = {}

		speeddial.storage.open();
		speeddial.storage.getGroups(function(tx,rs){

			for (var i=0; i < rs.rows.length; i++) {
				export_settings.groups[i] = rs.rows.item(i);
			}
			speeddial.storage.getAllItems(function(tx, rs) {

					// export settings
					for (var i=0; i < window.localStorage.length; i++) {

						key = localStorage.key(i);

						// no thumbnails
						if (
							key.indexOf('sync.password')==-1
							&& key.indexOf('sync.username')==-1
							&& key.indexOf('thumbnail_')==-1
							&& key.indexOf('_opened_tabs')==-1
							&& key.indexOf('_restore_tabs')==-1
							&& key.indexOf('_closed_tabs')==-1
							&& key.indexOf('options.activeGroup')==-1
						   ) {
							value = localStorage.getItem(localStorage.key(i));
							export_settings.settings[key] = value;
						}

					};

					// export dials
					for (var i=0; i < rs.rows.length; i++) {
						export_settings.dials[i] = rs.rows.item(i);
					}

					//console.log(export_settings);

					$.post(sync_url+'/sync2/import',{

						'username':localStorage.getItem('options.sync.username'),
						'password':localStorage.getItem('options.sync.password'),
						'sync':JSON.stringify(export_settings, null, 2)

					},function(response){

						if (response.code == 1) {
							if (response.last_sync > 0) localStorage.setItem('options.sync.lastsync',response.last_sync);
						}
						if (callback) callback(response);

					},"json");

			});
		})
	}

	speeddial.storage.sync_url = function() {

		var u = localStorage.getItem('options.sync.username');
		var p = localStorage.getItem('options.sync.password');

		//return 'http://'+u+':'+p+'@speeddial2.com';
		return 'https://speeddial2.com';

	}

	speeddial.storage.test_sync_account = function(callback) {

		if (!speeddial.storage.is_sync()) return false;
		var url = speeddial.storage.sync_url();

		$.post(url+'/sync2/test_account', {
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password')
		}, function(response){
			if (response.code == '1' && parseInt(response.user) > 0) {
				callback(response);
			} else {
				return false;
			}
		},"json")

	}

	speeddial.storage.sync_settings = function() {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var settings = {};

		var s = {};

		// export settings
		for (var i=0; i < window.localStorage.length; i++) {

			key = localStorage.key(i);

			// no thumbnails
			if (key.indexOf('sync.password')==-1
				&& key.indexOf('sync.username')==-1
				&& key.indexOf('thumbnail_')==-1
				&& key.indexOf('_opened_tabs')==-1
				&& key.indexOf('_restore_tabs')==-1
				&& key.indexOf('_closed_tabs')==-1
				&& key.indexOf('options.activeGroup')==-1
			   ) {
				value = localStorage.getItem(localStorage.key(i));
				settings[key] = value;
			}

		};
		s['settings'] = settings;

		$.post(url+'/sync2/settings',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		})

	}

	speeddial.storage.sync_add_group = function(id, group) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['id'] = id;
		s['action'] = 'create';
		s['group'] = {};
		s['group']['title'] = group['title'];
		s['group']['color'] = group['color'];
		s['group']['position'] = group['position'];

		$.post(url+'/sync2/group',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		})

	}

	speeddial.storage.sync_edit_group = function(id, group) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['id'] = id;
		s['action'] = 'edit';
		s['group'] = {};
		s['group']['title'] = group['title'];
		s['group']['color'] = group['color'];
		s['group']['position'] = group['position'];

		$.post(url+'/sync2/group',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		})

	}

	speeddial.storage.sync_remove_group = function(id) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['id'] = id;
		s['action'] = 'remove';

		$.post(url+'/sync2/group',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		})
	}

	speeddial.storage.sync_order_groups = function(groups) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['groups'] = groups;
		s['action'] = 'reorder';
		$.post(url+'/sync2/group',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		});
	}

	speeddial.storage.sync_add_bookmark = function(id, bookmark) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['id'] = id;
		s['action'] = 'create';
		s['bookmark'] = {};
		s['bookmark']['title'] = bookmark['title'];
		s['bookmark']['url'] = bookmark['url'];
		s['bookmark']['position'] = bookmark['position'];
		s['bookmark']['idgroup'] = bookmark['idgroup'];
		s['bookmark']['thumbnail'] = bookmark['thumbnail'];
		s['bookmark']['ts_created'] = bookmark['ts_created'];

		$.post(url+'/sync2/bookmark',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		})
	}

	speeddial.storage.sync_edit_bookmark = function(id, bookmark) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['id'] = id;
		s['action'] = 'edit';
		s['bookmark'] = {};
		s['bookmark']['title'] = bookmark['title'];
		s['bookmark']['url'] = bookmark['url'];
		s['bookmark']['position'] = bookmark['position'];
		s['bookmark']['idgroup'] = bookmark['idgroup'];
		s['bookmark']['thumbnail'] = bookmark['thumbnail'];
		s['bookmark']['ts_created'] = bookmark['ts_created'];
		s['bookmark']['visits'] = bookmark['visits'];
		s['bookmark']['visits_morning'] = bookmark['visits_morning'];
		s['bookmark']['visits_afternoon'] = bookmark['visits_afternoon'];
		s['bookmark']['visits_evening'] = bookmark['visits_evening'];
		s['bookmark']['visits_night'] = bookmark['visits_night'];

		$.post(url+'/sync2/bookmark',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		})
	}

	speeddial.storage.sync_remove_bookmark = function(id) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['id'] = id;
		s['action'] = 'remove';
		$.post(url+'/sync2/bookmark',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		})
	}

	speeddial.storage.sync_order_bookmarks = function(bookmarks) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['bookmarks'] = bookmarks;
		s['action'] = 'reorder';
		$.post(url+'/sync2/bookmark',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		});
	}

	speeddial.storage.sync_move_bookmark = function(id_bookmark,id_group) {

		if (!speeddial.storage.is_sync()) return false;

		var url = speeddial.storage.sync_url();
		var s = {};
		s['bookmark'] = id_bookmark;
		s['group'] = id_group;
		s['action'] = 'move';
		$.post(url+'/sync2/bookmark',
		{
			'username':localStorage.getItem('options.sync.username'),
			'password':localStorage.getItem('options.sync.password'),
			's':JSON.stringify(s, null, 2)
		});
	}

// CREATE/ALTER/DROP TABLE

// --------- BOOKMARKS

	speeddial.storage.createTable = function(callback) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
				'bookmarks(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, thumbnail TEXT NULL, ts_created INTEGER, visits INTEGER, visits_morning INTEGER, visits_afternoon INTEGER, visits_evening INTEGER, visits_night INTEGER, position INTEGER, idgroup INTEGER DEFAULT 0)', [],
				null,speeddial.storage.onError);
		});
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 'groups(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title TEXT, color TEXT, position INTEGER DEFAULT 0)', [], null,speeddial.storage.onError);
		});
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 'thumbnails(url TEXT NOT NULL, thumbnail TEXT)', [], callback,speeddial.storage.onError);
		});
	}

	speeddial.storage.dropTableBookmarks = function(callback) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('DROP TABLE bookmarks',[],callback,speeddial.storage.onError);
		});
	}
	speeddial.storage.getAllItems = function(renderFunc, id_group) {
		speeddial.storage.db.transaction(function(tx) {

			if (parseInt(id_group) > -1) {
				// default order
				var query = 'SELECT * FROM bookmarks WHERE idgroup = ? ORDER BY visits DESC';
				// user selected order
				if (localStorage.getItem('options.order')=='position')
				{ query = 'SELECT * FROM bookmarks WHERE idgroup = ? ORDER BY position ASC, ts_created ASC'; }

				tx.executeSql(query, [id_group], renderFunc, speeddial.storage.onError);

			} else {

			query = 'SELECT * FROM bookmarks ORDER BY position ASC';
			tx.executeSql(query, [], renderFunc, speeddial.storage.onError);

			}
		});
	}

	speeddial.storage.getItem = function(id,renderFunc) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM bookmarks WHERE id = ?', [id], renderFunc,
				speeddial.storage.onError);
		});
	}
	speeddial.storage.addItem = function(bookmark, callback) {
		if (!callback) {callback = speeddial.storage.onSuccess }

		if (!bookmark['thumbnail']) bookmark['thumbnail'] = '';
		if (!bookmark['ts_created']) bookmark['ts_created'] = Math.round(new Date().getTime() / 1000);
		if (!bookmark['position']) bookmark['position'] = 999;

		if (!bookmark['visits']) bookmark['visits'] = 0;
		if (!bookmark['visits_afternoon']) bookmark['visits_afternoon'] = 0;
		if (!bookmark['visits_evening']) bookmark['visits_evening'] = 0;
		if (!bookmark['visits_morning']) bookmark['visits_morning'] = 0;
		if (!bookmark['visits_night']) bookmark['visits_night'] = 0;

		if (typeof bookmark['idgroup']=="undefined") bookmark['idgroup'] = 0;

		if (bookmark['id']>0) {

			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('INSERT INTO bookmarks (id, title, url, thumbnail, ts_created, visits, visits_morning, visits_afternoon, visits_evening, visits_night, position, idgroup) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[bookmark['id'],bookmark['title'], bookmark['url'], bookmark['thumbnail'], bookmark['ts_created'], bookmark['visits'], bookmark['visits_morning'], bookmark['visits_afternoon'], bookmark['visits_evening'], bookmark['visits_night'], bookmark['position'],bookmark['idgroup']],
					callback,speeddial.storage.onError);
			});

		} else {

			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('INSERT INTO bookmarks (title, url, thumbnail, ts_created, visits, visits_morning, visits_afternoon, visits_evening, visits_night, position, idgroup) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
					[bookmark['title'], bookmark['url'], bookmark['thumbnail'], bookmark['ts_created'], bookmark['visits'], bookmark['visits_morning'], bookmark['visits_afternoon'], bookmark['visits_evening'], bookmark['visits_night'], bookmark['position'],bookmark['idgroup']],
					function(tx,rs){

						// sync
						var id = rs.insertId;
						b.sync_add_bookmark(id,bookmark);
						callback();

					},speeddial.storage.onError);
			});

		}

	}
	speeddial.storage.editItem = function(bookmark,clearVisitsData,callback,sync) {

		if (!callback) { callback = speeddial.storage.onSuccess }
		if (!bookmark) return false;

		if (clearVisitsData == true) { clearData = ',visits=0';  } else { clearData = ''; }
		if (parseInt(bookmark['position'])>0) {

			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('UPDATE bookmarks SET title=?, url=?, thumbnail =?, position=?, idgroup =? '+clearData+' WHERE id=?',
					[bookmark['title'], bookmark['url'], bookmark['thumbnail'], parseInt(bookmark['position']), bookmark['idgroup'], bookmark['id']],
					function(tx,rs) {

						if (sync!==false) b.sync_edit_bookmark(bookmark['id'],bookmark);
						callback(tx, rs);

					},speeddial.storage.onError);
			});

		} else {

			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('UPDATE bookmarks SET title=?, url=?, thumbnail =?, idgroup =? '+clearData+' WHERE id=?',
					[bookmark['title'], bookmark['url'], bookmark['thumbnail'], bookmark['idgroup'], bookmark['id']],
					function(tx,rs) {

						if (sync!==false) b.sync_edit_bookmark(bookmark['id'],bookmark);
						callback(tx, rs);

					},speeddial.storage.onError);
			});

		}

	};
	speeddial.storage.deleteItem = function(id) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('DELETE FROM bookmarks WHERE ID=?', [id],
				function() {

					//sync
					b.sync_remove_bookmark(id);

				}, speeddial.storage.onError);
		});
	}
	speeddial.storage.updateItemOrder = function(id,position) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('UPDATE bookmarks SET position=? WHERE ID=?', [position,id],
				null, speeddial.storage.onError);
		});
	}

// --------- END : BOOKMARKS

// --------- GROUPS

	speeddial.storage.dropTableGroups = function(callback) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('DROP TABLE groups',[],callback,speeddial.storage.onError);
		});
	}
	speeddial.storage.getGroups = function(callback) {
		speeddial.storage.db.transaction(function(tx) {

			GROUPS = [];
			GROUPS.length = 0;
			// default order
			var query = 'SELECT * FROM groups ORDER BY position ASC, title ASC';
			// user selected order
			tx.executeSql(query, [], callback, speeddial.storage.onError);
		});
	}
	speeddial.storage.getGroup = function(id,renderFunc) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM groups WHERE id = ?', [id], renderFunc, speeddial.storage.onError);
		});
	}
	speeddial.storage.addGroup = function(group, callback) {
		if (!callback) {callback = speeddial.storage.onSuccess }
		if (group['id']) {
			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('INSERT INTO groups (id, title, color, position) values (?, ?, ?, ?)', [group['id'], group['title'], group['color'], group['position']],callback,speeddial.storage.onError);
			});
		} else {
			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('INSERT INTO groups (title, color, position) values (?, ?, ?)', [group['title'], group['color'], 99],function(tx,rs){

					var id = rs.insertId;
					b.sync_add_group(id,group);
					callback(tx, rs);

				},speeddial.storage.onError);
			});
		}
	}
	speeddial.storage.editGroup = function(group, sync, callback) {
		if (!group) return false;
		if (!callback) callback = reload;

		if (group['position']>0) {

			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('UPDATE groups SET title=?, color =?, position =? WHERE id=?',
					[group['title'], group['color'], group['position'], group['id']],
					function(tx,rs) {

						if (sync==true) { b.sync_edit_group(group['id'],group); }
						callback(tx, rs);

					},speeddial.storage.onError);
			});

		} else {

			speeddial.storage.db.transaction(function(tx){
				tx.executeSql('UPDATE groups SET title=?, color =? WHERE id=?',
					[group['title'], group['color'], group['id']],
					function(tx,rs) {

						if (sync==true) { b.sync_edit_group(group['id'],group); }
						callback(tx, rs);

					},speeddial.storage.onError);
			});

		}
	};

	speeddial.storage.setGroupPosition = function(group, position) {
		if (!group || !position) return false;
		//var g = new Array();
		//g['position'] = position;
		//speeddial.storage.sync_group(group,g);
		speeddial.storage.db.transaction(function(tx){
			tx.executeSql('UPDATE groups SET position=? WHERE id=?',
				[position, group],
				null,speeddial.storage.onError);
		});
	};

	speeddial.storage.moveToGroup = function(idDial,idGroup,callback) {
		if (parseInt(idDial)>0 && parseInt(idGroup)>=0) {
		speeddial.storage.db.transaction(function(tx){
			tx.executeSql('UPDATE bookmarks SET idgroup=?,position=? WHERE id =?',
				[idGroup,999,idDial],function(tx, rs){

					b.sync_move_bookmark(idDial,idGroup);
					callback(tx, rs);

				},speeddial.storage.onError);
		});
		}
	};
	speeddial.storage.deleteGroup = function(id, skipreload) {
		if (parseInt(id)>0) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('DELETE FROM groups WHERE ID=?', [id],
				function(){

					query = 'SELECT * FROM bookmarks WHERE idgroup = ? ORDER BY position ASC';
					tx.executeSql(query, [id], function(tx,rs){
						for (var i=0; i < rs.rows.length; i++) {
							row = rs.rows.item(i);

							speeddial.storage.removeThumbnail(row.url);
							//localStorage.removeItem('thumbnail_' + encodeURIComponent(row.url));

							speeddial.storage.db.transaction(function(tx){
								tx.executeSql('DELETE FROM bookmarks WHERE id =?', [row.id],null,null);
							});
						}
						if (skipreload!==true) { reload(); }
					}, speeddial.storage.onError);
				}, speeddial.storage.onError);
		});

		b.sync_remove_group(id);

		}
	}

// --------- END : GROUPS

// --------- THUMBNAILS

	speeddial.storage.insertThumbnail = function(url, thumbnail, callback) {
		console.log('Inserting thumbnail - '+url);
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('DELETE FROM thumbnails WHERE url = ?', [url],function(){
				tx.executeSql('INSERT INTO thumbnails (url, thumbnail) values (?, ?)', [url, thumbnail],function(){
					speeddial.storage.removeCacheThumbnail(url)
				},speeddial.storage.onError);
			},speeddial.storage.onError);
		});
	}
	speeddial.storage.removeThumbnail = function(url) {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('DELETE FROM thumbnails WHERE url = ?', [url], null, speeddial.storage.onError);
		});
	}
	speeddial.storage.getThumbnail = function(url, element, parent) {

		if ( EXPERIMENTAL_THUMBNAIL_CACHE === true && localStorage['thumbnail_' + encodeURIComponent(url)] ) {
			element.style.backgroundImage = 'url('+localStorage['thumbnail_' + encodeURIComponent(url)]+')';
			parent.setAttribute("class", "link");
			return ;
		}

		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM thumbnails WHERE url = ? LIMIT 1', [url], function(tx,rs){

				if (rs.rows.length > 0) {
					element.style.backgroundImage = 'url('+rs.rows.item(0).thumbnail+')';

					if ( EXPERIMENTAL_THUMBNAIL_CACHE === true && GROUP == 0 ) {
						localStorage['thumbnail_' + encodeURIComponent(url)] = rs.rows.item(0).thumbnail;
					}


					parent.setAttribute("class", "link");
				} else {
					parent.setAttribute("class", "link no-thumbnail");
				}

			},speeddial.storage.onError);
		});
	}
	speeddial.storage.ThumbnailRemoveIfDoesntExists = function(url) {
		speeddial.storage.db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM bookmarks WHERE url = ?', [url], function(tx,rs){
			if (rs.rows.length <= 0) {
				tx.executeSql('DELETE FROM thumbnails WHERE url = ?', [url], null, speeddial.storage.onError);
				console.log('Removed url - '+url);
			}
		},speeddial.storage.onError)})

	}
	speeddial.storage.optimizeThumbnailCache = function() {
		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM thumbnails', [], function(tx,rs){
				// for each thumbnail: check if thumb. url exist - then KEEP of REMOVE
				console.log('optimizeThumbnailCache - Selected all bookmarks');
				for (var i=0; i < rs.rows.length; i++) {
					console.log('optimizeThumbnailCache - check '+rs.rows.item(i).url);
					speeddial.storage.ThumbnailRemoveIfDoesntExists( rs.rows.item(i).url );
				}
			},speeddial.storage.onError);
		});
	}
	speeddial.storage.removeCacheThumbnail = function(url) {
			// rather not going to use this
			//localStorage.removeItem('thumbnail_'   + encodeURIComponent(url));
			//console.log('removed cache thumbnail - '+url);
			return true;
	}

// --------- END : THUMBNAILS

// --------- MISCELLANEOUS

	speeddial.storage.alterTable = function(query) {
		speeddial.storage.db.transaction(function(tx){
			tx.executeSql(query, [],null, speeddial.storage.onError);
		});
	}
	speeddial.storage.hightlightExperimental = function() {
		if (localStorage['options.highlight']==1) {
			var dayPart = '';
			var hours = new Date().getHours();
			if ( hours >= 0  ) dayPart = 'night';
			if ( hours >= 6  ) dayPart = 'morning';
			if ( hours >= 12 ) dayPart = 'afternoon';
			if ( hours >= 18 ) dayPart = 'evening';
			var query = 'SELECT id FROM bookmarks WHERE idgroup='+GROUP+' ORDER BY visits_'+dayPart+' DESC LIMIT 3';
			speeddial.storage.db.transaction(function(tx) {
				tx.executeSql(query, [], function(tx, rs){
					for (var i=0; i < rs.rows.length; i++) {
						$('#pages li#'+rs.rows.item(i).id).find('.thumbnail_container').prepend('<img src="images/newtab.highlighted.png" class="highlight_corner" />');
					}
					PADDING = parseInt(localStorage['options.padding'])
					$('.highlight_corner').css({top:-PADDING,right:-PADDING})
				},null,speeddial.storage.onError);
			});
		}
	}
	speeddial.storage.trackVisits = function(url) {

		// keep track of part of a day
		var dayPart = '';
		var hours = new Date().getHours();

		if ( hours >= 0  ) dayPart = 'night';
		if ( hours >= 6  ) dayPart = 'morning';
		if ( hours >= 12 ) dayPart = 'afternoon';
		if ( hours >= 18 ) dayPart = 'evening';

		speeddial.storage.db.transaction(function(tx) {
			tx.executeSql('UPDATE bookmarks SET visits=visits+1, visits_'+dayPart+'=visits_'+dayPart+'+1 WHERE url=?', [url],
				null, speeddial.storage.onError);
		});
	}


// --------- END : MISCELLANEOUS

// --------- RENDER FUNCTIONS

	speeddial.storage.showGroups = function(tx,rs) {

		for (var i=0; i < rs.rows.length; i++)
		{
			GROUPS.push(rs.rows.item(i));
		}

		// url-dialog selectbox
		var cat = document.getElementById('url-dialog-groups');
		cat.value = GROUP;

		var grouplist = document.getElementById('groups');
		if (grouplist)
		{
			grouplist.innerHTML = '';
		}

		if (GROUPS.length==0) return false;

		// HOME group

			var li   = document.createElement("li");
			var link = document.createElement("a");

			link.setAttribute('class', GROUP == 0 ? 'group selected':'group');
			link.setAttribute('href','#');
			link.innerHTML = localStorage['options.defaultGroupName'];
			li.setAttribute('class','home');
			li.setAttribute('loadgroup',0);
			li.appendChild(link)

			grouplist.appendChild(li)

			for (var i=0; i < GROUPS.length; i++)
			{
				// #groups
				var li   = document.createElement("li");
				var link = document.createElement("a");
				link.setAttribute('class',GROUPS[i].id == GROUP ? 'group selected':'group');
				link.setAttribute('href','#'+GROUPS[i].id);
				link.style.backgroundColor = '#'+GROUPS[i].color;
				link.innerHTML = GROUPS[i].title
				li.setAttribute('color',GROUPS[i].color);
				li.setAttribute('loadgroup',GROUPS[i].id);
				li.appendChild(link)
				grouplist.appendChild(li)
			};
	}

	function loadItems(tx, rs) {

		COLS = localStorage.getItem('options.columns');

		// prepare elements
		var row, position;

		var container = document.getElementById('pages');
				container.innerHTML = '';

		var groupscontainer = document.getElementById('groups');

		var browser_toolbar = 130;

		var groups_space = 90;

		// experimental
		if (GROUPS.length > 0)
		{
			groups_space = 30 + parseInt ( $('#groups').css('height') );
		}
		else {
			groups_space = 15;
		}


		var apps_space = [];

				apps_space['large'] = 124;
				apps_space['medium'] = 102;
				apps_space['small'] = 86;
				apps_space['extrasmall'] = 66;

		// title height
			var TITLE = 24,

		// number of rows
			ROWS = Math.ceil(rs.rows.length/COLS)

		// custom spacing
			SPACING = parseInt(localStorage['options.dialspacing'])

		// LOAD GROUPS
			NUMBER_OF_GROUPS = GROUPS.length

		// custom padding
			PADDING = parseInt(localStorage['options.padding'])

		// custom zoom ?
			WIDTHMODIFIER = ( parseInt(getValue('options.dialSpace'))>0 ) ? ( getValue('options.dialSpace') / 100 ) : 0.9

		// screen dimensions
			WINDOW_WIDTH  = window.screen.width
			WINDOW_HEIGHT = window.screen.height
			WINDOW_INNER_WIDTH  = window.innerWidth

		// avail. space
			SPACE = window.innerHeight;

		// thumbnail ration (screen capture taken by Chrome should have this ratio)
			RATIO = (( WINDOW_HEIGHT - browser_toolbar ) / WINDOW_WIDTH )
			RATIO_MODIFIED = false;

			CUSTOM_RATIO = parseFloat(localStorage['options.thumbnailRatio']) > 0 && localStorage['options.thumbnailRatio']!=1
				? true : false;

		var CONTAINER_TOP = 15;

		if (NUMBER_OF_GROUPS==0 && localStorage['options.centerVertically']=='1') {
			CONTAINER_TOP = 0;
		}

		// maximized Chrome inner window ratio
		if (RATIO < 0.55) { RATIO = 0.55; RATIO_MODIFIED = true }
		if (RATIO > 0.65) { RATIO = 0.65; }

		if (CUSTOM_RATIO) {
			RATIO = RATIO * localStorage['options.thumbnailRatio'];
		}

		// space taken by Groups and Apps panels !
		if (localStorage['options.apps.show']=='1')
		{
				SPACE -= apps_space[localStorage['options.apps.iconsize']];
				if (localStorage['options.apps.position']=='top') {

					if (NUMBER_OF_GROUPS>0) $('#groups').css('top',apps_space[localStorage['options.apps.iconsize']]);
					container.style.top = 15 + apps_space[localStorage['options.apps.iconsize']];
					CONTAINER_TOP += apps_space[localStorage['options.apps.iconsize']];

				}
		}

		// Scrolling layout
		if (localStorage['options.scrollLayout']==1)
		{
			$('#container').addClass('scroll');
		} else {
			$('#container').removeClass('scroll');
		}

		if (NUMBER_OF_GROUPS>0)
			{ SPACE -= groups_space; }

		var DIALSPACE = WIDTHMODIFIER * WINDOW_INNER_WIDTH;
		var DIALWIDTH = ( DIALSPACE - ( (COLS) * SPACING ) )  / COLS ;
		DIALWIDTH = Math.floor(DIALWIDTH);

			if (DIALWIDTH>360) DIALWIDTH = 360;

		var DIALHEIGHT = ( DIALWIDTH * RATIO );

		// show title?
		if (localStorage['options.showTitle']!=1) {
			TITLE = PADDING + 2;
		}

		var RESIZEDDIALS = false;

		if ( localStorage['options.scrollLayout']!='1' && ( ROWS * (DIALHEIGHT+SPACING+PADDING+TITLE) ) > SPACE  ) {

			RESIZEDDIALS = true;
			DIALHEIGHT = ( SPACE - ( ROWS * ( SPACING+PADDING+TITLE ) ) ) / ROWS;
			DIALWIDTH = DIALHEIGHT / RATIO;

		}

		if (localStorage['options.centerVertically']=='1' && RESIZEDDIALS == false) {

			if (NUMBER_OF_GROUPS == 0) {
				CONTAINER_TOP -= 15;
			} else {

			}

		}

		// PAGES
		container.style.width =  COLS*(DIALWIDTH+SPACING)+'px';

		var THUMBNAILHEIGHT = ( ( DIALWIDTH - (2 * PADDING) ) * RATIO ) + PADDING ;

		// GROUPS
		if (NUMBER_OF_GROUPS>0) {
			var gWidth =  ( WIDTHMODIFIER * window.innerWidth );
			groupscontainer.style.paddingLeft =  SPACING/2 + (window.innerWidth - gWidth) / 2;
			groupscontainer.style.paddingRight =  SPACING/2 + (window.innerWidth - gWidth) / 2;
			groupscontainer.style.display = 'block';
		}

		// --RENDER EACH--

		for (var i=0; i < rs.rows.length; i++) {

				row = rs.rows.item(i);

				var li
					= document.createElement("li");
				var link
					= document.createElement("a");
				var thumbnail_container
					= document.createElement("div");
				var dialtitle
					= document.createElement("div");
				var shadow
					= document.createElement("div");

				li.setAttribute("class", "link");
				li.setAttribute("id", row['id']);
				li.setAttribute("url", row['url']);
				li.setAttribute("position", position);
				li.setAttribute("visits", row['visits']);
				link.setAttribute('href',row['url']);
				link.style.width = DIALWIDTH+'px';
				dialtitle.style.marginLeft = SPACING/2+'px';
				dialtitle.style.display = 'block'
				dialtitle.style.margin = '0 auto'
				dialtitle.setAttribute('class','title');
				dialtitle.innerHTML = safestr(row['title']);

				if (row['thumbnail']=='') {
					speeddial.storage.getThumbnail(row['url'], thumbnail_container, li);
				}


				// DO WE RENDER IMAGE (THUMBNAIL OR CUSTOM THUMBNAIL)
				if (row['thumbnail']!='') {

						li.setAttribute("custom_thumbnail", "true");

						// 100% height and center vertically
						if (localStorage['options.centerThumbnailsVertically']=='2')
						{
							thumbnail_container.style.backgroundSize = '100%';
							thumbnail_container.style.backgroundPosition = 'center center';
						}
						// fit to thumbnails container
						else if (localStorage['options.centerThumbnailsVertically']=='1')
						{
							thumbnail_container.style.backgroundSize = 'contain';
							thumbnail_container.style.backgroundPosition = 'center center';
						}
						// fit to thumbnails container
						else if (localStorage['options.centerThumbnailsVertically']=='0')
						{
							thumbnail_container.style.backgroundSize = '100%';
							thumbnail_container.style.backgroundPosition = 'top center';
						}
						else {
							thumbnail_container.style.backgroundSize = 'auto';
							thumbnail_container.style.backgroundPosition = 'top center';
						}
						if (row['thumbnail'].indexOf(' ')>-1)
						{
							thumbnail_container.style.backgroundImage = 'url('+encodeURI(row['thumbnail'])+')';
						}
						else {
							thumbnail_container.style.backgroundImage = 'url('+row['thumbnail']+')';
						}


				} else {

							if (RATIO_MODIFIED == true) {
								thumbnail_container.style.backgroundSize = '102% 100%'; // nove
							} else {
								thumbnail_container.style.backgroundSize = '102%'; // nove
							}
							if (CUSTOM_RATIO)
							{
								//thumbnail_container.style.backgroundSize = ( screen.width / ( screen.height - 150 ) * THUMBNAILHEIGHT ) + 'px';
								thumbnail_container.style.backgroundSize = 'cover';
								thumbnail_container.style.backgroundPosition = 'top center';
								//THUMBNAILHEIGHT

							}
							//speeddial.storage.getThumbnail(row['url'], thumbnail_container, li);
				}

				// widths and heights

				thumbnail_container.setAttribute('class','thumbnail_container');
				thumbnail_container.style.height = THUMBNAILHEIGHT;
				link.appendChild(thumbnail_container)
				link.style.height = THUMBNAILHEIGHT + PADDING + TITLE;
				link.style.padding = PADDING+'px';
				link.style.margin = SPACING/2;
				li.style.height = THUMBNAILHEIGHT + PADDING + TITLE + SPACING;
				li.style.overflow = 'hidden';

				// title at the bottom
				if (localStorage['options.dialstyle.titleposition']!='bottom') {

					if (localStorage['options.showTitle']==1) {
						dialtitle.style.width = DIALWIDTH-2*PADDING;
						li.appendChild(dialtitle);
					}
					link.appendChild(thumbnail_container)
					link.style.marginTop = 0;
					link.style.height = THUMBNAILHEIGHT + PADDING + PADDING+2;

				// title at the top
				} else {

					link.appendChild(thumbnail_container)
					if (localStorage['options.showTitle']==1) {
						link.appendChild(dialtitle)
					}
					link.style.paddingBottom = 0;
					thumbnail_container.style.height = THUMBNAILHEIGHT;

				}

				if (localStorage['options.showVisits']==1) {
					var visits = document.createElement('span');
					visits.setAttribute('class','visits');
					visits.innerHTML = row['visits']
					dialtitle.appendChild(visits)
				}

				shadow.style.width = DIALWIDTH;
				shadow.style.bottom = SPACING/2 - 10;
				shadow.style.left = '50%'
				shadow.style.marginLeft =  -DIALWIDTH/2;
				shadow.setAttribute('class','shadow');

				if (localStorage['options.dialstyle.titleposition']!='bottom') {
					shadow.style.bottom = 'auto';
					if (localStorage['options.showTitle']==1) {

						shadow.style.top = 24 - parseInt(localStorage['options.fontsize']) + parseInt(localStorage['options.fontsize']) + DIALHEIGHT + 2*PADDING;

					} else {
						shadow.style.top = 2 + DIALHEIGHT + 2*PADDING;
					}

				}

				li.appendChild(link);
				li.appendChild(shadow);

				container.appendChild(li);
		}

		// CENTER VERTICALLY?
		if (localStorage['options.centerVertically']=='1' && RESIZEDDIALS==false)
		{

			var rowsheight = ( ROWS * (THUMBNAILHEIGHT + 2*PADDING + 2*SPACING) );
			var top = (SPACE-rowsheight)/2;
			if (top >= 0) {
				container.style.paddingTop = CONTAINER_TOP - groups_space/2 + ((SPACE-rowsheight)/2);
				//container.style.paddingTop = ((SPACE-rowsheight)/2);
			} else {
				container.style.paddingTop = 15;
			}

		} else {

				if (NUMBER_OF_GROUPS==0 && RESIZEDDIALS==false) {
					container.style.paddingTop = 2*CONTAINER_TOP;
				} else {
					container.style.paddingTop = CONTAINER_TOP;
				}
		}

		// SHOW ADD DIAL BUTTON?

		if (getValue('options.showAddButton')==1) {

			position = rs.rows.length+1;

			emptyrow = document.createElement('li');
			emptyrow.setAttribute('id','emptyrow');
			emptyrow.setAttribute('rel','tooltip');
			emptyrow.setAttribute('title','Add dial');
			emptyrow.setAttribute('data-placement','bottom');
			emptyrow.innerHTML = '<img src="images/newtab.plus.png" />';
			emptyrow.style.width = SPACING+DIALWIDTH+'px';
			emptyrow.style.height= SPACING + PADDING +DIALHEIGHT+'px';

			emptyrow.addEventListener('click',function(){ switchDialog('add'); });
			container.appendChild(emptyrow);
		}

		if (rs.rows.length == 0)
		{

			if (getValue('options.showAddButton')==1) {
				if (emptyrow) emptyrow.style.display = 'none';
			}

			firstdial = document.createElement('div');
			firstdial.setAttribute('src','images/newtab.first-dial.png');
			firstdial.setAttribute('class','first-dial emptyrow');
			firstdial.innerHTML = 'Start over here';
			firstdial.addEventListener('click',function(){ switchDialog('add'); });
			document.body.appendChild(firstdial);

		} else if ($('.first-dial')) $('.first-dial').remove();

		if (NUMBER_OF_GROUPS>0) {} else { $('#groups').hide(); }

		//CENTER VERTICALLY?
		if (localStorage['options.apps.show']=='1' && localStorage['options.apps.position']=='bottom')
		{
			container.style.marginBottom = 100;
		}

		localStorage.setItem('sys.dialwidth',DIALWIDTH);
		localStorage.setItem('sys.dialheight',THUMBNAILHEIGHT + PADDING + TITLE)
		localStorage.setItem('sys.cellspacing',SPACING)
		localStorage.setItem('sys.rowspacing',SPACING)
		localStorage.setItem('sys.rows',ROWS)
		localStorage.setItem('sys.cols',COLS)
		localStorage.setItem('sys.containerwidth',COLS*(DIALWIDTH)+((COLS-1)*SPACING)+'px')

		// settings icon
		if (NUMBER_OF_GROUPS>0) {
			_pos = (0.2+(1-WIDTHMODIFIER)*100/2);
		} else {
			_pos = (-2+(1-WIDTHMODIFIER)*100/2);
		}
		if (_pos < 3) _pos = 3;

		if (getValue('options.showOptionsButton')==1) {
			$('#quick-settings-icon').css('right', _pos+'%').fadeIn();
		}

		//if ()
		if (getValue('options.sidebar') == 1) {
			$('.sidebar-arrow').show();
		}

		pagesOnLoad();
		speeddial.storage.hightlightExperimental();

	}

	function getDominantColor(aImg) {
  var canvas = document.createElement("canvas");
  canvas.height = aImg.height;
  canvas.width = aImg.width;

  var context = canvas.getContext("2d");
  context.drawImage(aImg, 0, 0);

  // keep track of how many times a color appears in the image
  var colorCount = {};
  var maxCount = 0;
  var dominantColor = "";

  // data is an array of a series of 4 one-byte values representing the rgba values of each pixel
  var data = context.getImageData(0, 0, aImg.height, aImg.width).data;

  for (var i = 0; i < data.length; i += 4) {
    // ignore transparent pixels
    if (data[i+3] == 0)
      continue;

    var color = data[i] + "," + data[i+1] + "," + data[i+2];
    // ignore white
    if (color == "255,255,255")
      continue;

    colorCount[color] = colorCount[color] ?  colorCount[color] + 1 : 1;

    // keep track of the color that appears the most times
    if (colorCount[color] > maxCount) {
      maxCount = colorCount[color];
      dominantColor = color;
    }
  }

  var rgb = dominantColor.split(",");
  return rgb;
}

	function loadItems2(tx, rs) {


		WIDTHMODIFIER = ( parseInt(getValue('options.dialSpace'))>0 ) ? ( getValue('options.dialSpace') / 100 ) : 0.9
		WINDOW_INNER_WIDTH  = window.innerWidth
		var DIALSPACE = WIDTHMODIFIER * WINDOW_INNER_WIDTH;
		container.style.marginBottom = 100;
		container.style.width = DIALSPACE;
		container.style.margin = '0 auto';

		// --RENDER EACH--

		for (var i=0; i < rs.rows.length; i++) {

				row = rs.rows.item(i);
				//position=i+1;

				//CURRENT_ROW = Math.ceil(position/COLS);
				//CURRENT_COL = ((position-1)%COLS)+1;

				var li
					= document.createElement("li");
				var link
					= document.createElement("a");
				var img
					= document.createElement("img");

				//img.src = 'chrome://favicon/'+row['url'];

				//var color = getDominantColor(img);

				//link.style.background = 'rgba('+color+',0.2)';

				li.setAttribute("class", 'inline-link');
				li.setAttribute("id", row['id']);
				li.setAttribute("url", row['url']);
				li.setAttribute("visits", row['visits']);
				link.setAttribute('href',row['url']);
				link.style.width = '90%';
				link.style.display = 'block';


				link.innerHTML = '<img src="chrome://favicon/'+row['url']+'" />'+row['title']+'<span class="visits">'+row['visits']+' visits</span>';
				li.appendChild(link);
				container.appendChild(li);

		}

		//localStorage.setItem('sys.dialwidth',DIALWIDTH);
		//localStorage.setItem('sys.dialheight',THUMBNAILHEIGHT + PADDING + TITLE)
		//localStorage.setItem('sys.cellspacing',SPACING)
		//localStorage.setItem('sys.rowspacing',SPACING)
		//localStorage.setItem('sys.rows',ROWS)
		//localStorage.setItem('sys.cols',COLS)
		//localStorage.setItem('sys.containerwidth',COLS*(DIALWIDTH)+((COLS-1)*SPACING)+'px')

		pagesOnLoad();
		speeddial.storage.hightlightExperimental();

	}


// INIT FUNCTIONS

	function init()
	{

		speeddial.storage.open();
		// create table bookmarks if not exists
		speeddial.storage.createTable();
		// get all groups
		speeddial.storage.getGroups(speeddial.storage.showGroups);
		// load all dials
		speeddial.storage.getAllItems(loadItems, GROUP);
	}
	function reload()
	{
		speeddial.storage.getGroups(speeddial.storage.showGroups);
		speeddial.storage.getAllItems(loadItems, GROUP);
	}
	function background_init()
	{
		speeddial.storage.open();
		// create table bookmarks if not exists
		speeddial.storage.createTable();
	}
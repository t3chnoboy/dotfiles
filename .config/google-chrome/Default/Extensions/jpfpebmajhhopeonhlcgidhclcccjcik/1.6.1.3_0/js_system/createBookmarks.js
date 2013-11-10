
	/* coming up */

	function speedDial2ToBookmarks() 
	{
		var create_bookmarks = function(parent) 
		{

			chrome.bookmarks.create({'parentId':'2',title:'Speed Dial 2'},function(folder){

				var p = folder.id;

				// get groups
				speeddial.storage.getGroups(function(tx,rs){
					for (var i=0; i < rs.rows.length; i++) {

						row = rs.rows.item(i);
						chrome.bookmarks.create({'parentId':p,title:row.title},function(folder){
							
							speeddial.storage.getAllItems(function(ttx,rrs){

								for (var j=0; j < rrs.rows.length; j++) {
									//export_settings.dials[i] = rs.rows.item(i);
									rrow = rrs.rows.item(j);
									chrome.bookmarks.create({'parentId':folder.id,title:rrow.title,url:rrow.url});
								}								

							}, row.id);
						})
					}
				})	
			})
		}
		chrome.bookmarks.getChildren('2', function(result) { 
			for (var i=0; i < result.length; i++) {
				if (!result[i].url && result[i].title == 'Speed Dial 2') {
					// remove and re-create
					chrome.bookmarks.removeTree(result[i].id,function(){ create_bookmarks(); })
					return; 
				}
			};	
			// create
			create_bookmarks();
		})

	}


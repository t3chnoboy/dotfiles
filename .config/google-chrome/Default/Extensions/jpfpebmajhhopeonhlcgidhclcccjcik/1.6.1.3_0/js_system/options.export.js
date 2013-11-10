
var export_settings      = {};
export_settings.groups   = {}
export_settings.dials    = {}
export_settings.settings = {}

function exportData() {

	speeddial.storage.open();
	speeddial.storage.getGroups(function(tx,rs){
		for (var i=0; i < rs.rows.length; i++) {
			export_settings.groups[i] = rs.rows.item(i);
		}
		speeddial.storage.getAllItems(function(tx, rs){

			// export dials
			for (var i=0; i < rs.rows.length; i++) {
				export_settings.dials[i] = rs.rows.item(i);
			}

			// export settings
			for (var i=0; i < window.localStorage.length; i++) {
				key = localStorage.key(i);
				// no thumbnails
				if (key.indexOf('sync.password')==-1 && key.indexOf('sync.username')==-1 && key.indexOf('thumbnail_')==-1 && key.indexOf('_opened_tabs')==-1 && key.indexOf('_restore_tabs')==-1 && key.indexOf('_closed_tabs')==-1) {
					value = localStorage.getItem(localStorage.key(i));
					export_settings.settings[key] = value;
				}
			};

			$('#export textarea').val(JSON.stringify(export_settings, null, 2));
			$('#export').show();

		});

	})

}
function import_settings() {

	var settings = $('#import_textarea').val();
	if (settings && confirm('Warning: This will wipe all your settings and dials and replace them with ones included in imported settings. If you are a Pro user, these groups and bookmarks will replace existing bookmarks on our server. Do you wish to continue?'))
	{
		// var b = chrome.extension.getBackgroundPage();
    try {
        var theJson = jQuery.parseJSON(settings);
    }
    catch (e) {
    		show_message("Sorry, this doesn't seem like valid JSON. Please use JSON validator to fix it.", true, 5000);
    		return false;
    }
		show_message('Importing ...', true, 16000);
		b.import_settings(settings,function(){
			setTimeout(function(){show_message('Import successfull');},2000);
		});
	}

}

function moveSettings(direction) {

	$('#import,#export').hide();

	if (direction=='import')
	{
		$('#import').show(); $('#import_textarea').val('');

	} else if (direction=='export') {

		exportData();
	}

}
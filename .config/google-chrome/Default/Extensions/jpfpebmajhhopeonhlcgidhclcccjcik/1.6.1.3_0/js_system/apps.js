
	// The list of all apps & extensions.
	var completeList = [];

	// A filtered list of apps we actually want to show.
	var appList = [];

	// Returns the largest size icon, or a default icon, for the given |app|.
	function getIconURL(app) {

		var largest = {size:0};

		if (!app.icons || app.icons.length == 0) {
			return chrome.extension.getURL("icon64.png");
		}

		for (var i = 0; i < app.icons.length; i++) {
			var icon = app.icons[i];
			if (icon.size > largest.size) {
				largest = icon;
			}
		}
		return largest.url;
	}

	function appUninstall(id,element) {

		if (confirm(i18n('apps_do_you_want_to_uninstall'))) {
			chrome.management.uninstall(id, function() {
				show_message(i18n('apps_app_uninstalled'));
				$(element).remove();
			});
		}
	}

	function launchApp(id) {
		chrome.management.launchApp(id);
		window.close(); // Only needed on OSX because of crbug.com/63594
	}

	function compare(a, b) {
		return (a > b) ? 1 : (a == b ? 0 : -1);
	}

	function compareByName(app1, app2) {
		return compare(app1.name.toLowerCase(), app2.name.toLowerCase());
	}

	// Adds DOM nodes for |app| into |appsDiv|.
	function addApp(appsDiv, app, type) {

		if (typeof app=="undefined") return false;

		var li = document.createElement("li");
		li.setAttribute('rel',app.id)
		li.setAttribute('data-options',app.optionsUrl)
		if (app.mayDisable === false) {
			li.setAttribute('data-uninstall','false');
		}

		if (type=='sidebar') {

			li.setAttribute('class','app')

			li.onclick = function(e) {

				if ( localStorage['options.alwaysNewTab'] == '1' && (isCtrl == true || e.which == 2)) {
					openInCurrent( app.appLaunchUrl );
					e.preventDefault();
					e.stopPropagation();
				} else if ( localStorage['options.alwaysNewTab'] == '1' ) {
					chrome.tabs.create({url: app.appLaunchUrl, selected:true });
					e.preventDefault();
				}
			};

			var a = document.createElement("a");
			a.setAttribute('href',app.appLaunchUrl);

			var img = document.createElement("img");
			img.src = getIconURL(app);

			var title = document.createElement("span");
			title.className = "app_title";
			title.innerText = app.name;

			a.appendChild(img);
			a.appendChild(title);

			li.appendChild(a);

		}
		if (type=='dial') {

			//  launchApp(app.id);

			li.onclick = function(e) {

				if ( localStorage['options.alwaysNewTab'] == '1' && (isCtrl == true || e.which == 2)) {
					openInCurrent( app.appLaunchUrl );
					e.preventDefault();
				} else if ( localStorage['options.alwaysNewTab'] == '1' ) {
					chrome.tabs.create({url: app.appLaunchUrl, selected:true });
					e.preventDefault();
				}
			};

			var a = document.createElement("a");
			a.setAttribute('href',app.appLaunchUrl);

			var img = document.createElement("img");
			img.src = getIconURL(app);

			var title = document.createElement("span");
			title.className = "apptitle";
			title.innerText = app.name;

			a.appendChild(img);
			a.appendChild(title);

			li.appendChild(a);

		}


		appsDiv.appendChild(li);
	}

	function showApps() {

		var appsDiv = document.getElementById("apps_ul");

		// Empty the current content.
		appsDiv.innerHTML = "";

		for (var i = 0; i < appList.length; i++) {
			var item = appList[i];
			addApp(appsDiv, item, 'sidebar');
		}

		// make apps sortable
		$('#apps_ul').sortable({
			forcesize:true,axis: 'y', tolerance: 'pointer',stop: function(event, ui) {
				var apps_list = $('#apps_ul li');
				var newAppOrder = new Array();
				for (var i = 0; i < apps_list.length; i++) {
					newAppOrder.push( $(apps_list[i]).attr('rel') )
				};
				localStorage['options.appOrder'] = JSON.stringify(newAppOrder)
			}
		});

	}

	function showAppsAsDials() {

		var appsDiv = document.getElementById("appspanel");

		// Empty the current content.
		appsDiv.innerHTML = "";

		for (var i = 0; i < appList.length; i++) {
			var item = appList[i];
			addApp(appsDiv, item, 'dial');
		}

		// width
		_width = $(appsDiv).find('li').width();
		_l = ($('#appspanel li').length);

		appsDiv.style.width = _l * (_width);

	}

	function loadApps(type) {

		chrome.management.getAll(function(info) {
			var appCount = 0;
			for (var i = 0; i < info.length; i++) {
				if (info[i].isApp) {
					appCount++;
				}
			}
			completeList = info.sort(compareByName);
			appList = [];
			var appOrder = [];
			if (typeof localStorage['options.appOrder']!='undefined') {
				appOrder = JSON.parse(localStorage['options.appOrder']);
			}
			for (var i = 0; i < completeList.length; i++){
				var item = completeList[i];
				// Skip extensions and disabled apps.
				if (!item.isApp || !item.enabled) {
					continue;
				}
				//appList[i] = item;
				if (appOrder.length>0) {

					if (parseInt(jQuery.inArray(completeList[i].id,appOrder))>=0) {
						appList[jQuery.inArray(completeList[i].id,appOrder)] = item;
					} else {
						appList[99-i] = item;
					}

				} else {
					appList.push(item);
				}
			}
			appList.push({appLaunchUrl:'https://chrome.google.com/webstore/category/home',optionsUrl:'',enabled:true,icons:[{size:128,url:'chrome://extension-icon/ahfgeienlihckogmohjhadlkjgocpleb/128/1'}],id:'ahfgeienlihckogmohjhadlkjgocpleb',name:'Chrome Web Store',mayDisable:false})
			if (type=='sidebar') {
				showApps();
			}
			else if (type=='dial') {
				showAppsAsDials();
			}
		});

	}

	$(function(){

	if (localStorage['options.apps.show']==1) {

		switch(getValue('options.apps.align'))
		{
			case 'left':
				$('#appspanel_wrapper').addClass('apps_alignleft');
			break;
			case 'right':
				$('#appspanel_wrapper').addClass('apps_alignright');
			break;
		}

		switch(getValue('options.apps.position'))
		{
			case 'top':
				$('#appspanel_wrapper').addClass('apps_top');
			break;
		}

		switch(getValue('options.apps.theme'))
		{
			case 'transparent':
				$('#appspanel_wrapper').addClass('apps_transparent');
			break;
			case 'dark':
				$('#appspanel_wrapper').addClass('apps_dark');
			break;
		}

		switch(getValue('options.apps.iconsize'))
		{
			case 'extrasmall':
				$('#appspanel_wrapper').addClass('apps_extrasmall');
			break;
			case 'small':
				$('#appspanel_wrapper').addClass('apps_small');
			break;
			case 'large':
				$('#appspanel_wrapper').addClass('apps_large');
			break;
		}

		loadApps('dial');

		// padding by width modifier
		$('#appspanel').css('padding','0% '+( (100-parseInt(localStorage['options.dialSpace']))/2 )+'%')

		// make apps sortable
		$('#appspanel').sortable({
			placeholder: 'sortableplaceholder',axis: 'x', tolerance: 'pointer',stop: function(event, ui) {
				var apps_list = $('#appspanel li');
				var newAppOrder = new Array();
				for (var i = 0; i < apps_list.length; i++) {
					newAppOrder.push( $(apps_list[i]).attr('rel') )
				};
				localStorage['options.appOrder'] = JSON.stringify(newAppOrder)
			}
		});

		// scroll apps
		$("#appspanel_wrapper").mousewheel(function(event, delta)
		{
			this.scrollLeft -= (delta * 80);
			event.preventDefault();
		});

	}
	})

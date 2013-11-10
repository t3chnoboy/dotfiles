
	if ( localStorage['options.padding'] ) {
		document.write('<style type="text/css">');
		document.write('#pages li a {padding:' +localStorage['options.padding']+'px; }');
		document.write('<\/style>');
	}

	$(function(){
		$('*[i18n]').each(function(){
			if (i18n($(this).attr('i18n')))
				$(this).html(i18n($(this).attr('i18n')));
		})
	})

	function setBookmarksProvider(p) {

		setValue('options.sidebar.showGooglebookmarks',0);
		setValue('options.sidebar.showBookmarks',0);
		setValue('options.sidebar.showDelicious',0);
		setValue('options.sidebar.showPinboard',0);

		$('.bookmarks-provider').hide();

		switch (p) {

			case 'chrome':
			setValue('options.sidebar.showBookmarks',1);
			$('.bookmarks-provider').hide();
			$('#bookmarks-provider-chrome-settings').show();
			break;

			case 'google':
			setValue('options.sidebar.showGooglebookmarks',1);
			$('.bookmarks-provider').hide();
			$('#bookmarks-provider-google-settings').show();
			break;

			case 'delicious':
			setValue('options.sidebar.showDelicious',1);
			$('.bookmarks-provider').hide();
			$('#bookmarks-provider-delicious-settings').show();
			break;

			case 'pinboard':
			setValue('options.sidebar.showPinboard',1);
			$('.bookmarks-provider').hide();
			$('#bookmarks-provider-pinboard-settings').show();
			break;

		}

	}

	$(function(){

		$('.bookmarks-provider').hide();

		if (getValue('options.sidebar.showBookmarks')==1) {
			$('#bookmarks-provider-chrome').attr('checked',true);
		}
		if (getValue('options.sidebar.showDelicious')==1) {
			$('#bookmarks-provider-delicious').attr('checked',true);
			$('#bookmarks-provider-delicious-settings').show();
		}
		if (getValue('options.sidebar.showGooglebookmarks')==1) {
			$('#bookmarks-provider-google').attr('checked',true);
			$('#bookmarks-provider-google-settings').show();
		}
		if (getValue('options.sidebar.showPinboard')==1) {
			$('#bookmarks-provider-pinboard').attr('checked',true);
			$('#bookmarks-provider-pinboard-settings').show();
		}

		/* chrome */
		if (getValue('options.sidebar.showBookmarksURL')==1) {
			$('#options-sidebar-showbookmarksURL').attr('checked',true);
		}

		/* google */
		if (getValue('options.useGoogleBookmarksShortcut')==1) {
			$('#options-useGoogleBookmarksShortcut').attr('checked',true);
		}

		/* delicious */
		if (getValue('options.useDeliciousShortcut')==1) {
			$('#options-useDeliciousShortcut').attr('checked',true);
		}
		if (getValue('options.sidebar.deliciousUsername')) {
			$('#options-sidebar-delicious-username').val(getValue('options.sidebar.deliciousUsername'));
		}
		$('#options-sidebar-delicious-username').change(function(){ setValue('options.sidebar.deliciousUsername', $(this).val() ) })
		if (getValue('options.sidebar.delicious.favoriteTags')) {
			$('#options-sidebar-delicious-favoriteTags').val(getValue('options.sidebar.delicious.favoriteTags'));
		}
		$('#options-sidebar-delicious-favoriteTags').change(function(){ setValue('options.sidebar.delicious.favoriteTags', $(this).val() ) })

		/* pinboard */
		if (getValue('options.usePinboardShortcut')==1) {
			$('#options-usePinboardShortcut').attr('checked',true);
		}
		if (getValue('options.sidebar.pinboardUsername')) {
			$('#options-sidebar-pinboard-username').val(getValue('options.sidebar.pinboardUsername'));

		}
		$('#options-sidebar-pinboard-username').change(function(){
			setValue('options.sidebar.pinboardUsername', $(this).val() )
			clearValue('_tmp_pinboard.tags');
		})

	})

				// var b = chrome.extension.getBackgroundPage();
				var sync_url = speeddial.storage.sync_url();
				//if (!b) var b = chrome.extension.getBackgroundPage();
				//alert(b);


					var preview = Array;

					preview['bg']           = localStorage['options.colors.dialbg'];
					preview['bgover']       = localStorage['options.colors.dialbgover'];
					preview['bginner']      = localStorage['options.colors.dialbginner'];
					preview['bginnerover']  = localStorage['options.colors.dialbginnerover'];
					preview['border']       = localStorage['options.colors.border'];
					preview['borderover']   = localStorage['options.colors.borderover'];
					preview['title']        = localStorage['options.colors.title'];
					preview['titleover']    = localStorage['options.colors.titleover'];
					preview['titlealign']   = localStorage['options.titleAlign'];
					preview['titlefontface']= localStorage['options.fontface'];
					preview['padding']      = localStorage['options.padding'];
					preview['corners']      = localStorage['options.dialstyle.corners'];
					preview['shadow']       = localStorage['options.dialstyle.shadow'];

					function reloadCss() {

						$('#pages li a').css('background-color',preview['bg']);
						$('#pages li a').css('border-color',preview['border']);
						$('#pages li a').css('padding',preview['padding']);
						$('#pages li a, .shadow').css('width',420 - (12 - preview['padding']) );

						$('#pages li a').css('border-radius',preview['corners']);
						$('#pages li .thumbnail_container').css('border-radius',preview['corners']+'px '+preview['corners']+'px 0 0');
						$('#pages li .thumbnail_container').css('background-color',preview['bginner']);
						$('#pages li .title').css('color',preview['title']);

						$('#pages li .title').css('text-align',preview['titlealign']);
						$('#pages li .title').css('font-family',preview['titlefontface']+'!important');

						if (preview['shadow']!='none') {

							if ( localStorage['options.dialstyle.shadow']=='glow' ) {

								$('#pages li a').addClass('glowshadow')
								$('.shadow').css('visibility','hidden');

							} else {

								$('#pages li .shadow').css('background','url("images/shadow_'+preview['shadow']+'.png") no-repeat left top')
								$('#pages li a').removeClass('glowshadow')
								$('.shadow').css('visibility','visible');
							}

						} else {

							$('.shadow').css('visibility','hidden');
							$('#pages li a').removeClass('glowshadow')

						}


						$('#pages li a').hover(function(){

							$('#pages li a').css('background-color',preview['bgover']);
							$('#pages li .thumbnail_container').css('background-color',preview['bginnerover']);
							$('#pages li a').css('border-color',preview['borderover']);
							$('#pages li .title').css('color',preview['titleover']);

						}, function() {

							$('#pages li a').css('background-color',preview['bg']);
							$('#pages li .thumbnail_container').css('background-color',preview['bginner']);
							$('#pages li a').css('border-color',preview['border']);
							$('#pages li .title').css('color',preview['title']);

						})

					}

					function setPreview(prop,value) {
						preview[prop] = value;
						reloadCss()
					}

			function setBackground(elem) {

				setValue('options.background', $(elem).attr('background') );
				if ($(elem).attr('pattern')) {
					setValue('options.backgroundPattern', $(elem).attr('pattern'));
				} else {
					setValue('options.backgroundPattern', '');
				}
				setValue('options.backgroundPosition', $(elem).attr('position'));
				setValue('options.repeatbackground', $(elem).attr('repeat'));
				if ($(elem).attr('color')!='') setValue('options.colors.bg',$(elem).attr('color'));

				// var b = chrome.extension.getBackgroundPage();
				b.sync_settings();
				top.location.href=chrome.extension.getURL('newtab.html');

			}

			function switchTab(tabhash) {

				$('.tabs li').removeClass('selected');
				$('.tabs li[rel='+tabhash+']').addClass('selected');
				$('.tab').hide();
				$( '#'+tabhash ).show();
				window.location.hash = tabhash;

				$("html").scrollTop();
				window.scrollTo(0,0);

			}

			function tabsync() {
				window.scroll(0,0);
				$('.options_tab_link').removeClass('selected');
				$('#sync_indicator').addClass('selected');
				$('.options_tab').hide();
				$('#tab_sync').show(0);
			}

// ready

		$(function(){

/* NAVIGATION */

			$('.options_tab_link').click(function(){
				$('.options_tab_link').removeClass('selected');
				$(this).addClass('selected');
				$('.options_tab').hide();
				$('#tab_'+($(this).attr('rel'))).show(0);
			})

/* TABS */

			$('ul.tabs li').click(function(){
				switchTab( $(this).attr('rel') );
			})

/* THEMES */

			$('#themes .bg').click(function(){
				setBackground(this);
			})

/* CSS */

			reloadCss();

			$('input[name=options-corners]').change(function(){ setValue('options.dialstyle.corners', $(this).val() ); setPreview('corners',$(this).val()) })
			$('input[name=options-dropShadow][value='+getValue('options.dialstyle.shadow')+']').attr('checked','checked');
			$('input[name=options-titlePosition][value='+getValue('options.dialstyle.titleposition')+']').attr('checked','checked');

			$('#options-fontface').change(function(){ setValue('options.fontface', $(this).val() ); setPreview('titlefontface',$(this).val()) })
			$('#options-fontsize').change(function(){ setValue('options.fontsize', $(this).val() ); })
			$('#options-fontstyle').change(function(){ setValue('options.fontstyle', $(this).val() ); })
			$('#options-colors-dialbg').val( getValue( 'options.colors.dialbg' ) )
			$('#options-colors-dialbg').change( function() { setValue( 'options.colors.dialbg', $(this).val() ); setPreview('bg',$(this).val()) })
			$('#options-colors-dialbgover').val( getValue( 'options.colors.dialbgover' ) );
			$('#options-colors-dialbgover').change( function() { setValue( 'options.colors.dialbgover', $(this).val() ); setPreview('bgover',$(this).val()) } )
			$('#options-colors-dialbginner').val( getValue( 'options.colors.dialbginner' ) );
			$('#options-colors-dialbginner').change( function() { setValue( 'options.colors.dialbginner', $(this).val()); setPreview('bginner',$(this).val())} )
			$('#options-colors-dialbginnerover').val( getValue( 'options.colors.dialbginnerover' ) );
			$('#options-colors-dialbginnerover').change( function() { setValue( 'options.colors.dialbginnerover', $(this).val() ); setPreview('bginnerover',$(this).val())  } )
			$('#options-colors-border').val( getValue( 'options.colors.border' ) );
			$('#options-colors-border').change( function() { setValue( 'options.colors.border', $(this).val() );  setPreview('border',$(this).val()) } )
			$('#options-colors-borderover').val( getValue( 'options.colors.borderover' ) );
			$('#options-colors-borderover').change( function() { setValue( 'options.colors.borderover', $(this).val() ); setPreview('borderover',$(this).val()) } )
			$('#options-colors-title').val( getValue( 'options.colors.title' ) );
			$('#options-colors-title').change( function() { setValue( 'options.colors.title', $(this).val() ); setPreview('title',$(this).val()) } )
			$('#options-colors-titleover').val( getValue( 'options.colors.titleover' ) );
			$('#options-colors-titleover').change( function() { setValue( 'options.colors.titleover', $(this).val() ); setPreview('titleover',$(this).val()) } )

			if (getValue('options.corners')>=0) {
				$('#options-corners').val(getValue('options.dialstyle.corners'));
				$('#options-corners-val').val(getValue('options.dialstyle.corners'));
			}
			$('#options-corners').change(function(){
				$('#options-corners-val').val($(this).val())
				setValue('options.dialstyle.corners', $(this).val() )
				setPreview('corners',$(this).val())
			});

			if (getValue('options.padding')>=0) {
				$('#options-padding').val(getValue('options.padding'));
				$('#options-padding-val').val(getValue('options.padding'));
			}
			$('#options-padding').change(function(){
				$('#options-padding-val').val($(this).val())
				setValue('options.padding', $(this).val() )
				setPreview('padding',$(this).val())
			});

/* END:CSS */

/* SIDEBAR */

			if (getValue('options.sidebar')==1) {
				$('#options-sidebar').attr('checked',true);
			}
			if (getValue('options.sidebaractivation')=='position') {
					$('#options-sidebaractivation-position').attr('checked',true);
				}
				else
				{
					$('#options-sidebaractivation-scroll').attr('checked',true);
			}
			if (getValue('options.sidebar.showHistory')==1) {
				$('#options-sidebar-showhistory').attr('checked',true);
			}
			if (getValue('options.sidebar.showApps')==1) {
				$('#options-sidebar-showapps').attr('checked',true);
			}

/* APPS */

		if (getValue('options.apps.show')==1) {
			$('#options-apps-show').attr('checked',true);
		}
		switch(getValue('options.apps.align'))
		{
		case 'left':
			$('#options-apps-align-left').attr('checked',true);
			break;
		case 'right':
			$('#options-apps-align-right').attr('checked',true);
			break;
		default:
			$('#options-apps-align-center').attr('checked',true);
		}
		switch(getValue('options.apps.position'))
		{
		case 'top':
			$('#options-apps-position-top').attr('checked',true);
			break;
		default:
			$('#options-apps-position-bottom').attr('checked',true);
		}
		switch(getValue('options.apps.theme'))
		{
		case 'transparent':
			$('#options-apps-theme-transparent').attr('checked',true);
			break;
		case 'dark':
			$('#options-apps-theme-dark').attr('checked',true);
			break;
		default:
			$('#options-apps-theme-light').attr('checked',true);
		}
		switch(getValue('options.apps.iconsize'))
		{
		case 'extrasmall':
			$('#options-apps-iconsize-extrasmall').attr('checked',true);
			break;
		case 'small':
			$('#options-apps-iconsize-small').attr('checked',true);
			break;
		case 'large':
			$('#options-apps-iconsize-large').attr('checked',true);
			break;
		default:
			$('#options-apps-iconsize-medium').attr('checked',true);
		}

/* GENERAL */

			if (getValue('options.centerThumbnailsVertically')==3) {
				$('#options-centerThumbnailsVertically3').attr('checked',true);
			} else if (getValue('options.centerThumbnailsVertically')==1) {
				$('#options-centerThumbnailsVertically1').attr('checked','checked');
			} else if (getValue('options.centerThumbnailsVertically')==2) {
				$('#options-centerThumbnailsVertically2').attr('checked',true);
			} else if (getValue('options.centerThumbnailsVertically')==0) {
				$('#options-centerThumbnailsVertically0').attr('checked',true);
			}

			if (getValue('options.columns')>=0) {
				$('#options-columns').val(getValue('options.columns'));
				$('#options-columns-val').val(getValue('options.columns'));
			}
			$('#options-columns').change(function(){
				$('#options-columns-val').val($(this).val())
				setValue('options.columns', $(this).val() )
			});

			if (getValue('options.dialspacing')>=0) {
				$('#options-dialspacing').val(getValue('options.dialspacing'));
				$('#options-dialspacing-val').val(getValue('options.dialspacing'));
			}
			$('#options-dialspacing').change(function(){
				$('#options-dialspacing-val').val($(this).val())
				setValue('options.dialspacing', $(this).val() )
			});
			if (getValue('options.thumbnailRatio')>=0) {
				$('#options-thumbnailRatio').val(getValue('options.thumbnailRatio'));
				$('#options-thumbnailRatio-val').val(getValue('options.thumbnailRatio'));
			}
			$('#options-thumbnailRatio').change(function(){
				$('#options-thumbnailRatio-val').val( Math.round($(this).val() * 100)/100 )
				setValue('options.thumbnailRatio', Math.round($(this).val() * 100)/100 )
			});
			resetThumbnailRatio = function() {
				$('#options-thumbnailRatio').val(1);
				$('#options-thumbnailRatio-val').val(1);
				setValue('options.thumbnailRatio', 1 )
			}

			if (getValue('options.dialSpace')>=0) {
				$('#options-dialspace').val(getValue('options.dialSpace'));
				$('#options-dialspace-val').val(getValue('options.dialSpace'));
			}
			$('#options-dialspace').change(function(){
				$('#options-dialspace-val').val($(this).val())
				setValue('options.dialSpace', $(this).val() )
			});
			if (getValue('options.alwaysNewTab')==1) {
				$('#options-alwaysNewTab').attr('checked',true);
			}
			if (getValue('options.showContextMenu')==1) {
				$('#options-showContextMenu').attr('checked',true);
			}
			if (getValue('options.showVisits')==1) {
				$('#options-showVisits').attr('checked',true);
			}
			if (getValue('options.showTitle')==1) {
				$('#options-showTitle').attr('checked',true);
			}
			if (getValue('options.showFavicon')==1) {
				$('#options-showFavicon').attr('checked',true);
			}
			if (getValue('options.showAddButton')==1) {
				$('#options-showAddButton').attr('checked',true);
			}
			if (getValue('options.showOptionsButton')==1) {
				$('#options-showOptionsButton').attr('checked',true);
			}
			if (getValue('options.keepActiveGroup')==1) {
				$('#options-keepActiveGroup').attr('checked',true);
			}
			if (getValue('options.centerVertically')==1) {
				$('#options-centervertically').attr('checked',true);
			}
			if (getValue('options.highlight')==1) {
				$('#options-highlight').attr('checked',true);
			}
			if (getValue('options.order')=='visits') {
					$('#options-order-visits').attr('checked',true);
				} else {
					$('#options-order-position').attr('checked',true);
			}
			if (getValue('options.thumbnailQuality')=='low') {
				$('#options-thumbquality-low').attr('checked',true);
				}
				else if (getValue('options.thumbnailQuality')=='high') {
					$('#options-thumbquality-high').attr('checked',true);
				}
				else {
					$('#options-thumbquality-medium').attr('checked',true);
			}

			$('#options-columns').change(function(){ setValue('options.columns', $(this).val() ) })
			$('#options-defaultGroupName').change(function(){ setValue('options.defaultGroupName', $(this).val() ) })
			if (getValue('options.defaultGroupName')) {
				$('#options-defaultGroupName').val(getValue('options.defaultGroupName'));
			}

			/* THEME */

			$('#options-backgroundPosition').val(getValue('options.backgroundPosition'));
			$('#options-repeatbackground').val(getValue('options.repeatbackground'));
			$('#options-repeatbackground').val(getValue('options.repeatbackground'));
			$('#options-repeatbackground').change(function(){
				setValue('options.repeatbackground',$(this).val());
			});

			if (getValue('options.background')) {
				$('#options-background').val(getValue('options.background'));
			}
			if (getValue('options.fontsize')) {
				$('#options-fontsize').val(getValue('options.fontsize'));
			}
			if (getValue('options.fontface')) {
				$('#options-fontface').val(getValue('options.fontface'));
			}
			if (getValue('options.fontstyle')) {
				$('#options-fontstyle').val(getValue('options.fontstyle'));
			}
			if (getValue('options.customCss')) {
				$('#options-custom-css').val(getValue('options.customCss'));
			}
			$('#options-custom-css').blur(function(){
				setValue('options.customCss',$(this).val())
			})
			if (getValue('options.columns')) {
				$('#options-columns').val(getValue('options.columns'));
			}

			switch(getValue('options.titleAlign'))
			{
			case 'left':
				$('#options-titleAlign-left').attr('checked',true);
				break;
			case 'right':
				$('#options-titleAlign-right').attr('checked',true);
				break;
			default:
				$('#options-titleAlign-center').attr('checked',true);
			}

			switch(getValue('options.refreshThumbnails'))
			{
			case '10':
				$('#options-refreshThumbnails10').attr('checked',true);
				break;
			case '5':
				$('#options-refreshThumbnails5').attr('checked',true);
				break;
			case '2':
				$('#options-refreshThumbnails2').attr('checked',true);
				break;
			default:
				$('#options-refreshThumbnails0').attr('checked',true);
			}

			switch(getValue('options.scrollLayout'))
			{
			case '0':
				$('#options-scrollLayout0').attr('checked',true);
				break;
			default:
				$('#options-scrollLayout1').attr('checked',true);
			}

			$('#options-backgroundPosition').change(function(){ setValue('options.backgroundPosition', $(this).val() ) })
			$('#options-background').change(function(){ setValue('options.background', $(this).val() ); setValue('options.backgroundPattern', '' ) })
			$('#options-colors-bg').val( getValue( 'options.colors.bg' ) );
			$('#options-colors-bg').change( function() { setValue( 'options.colors.bg', $(this).val() )} )

/* EXPORT & SYNC */

		// check is sync is set up
		b.test_sync_account(function(response){

		if (response.code == 1) {
			$('#sync_indicator').prepend('<img src="images/options.sync-indicator.png" /> ');
			$('#sync_status').html('Sync OK, last synchronization ' + prettyDate(parseInt(response.last_sync)));
		}

		})

		var sync_password = getValue('options.sync.password');
		var sync_username = getValue('options.sync.username');

		if (sync_username!='') {
			$('#options-sync-username').val(sync_username);
		}
		if (sync_password!='') {
			$('#options-sync-password').val(sync_password);
		}

		$('#sync').click(function(e){

			e.preventDefault();

			//username changed
			var sync_new_password = $('#options-sync-password').val();
			var sync_new_username = $('#options-sync-username').val();

			if (sync_new_password!=sync_password) {
				sync_password = Base64.encode(sync_new_password);
			}
			if (sync_new_username!=sync_username) {
				sync_username = sync_new_username;
			}

			setValue('options.sync.username',sync_username);
			setValue('options.sync.password',sync_password);

			if (sync_username!='' && sync_password!='') {

				sync_url = speeddial.storage.sync_url();

				//alert('Settings saved');
				show_message('Connecting to sync server...', true, 50000);

				$.post(sync_url+'/sync2/test',{

				'username':localStorage.getItem('options.sync.username'),
				'password':localStorage.getItem('options.sync.password')

				},function(r) {

					if (r) {

					switch(r.code) {

						case 1:
						//show_message('You sync account is connected...', true, 600);
						show_message('Please wait for synchronization to complete...', true, 100000);
						speeddial.storage.open();

						if (localStorage.getItem('options.sync.lastsync')) {
							b.sync(function(){
								show_message('Sync complete...', true, 600);
							});
						} else {
							b.backup_and_sync(function(){
								show_message('Sync complete...', true, 600);
							});
						}
						/*
						b.sync(function(){
							show_message('Sync complete...', true, 600);
						});
						*/
						break;

						case 0:
						setTimeout(function(){show_message('Importing your settings...', true, 50000)},1200);
						b.sync_to_server(function(response){

							if (response.code == 1) {
								setTimeout(function(){show_message('You sync account is connected...', true, 600)},2200);
							} else {
								alert('There was an error while importing your settings.');
								hide_message();
							}

						});
						break;

						case -999:
						alert('Enter username and password');
						localStorage.removeItem('options.sync.password');
						var sync_new_password = $('#options-sync-password').val('');
						hide_message();
						break;

						case -99:
						alert('Wrong username, e-mail or password');
						localStorage.removeItem('options.sync.password');
						var sync_new_password = $('#options-sync-password').val('');
						hide_message();
						break;

						case -1:
						alert('Your sync account is not active. Please log in to activate it.');
						hide_message();
						break;

						default:
						hide_message();
						break;

					}
				}},"json").error(function() { hide_message(); alert("There was an error while connecting to server"); });
			} else {

				alert('Enter username and password');
				localStorage.removeItem('options.sync.password');
				var sync_new_password = $('#options-sync-password').val('');

			}
		})

		/* SAVE AND SYNC SETTINGS */

		$('.save_settings_button').click(function(){
			b.sync_settings();
			top.location.href=chrome.extension.getURL('newtab.html');
		})

		/* PRETTY CHECKBOXES */

		$('.on_off').iphoneStyle({
			checkedLabel: '&#10004;',
			uncheckedLabel: '&#10006;'
		});

		/* TOOLTIPS */
		$('[rel=popover]').popover();
		$('[rel=tooltip]').tooltip();

		/* FOOTER DIFF */

		var randomnumber=Math.floor(Math.random()*11);
		if (randomnumber%2==0) {
			var cake = true;
			$('#support').addClass('cake')
		}

		if (location.hash == '#tab-sync') {
			tabsync();
		}

		$( ".radio" ).buttonset();

/* PATTERNS */

		var patterns = [
'http://farm8.static.flickr.com/7017/6430432723_ae79eceece_b.jpg',
'http://farm8.static.flickr.com/7157/6430432775_45e53d864f_b.jpg',
'http://farm7.static.flickr.com/6230/6430433001_11c1c5219d_b.jpg',
'http://farm8.static.flickr.com/7151/6430433259_434ee9b232_b.jpg',
'http://farm8.static.flickr.com/7006/6430433325_efc69a92c6_b.jpg',
'http://farm7.static.flickr.com/6033/6430433513_1aa8a93aa3_b.jpg',
'http://farm8.static.flickr.com/7152/6430433661_660bf4bda4_b.jpg',
'http://farm7.static.flickr.com/6221/6430433703_1c8b08f65e_b.jpg',
'http://farm8.static.flickr.com/7156/6430433775_0e64bc8ebe_b.jpg',
'http://farm7.static.flickr.com/6058/6430433995_14d53ef568_b.jpg',
'http://farm7.static.flickr.com/6094/6430434403_145e123a63_b.jpg',
'http://farm8.static.flickr.com/7150/6430434585_a57ee59aac_b.jpg',
'http://farm8.static.flickr.com/7167/6430434713_70d73ceebf_b.jpg',
'http://farm8.static.flickr.com/7147/6430434755_809ed76464_b.jpg',
'http://farm8.static.flickr.com/7034/6430434817_c048bc17b7_b.jpg',
'http://farm8.static.flickr.com/7013/6430435097_7c2b6d87e4_b.jpg',
'http://farm8.static.flickr.com/7022/6430435511_89de9f221c_b.jpg',
'http://farm7.static.flickr.com/6101/6430435697_6c96223cde_b.jpg',
'http://farm8.static.flickr.com/7147/6430435777_a04138d916_b.jpg',
'http://farm8.static.flickr.com/7154/6430435829_5c62dc4c8c_b.jpg',
'http://farm8.static.flickr.com/7158/6430435899_df2f9b3bb7_b.jpg',
'http://farm8.static.flickr.com/7024/6430436027_3e5ec59b91_b.jpg',
'http://farm7.static.flickr.com/6031/6430436283_1c2faec3dd_b.jpg',
'http://farm8.static.flickr.com/7004/6430436537_30fb3398b6_b.jpg',
'http://farm8.static.flickr.com/7172/6430436703_1e470b18ca_b.jpg',
'http://farm8.static.flickr.com/7024/6430436879_3b859d1ebd_b.jpg',
'http://farm8.static.flickr.com/7150/6430437201_15d3d5b34e_b.jpg',
'http://farm8.static.flickr.com/7170/6430437409_d305d8d520_b.jpg',
'http://farm8.static.flickr.com/7028/6430437477_25afea585d_b.jpg',
'http://farm8.static.flickr.com/7151/6430437645_f2d1231fa9_b.jpg',
'http://farm8.static.flickr.com/7013/6430437897_0ebfe83736_b.jpg',
'http://farm8.static.flickr.com/7164/6430438153_5e73b6381e_b.jpg',
'http://farm7.static.flickr.com/6055/6430438283_7f412e9045_b.jpg',
'http://farm8.static.flickr.com/7017/6430438361_ac3377a48f_b.jpg',
'http://farm8.static.flickr.com/7001/6430438523_7ef78641d7_b.jpg',
'http://farm8.static.flickr.com/7015/6430438577_5502f2f4d9_b.jpg',
'http://farm8.static.flickr.com/7025/6430438649_3c185b8010_b.jpg',
'http://farm8.static.flickr.com/7175/6430438857_5a4262c3cc_b.jpg',
'http://farm8.static.flickr.com/7161/6430439029_5c8cbaf8f1_b.jpg',
'http://farm8.static.flickr.com/7020/6430439291_68cbc4ab49_b.jpg',
'http://farm7.static.flickr.com/6043/6430439339_9ae66d72d6_b.jpg',
'http://farm8.static.flickr.com/7027/6430439705_e691057a51_b.jpg',
'http://farm8.static.flickr.com/7143/6430439825_beecd5efe2_b.jpg',
'http://farm8.static.flickr.com/7011/6430439859_cbf4cd3643_b.jpg',
'http://farm7.static.flickr.com/6058/6430440053_0083658254_b.jpg',
'http://farm8.static.flickr.com/7149/6430441203_8518057a11_b.jpg',
'http://farm8.static.flickr.com/7174/6430441473_e3d92a5095_b.jpg',
'http://farm8.static.flickr.com/7160/6430441673_e0b2674190_b.jpg',
'http://farm7.static.flickr.com/6044/6430442053_ea8e655d6b_b.jpg',
'http://farm8.static.flickr.com/7008/6430442221_08d9f05e44_b.jpg',
'http://farm8.static.flickr.com/7169/6430442301_c8eeb537af_b.jpg',
'http://farm8.static.flickr.com/7002/6430442401_e914e0585a_b.jpg',
'http://farm8.static.flickr.com/7175/6430442631_a84b7c8385_b.jpg',
'http://farm7.static.flickr.com/6114/6430442765_0fcd38b9de_b.jpg',
'http://farm8.static.flickr.com/7161/6430443135_6f3d3b48f6_b.jpg',
'http://farm8.static.flickr.com/7009/6430443349_ca153c5380_b.jpg',
'http://farm8.static.flickr.com/7165/6430443407_1b7b7bf5c5_b.jpg',
'http://farm8.static.flickr.com/7161/6430443633_b254952080_b.jpg',
'http://farm7.static.flickr.com/6240/6430444103_2edf88c734_b.jpg',
'http://farm8.static.flickr.com/7024/6430444581_1e00f3067a_b.jpg',
'http://farm8.static.flickr.com/7155/6430445203_c86da93674_b.jpg',
'http://farm8.static.flickr.com/7011/6430445371_5c60b7f6ee_b.jpg',
'http://farm8.static.flickr.com/7004/6430445449_0751a6dcb2_b.jpg',
'http://farm8.static.flickr.com/7172/6430445757_f4f410eab6_b.jpg',
'http://farm8.static.flickr.com/7022/6430445941_51eee2362c_b.jpg',
'http://farm8.static.flickr.com/7010/6430445995_8153401329_b.jpg',
'http://farm8.static.flickr.com/7154/6430446071_fe3c5cbb85_b.jpg',
'http://farm8.static.flickr.com/7005/6430446157_09dda9d044_b.jpg',
'http://farm8.static.flickr.com/7016/6430447535_9f9114450c_b.jpg',
'http://farm7.static.flickr.com/6234/6430446307_4e01cdc27f_b.jpg',
'http://farm7.static.flickr.com/6233/6430446383_336b9a6e78_b.jpg',
'http://farm8.static.flickr.com/7154/6430446455_29fbc69ce6_b.jpg',
'http://farm8.static.flickr.com/7029/6430446515_c865b8f7ee_b.jpg',
'http://farm8.static.flickr.com/7144/6430446849_64dd003d4e_b.jpg',
'http://farm7.static.flickr.com/6226/6430446941_851b97d726_b.jpg',
'http://farm8.static.flickr.com/7151/6430446979_9138c58f40_b.jpg',
'http://farm8.static.flickr.com/7164/6430447071_905f69575b_b.jpg',
'http://farm7.static.flickr.com/6239/6430440143_55e3e64a2e_b.jpg',
'http://farm7.static.flickr.com/6227/6430439145_ed9552936a_b.jpg',
'http://farm7.static.flickr.com/6236/6430439581_82fcb19c8b_b.jpg',
'http://farm8.static.flickr.com/7008/6430447095_e43c3d77b2_b.jpg',
'http://farm8.static.flickr.com/7162/6430447207_54aece209c_b.jpg',
'http://farm8.static.flickr.com/7157/6430447373_612f33b2d9_b.jpg',
'http://farm7.static.flickr.com/6231/6430446667_7e6d83910a_b.jpg',
'http://farm8.static.flickr.com/7165/6430432855_0ef6a52f8e_b.jpg',
'http://farm7.static.flickr.com/6035/6430433123_69de1514b6_b.jpg',
'http://farm8.static.flickr.com/7004/6430433219_25593c3c21_b.jpg',
'http://farm7.static.flickr.com/6036/6430434145_4179fbc973_b.jpg',
'http://farm8.static.flickr.com/7152/6430434625_cfd30eecc4_b.jpg',
'http://farm8.static.flickr.com/7022/6430434851_a3916036ec_b.jpg',
'http://farm7.static.flickr.com/6034/6430434909_12685d155b_b.jpg',
'http://farm8.static.flickr.com/7025/6430435145_b5b330328e_b.jpg',
'http://farm8.static.flickr.com/7153/6430435331_8f0cc2d756_b.jpg',
'http://farm7.static.flickr.com/6095/6430435359_200e7df71a_b.jpg',
'http://farm8.static.flickr.com/7025/6430435955_513af70347_b.jpg',
'http://farm8.static.flickr.com/7006/6430436069_26a7fc24fb_b.jpg',
'http://farm7.static.flickr.com/6226/6430436367_883e22a4ff_b.jpg',
'http://farm8.static.flickr.com/7003/6430437035_3a136d9ca8_b.jpg',
'http://farm8.static.flickr.com/7008/6430437355_f618e5a96e_b.jpg',
'http://farm8.static.flickr.com/7141/6430438109_b41ab531be_b.jpg',
'http://farm8.static.flickr.com/7147/6430438229_5f46192b60_b.jpg',
'http://farm8.static.flickr.com/7024/6430439247_50402ca34c_b.jpg',
'http://farm8.static.flickr.com/7024/6430439439_31bca46c64_b.jpg',
'http://farm8.static.flickr.com/7024/6430439487_5f69b64222_b.jpg',
'http://farm7.static.flickr.com/6044/6430439531_7115db9edb_b.jpg',
'http://farm8.static.flickr.com/7152/6430439655_ffd7f5266d_b.jpg',
'http://farm7.static.flickr.com/6038/6430439783_d96f28f6e1_b.jpg',
'http://farm8.static.flickr.com/7141/6430439917_d02a485b88_b.jpg',
'http://farm8.static.flickr.com/7160/6430440343_c065e30f93_b.jpg',
'http://farm8.static.flickr.com/7012/6430440555_4861dfa5f8_b.jpg',
'http://farm7.static.flickr.com/6233/6430440721_de3a8f10c7_b.jpg',
'http://farm8.static.flickr.com/7163/6430441017_84ed341c8c_b.jpg',
'http://farm7.static.flickr.com/6054/6430442991_e393c8b17d_b.jpg',
'http://farm8.static.flickr.com/7171/6430443481_11c69b8a5a_b.jpg',
'http://farm7.static.flickr.com/6034/6430441889_310f286f1d_b.jpg',
'http://farm7.static.flickr.com/6227/6430443845_2318a7866e_b.jpg',
'http://farm7.static.flickr.com/6059/6430443915_830d6fe386_b.jpg',
'http://farm8.static.flickr.com/7171/6430443955_faf786b335_b.jpg',
'http://farm8.static.flickr.com/7032/6430444185_38a5cf03ed_b.jpg',
'http://farm8.static.flickr.com/7168/6430444371_d757e07d2f_b.jpg',
'http://farm8.static.flickr.com/7165/6430444537_593f40fe3a_b.jpg',
'http://farm8.static.flickr.com/7008/6430444875_591630e4b6_b.jpg',
'http://farm8.static.flickr.com/7009/6430445043_3810458125_b.jpg',
'http://farm8.static.flickr.com/7157/6430445593_ccbb23e7c9_b.jpg',
'http://farm7.static.flickr.com/6035/6430446109_63004c7b88_b.jpg'
		]

		for (var i=0; i < patterns.length; i++) {

			var pattern_url = patterns[i];
			var pattern_div = $('<div />')
					.addClass('pattern')
					.css('background','url('+patterns[i]+') repeat')
					.attr('background',pattern_url)
					.attr('repeat','repeat')
					.click(function(){setBackground(this)})
					.appendTo($('#subtle_patterns'));
		};

	})

$(function(){

	$('.click-open-extension-page').click(function(){
		top.location.href=chrome.extension.getURL( $(this).data('url'));
	})

	$('.click-explain-show').click(function(){
		$('#preview').hide();$('#explain').show();
	})

	$('.click-explain-hide').click(function(){
		$('#preview').show();$('#explain').hide();
	})

	$('.click-preview-shadow').click(function(){
		setValue('options.dialstyle.shadow',$(this).val()); 
		setPreview('shadow',$(this).val())
	})

	$('.click-preview-title-alignment').click(function(){
		var p = $(this).data('option');
		var v = $(this).data('value');
		setValue(p,v);
		setPreview('titlealign',v)
	})

	$('.click-set-value').click(function(){
		var p = $(this).data('option');
		var v = $(this).data('value');
		setValue(p,v);
	})

	$('.change-toggle-value').change(function(){
		var p = $(this).data('option');
		toggleValue(p);
	})

	$('#bookmarks-provider-none').click(     function(){ setBookmarksProvider(null) })
	$('#bookmarks-provider-chrome').click(   function(){ setBookmarksProvider('chrome') })
	$('#bookmarks-provider-delicious').click(function(){ setBookmarksProvider('delicious') })
	$('#bookmarks-provider-google').click(   function(){ setBookmarksProvider('google') })
	$('#bookmarks-provider-pinboard').click( function(){ setBookmarksProvider('pinboard') })

	$('.move-settings').click(function(){
		
		moveSettings($(this).data('direction'));
		
	})

	$('#import-settings-button').click( function(){ import_settings() })
	$('.click-tab-sync').click( function(){ tabsync() })
	$('.click-reset-thumbnail-ration').click( function(){ resetThumbnailRatio() })
	$('.click-reset-background').click( function(){ $('#options-background').val('');setValue('options.background','') })
	
})
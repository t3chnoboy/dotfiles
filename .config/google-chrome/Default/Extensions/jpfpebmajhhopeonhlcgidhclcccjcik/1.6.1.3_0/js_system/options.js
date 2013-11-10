function setValue(key,value)
{
	localStorage.removeItem(key);
	localStorage.setItem(key,value);
	//localStorage[key] = value;
}
function getValue(key)
{
	return localStorage.getItem(key);
}
function clearValue(key)
{
	return localStorage.removeItem(key);
}
function toggleValue(key)
{
	if ( getValue(key) == 1 || getValue(key) == 0 )
	{
		localStorage.setItem( key, ((-1) * parseInt(getValue(key)))+1 )
	} else {
		localStorage.setItem( key, 1)
	}
}

function show_message(text,autoclose, time) {
	$('#message').html(text).fadeIn(50).animate({opacity:'1'},1000,function(){
		if (autoclose!==true) {
		  $('#message').fadeOut(500);
		} else {
		  if (!time) time = 5000;
		  setTimeout(function(){$('#message').hide(100)},time);
	  }
	});
}

function i18n(m) {
 	return chrome.i18n.getMessage(m);
}

function hide_message() {
  $('#message').fadeOut(200);
}

if (localStorage['firstTime']!='false')
{
	setValue('options.fontstyle','font-weight:normal;font-style:normal;');
	setValue('options.sidebar.showApps','1');
	setValue('options.fontsize','11');
	setValue('options.colors.bg','FFFFFF');
	setValue('options.colors.dialbg','FFFFFF');
	setValue('options.colors.dialbgover','FFFFFF');
	setValue('options.colors.dialbginner','FFFFFF');
	setValue('options.colors.dialbginnerover','FFFFFF');
	setValue('options.colors.border','CCCCCC');
	setValue('options.colors.borderover','999999');
	setValue('options.colors.title','8C7E7E');
	setValue('options.colors.titleover','333333');
	setValue('options.padding','4');
	setValue('options.dialstyle.corners','4');
	setValue('options.dialstyle.shadow','glow');
	setValue('options.dialstyle.titleposition','bottom');
	setValue('options.background','images/themes/light/background_top.jpg' );
	setValue('options.backgroundPattern','images/themes/light/background_strip.jpg');
	setValue('options.backgroundPosition','right top');
	setValue('options.repeatbackground','repeat-x');
	setValue('options.showOptionsButton','1');
}

var defaults = {
	'options.fontface':'Helvetica,"Helvetica Nueue";arial,sans-serif',
	'options.colors.dialbginner':'FFFFFF',
	'options.colors.dialbginnerover':'FFFFFF',
	'options.defaultGroupName':'Home',
	'options.refreshThumbnails':'0',
	'options.dialstyle.shadow':'paper',
	'options.dialstyle.titleposition':'bottom',
	'options.dialSpace':'90',
	'options.dialspacing':'24',
	'options.sidebar.showApps':'0',
	'options.apps.show':'0',
	'options.apps.position' :'bottom',
	'options.apps.theme':'dark',
	'options.apps.align':'center',
	'options.apps.iconsize':'medium',
	'options.columns':'4',
	'options.order':'position',
	'options.showVisits':'1',
	'options.highlight':'0',
	'options.sidebar':'1',
	'options.sidebaractivation':'position',
	'options.showTitle' :'1',
	'options.backgroundPosition':'left top',
	'options.useDeliciousShortcut':0,
	'options.centerThumbnailsVertically':1,
	'options.centerVertically':1,
	'options.sidebar.showHistory':1,
	'options.sidebar.showBookmarks':1,
	'options.sidebar.showBookmarksURL':0,
	'options.sidebar.showDelicious':0,
	'options.thumbnailQuality':'medium',
	'options.showAddButton':1,
	'options.showContextMenu':1,
	'options.titleAlign':'center',
	'options.alwaysNewTab':0,
	'options.dialstyle.corners':'4',
	'options.scrollLayout':'1',
	'options.padding':'4'
}

// apply defaults
for (value in defaults)
{
	if (!getValue(value)) {
		setValue(value,defaults[value])
	}
}

// clear TMP
localStorage.removeItem('_TMP_opened_tabs');
localStorage.removeItem('ClosedTabs');
localStorage.removeItem('options.showFavicon');
localStorage.removeItem('addPageFromContextMenu');
localStorage.removeItem('lastdeleted');

// reset themes directory
if (getValue('options.background') == 'themes/light/background_top.jpg') {
	setValue('options.background','images/themes/light/background_top.jpg' )
}
if (getValue('options.backgroundPattern') == 'themes/light/background_strip.jpg') {
	setValue('options.backgroundPattern','images/themes/light/background_strip.jpg');
}

/* count remeining space */
/*
localStorage.setItem("DATA", "m");
for(i=0 ; i<40 ; i++) {
    var data = localStorage.getItem("DATA");
    try {
        localStorage.setItem("DATA", data + data);
    } catch(e) {
        console.log("LIMIT REACHED: (" + i + ")");
        console.log(e);
    }
}
localStorage.removeItem("DATA");
*/

/*
for (var i=0; i < window.localStorage.length; i++) {
	key = localStorage.key(i);
	// no thumbnails
	if (key.indexOf('thumbnail_')==0) {
		localStorage.removeItem(key);
	}
};
*/

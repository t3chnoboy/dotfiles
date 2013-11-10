var panels = 0;

$(function(){

// delicious

	if (getValue('options.sidebar.showDelicious')==1 && getValue('options.sidebar.deliciousUsername')!='') {

		$('#delicious').show();
		panels++;

	} else {$('#delicious').remove();}

// google

	if (getValue('options.sidebar.showGooglebookmarks')==1) {

		$('#googlebookmarks').show();
		panels++;

	} else {$('#googlebookmarks').remove();}

// google

	if (getValue('options.sidebar.showPinboard')==1) {

		$('#pinboard').show();
		panels++;

	} else {$('#pinboard').remove();}

// bookmarks

	if (getValue('options.sidebar.showBookmarks')==1) {

	  $('#bookmarks').show();
	  panels++;

	} else {$('#bookmarks').remove();}

// history

	if (getValue('options.sidebar.showHistory')==1) {

		$('#history').show();
		panels++;

	} else {$('#history').remove();}

// apps

  if (getValue('options.sidebar.showApps')=='1') {
    $('#apps').show();
    panels++;
    loadApps('sidebar');

  } else {$('#apps').remove();}

// sidebar load

	// width
	var sidebarWidth = panels*281;
	$('#sidebars').css({'width':sidebarWidth,'right': (-1*sidebarWidth)+3 });
	//$('#bookmarks ul,#history ul').css('height', $(window).height()-150 );
	$('#bookmarks,#history').css('height', $(window).height());
	$('#d_bookmarks').css('height', $(window).height() );

	function show_sidebar() {

			if ( parseInt($('#sidebars').css('right')) < 0 )
			{
				if (getValue('options.sidebar.showBookmarks')==1) {
				  if ($('#bookmarks ul li').length < 1)
				  {
				  	bookmarksLoad('1');
				  }
				}
				$('#sidebars').animate({right:0},100);

			}
			//$('#bookmarks ul,#history ul').css('height', $(window).height()-150 );
			$('#bookmarks,#history').css('height', $(window).height());
			$('#d_bookmarks').css('height', $(window).height() );
			if (getValue('options.sidebar.showHistory')==1) {
				renderHistoryItems();
			}

	}
	function hide_sidebar() {

			if ( parseInt($('#sidebars').css('right')) == 0 )
			{
				if (panels == 1 && $('#sidebars > div').length==2)
				{
					$('#sidebars').css('width',281);
				}
				$('#sidebars').animate({right: -sidebarWidth+3 },175);
			}

	}

	// Show sidebar on screen right border
	if (localStorage['options.sidebaractivation']=='position' || getValue('options.scrollLayout')==1)
	{

	  $('#sidebar-toggle').hover(function() {
	  	if (SORTINGGROUPS === false && SORTING === false)
				show_sidebar();
		})
		$('#sidebars').mouseenter(function() {
			show_sidebar();
		})
		$('#container').mouseenter(function() {
			hide_sidebar();
		})

	} else if (getValue('options.scrollLayout')!=1) {

		// load
		if (getValue('options.sidebar.showBookmarks')==1) {
		  bookmarksLoad('1');
	  }

		$('#sidebars').mouseleave(function() {
			hide_sidebar();
		})

		$(window).mousewheel(function(e,d) {
			var tgid = $(e.target).attr('id');
			var tgcl = $(e.target).attr('class');
			if (tgid=='pages' || tgid=='container' || tgid=='main' || tgcl=='link' || tgcl=='title' || tgcl=='thumbnail' || tgcl=='thumbnail_container' || tgcl=='thumbnail_extra')
			{
				if (d>0)
				{
					hide_sidebar();
				} else {
					show_sidebar();
				}
			}
		})
	}
})
// sidebar:end
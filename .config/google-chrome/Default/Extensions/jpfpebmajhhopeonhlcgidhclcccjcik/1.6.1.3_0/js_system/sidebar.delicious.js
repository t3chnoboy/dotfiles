$(function(){

  var delicioususer = getValue('options.sidebar.deliciousUsername');

// clickable tags
	$('.delicious_tag').live('click',function(){ delicious_expandTag($(this).attr('rel')); });

// get all user tags
	var user_tags = [];
	function saveTags(data) {
		$.each(data, function(key, val) {
		  user_tags.push(key);
		});
	}
	$.getJSON('http://feeds.delicious.com/v2/json/tags/'+delicioususer, saveTags);

// search for a tag
	function delicious_expandTag(tag) {

		$('#delicious h1:nth(0)').addClass('loading');

		if (tag=='last25bookmarks') {
			d_url = 'http://feeds.delicious.com/v2/json/'+delicioususer+'?count=25';
		} else {
			d_url = 'http://feeds.delicious.com/v2/json/'+delicioususer+'/'+tag+'?count=100'
		}

		$.getJSON(d_url, function(data) {

			var items = [];
			var thistags = new Array;
			var thistagsoutput = new Array;

			$.each(data, function(key, val) {
				var tags = (String(val['t'])).split(",");
			  for (var i=0; i < tags.length; i++) {
			  	if (tag.indexOf(tags[i])<0) thistags.push(tags[i]);
			  };
				items.push('<li style="background-image:url(chrome://favicon/'+ val['u'] +')" class="openurl" rel="' + val['u'] + '"><a href="' + val['u'] + '">' + val['d'] + ' <span>#'+ val['t'] +'</span></a></li>');
			});
			thistags = $.unique(thistags);
			var combine ='<hr />';
			if (thistags.length > 0 && tag!='last25bookmarks') {
				for (var i=0; i < thistags.length; i++) {
					thistagsoutput.push('<a class="delicious_tag delicious_combine_with" rel="'+tag+'+'+thistags[i]+'">'+thistags[i]+'</a>&nbsp;&nbsp;');
				};
				combine = '<hr /><b>+</b> '+thistagsoutput.join(' ')+'<hr />';
			}
			$('#d_bookmarks').html(combine+items.join(''));

			if (panels == 1) {

				$('#sidebars').css('width',281+281)
				if ($('#sidebars >div').length == 1) $('#sidebars').append('<div style="height:100%">');
				// append div for results

			}

			var tagname = tag.split('+')
			var tagnames = [];
			for (var i=0; i < tagname.length; i++) {
				if (tagname.length > 1) {
					if (i > 0) {
						removetag = tag.replace('+'+tagname[i],'');
					}
					else {
						removetag = tag.replace(tagname[i]+'+','');
					}
					tagnames.push('<div><h1 class="delicious_tag" rel="'+tagname[i]+'">#'+tagname[i]+'</h1><a class="delicious_tag delicious_closetag" rel="'+removetag+'"></a></div>');
				} else {
					tagnames.push('<h1 class="delicious_tag" rel="'+tagname[i]+'">#'+tagname[i]+'</h1>');
				}
			};
			$('#d_bookmarks').prepend('<a id="delicious_close">close</a>'+tagnames.join(''));
			$('#d_bookmarks').prependTo('#sidebars>div:nth-child(2)').show()
			$('#delicious h1').removeClass('loading');

		});
	}

	function delicious_searchTag(q) {

		var items = [];
		var foundtags = [];

		for (var i=0; i < user_tags.length; i++) {
			if (user_tags[i].indexOf(q)==0) {
				items.push('<li class="delicious_tag" rel="'+user_tags[i]+'"><a>' + user_tags[i] + '</a></span></li>');
				foundtags.push(user_tags[i]);
			}
		};

		// result
		$('#delicious ul#d_tags').html(items.join(''))
		if (foundtags.length == 1) { delicious_expandTag(foundtags[0]) }
		else { $('#delicious ul#d_bookmarks').hide();  }
		$('#delicious h1').removeClass('loading')
	}

	// search input functionality
	$('#delicious-search').keyup(function(e){
		query = $(this).val()
		if ( query.length < 1 ) return false
		$('#delicious h1').addClass('loading')
		delicious_searchTag(query)
		if (e.which==13) {
			delicious_expandTag(query)
		}
	})

	// get biggest 25 tags
	$.getJSON('http://feeds.delicious.com/v2/json/tags/'+delicioususer+'?count=100', function(data) {

		var items = [];
		if (localStorage['options.sidebar.delicious.favoriteTags']) {
			var favoriteTags = localStorage['options.sidebar.delicious.favoriteTags'].split(',');
			for (var i=0; i < favoriteTags.length; i++) {
				items.push('<li class="delicious_tag sticky" rel="'+favoriteTags[i]+'"><a>' + favoriteTags[i] +'</a></span></li>');
			};
		}

		tagArray = [];
		$.each(data, function(key, val) {
			tagArray.push({ tag: key, count: val });
		});
		var dsbc = function(a, b) {
			return b.count - a.count;
		}

		tagArray.sort(dsbc);

		$.each(tagArray, function(key, tag) {
		  items.push('<li class="delicious_tag" rel="'+tag.tag+'"><a>' + tag.tag + ' <span>'+ tag.count +'</a></span></li>');
		});

		$('#delicious ul#d_tags').prepend(items.join(''));

	})

})
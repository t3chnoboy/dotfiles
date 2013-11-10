$(function(){

  var pinboard_username = getValue('options.sidebar.pinboardUsername');

// clickable tags
	$('.pinboard_tag').live('click',function(){ expandTag($(this).attr('rel')); });

	var user_tags = [];

// search for a tag
	function expandTag(tag) {

		$('#pinboard h1:nth(0)').addClass('loading');

		if (tag=='last25bookmarks') {
			d_url = 'http://feeds.pinboard.in/json/v1/u:'+pinboard_username+'/?count=25';
		} else {
			t = tag;
			if (tag.indexOf('+'))
			{
				t = tag.replace('+','/t:');
			}
			d_url = 'http://feeds.pinboard.in/json/v1/u:'+pinboard_username+'/t:'+t+'?count=1000000'
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
					thistagsoutput.push('<a class="pinboard_tag delicious_combine_with" rel="'+tag+'+'+thistags[i]+'">'+thistags[i]+'</a>&nbsp;&nbsp;');
				};
				combine = '<hr /><b>+</b> '+thistagsoutput.join(' ')+'<hr />';
			}
			$('#d_bookmarks').html(combine+items.join(''));

			if (panels == 1) {

				// append div for results
				$('#sidebars').css('width',281+281)
				if ($('#sidebars >div').length == 1) $('#sidebars').append('<div style="height:100%">');

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
					tagnames.push('<div><h1 class="pinboard_tag" rel="'+tagname[i]+'">#'+tagname[i]+'</h1><a class="pinboard_tag delicious_closetag" rel="'+removetag+'"></a></div>');
				} else {
					tagnames.push('<h1 class="pinboard_tag" rel="'+tagname[i]+'">#'+tagname[i]+'</h1>');
				}
			};
			$('#d_bookmarks').prepend('<a id="delicious_close">close</a>'+tagnames.join(''));
			$('#d_bookmarks').prependTo('#sidebars>div:nth-child(2)').css('height','100%').show()
			$('#pinboard h1').removeClass('loading');

		});
	}

	function searchTag(q) {

		var items = [];
		var foundtags = [];

		for (var i=0; i < user_tags.length; i++) {
			if (user_tags[i].indexOf(q)==0) {
				items.push('<li class="pinboard_tag" rel="'+user_tags[i]+'"><a>' + user_tags[i] + '</a></span></li>');
				foundtags.push(user_tags[i]);
			}
		};

		// result
		$('#pinboard ul#d_tags').html(items.join(''))
		if (foundtags.length == 1) { expandTag(foundtags[0]) }
		else { $('#pinboard ul#d_bookmarks').hide();  }
		$('#pinboard h1').removeClass('loading')
	}

	// search input functionality
	$('#pinboard-search input').keyup(function(e){
		query = $(this).val()
		if ( query.length < 1 ) return false
		$('#pinboard h1').addClass('loading')
		searchTag(query)
		if (e.which==13) {
			expandTag(query)
		}
	})

// get all user tags

	var pinboard =
	{
		"tags": {},
		"bookmarks": []
	};

	//if (b._browser_start_ === false && (getValue('_tmp_pinboard.tags')!='undefined' && getValue('_tmp_pinboard.tags')))
	if ((getValue('_tmp_pinboard.tags')!='undefined' && getValue('_tmp_pinboard.tags')))
	{
		var tagArray = JSON.parse(getValue('_tmp_pinboard.tags'));
		//pinboard.bookmarks = JSON.parse(getValue('_tmp_pinboard.bookmarks'));

		$.each(tagArray,function(key, tag){
			user_tags.push(tag.tag);
			$('#pinboard ul#d_tags').append('<li class="pinboard_tag" rel="'+tag.tag+'"><a>' + tag.tag + ' <span>'+tag.count+'</span></a></li>')
		})

	}
	else
	{

		$.getJSON('http://feeds.pinboard.in/json/v1/u:'+pinboard_username+'/?count=1000000', function(data)
		{
			for (var i = 0; i < data.length; ++i)
			{
				for (var j = 0; j < data[i].t.length; ++j)
				{
						if (!pinboard.tags[data[i].t[j]])
						{
							pinboard.tags[data[i].t[j]] = 1;
						}
						else
						{
							pinboard.tags[data[i].t[j]]++;
						}
				}
				pinboard.bookmarks.push(data);
			}
			tagArray = [];
			$.each(pinboard.tags, function(tag, count) {
				tagArray.push({ tag: tag, count: count });
			})
			var dsbc = function(a, b) {
				return b.count - a.count;
			}

			tagArray.sort(dsbc);
			$.each(tagArray,function(key, tag){
				user_tags.push(tag.tag);
				$('#pinboard ul#d_tags').append('<li class="pinboard_tag" rel="'+tag.tag+'"><a>' + tag.tag + ' <span>'+tag.count+'</span> </a></li>')
			})

			setValue('_tmp_pinboard.tags',JSON.stringify(tagArray, null, 2));
			//setValue('_tmp_pinboard.bookmarks',JSON.stringify(pinboard.bookmarks, null, 2));
		});
	}
})

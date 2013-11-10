"use strict";

window.onload = function() 
{
	var intent = window.webkitIntent;
	if( !intent ) 
	{
		location.href = "gc-launcher.htm";
		return;
	}

	var url = ( intent.getExtra && intent.getExtra('url') ) || intent.data;
		
	location.href = "http://cloud.feedly.com/#subscription/" + encodeURIComponent( "feed/" + url );
};


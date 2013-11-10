"use strict";

function $feedly( msg )
{
	window.console.log( msg );
}

document.body.setAttribute( "data-enricher", "yes" );

document.body.addEventListener( "feedlyEnrichmentRequest", askEnrich, false );

function createCustomEvent( type, payload )
{
	var evt = document.createEvent( "CustomEvent" );
    evt.initCustomEvent( type, false, false, payload );
    return evt;
}

function askEnrich( event )
{
	chrome.runtime.sendMessage( event.detail, function( response ) {
		var feEvent = createCustomEvent( "feedlyEnrichmentResponse", response );
		document.body.dispatchEvent( feEvent );
	});
}


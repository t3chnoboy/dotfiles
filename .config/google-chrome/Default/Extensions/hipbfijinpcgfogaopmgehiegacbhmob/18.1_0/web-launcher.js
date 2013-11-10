// LAZY LOADER
var BACKEND = "//cloud.feedly.com";
if( new String( document.location ).indexOf( "sandbox.feedly.com" ) > -1 )
	BACKEND = "//sandbox.feedly.com";

function bindEvent(el, eventName, eventHandler, b) {
  if (el.addEventListener){
    el.addEventListener(eventName, eventHandler, b); 
  } else if (el.attachEvent){
    el.attachEvent('on'+eventName, eventHandler);
  }
}

function createCustomEvent( type, payload )
{
	var evt = document.createEvent( "CustomEvent" );
    evt.initCustomEvent( type, false, false, payload );
    return evt;
}

var streets = null;
var _gaq = _gaq || [];
var boxElem;

window.onload = function()
{
	boxElem = document.getElementById( "box" );
	
	bindEvent( boxElem, "gaEvent", 					processAnalyticsData, 				false );	
	bindEvent( boxElem, "googleDecorateEvent", 		processGoogleDecorateEvent, 		false );	
	bindEvent( boxElem, "googlePlusDecorateEvent", 	processGooglePlusDecorateEvent, 	false );	

	// IE does not seem to have support for default view
	if( document.defaultView == null )
		document.defaultView = window;

	// load and initialize the streets bus
	streets = devhd.streets.create();
	streets.attachDocument( document );
	streets.setMode( "cloud" );
	streets.setEnvironment( "web" );
	streets.load( coreStreets );
	streets.load( feedlyStreets );

	streets.onAfterIdentitySync = function(){
		streets.service( "feedly" ).loadStartPage();
	};

	streets.askSyncIdentity( "initial boot" ); // non-i18n
	
	
	// Delaying the loading of Google Analytics and Twitter to make sure that those two scripts do not impact the feedly load experience.
	// Specially the twitter experience!

	window.setTimeout( function(){
		// GOOGLLE ANALYTICS BRIDGE
	  	(function() {
	    	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  	})();
	
		// GOOGLE PLUS BRIDGE
	  	(function() {
	    	var po = document.createElement('script'); 
			po.type = 'text/javascript'; 
			po.async = true; 
	    	po.src = 'https://apis.google.com/js/plusone.js';

	    	var s = document.getElementsByTagName('script')[0]; 
			s.parentNode.insertBefore(po, s);
	  	})();		
	},
	100
	);	
};

window.onbeforeunload = function()
{
	// load and initialize the streets bus
	streets.askShutdown();
};

function reloadFeedly( message )
{
};

var oauthWindow = null;

bindEvent( window, "message", function( e ) {
		
	if( e.origin != "http://cloud.feedly.com" && e.origin != "http://sandbox.feedly.com" && e.origin != "https://cloud.feedly.com" && e.origin != "https://sandbox.feedly.com" )
		return;
				
	
	var response = e.data;
		
	if( response.indexOf( "eventType=feedly" ) > -1 )
	{
		var index = response.indexOf( "code=" );

		if( index > -1 )
		{
			var code = response.slice( index + "code=".length );
			var end = code.indexOf( "&" );
			
			if( end > -1 )
				code = code.slice( 0, end );
		
			streets.service( "feedly" ).askLogin( code );
		}
		
		if( oauthWindow != null )
		{
			oauthWindow.close();
			oauthWindow = null;
		}
	}
	else if( response.indexOf( "eventType=evernote" ) > -1 )
	{
		var index = response.indexOf( "error=" );

		if( index == -1 )
		{
			// we need to ask the evernote popup to refresh itself
			
		}
		
		if( oauthWindow != null )
		{
			oauthWindow.close();
			oauthWindow = null;
		}
	}
}, 
false
);

function askLoginEvernote()
{	
	var redirect = "http://cloud.feedly.com/evernote.html";
	var currentLocation = new String( document.location );
	
	if( currentLocation.indexOf( "https" ) == 0 )
		redirect = "https://cloud.feedly.com/evernote.html";
	
	if( currentLocation.indexOf( "http://sandbox.feedly.com" ) == 0 )
	{
		redirect = "http://sandbox.feedly.com/evernote.html";
	}
	else if( currentLocation.indexOf( "https://sandbox.feedly.com" ) == 0 )
	{
		redirect = "https://sandbox.feedly.com/evernote.html";
	};
	
	var oauthURL = 	BACKEND + "/v3/evernote/auth?"
		  			+ "redirectUri=" + encodeURIComponent( redirect )
		  			+ "&feedlyToken=" + devhd.utils.SessionUtils.load().feedlyToken
	
	var DD=850, AA=680, CC=screen.height, BB=screen.width, HH=Math.round((BB/2)-(DD/2)), GG=100;
	if( CC/2>AA )
		GG=Math.round(CC/2-AA);
	
	oauthWindow = window.open( oauthURL, "Feedly Cloud", 'left=' + HH + ',top=' + GG + ',width=850,height=680,personalbar=0,toolbar=0,scrollbars=1,resizable=1' );

	if( oauthWindow == null )
	{
		window.alert( "[feedly] Evernote auth popup is null" );
		return;
	}

	if( oauthWindow.focus )
		oauthWindow.focus();
}



function askLoginFeedly()
{	
	var redirect = "http://cloud.feedly.com/feedly.html";
	var currentLocation = new String( document.location );
	
	if( currentLocation.indexOf( "https" ) == 0 )
		redirect = "https://cloud.feedly.com/feedly.html";
	
	if( currentLocation.indexOf( "http://sandbox.feedly.com" ) == 0 )
	{
		redirect = "http://sandbox.feedly.com/feedly.html";
	}
	else if( currentLocation.indexOf( "https://sandbox.feedly.com" ) == 0 )
	{
		redirect = "https://sandbox.feedly.com/feedly.html";
	};
	
	var oauthURL = 	BACKEND + "/v3/auth/auth?"
		  			+ "client_id=feedly&"
		  			+ "redirect_uri=" + encodeURIComponent( redirect ) + "&"
		  			+ "scope=" + encodeURIComponent( "https://cloud.feedly.com/subscriptions" ) + "&"
		  			+ "response_type=code&"
		  			+ "provider=google&"
		  			+ "migrate=false";

	var DD=480, AA=680, CC=screen.height, BB=screen.width, HH=Math.round((BB/2)-(DD/2)), GG=100;
	if( CC/2>AA )
		GG=Math.round(CC/2-AA);
	
	oauthWindow = window.open( oauthURL, "Feedly Cloud", 'left=' + HH + ',top=' + GG + ',width=480,height=680,personalbar=0,toolbar=0,scrollbars=1,resizable=1' );

	if( oauthWindow == null )
	{
		$feedly( "[feedly] Feedly Auth popup is null" );
		return;
	}

	if( oauthWindow.focus )
		oauthWindow.focus();
}

function askLoginFeedlyForOPML()
{	
	var redirect = "http://cloud.feedly.com/feedly.html";
	var currentLocation = new String( document.location );
	
	if( currentLocation.indexOf( "https" ) == 0 )
		redirect = "https://cloud.feedly.com/feedly.html";
	
	if( currentLocation.indexOf( "http://sandbox.feedly.com" ) == 0 )
	{
		redirect = "http://sandbox.feedly.com/feedly.html";
	}
	else if( currentLocation.indexOf( "https://sandbox.feedly.com" ) == 0 )
	{
		redirect = "https://sandbox.feedly.com/feedly.html";
	};
	
	var oauthURL = 	BACKEND + "/v3/auth/auth?"
		  			+ "client_id=feedly&"
		  			+ "redirect_uri=" + encodeURIComponent( redirect ) + "&"
		  			+ "scope=" + encodeURIComponent( "https://cloud.feedly.com/subscriptions" ) + "&"
		  			+ "response_type=code&"
		  			+ "migrate=false";

	var DD=480, AA=680, CC=screen.height, BB=screen.width, HH=Math.round((BB/2)-(DD/2)), GG=100;
	if( CC/2>AA )
		GG=Math.round(CC/2-AA);
	
	var oauthWindow = window.open( oauthURL, "Feedly Cloud", 'left=' + HH + ',top=' + GG + ',width=480,height=680,personalbar=0,toolbar=0,scrollbars=1,resizable=1' );

	if( oauthWindow == null )
	{
		$feedly( "[feedly] Feedly Auth popup is null" );
		return;
	}

	if( oauthWindow.focus )
		oauthWindow.focus();
}


///////////////////
// GOOGLE        // 
///////////////////
function processGoogleDecorateEvent()
{
	var loginWithGoogleElem = document.getElementById( "loginWithGoogle" );
	if( loginWithGoogleElem != null )
	{
		var decorated = loginWithGoogleElem.getAttribute( "data-decorated" );
		
		if( decorated == "yes" )
			return;
		
		loginWithGoogleElem.setAttribute( "data-decorated", "yes" );
		
		loginWithGoogle.onclick = function(){
			try
			{
				askLoginWithGoogle();
			}
			catch( e )
			{
				// ignore
			}
			return false;
		};
	};
}

///////////////////
// GOOGLE PLUS   //
///////////////////
		
function processGooglePlusDecorateEvent()
{
	window.setTimeout( doDecorateGooglePlusButtons, 750 );
}

function doDecorateGooglePlusButtons()	
{
	var pluses = document.getElementsByClassName( "gplus" );
	for( var i = 0; i < pluses.length; i++ )
		decorateGooglePlusButton( pluses[ i ] );
}		

function decorateGooglePlusButton( elem )
{
	if( elem.getAttribute( "data-google-plus-decorated" ) == "yes" )
		return;
	
	try
	{
		elem.setAttribute( "data-google-plus-decorated", "yes" );
		
		gapi.plusone.render(elem, 
						{ 	
							annotation: "none", 
							size: "tall", 
							source: "feedly",
							recommendations: false,
							href: elem.getAttribute( "data-href" ), 
							callback: function( info ){
								
								boxElem.setAttribute( "googlePlusLikeEventOptions", JSON.stringify( { "data-entryId": elem.getAttribute( "data-entryId" ), "data-state" : info.state } ) );

								var googlePlusEvent = document.createEvent( "Event" );
								googlePlusEvent.initEvent( "googlePlusLikeEvent", true, true );
								boxElem.dispatchEvent( googlePlusEvent );
							} 
						} 
						);
										
		elem.parentNode.parentNode.style.visibility = "visible";
	}
	catch( e )
	{
		$feedly( "failed to decorate:" + elem.getAttribute( "data-entryId" ) );
	}
}		

///////////////////
//GOOGLE PLUS   //
///////////////////

function processAnalyticsData()
{
	try
	{
		try
		{
			// Singleton events
			var gaOnce = boxElem.getAttribute( "data-ga-once" );
			
			// The client only want to send this event once in the lifetime of this browser
			if( gaOnce != null )
			{
				var val = window.localStorage.getItem( gaOnce );
				
				// there is a marker - this event has already been fired. cancel.
				if( val == "fired" )
					return;
				
				// assign marker so that this even it no longer fired in the future.
				window.localStorage.setItem( gaOnce, "fired" );
			}
		}
		catch( ignore )
		{
			
		}
		
		var gaData = boxElem.getAttribute( "data-ga" );

		if( gaData == null )
			return;

  		var gaCommand = JSON.parse( gaData );
		_gaq.push( gaCommand );

		boxElem.removeAttribute( "data-ga" );	
	}
	catch( err )
	{
		
	}
}

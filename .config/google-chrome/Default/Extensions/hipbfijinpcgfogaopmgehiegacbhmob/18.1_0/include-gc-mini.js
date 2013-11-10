"use strict";

function IO( xhrOptions ) 
{
	if( xhrOptions == null || xhrOptions.onComplete == null )
		return;

	chrome.extension.sendRequest( { type: "system", topic: "io", xhrOptions: xhrOptions }, function( msg ){
		xhrOptions.onComplete(msg.status, msg.data, msg.version);
	});
}

var includedScripts = {};
var pendingScripts  = {};

function askIncludeFeedlyScript( partialURI, onComplete )
{
	onComplete = onComplete || function(){};
	
	if( includedScripts[ partialURI ] == true )
		return onComplete();

	if( pendingScripts[ partialURI ] != null )
	{
		pendingScripts[ partialURI ].push( onComplete );
		return;
	}
	
	pendingScripts[ partialURI ] = [ onComplete ];

	try
	{
		IO(	{	method: 	"GET",
		  		url:  		chrome.extension.getURL( partialURI ),
		  		onComplete: function( status, data, version ) 
				{
					if (status == 200) 
					{
						try
						{
							window.eval.call( window, data );
						}
						catch( e )
						{
							window.console.log( "[page][load-script]" + partialURI + " failed because " + e.name + " -- " + e.message );
							throw e;
						}
					}
					includedScripts[ partialURI ] = true;
					
					for( var i = 0; i < pendingScripts[ partialURI ].length; i++ )
						pendingScripts[ partialURI ][ i ]();
	
					delete pendingScripts[ partialURI ];
				}
			});
	}
	catch( ignore )
	{
		
		// some files might not exist. no worries
	}
}

	loadFeedlyMini();


function loadFeedlyMini()
{
	// determine if the mini is enabled or not
	chrome.extension.sendRequest( { type: "system", topic: "mini" }, function( options ){

		// Make sure that the required JS files have already been loaded.
		if( typeof devhd == "undefined" || devhd.mini == null || devhd.mini.FilterUtils == null || options == null )
			return;

		if( options.enabled != true )
			return;
		
		if( devhd.mini.FilterUtils.ignore( new String( window.document.location ), options.exclude ) == true )
			return;
			
		if( window.innerWidth < 700 || window.innerHeight < 600 )
			return;

		
		displayMiniIcon( options );
	});
}

function displayMiniIcon( options )
{
	// Special case: Feedburner RSS feed - redirect automatically to feedly.
	if( document.getElementById( "subscribe-userchoice" ) != null && document.getElementById( "subscribenow" ) != null )
	{
		window.location.href = "http://cloud.feedly.com/#" + encodeURIComponent( "subscription/feed/" + window.location.href );
		return;
	}
	
	devhd.mini.UIUtils.insertIcon( window, options.bottom, function(){
		// activate feedly mini when the user clicks on the mini icon
		loadMini( options );
	});
}

function loadMini( options )
{
	tools = options.tools;
	
	askIncludeLibraries();
}

var streets = null;
var pending = 0;
var finished = false;
var tools = null;
var miniStreets = null;

function askIncludeLibraries()
{
	if( streets != null )
		return askShowPopup();

	pending = 0;
	finished = false;
	
	include ( "js/10101_gc-mini_125.js");
	
	
	finished = true;
	
	tryCompleteIncludeLibraries();
}

function include( uri )
{
	pending++;
	askIncludeFeedlyScript( uri, 
							function()
							{
								pending--;
								
								tryCompleteIncludeLibraries();
							});
}

function tryCompleteIncludeLibraries()
{
	if( pending > 0 || finished == false )
		return;

	// load and initialize the streets bus
	streets = devhd.streets.create();
	streets.setEnvironment( "chrome" );
	
	streets.connect();

	streets.attachDocument( document );	

	streets.load( miniStreets );
	
	streets.askStart( 	function()
						{
							askShowPopup();
						},
						function( status )
						{
							window.console.log( "[feedly] failed to initialize mini because " + status );
						}
						);
						
	bindEvent( window,  "pagehide",  unloadMini, false );
}

function askShowPopup()
{
	streets.service( "mini" ).show( tools );
}

function unloadMini()
{
	// load and initialize the streets bus
	if( streets != null )
	{
		streets.askShutdown();
		streets = null;
	}

	bindEvent( window, "pagehide",  unloadMini, false ); 
}

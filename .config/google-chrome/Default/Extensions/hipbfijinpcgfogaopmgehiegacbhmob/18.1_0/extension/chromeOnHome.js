"use strict";

function IO( xhrOptions ) 
{
	if( xhrOptions == null || xhrOptions.onComplete == null )
		return;

	streets.sendRequest( { type: "system", topic: "io", xhrOptions: xhrOptions }, function( msg ){
		xhrOptions.onComplete(msg.status, msg.data, msg.version);
	});
}

function $feedly( msg )
{
	window.console.log( msg );
}

var includedScripts = {};
var pendingScripts  = {};

function askIncludeFeedlyScript( partialURI, onComplete )
{
	if( includedScripts[ partialURI ] == true )
		return devhd.fn.callback( onComplete );

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
							$feedly( "[page][load-script]" + partialURI + " failed because " + e.name + " -- " + e.message );
							throw e;
						}
					}
					includedScripts[ partialURI ] = true;
					
					for( var i = 0; i < pendingScripts[ partialURI ].length; i++ )
						devhd.fn.callback(  pendingScripts[ partialURI ][ i ] );
	
					delete pendingScripts[ partialURI ];
				}
			});
	}
	catch( ignore )
	{
		
		// some files might not exist. no worries
	}
}

var streets = null;
function loadFeedly() 
{
	$feedly( "[feedly][page] loading feedly v." + feedlyMajorVersion );

	document.body.setAttribute( "feedly-version", feedlyMajorVersion );
	
	// load and initialize the streets bus
	streets = devhd.streets.create();
	streets.setEnvironment( "chrome" );

	streets.connect();

	streets.attachDocument( document );	

	streets.load( feedlyStreets );
	
	streets.askStart( 	function()
						{
							streets.service( "feedly" ).loadStartPage();	
						},
						function( status )
						{
							status = status || "";
							
							if( status.indexOf( "fail") > -1 )
							{
								document.location = "http://www.feedly.com/offline.htm?010-services_not_started--" + status + "--feedly_" + feedlyApplicationVersion+ "_chrome";
							}
							else
							{
								document.getElementById( "loadingStatus" ).innerHTML = status;	
							}
						}
						);
}

function reloadFeedly( message )
{
	try
	{	
		if( message.cause != null )
			window.localStorage.setItem( "reload.cause", message.cause );
		
		window.setTimeout( function(){
			var s = new String( window.location.href );
			if( s.indexOf( "feedly.com/home" ) > -1 && s.indexOf( "category/" ) == -1 && s.indexOf( "label/" ) == -1 )
				window.location.reload( true );
			else
				window.location = "http://cloud.feedly.com/";
		}, 
		1000
		);
	}
	catch( e )
	{
		window.alert( "Please reload the feedly page because " + message.cause );
	}
}

function upgradeFeedly( message )
{
	window.location = "http://www.feedly.com/upgrade.html";
}

if( document.body.getAttribute( "feedly-version" ) == null )
{
	loadFeedly();

}


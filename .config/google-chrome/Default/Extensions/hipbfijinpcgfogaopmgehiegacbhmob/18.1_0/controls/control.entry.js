"use strict";

( function ()
{
	var pkg = devhd.pkg( "control" );

	var BaseControl	 = pkg.BaseControl.prototype;
	var EntryControl = pkg.createClass ( "EntryControl", pkg.BaseControl );

	var LOG = devhd.log.get( "control.entry");

	var _L = devhd.i18n.L;

	EntryControl.initialize = function ()
	{
		BaseControl.initialize.call( this );
	};

	EntryControl.setEntryId = function( entryId )
	{
		this.entryId = entryId;
	};

	EntryControl.setWidth = function( w )
	{
		this.width = w;
	};

	EntryControl.setSelectedEntryId = function( selectedEntryId )
	{
		this.selectedEntryId = selectedEntryId;
	};

	EntryControl.setReader = function ( value )
	{
		this.reader = value;
		this.reader.registerObserver( this );
	};

	EntryControl.setPreferences = function ( value )
	{
		this.preferences = value;
	};

	EntryControl.setSigns = function ( value )
	{
		this.signs = value;
	};

	EntryControl.setTumblr = function ( value )
	{
		this.tumblr = value;
	};

	EntryControl.setFeedly = function ( value )
	{
		this.feedly = value;
	};

	EntryControl.setSearchTerm = function( value )
	{
		this.searchTerm = value;
	};

	EntryControl.setReco = function( value )
	{
		this.reco = value;
	};

	EntryControl.setCondensed = function( value )
	{
		this.condensed = value == true;
	};

	EntryControl.setPopup = function( value )
	{
		this.popup = value;
	};

	EntryControl.setProfile = function( value )
	{
		this.profile = value;
	};

	EntryControl.setTwitter = function( value )
	{
		this.twitter = value;
	};

	EntryControl.setTinyURL = function( value )
	{
		this.tinyURL = value;
	};

	EntryControl.setAnalytics = function( value )
	{
		this.analytics = value;
	};

	EntryControl.setAdz = function( value )
	{
		this.adz = value;
	};

	EntryControl.setShowSourceTitle = function( value )
	{
		this.showSourceTitle = value;
	};

	EntryControl.setOnLayoutReady = function( fn )
	{
		this.onLayoutReady = fn;
	};

	EntryControl.setIo = function( value )
	{
		this.io = value;
	};

	EntryControl.setBack = function( value )
	{
		this.back = value;
	};

	EntryControl.setFacebook = function( value )
	{
		this.facebook = value;
	};

	/***
	 * Clean up time. Release all resources.
	 */
	EntryControl.destroy = function()
	{
		if( this.postProcessingTimer != null )
		{
			this.home.getDocument().defaultView.clearTimeout( this.postProcessingTimer );
			this.postProcessingTimer = null;
		}

		if( this.reader != null )
		{
			this.reader.unregisterObserver( this );
			this.reader = null;
		}

		// clean up the wall control.
		if( this.wall != null )
		{
			this.wall.destroy();
			this.wall = null;
		}

		this.preferences 	= null;
		this.signs 			= null;
		this.tumblr 		= null;
		this.feedly 		= null;
		this.searchTerm 	= null;
		this.reco 			= null;
		this.popup 			= null;
		this.profile 		= null;
		this.analytics 		= null;
		this.adz	 		= null;
		this.io				= null;
		this.twitter 		= null;
		this.tinyURL 		= null;
		this.back			= null;
		this.facebook		= null;

		this.onLayoutReady	= null;

		this.part.innerHTML = "";

		BaseControl.destroy.call( this );

		// release reference to entry
		this.entry 			= null;
	};

	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	// Private Implementation                       //
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	EntryControl.display = function()
	{
		this.t0 = new Date().getTime();

		// For markers
		var that = this;

		// do no assume that the information regarding this entry is in the cache. Ask for it instead.
		this.reader.askEntry( 			this.entryId,
										function( anEntry )
										{
											try
											{
												if( that.isDestroyed() )
													return true;

												if( anEntry == null )
												{
													onEntryNotFound.call( that )
													return;
												}

												that.entry = anEntry;

												// make sure that the entry is marked as read
												if( that.entry.isRead() == false )
													that.reader.askMarkEntryAsRead( that.entryId, false, false, true );

												that.customRenderer = createCustomRenderer( that.entry );
												
												// render the page body
												that.part.innerHTML = templates.page.base.u100EntryImpl( that.entry, that.customRenderer != null, that.home );
												
												if( that.customRenderer == null )
													manupulateContent.call( that );

												that.part.style.opacity = 1;
												
												// optional callback - used in case of the entry being inlined to show the frame and
												// select the entry.
												if( that.onLayoutReady != null )
													devhd.fn.callback( that.onLayoutReady );
												
												that.analytics.trackEvent( "reading", "open", anEntry.getFeedId() );
											}
											catch( e )
											{
												$feedly( "[control][entry]" + devhd.utils.ExceptionUtils.formatError( "display entry: " + that.entryId, e ) );
												that.signs.setMessage( "[ERR-EC-001]" + devhd.utils.ExceptionUtils.formatError( "display entry: " + that.entryId, e ) );
											}
										},
										function()
										{
											if( that.isDestroyed() )
												return true;

											onEntryNotFound.call( that );
										}
										);
	};

	function onEntryNotFound()
	{
		this.part.innerHTML = templates.page.base.disconnected();
		this.part.style.opacity = 1;
		return;
	};

	function onEntryInformationReady( anEntry )
	{
		if( this.part == null )
			return;

	};

	EntryControl.finishDisplay = function()
	{		
		this.bind( this.part, "mouseup", 	EntryControl.processSelection	);
		this.bind( this.part, "click", 		EntryControl.processClick		);

		if( this.customRenderer == null )
		{
			doPostProcessing.call( this );
			return;
		}
		else
		{
			var that = this;
			this.customRenderer.call( 	this,
										function()
										{
											if( that.isDestroyed() == true )
												return;
	
											manupulateContent.call( that );

											doPostProcessing.call( that );
										}
										);
		}
	};

	function activateGooglePlus()
	{
		try
		{
			var e = this.home.getDocument().createEvent( "Event" );
	   		e.initEvent( "googlePlusDecorateEvent", true, true );
	   		
	   		var boxElem = this.home.getDocument().getElementById( "box" );
	   		if( boxElem != null )
	   			boxElem.dispatchEvent( e );
		}
		catch( e )
		{
			
		}		
	}
 	
	function manupulateContent()
	{
		var entryHolderElem = this.element( this.entryId + "_entryBody" );
 		devhd.utils.HTMLUtils.cleanNode( 	entryHolderElem, 
 											{ 
 												maxWidth : 579, 
 												rtl : this.entry.isContentRTL(),
 												pinImage: this.feedly.getPreference( "pinImage" ) 
 											} 
 											);
	}

	// Allows for custom rendering of entries. For example, for hulu, we can use the hulu embedding capabilities
	// to auto embed the video.
	function createCustomRenderer( anEntry )
	{
		var url = anEntry.getAlternateLink();

		if( url.indexOf( "youtube.com" ) != -1 )
			return youtubeRenderer;
		
		if( url.indexOf( "vimeo.com" ) != -1 )
			return vimeoRenderer;

		if( url.indexOf( "hulu.com" ) != -1 && false )
			return huluRenderer;

		if( url.indexOf( "www.thedailyshow.com" ) != -1 )
			return dailyShowRenderer;

		if( url.indexOf( "collegehumor.com") != -1 )
			return collegeHumorRenderer;

		return null;
	}

	function defaultRenderer( onComplete )
	{
		var bodyElem = that.element( that.entry.getId() + "_entryBody" );
		bodyElem.innerHTML = templates.page.base.u100EntryBody( that.entry, that.home );

		devhd.fn.callback( onComplete );
	}

	// Hulu
	// <link rel="media:video" href="http://www.hulu.com/embed/jb-tm88d5TtYGw_kgEcZOA" />
	var RE_HU_VIDEO = /rel="media:video" href="([^"]*)"/i;
	function huluRenderer( onComplete )
	{
		var that = this;

		var bodyElem = that.element( that.entry.getId() + "_entryBody" );
		bodyElem.innerHTML = templates.control.entry.huluFrame( that.entry );

		devhd.fn.callback( onComplete );

		that.io.get( 	that.entry.getAlternateLink(),
						function( content )
						{
							if( that.isDestroyed() == true )
								return;

							that.entry.hulu = devhd.utils.RegExUtils.select( RE_HU_VIDEO, content );
							that.element( that.entry.getId() + "_hu" ).innerHTML = templates.control.entry.huluVideo( that.entry );
						},
						function( error )
						{
							that.element( that.entry.getId() + "_hu" ).innerHTML = "Error:" + error;
						}
						);
	}

	// Daily Show
	var RE_DS_VIDEO = /videoId=([^&]*)&/i;
	function dailyShowRenderer( onComplete )
	{
		var that = this;

		that.entry.dailyShow = devhd.utils.RegExUtils.select( RE_DS_VIDEO, that.entry.getAlternateLink() ).split( "?" );

		var bodyElem = that.element( that.entry.getId() + "_entryBody" );
		bodyElem.innerHTML = templates.control.entry.dailyShow( that.entry );

		devhd.fn.callback( onComplete );
	}
	
	// http://www.youtube.com/watch?v=B02GMblHuDA&feature=youtube_gdata
	var RE_YOUTUBE1 = /youtube\.com\/embed\/([A-Za-z0-9\-_]+)/i;
	var RE_YOUTUBE2 = /youtube\.com\/v\/([A-Za-z0-9\-_]+)/i;
	var RE_YOUTUBE3 = /ytimg\.com\/vi\/([A-Za-z0-9\-_]+)/i;
	var RE_YOUTUBE4 = /youtube\.com\/watch\?v=([A-Za-z0-9\-_]+)/i;
	function youtubeRenderer( onComplete )
	{
		var link = this.entry.getAlternateLink();
		this.entry.metadata.youtube = 	devhd.utils.RegExUtils.select( RE_YOUTUBE1, link ) 
										|| devhd.utils.RegExUtils.select( RE_YOUTUBE2, link )
										|| devhd.utils.RegExUtils.select( RE_YOUTUBE3, link )
										|| devhd.utils.RegExUtils.select( RE_YOUTUBE4, link );

		var bodyElem = this.element( this.entry.getId() + "_entryBody" );
		bodyElem.innerHTML = templates.control.entry.youtube( this.entry );
		
		var elems = devhd.utils.HTMLUtils.findElements( this.part, { className: "topWikiWidget", "data-entryId": this.entry.getId() } );
		
		for( var i = 0; i < elems.length ; i++ )
			elems[ i ].className = "topWikiWidget wikiWidget forVideo";

		devhd.fn.callback( onComplete );
	}

	// http://www.youtube.com/watch?v=B02GMblHuDA&feature=youtube_gdata
	var RE_VIMEO = /vimeo\.com.*\/([A-Za-z0-9\-_]+)/i;
	function vimeoRenderer( onComplete )
	{
		var link = this.entry.getAlternateLink();

		if( link.indexOf( "#" ) > -1 )
			this.entry.metadata.vimeo = link.split( "#" )[ 1 ];
				
		if( this.entry.metadata.vimeo == null || this.entry.metadata.vimeo == "" )
			this.entry.metadata.vimeo = devhd.utils.RegExUtils.select( RE_VIMEO, link );

		var bodyElem = this.element( this.entry.getId() + "_entryBody" );
		bodyElem.innerHTML = templates.control.entry.vimeo( this.entry );
		
		var elems = devhd.utils.HTMLUtils.findElements( this.part, { className: "topWikiWidget", "data-entryId": this.entry.getId() } );
				
		for( var i = 0; i < elems.length ; i++ )
			elems[ i ].className = "topWikiWidget wikiWidget forVideo";

		devhd.fn.callback( onComplete );
	}
	
	// Daily Show
	var RE_CH_VIDEO = /video:(.*)/i;
	function collegeHumorRenderer( onComplete )
	{
		var that = this;

		that.entry.collegeHumor = devhd.utils.RegExUtils.select( RE_CH_VIDEO, that.entry.getAlternateLink() );

		var bodyElem = that.element( that.entry.getId() + "_entryBody" );
		bodyElem.innerHTML = templates.control.entry.collegeHumor( that.entry );

		devhd.fn.callback( onComplete );
	}

	function doPostProcessing()
	{
		// for longer articles, display another copy of the sharing toolbar at the bottom of the document.
		var bodyElem = this.element( this.entry.getId() + "_entryHolder" );
		if( bodyElem != null && bodyElem.clientHeight > this.home.getDocument().body.clientHeight - 80 || this.entry.listContentVisuals().length > 1 || ( this.entry.listContentVisuals().length > 0 && this.entry.asText() > 300 ) )
			this.element( this.entry.getId() + "_bottomWikiWidget").style.display = "block";
				
		activateGooglePlus.call( this );

		// Some entries (like shared notes, do not have an alternate link. For those,
		// the wall is not relevant.
		var that  = this;
		that.wall = new devhd.control.WallControl();
		that.wall.setHome( that.home );
		that.wall.setPreferences( that.preferences );
		that.wall.setReader( that.reader );
		that.wall.setTwitter( that.twitter );
		that.wall.setFacebook( that.facebook );
		that.wall.setTinyURL( that.tinyURL );
		that.wall.setContext( { entry: that.entry, entryId: that.entry.getId(), feedId: that.entry.getFeedId() } );
		that.wall.setReadOnly( false );
		that.wall.setPart( that.element( that.entryId + "_wallHolder" ) );
		that.wall.display();
	}

	EntryControl.processClick = function( event )
	{
		// Special logic for handling click on microformat elements
		var targetElem = event.target;
		var mfText = targetElem.getAttribute( "data-mf-text" );
		if( mfText != null )
			this.feedly.search( mfText );

		return false;
	};

	EntryControl.processSelection = function (event)
	{
		try
		{
			if( event.target.tagName.toLowerCase() == "embed" )
				return;

			if( event.target.className == "action" )
				return ;

			// make sure that the user has selected something
			var s = devhd.utils.HTMLUtils.getSelection( this.home.getDocument() );
			if( s == null || s == "" )
				return;

			var r = devhd.utils.HTMLUtils.grabRangeContext( this.home.getDocument().defaultView );
			if (r == null)
				return;

			// hide the potential annotation helper sign so that there are no
			// interference.
			this.signs.hide( 0 );

			var that = this;
			this.preferences.askPreference( "contextualMenu", function( contextualMenu ){
				
				if( contextualMenu == "no" )
					return
				
				LOG.trace(516,"range present, will process selection");
				// for reasons to complicated to explain here, suffice it to say we need to do the following:
				var ev = { altKey: event.altKey, pageX: event.pageX, pageY: event.pageY };
				that.home.getDocument().defaultView.setTimeout( function() { doProcessSelection.call( that,ev ); }, 5 );
			});

		}
		catch( e )
		{
			$feedly( devhd.utils.ExceptionUtils.formatError( "process section", e ) );
		}
	}

	function doProcessSelection( e )
	{
		// control/page destroyed before the async timeout happens.
		if( this.home == null )
			return;

		// make sure that the user has selected something
		var s = devhd.utils.HTMLUtils.getSelection( this.home.getDocument() );
		if( s == null || s == "" )
			return;

		var r = devhd.utils.HTMLUtils.grabRangeContext( this.home.getDocument().defaultView );
		if( r == null )
			return;

		// pop-up the pop-up
		// edwin k. changed the popup location to the bottom of the cursor to accomodate some
		// of the users who like to highlight and read.
		this.popup.show0(	templates.control.entry.toolsPopup( this.entry.getId(), s, this.home ),
		    				{
								minWidth: 40,
								deltaTop: 15,
								deltaLeft: -19,
								pageX: e.pageX,
								pageY: e.pageY
							},
							this,
							true
							);

		var that = this;

		this.bind( 	this.element( "tp_tweet" ),
					"mousedown",
					function()
					{
						that.feedly.tweetEntry( that.entry.getId(), null, s );
						devhd.events.cancelEvent( e );
					}
					);

		this.bind( 	this.element( "tp_translate" ),
					"mousedown",
					function( e )
					{
						that.feedly.translateSelection();
						devhd.events.cancelEvent( e );
					}
					);

		this.popup.armAutoHideAfterDelay( 14000 );
	}

	EntryControl.showRelatedArticles = function()
	{
		var s = devhd.utils.HTMLUtils.getSelection( this.home.getDocument() );
		if( s == null || s ==  "" )
		{
			this.signs.setMessage(_L(4) );
			return;
		}

		this.feedly.loadPage( "search/" + s );
	};

	EntryControl.showRelatedSources = function()
	{
		var s = devhd.utils.HTMLUtils.getSelection( this.home.getDocument() );

		if( s == null || s ==  "" )
		{
			this.signs.setMessage( _L(4) );
			return;
		}

		this.feedly.explore( s );
	};

	EntryControl.showGoogleResults = function()
	{
		var s = devhd.utils.HTMLUtils.getSelection( this.home.getDocument() );

		if( s == null || s ==  "" )
		{
			this.signs.setMessage( _L(4) );
			return;
		}

		this.home.getDocument().location.href = "!{google.search}/search?q=" + encodeURIComponent( s );
	};

	EntryControl.showTwitterResults = function()
	{
		var s = devhd.utils.HTMLUtils.getSelection( this.home.getDocument() );

		if( s == null || s ==  "" )
		{
			this.signs.setMessage( _L(4) );
			return;
		}

		this.home.getDocument().location.href = "http://search.twitter.com/search?q=" + encodeURIComponent( s );
	};

	EntryControl.showYouTubeResults = function()
	{
		var s = devhd.utils.HTMLUtils.getSelection( this.home.getDocument() );

		if( s == null || s ==  "" )
		{
			this.signs.setMessage( _L(4) );
			return;
		}

		this.home.getDocument().location.href = "http://www.youtube.com/results?search_query=" + encodeURIComponent( s );
	};

	EntryControl.loadEntry = function( entryId, select, evt )
	{
		if( this.entry.getId() == entryId )
			return true;
		else
			return this.feedly.loadEntry( entryId, evt );
	};


} )();


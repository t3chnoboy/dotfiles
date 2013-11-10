"use strict";

( function ()
{
	var pkg = devhd.pkg( "control" );

	var BaseControl = devhd.control.BaseControl.prototype;
	var RecommendationAreaControl = pkg.createClass( "RecommendationAreaControl", pkg.BaseControl );

	/////////////////////////////
	// LIFECYCLE
	/////////////////////////////
	RecommendationAreaControl.initialize = function()
	{
		BaseControl.initialize.call( this ); 
		this.minVisible = 0;
		this.includeSourceTitle = true;
	};


	RecommendationAreaControl.destroy = function( mode )
	{
		this.page 				= null;
		this.reader 			= null;
		this.featured 			= null;
		this.minVisible 		= null;
		this.includeSourceTitle	= null;

		BaseControl.destroy.call(this);
	};

	/////////////////////////////
	// DEPENDENCY INJECTION
	/////////////////////////////
	RecommendationAreaControl.setReader = function( r )
	{
		this.reader = r;
	};

	RecommendationAreaControl.setPage = function( p )
	{
		this.page = p;
	};

	RecommendationAreaControl.setFeatured = function( r )
	{
		/*
		for( var i = 0; i < r.length; i++ )
		{
			$feedly( "CONTENT / " + i + " / " + r[ i ].getContentOrSummary() );
			$feedly( "VISUALS / " + i + " / " + devhd.utils.JSONUtils.encode( r[ i ].listContentVisuals() ) );
		}
		*/
			
		if( r.length == 4 )
		{
			this.top = r[ 0 ];
			r = r.slice( 1 );
		}
		
		
		this.featured = r.sort( function ( eA, eB ){ return eB.getEngagement() - eA.getEngagement(); } );
	};

	RecommendationAreaControl.setMinVisible = function( m )
	{
		this.minVisible = m;
	};

	RecommendationAreaControl.showSourceTitle = function( b )
	{
		this.includeSourceTitle = b;
	};

	/////////////////////////////
	// CONTROL
	/////////////////////////////
	RecommendationAreaControl.display = function( forceGrid )
	{
		if( this.featured.length == 0 )
			return;
		
		this.part.innerHTML = templates.page.base.displayRecommendationArea();

		// TOP ENTRY
		if( this.top != null )
		{
			if( this.top.fits( "U8", 0.9 ) && this.top.asText() < 400 )
			{
				this.element( "recommentationAreaTop" ).innerHTML
					= templates.page.base.u8Entry( this.top, { includeSourceTitle : this.includeSourceTitle }, this.home );
		
				this._askTopVisual( this.top, "U8", 0.9 );
			}
			else if( this.top.fits( "U9", 0.8 ) )
			{
				this.element( "recommentationAreaTop" ).innerHTML
					= templates.page.base.u9Entry( this.top, { includeSourceTitle : this.includeSourceTitle }, this.home );
		
				this._askTopVisual( this.top, "U9", 0.7 );
			}
			else if( this.top.fits( "U10", 0.55 ) )
			{
				this.element( "recommentationAreaTop" ).innerHTML
					= templates.page.base.u10Entry( this.top, { includeSourceTitle : this.includeSourceTitle }, this.home );
		
				this._askTopVisual( this.top, "U10", 0.55 );
			}
			else if( this.top.listContentVisuals().length > 0 )
			{
				this.element( "recommentationAreaTop" ).innerHTML
					= templates.page.base.u10Entry( this.top, { includeSourceTitle : this.includeSourceTitle }, this.home );

				this._askTopVisual( this.top, "U10" );
			}
			else
			{
				this.element( "recommentationAreaTop" ).innerHTML
					= templates.page.base.u11Entry( this.top, { includeSourceTitle : this.includeSourceTitle }, this.home );
			}
		}
				
		// Headlines
		if( this.featured.length > 0 )
		{
			this.element( "recommentationAreaHeadlines" ).innerHTML
				= templates.page.base.displayRecommendations( this.featured, { includeSourceTitle : this.includeSourceTitle }, this.home );
		
			for( var i = 0; i < this.featured.length; i++ )
				this._askRecommendationVisual( this.featured[ i ] );
			
			this.page.askAdjustEntries( this.featured );
		}
	};

	/////////////////////////////
	// PRIVATE
	/////////////////////////////
	RecommendationAreaControl._askTopVisual = function( anEntry, u, tolerance )
	{
		tolerance = tolerance || 1;

		var w = devhd.utils.PageConstants[ u + "_IMAGE_WIDTH"  ];
		var h = devhd.utils.PageConstants[ u + "_IMAGE_HEIGHT" ];

		var finder = this.page._createAndEnlistVisualFinder( anEntry, w, h, w * tolerance, h * tolerance );

		var that = this;

		finder.onVisualReady = 	function( entryId, aVisual )
								{
									that.askDisplayTopVisual( entryId, aVisual, w, h, anEntry.embedsVideo() );
									
									switch( u )
									{
										case "U8": 
											// Adjust the title of the vignette.
											that.adjustU8Recommendation( entryId );
									
										case "U10":
											// Adjust the amount of summary text visible.
											that.adjustU10Recommendation( entryId );
											break;
											
										default:
			
									}
								};

		finder.onNoVisual = 	function( entryId )
								{
									that.element( "recommentationAreaTop" ).innerHTML
										= templates.page.base.u11Entry( that.top, 
																		{ 
																			includeSourceTitle : that.includeSourceTitle 
																		}, 
																		that.home 
																		);
								};
		finder.start();
	};

	RecommendationAreaControl.adjustU8Recommendation = function( entryId )
	{
		var entryElem = this.element( entryId + "_main" );
		var vignetteElem = this.element( entryId + "_main_vignette" );
		var titleElem = this.element( entryId + "_main_title" );

		if( titleElem == null || vignetteElem == null || entryElem == null )
			return;
		
		vignetteElem.style.marginTop = - ( titleElem.clientHeight + 8 + 16 + 17 * 2 );
		entryElem.style.visibility = "visible";
	};

	RecommendationAreaControl.adjustU10Recommendation = function( entryId )
	{
		var titleElem = this.element( entryId + "_main_title" );
		var summaryElem = this.element( entryId + "_main_summary" );
	
		if( titleElem == null || summaryElem == null )
			return;
		
		var leftOver = 258 - 16 - titleElem.clientHeight - 8;
		
		var nbrLines = Math.floor( leftOver / COPY_LINE_HEIGHT );

		summaryElem.style.maxHeight = ( nbrLines * COPY_LINE_HEIGHT ) + "px";
	};

	RecommendationAreaControl.askDisplayTopVisual = function( entryId, aVisual, w, h, video )
	{
		if( this.page.state=="destroyed" )
			return;

		this.page._delistVisualFinder( entryId );

		var visualElem = this.element( entryId + "_main_visual" );
		if( visualElem == null )
			return; // this elem is no longer part of the page which is being rendered. The user has transitioned to another page already.

		var backgroundImage = "";
		if( video == true )
			backgroundImage = "url( " + devhd.s3( "images/play.png" )+ " ), ";
	
		backgroundImage += "url(" + aVisual.url + ")";
		
		visualElem.style.backgroundImage = backgroundImage;
		
		if( video )
			visualElem.className = "visual largePlayable";

		visualElem.style.display = "block";
		
		this.home.getDocument().defaultView.setTimeout( function(){
			visualElem.style.opacity = 1;
			visualElem.style.webkitTransform = "none";
			visualElem.style.MozTransform = "none";
		},
		100
		);
	};

	RecommendationAreaControl._askRecommendationVisual = function( anEntry, rank )
	{
		var w = devhd.utils.PageConstants.UR_IMAGE_WIDTH;
		var h = devhd.utils.PageConstants.UR_IMAGE_HEIGHT;

		// if the entry includes a podcast, embed the media player instead of the visual
		var finder = this.page._createAndEnlistVisualFinder( anEntry, w, h );

		var that = this;

		finder.onVisualReady = 	function( entryId, aVisual )
								{
									that.askDisplayURVisual( entryId, aVisual, w, h, anEntry.embedsVideo() );
									that.adjustTopRecommendation( entryId, w, h );
								};

		finder.onNoVisual = 	function( entryId )
								{
									that.askHandleNoURVisual( entryId );
									that.adjustTopRecommendation( entryId, w, h );
								};
		finder.start();
	};

	RecommendationAreaControl.askDisplayURVisual = function( entryId, aVisual, w, h, video )
	{
		if( this.page.state=="destroyed" )
			return;

		this.page._delistVisualFinder( entryId );

		this._displayRecommendationVisual( entryId, aVisual, w, h, video );
	};

	RecommendationAreaControl.askHandleNoURVisual = function( entryId )
	{
		if( this.isDestroyed() == true )
			return;

		this.page._delistVisualFinder( entryId );

		var visualElem = this.element( entryId + "_main_visual" );
		if( visualElem != null )
		{
			visualElem.className = "visual placeholder";
			this.home.getDocument().defaultView.setTimeout( function(){
				visualElem.style.opacity = 1;
				visualElem.style.webkitTransform = "none";
				visualElem.style.MozTransform = "none";
			},
			100
			);
		}
	};

	var COPY_LINE_HEIGHT = 16;
	
	RecommendationAreaControl.adjustTopRecommendation = function( entryId, w, h )
	{
		var titleElem = this.element( entryId + "_main_title" );
		var visualElem = this.element( entryId + "_main_visual" );
		var summaryElem = this.element( entryId + "_main_summary" );
	
		if( titleElem == null || summaryElem == null || visualElem == null )
			return;
		
		var leftOver = 280 - 17 - titleElem.clientHeight - 8;
		
		if( h != null )
			leftOver = leftOver - h - 8;

		var nbrLines = Math.floor( leftOver / COPY_LINE_HEIGHT );		
		summaryElem.style.maxHeight = ( nbrLines * COPY_LINE_HEIGHT ) + "px";
	};

	RecommendationAreaControl._displayRecommendationVisual = function( anEntryId, aVisual, w, h, video )
	{
		var visualElem = this.element( anEntryId + "_main_visual" );
		if( visualElem == null )
			return; // this elem is no longer part of the page which is being rendered. The user has transitioned to another page already.
		
		var backgroundImage = "";
		if( video == true )
			backgroundImage = "url( " + devhd.s3( "images/play.png" )+ " ), ";
	
		backgroundImage += "url(" + aVisual.url + ")";
		
		visualElem.style.backgroundImage = backgroundImage;
		
		if( video )
			visualElem.className = "visual playable";
		
		visualElem.style.display ="block";
		this.home.getDocument().defaultView.setTimeout( function(){
			visualElem.style.opacity = 1;
			visualElem.style.webkitTransform = "none";
			visualElem.style.MozTransform = "none";
		},
		100
		);
	};

	RecommendationAreaControl._askU4Visual = function( anEntry, rank )
	{
		var finder = this.page._createAndEnlistVisualFinder( 	anEntry,
																devhd.utils.PageConstants.U4_IMAGE_WIDTH,
																devhd.utils.PageConstants.U4_IMAGE_HEIGHT
																);

		var that = this;

		finder.onVisualReady = 	function( entryId, aVisual )
								{
									that.askDisplayU4Visual( entryId, aVisual, anEntry.embedsVideo() );
								};

		finder.onNoVisual = 	function( entryId )
								{
									that.askHandleNoU4Visual( entryId );
								};
		finder.start();
	};

	RecommendationAreaControl.askDisplayU4Visual = function( entryId, aVisual, video )
	{
		if( this.isDestroyed() == true )
			return;

		this.page._delistVisualFinder( entryId );

		var visualElem = this.element( anEntryId + "_main_visual" );
		if( visualElem == null )
			return; // this elem is no longer part of the page which is being rendered. The user has transitioned to another page already.

		var backgroundImage = "";
		if( video == true )
			backgroundImage = "url( " + devhd.s3( "images/play.png" )+ " ), ";
	
		backgroundImage += "url(" + aVisual.url + ")";
		
		visualElem.style.backgroundImage = backgroundImage;
		
		if( video )
			visualElem.className = "visual playable";
		
		visualElem.style.display ="block";
		this.home.getDocument().defaultView.setTimeout( function(){
			visualElem.style.opacity = 1;
			visualElem.style.webkitTransform = "none";
			visualElem.style.MozTransform = "none";
		},
		100
		);
	};

	RecommendationAreaControl.askHandleNoU4Visual = function( entryId, aVisual )
	{
		if( this.isDestroyed() == true )
			return;

		this.page._delistVisualFinder( entryId );
	};


	RecommendationAreaControl.markAllAsRead = function()
	{
		if( featured == null || featured.length == 0 )
			return;
		
		// mark all the featured entries as read
		var ids = [];
		
		if( this.featured != null )
			for( var i = 0; i < this.featured.length; i++ )
				ids.push( this.featured[ i ].getId() );
			
		var that = this;
		
		this.reader.askMarkEntriesAsRead( 	ids, 
											function()
											{
											},
											function( errCode )
											{
												that.signs.setMessage( "Error:" + errCode );
											}
											);
	};

	RecommendationAreaControl.findNextEntyId = function( entryId, unreadOnly )
	{
		if( this.featured == null )
			return null;

		var found = false;
		if( entryId == null )
			found = true;

		for( var i = 0; i < this.featured.length; i++ )
		{
			var entry = this.featured[ i ];

			if( found == true )
			{
				if( ! unreadOnly || ( unreadOnly && entry.isRead() == false ) )
					return entry.getId();
			}
			else
			{
				if( entryId == entry.getId() )
					found = true;
			}
		}

		// no match
		return found === true ? true : null;
	};

	RecommendationAreaControl.findPreviousEntryId = function( entryId, unreadOnly )
	{
		if( this.featured == null )
			return null;

		var found = false;
		if( entryId == null )
			found = true;

		for( var i = this.featured.length - 1; i >= 0 ; i-- )
		{
			var entry = this.featured[ i ];

			if( found == true )
			{
				if( ! unreadOnly || ( unreadOnly && entry.isRead() == false ) )
					return entry.getId();
			}
			else
			{
				if( entryId == entry.getId() )
					found = true;
			}
		}

		// no match
		return found === true ? true : null;
	};
})();

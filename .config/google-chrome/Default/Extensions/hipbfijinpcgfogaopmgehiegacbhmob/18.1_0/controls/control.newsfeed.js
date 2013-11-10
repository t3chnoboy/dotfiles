"use strict";

(function () {
	var pkg = devhd.pkg( "control" );

	var BaseControl     = pkg.BaseControl.prototype;
	var NewsfeedControl = pkg.createClass ( "NewsfeedControl", pkg.BaseControl );

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	NewsfeedControl.setFacebook = function( value )
	{
		this.facebook = value;
	};

	NewsfeedControl.setSherlock = function( m )
	{
		this.sherlock = m;
	};

	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	
	// When a page or a card are destroyed, all the containing controls are destroyed as well
	// this is the opportunity for the control to stop listening to events, release references
	// to services which might have been injected into it and call the base destructor to 
	// release any potential DOM binding.
	NewsfeedControl.destroy = function ()
	{
		this.facebook.unregisterObserver( this );

		this.facebook  	 = null;

		BaseControl.destroy.call( this );
	};

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	NewsfeedControl.display = function ()
	{
		// Listen to event from the facebook service so that we can update the UI if the user
		// signs in or signs out. See: onFacebookIdentityChanged
		this.facebook.registerObserver( this );
		
		// Listen to event from the facebook service so that we can update the UI if the user
		// signs in or signs out. See: onFacebookIdentityChanged
		this.part.innerHTML = templates.modules.loadingNewsfeed( this.home );

		var that = this;
		
		// Ask the facebook service for a JSON stream representing the newsfeed of the user
		this.facebook.askResource(	"me/home",
									{ n: 5 },
									{ "link": true, "photo" : true },
									// LOGGED IN
									function( feed )
									{
										try
										{
											// This control my have been destroyed before the facebook service has had the time to perform
											// the network IO and return the requested return. In which case, we can just stop.
											if( that.part == null )
												return;
											
											// The user 
											if( feed == null )
											{
												that.part.innerHTML = templates.modules.layoutNewsfeedLogin( that.home );
												return;
											}
													
											// Use a template to convert the JSON stream into HTML+CSS.
											that.part.innerHTML = templates.modules.layoutNewsfeed( feed, that.home );
											
											for( var i = 0; i < feed.length; i++ )
											{
												var aPost = feed[ i ];
												
												if( aPost.type == "link" )
													that.askShowLinkObject( aPost );
											}
											
											var elems = that.part.getElementsByClassName( "likeButton" );
											for( var i = 0; i < elems.length; i++ )
											{
												that.bind( 	elems[ i ],
															"click",
															function( event )
															{
																try
																{
																	devhd.events.cancelEvent( event );
																	event.target.style.display = "none";

																	var fbId = event.target.getAttribute( "data-fbId" ); 
																	if( fbId == null )
																		return false;
																		
																	that.like( fbId );
																																		
																	var myLikeElem = that.element( fbId + "_myLike" );
																	if( myLikeElem != null )
																		that.element( fbId + "_myLike" ).style.display = "inline";
																}
																catch( e )
																{
																	$feedly( "[newsfeed] failed to like because " + e.name + " -- " + e.message );
																}
																
																return false;
															}
															);
											}												
										}
										catch( e )
										{
											that.part.display = "none";
										}
									},
									// NOT LOGGED IN
									function(  )
									{
										// cancelled in flight.
										if( that.part == null )
											return;
	
										that.part.display = "none";
									}
									);
	};
	
	NewsfeedControl.askShowLinkObject = function( aPost )
	{
		if( aPost.link == null )
		{
			var linkObjectElem = that.element( aPost.id + "_object" );
			if( linkObjectElem != null )
				linkObjectElem.style.display = "none";
			
			return;
		}

		///D $feedly( "FB POST:" + devhd.utils.JSONUtils.encode( aPost ) );

		var that = this;
		this.sherlock.askEnrichLink( 	aPost.link,
										function( map )
										{
											var linkObjectElem = that.element( aPost.id + "_object" );
											if( linkObjectElem == null )
												return;
											
											/// $feedly( "MAP:" + devhd.utils.JSONUtils.encode( map ) );

											if( map == null )
												map = {};
											
											if( map.og == null )
												map.og = {};
											
											if( map.image == null )
												map.image = {};
											
											
											var model = {};
											
											if( aPost.link.indexOf( "instagr.am") == -1 && aPost.link.indexOf( "yfrog.com") == -1 )
											{
												model.title = map.title || aPost.name;
												model.summary = map.og.description || aPost.description;
												model.source = map.og.site_name || aPost.caption;
											}
											
											if( map.image != null && map.image.url != null && map.image.width > 180 )
											{
												model.picture = map.image.url;
												model.width = map.image.width;
												model.height = map.image.height;
											}

											/// $feedly( "LINK MODEL:" + devhd.utils.JSONUtils.encode( model ) );
											
											linkObjectElem.innerHTML = templates.modules.layoutLinkObject( model, aPost );

											if( model.title == null && model.picture == null )
												linkObjectElem.style.display = "none";
											else
												linkObjectElem.innerHTML = templates.modules.layoutLinkObject( model, aPost );
										}
										);
	};
	
	
	/////////////////////////////////////////////////////////////////////////////////////
	// Event handlers                                                                  //
	/////////////////////////////////////////////////////////////////////////////////////
	
	// Event from the facebook service notifying us that the session has changed.
	// Happens when the user logs in or out of facebook. Refreshing the user interface
	// to reflect the session state.
	NewsfeedControl.onFacebookIdentityChanged = function()
	{
		try
		{
			this.display();
		}
		catch( e )
		{
			this.part.style.display = "none";
		}
	};
	
	/////////////////////////////////////////////////////////////////////////////////////
	// Action Handlers                                                                 //
	/////////////////////////////////////////////////////////////////////////////////////
	NewsfeedControl.like = function( fbId )
	{
		try
		{
			this.facebook.askLike( fbId );
		}
		catch( e )
		{
			$feedly( "[newsfeed][share] failed because:" + e.name + " -- " + e.message + " -- " + e.fileName + " -- " + e.lineNumber );
		}
	};
})();

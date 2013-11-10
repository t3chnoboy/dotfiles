"use strict";

(function () {
	var pkg = devhd.pkg("control");

	var BaseControl     = pkg.BaseControl.prototype;
	var TimelineControl = pkg.createClass ( "TimelineControl", pkg.BaseControl );

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	TimelineControl.setTwitter = function( value )
	{
		this.twitter = value;
	};

	TimelineControl.setDialog = function( d )
	{
		this.dialog = d;
	};

	TimelineControl.setTinyURL = function( d )
	{
		this.tinyURL = d;
	};

	TimelineControl.setSigns = function( d )
	{
		this.signs = d;
	};

	TimelineControl.setSherlock = function( d )
	{
		this.sherlock = d;
	};
	
	TimelineControl.setMax = function( m )
	{
		this.max = m;
	};


	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	TimelineControl.destroy = function ()
	{
		this.twitter.unregisterObserver( this );

		destroyShareControl.call( this );

		this.twitter  	 = null;
		this.dialog 	 = null;
		this.tinyURL 	 = null;
		this.signs 		 = null;
		this.sherlock	 = null;

		BaseControl.destroy.call( this );
	};

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	
	/*
	{
		from: {
		}
		
		message: "",
		
		type: "photo|link",
		
		link: "",
		picture: "",
		
		metadata: "retweeted by X | x retweets"
	}
	*/
	function buildPost( aTweet )
	{
		var context = aTweet;
		if( aTweet.retweeted_status != null )
		{
			// this is a retweet. Let's see if the original tweet has a link!
			context = aTweet.retweeted_status;
		}
		
		if( context.entities == null )
			return null;
		
		if( context.entities.urls != null && context.entities.urls.length > 0 )
		{
			return {
				id			: context.id_str,
				created		: new Date( context.created_at ),
				type		: "link",
				link		: context.entities.urls[ 0 ].expanded_url || context.entities.urls[ 0 ].url,
				message		: cleanMessage( context.text ),
				from		: context.user,
				metadata	: aTweet.retweeted_status != null 
								? "/via " + aTweet.user.screen_name
								: "", //( context.retweet_count != null && context.retweet_count > 0 ? context.retweet_count + " retweets" : "" ),
				tweet		: aTweet
			};
		}
		else if( context.entities.media != null && context.entities.media.length > 0 )
		{
			for( var i = 0; i < context.entities.media.length; i++ )
			{
				var aMedia = context.entities.media[ i ];
				if( aMedia.type == "photo" )
				{
					return {
						id			: context.id_str,
						created		: new Date( context.created_at ),
						type 		: "photo",
						link		: aMedia.url,
						picture		: aMedia.media_url,
						message		: cleanMessage( context.text ),
						from		: context.user,
						metadata	: aTweet.retweeted_status != null 
										? "/via " + aTweet.user.screen_name
										: "", //( context.retweet_count != null && context.retweet_count > 0 ? context.retweet_count + " retweets" : "" ),
						tweet		: aTweet
					};
				}
			}
		}
		
		return null;
	}
	
	function cleanMessage( message )
	{	 
		if( message == null )
			return null;
		
		var exp1 = /(\b( - https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
		var exp2 = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
		return message.replace( exp1, " " ).replace( exp2, " " );
	}
	
	
	TimelineControl.display = function ()
	{
		this.twitter.registerObserver( this );
		
		this.part.innerHTML = templates.modules.loadingTimeline( this.home );

		var that = this;
				
		this.twitter.askHomeTimeline(	40,
										function( me, tweets )
										{
											// cancelled in flight.
											if( that.part == null )
												return;

											// user not logged in
											if( tweets == null )
											{
												that.part.innerHTML = templates.modules.layoutTimelineLogin( tweets, that.home );
											}
											else
											{
												// filter through these 100 tweets and try to keep the ones which have a link.
												var posts = [];
												
												for( var i = 0; i < tweets.length && posts.length < 5; i++ )
												{
													var post = buildPost( tweets[ i ] );
													
													if( post == null )
														continue;
																										
													posts.push( post );
												}
												
												if( posts.length == 0 )
													return; // no interesting tweets
												
												that.part.innerHTML = templates.modules.layoutTimeline( posts );
												
												for( var i = 0; i < posts.length; i++ )
												{
													var aPost = posts[ i ];
													
													if( aPost.type == "link" )
														that.askShowLinkObject( aPost );
												}

												that.bind( that.element( "tw_tweet" ), "click", TimelineControl.tweet );
		
												var elems = that.part.getElementsByClassName( "retweetButton" );
												for( var i = 0; i < elems.length; i++ )
												{
													that.bind( 	elems[ i ],
																"click",
																function( event )
																{
																	devhd.events.cancelEvent( event );

																	var screen_name  = event.target.getAttribute( "data-screen_name" );
																	var text = event.target.getAttribute( "data-text" ); 
																	that.retweet( screen_name, text );
																}
																);
												}
											}
											
											that.twitter.askDecorate();	
										});
	}

	TimelineControl.askShowLinkObject = function( aPost )
	{
		var that = this;
		this.sherlock.askEnrichLink( 	aPost.link,
										function( map )
										{
											var linkObjectElem = that.element( aPost.id + "_object" );
											if( linkObjectElem == null )
												return;
											
											///D $feedly( "MAP:" + devhd.utils.JSONUtils.encode( map ) );

											if( map == null )
												map = {};
											
											if( map.og == null )
												map.og = {};
											
											if( map.image == null )
												map.image = {};
											
											
											var model = {};
											
											if( aPost.link.indexOf( "instagr.am") == -1 && aPost.link.indexOf( "yfrog.com") == -1 )
											{
												model.title = map.title;
												model.summary = map.og.description;
												model.source = map.og.site_name;
											}

											if( map.image != null && map.image.url != null && map.image.width > 180 )
											{
												model.picture = map.image.url;
												model.width = map.image.width;
												model.height = map.image.height;
											}

											/// $feedly( "LINK MODEL:" + devhd.utils.JSONUtils.encode( model ) );
											
											if( model.title == null && model.picture == null )
												linkObjectElem.style.display = "none";
											else
												linkObjectElem.innerHTML = templates.modules.layoutLinkObject( model, aPost );
										}
										);
	};
	
	
	function onSectionSelectorClicked( event )
	{
		var t = event.target;
		var section = t.getAttribute( "data-section" );

		if( section == null )
			return;

		showSection.call( this, section );
	}

	function showSection( section )
	{
		if( selectedSection != null )
		{
			this.element( "timeline_" + selectedSection ).style.display = "none";
			this.element( "timeline_" + selectedSection + "_selector").className = "";
			selectedSection = null;
		}

		this.element( "timeline_" + section ).style.display = "block";
		this.element( "timeline_" + section + "_selector").className = "selected";
		selectedSection = section;
	}

	var MWIDTH 	= 600;
	var HPROP 	= 0.5;
	var BOPAC	= 0.5;

	function prepareDialog()
	{
		this.dialog.show( "<div id='f'></div>", MWIDTH, HPROP, BOPAC );
		return this.part.ownerDocument.getElementById( "f" );
	}

	function destroyShareControl()
	{
		if( this.shareControl == null )
			return;

		this.dialog.hide();

		this.shareControl.unregisterObserver( this );
		this.shareControl.destroy();
		this.shareControl = null;
	}

	TimelineControl.onTwitterIdentityChanged = function()
	{
		this.refresh();
	}
	
	TimelineControl.refresh = function()
	{
		try
		{
			this.display();
		}
		catch( e )
		{
			that.part.style.display = "none"
		}
	}

	TimelineControl.tweet = function()
	{
		try
		{
			var that = this;
			that.shareControl = new devhd.control.TwitterControl()
			that.shareControl.setHome( that.home );
			that.shareControl.setSigns( that.signs );
			that.shareControl.setTwitter ( that.twitter )
			that.shareControl.setTinyURL ( that.tinyURL );
			that.shareControl.setPart ( prepareDialog.call( that ) );
			that.shareControl.setModel( "message", "" );

			that.shareControl.registerObserver( that );

			that.shareControl.display();
		}
		catch( e )
		{
			$feedly( "[timeline][tweet] failed because:" + e.name + " -- " + e.message + " -- " + e.fileName + " -- " + e.lineNumber );
		}
	}

	TimelineControl.retweet = function( screen_name, text )
	{
		try
		{
			var that = this;
			that.shareControl = new devhd.control.TwitterControl()
			that.shareControl.setHome( that.home );
			that.shareControl.setSigns( that.signs )
			that.shareControl.setTwitter ( that.twitter )
			that.shareControl.setTinyURL ( that.tinyURL );
			that.shareControl.setPart ( prepareDialog.call( that ) );
			that.shareControl.setModel("message", "RT @" + screen_name + " " + text ); // non_i18n

			that.shareControl.registerObserver( that );

			that.shareControl.display();
		}
		catch( e )
		{
			$feedly( "[timeline][retweet] failed because:" + e.name + " -- " + e.message + " -- " + e.fileName + " -- " + e.lineNumber );
		}
	}

	// this.shareControl is done. clean-up time.
	TimelineControl.onControlDoneSending = function( status )
	{
		destroyShareControl.call( this );

		if( status != null && this.signs != null )
			this.signs.setMessage( status );
	}


}) ()

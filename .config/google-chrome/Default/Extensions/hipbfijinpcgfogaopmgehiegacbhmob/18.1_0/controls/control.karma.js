"use strict";

(function () {
	var pkg = devhd.pkg("control");
	
	
	var BaseControl  = pkg.BaseControl.prototype
	var KarmaControl = pkg.createClass ( "KarmaControl", pkg.BaseControl ) 
	
	
	KarmaControl.setTwitter = function( value )
	{
		this.twitter = value;
	}

	KarmaControl.setTinyURL = function( value )
	{
		this.tinyURL = value;
	}

	KarmaControl.setMax = function( value )
	{
		this.max = value;
	}
	
	//////////////////////////////////////////////////
	//   Page Behavior                              //
	//////////////////////////////////////////////////
		
	/***
	 * Clean up time. Release all resources.
	 */
	KarmaControl.destroy = function()
	{
		this.twitter = null;
		this.tinyURL   = null;
		
		BaseControl.destroy.call( this )
	}
	
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	// Private Implementation                       //
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
		
	KarmaControl.display = function( )
	{
		var that = this;
		this.twitter.askCurrentUserInfo( function( p ){
			that.doDisplay( p!= null ? p.screen_name : null );
		});
	}
	
	KarmaControl.doDisplay = function( screen_name )
	{
		if( this.isDestroyed() == true )
			return;
		
		this.twitterId = screen_name;
		
		if( this.twitterId == null )
		{
			this.part.style.display = "none";
			return
		}
		
		var that = this;
		var filter = { q: "feedly.com/k", from: this.twitterId, rpp:this.max * 2 };
		this.twitter.askSearch( filter, 
								function( tweets )
								{
									if( that.isDestroyed() || tweets == null )
										return;
									
									if( tweets.length == 0 )
									{
										that.part.style.display = "none";
										return;
									}

									var uindex = {};
									var filtered = [];
									for( var i = 0; i < tweets.length && filtered.length < that.max; i++ )
									{
										// avoid that 2 tweets point to the same url
										if( tweets[ i ].bitly == null || uindex[ tweets[ i ].bitly ] != null )
											continue; 
											
										uindex[ tweets[ i ].bitly ] = true;
										
										filtered.push( tweets[ i ] );
									}
									that.part.innerHTML = templates.control.karma.tweets( filtered );

									enrichTweets.call( that, filtered );
								}
								);
	}
	
	function enrichTweets( tweets )
	{
		var buckets = [ [], [], [], [] ]
		for( var i = 0; i < tweets.length; i++ )
			buckets[ i % 4 ].push( tweets[ i ] );
			
		for( var j = 0; j < buckets.length; j++ )
			processBucket.call( this, buckets[ j ], j );
	}
	
	function processBucket( bucket, bNumber )
	{
		var that = this;
		
		devhd.utils.FlowUtils.forEach(	{},
							bucket,
							function( aTweet, i, onSuccess, onError, onProgress )
							{
								if( that.isDestroyed() )
									return;

								if( aTweet.bitly == null )
									devhd.fn.callback( onSuccess );
								

								enrichTweet.call( that, aTweet, onSuccess, onError, bNumber, i );
							}
							);
	}
	
	function enrichTweet( aTweet, onSuccess, onError, bNumber, i )
	{
		var that = this;
		this.tinyURL.askStats( 	aTweet.bitly, 
								function( stats )
								{
									try
									{
										if( that.isDestroyed() )
											return;
		
										if( stats.user_clicks == null )
										{
											that.element( aTweet.bitly ).style.display = "none";
										}
										else
										{
											that.element( aTweet.bitly + "_clicks" ).innerHTML = stats.user_clicks + " clicks";											
										}
									}
									catch( ignore )
									{
										
									}
	
									devhd.fn.callback( onSuccess );
								},
								function( error )
								{
									try
									{
										if( that.isDestroyed() )
											return;
										that.element( aTweet.bitly + "_clicks" ).innerHTML = "?";
									}
									catch( ignore )
									{
										
									}
	
									devhd.fn.callback( onSuccess );
								}
								);

		this.twitter.askSearch( { q: "http://bit.ly/" + aTweet.bitly, rpp:50 }, 
								function( related )
								{
									try
									{
										if( that.isDestroyed() )
											return;
									
										var filtered = [];
										for( var i = related.length - 1; i >= 0 ; i-- )
										{
											if( related[ i ].text.indexOf( "http://bit.ly/" + aTweet.bitly ) > -1 )
												filtered.push( related[ i ] );

											if( related[ i ].text.indexOf( "http://feedly.com/k/" + aTweet.bitly ) > -1 )
												filtered.push( related[ i ] );
										}
										
										if( filtered.length > 1 )
											that.element( aTweet.bitly + "_rt" ).innerHTML = filtered.length + " RT";
									}
									catch( ignore )
									{
										
									}
								}
								);
	}	
} ) ();




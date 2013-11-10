"use strict";

(function () {
	var pkg = devhd.pkg("control");


	var BaseControl    = pkg.BaseControl.prototype
	var LiveControl  = pkg.createClass ( "LiveControl", pkg.BaseControl )

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	LiveControl.setTwitter = function( value )
	{
		this.twitter = value;
	}

	LiveControl.setPrefix = function( p )
	{
		this.prefix = p;
	}

	LiveControl.setDialog = function( d )
	{
		this.dialog = d;
	}

	LiveControl.setTinyURL = function( d )
	{
		this.tinyURL = d;
	}

	LiveControl.setSigns = function( d )
	{
		this.signs = d;
	}

	LiveControl.setMax = function( m )
	{
		this.max = m;
	}

	LiveControl.setQuery = function ( value )
	{
		this.query = value;
	}

	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	LiveControl.destroy = function ()
	{
		destroyShareControl.call( this );

		this.twitter = null;
		this.prefix  = null;
		this.dialog  = null;
		this.tinyURL = null;
		this.signs 	 = null;
		this.query	 = null;

		BaseControl.destroy.call(this)
	}


	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	LiveControl.display = function ()
	{
		this.part.innerHTML = templates.twitter.searching( this.query );

		var lang = devhd.utils.BrowserUtils.getLanguage();

		var that = this;
		this.twitter.askSearch(	{ q: this.query, lang : "en" ? null : lang },
								function( tweets )
								{
									// page destroyed
									if( that.part == null )
										return;

									// cancelled in flight.
									if( tweets == null || tweets.length == 0 )
									{
										that.part.style.display = "none";
										return;
									}

									that.part.innerHTML = templates.page.base.quotes( tweets, that.max || 6, that.home );


								});
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

	LiveControl.retweet = function( elementId )
	{
		try
		{
			var tweetElem = this.element( elementId );
			if( tweetElem == null )
				return;

			var screen_name = tweetElem.getElementsByClassName( "screen-name" )[ 0 ].innerHTML;
			var content = devhd.str.stripTags( tweetElem.getElementsByClassName( "entry-content" )[ 0 ].innerHTML );

			var that = this;
			that.shareControl = new devhd.control.TwitterControl()
			that.shareControl.setHome( that.home );
			that.shareControl.setSigns( that.signs )
			that.shareControl.setTwitter ( that.twitter )
			that.shareControl.setTinyURL ( that.tinyURL );
			that.shareControl.setPart ( prepareDialog.call( that ) );
			that.shareControl.setModel("message", "RT @" + screen_name + " " + content ); // non-l10n

			that.shareControl.registerObserver( that );

			that.shareControl.display();
		}
		catch( e )
		{
			$feedly( "[timeline][retweet] failed because:" + e.name + " -- " + e.message + " -- " + e.fileName + " -- " + e.lineNumber );
		}
	}

	// this.shareControl is done. clean-up time.
	LiveControl.onControlDoneSending = function( status )
	{
		destroyShareControl.call( this );

		if( status != null && this.signs != null )
			this.signs.setMessage( status );
	}

}) ()

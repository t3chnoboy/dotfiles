"use strict";

(function () {
	var pkg = devhd.pkg("control");

	var BaseControl = pkg.BaseControl.prototype
	var WallControl = pkg.createClass ( "WallControl", pkg.BaseControl )

	var LOG = devhd.log.get("control.wall");

	// Localization.
	var _L = devhd.i18n.L;

	WallControl.initialize = function ()
	{
		BaseControl.initialize.call( this );
		this.completionModel = {};
		this.charsize = 132;
	};

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////

	WallControl.setPreferences = function ( value )
	{
		this.preferences = value;
	};

	WallControl.setReader = function ( value )
	{
		this.reader = value;
		this.reader.registerObserver( this );
	};

	WallControl.setTinyURL = function ( value )
	{
		this.tinyURL = value;
	};

	WallControl.setTwitter = function ( value )
	{
		this.twitter = value;
	};

	WallControl.setFacebook = function ( value )
	{
		this.facebook = value;
	};

	WallControl.setContext = function( value )
	{
		this.context = value;

		this.key = this.context.entryId || this.context.url;
		this.entry = this.context.entry;
	};

	WallControl.setReadOnly = function( value )
	{
		this.readOnly = value == true;
	};

	WallControl.destroy = function ()
	{
		if( this.reader != null )
			this.reader.unregisterObserver( this );

		if( this.context != null )
			delete this.context.entry;

		this.context 		= null;
		this.reader 		= null;
		this.preferences	= null;
		this.twitter		= null;
		this.tinyURL		= null;
		this.facebook		= null;

		BaseControl.destroy.call( this );
	};

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////

	WallControl.display = function ()
	{
		try
		{
			this.part.innerHTML = templates.control.wall.layoutWallControl( this.key, this.home );

			var that = this;
			
			askOverlayBio.call( this );
						
			// askOverlayFacebookComments.call( this );
		}
		catch( e )
		{
			LOG.error(100," failed to display ", e );
		}
	};

	function askOverlayBio()
	{
		var that = this;
		this.twitter.askBio( 	this.entry.getAlternateLink(),
								function( bio )
								{
									if( that.isDestroyed() == true )
										return;
	
									if( bio == null || bio.screen_name == null )
										return;
									
									that.element( that.entry.getId() + "_bioHolder" ).innerHTML = templates.control.wall.bio( bio );
								}
								);
	};
	
	function askOverlayFacebookComments()
	{
		var that = this;
		this.preferences.askPreference( "facebookComments", function( facebookComments ){
			if( facebookComments != "yes" )
				return;	
			
			that.element( that.entry.getId() + "_fbHolder" ).innerHTML = templates.control.wall.facebook( that.entry );
		});	
	}

}) ();

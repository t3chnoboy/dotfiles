"use strict";

(function () {
	var pkg = devhd.pkg("control");
	
	var BaseControl    = pkg.BaseControl.prototype
	var YoutubeControl  = pkg.createClass ( "YoutubeControl", pkg.BaseControl ) 
	
	/////////////////////////////////////////////////
	// Dependency injection  
	/////////////////////////////////////////////////
	YoutubeControl.setSherlock = function( value ) 
	{
		this.sherlock = value;	
	}

	YoutubeControl.setMax = function( m )
	{
		this.max = m;
	}

	YoutubeControl.setQuery = function ( value ) 
	{
		this.query = value;
	}

	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	YoutubeControl.destroy = function () 
	{
		this.sherlock  	 = null;
		this.query		 = null;

		BaseControl.destroy.call(this)
	}		
	
		
	/////////////////////////////////////////////////
	// Control contract 
	/////////////////////////////////////////////////
	YoutubeControl.display = function () 
	{		
		var that = this;
		this.sherlock.askSearchYoutube( this.query, 
										function( videoItems )
										{	
											// Page destroyed before callback
											if( that.isDestroyed() == null )
												return;
																														
											that.part.innerHTML = 
												templates.modules.layoutYoutubeVideos( videoItems.slice( 0, that.max || 4 ), that.home );
										}
										);
	}
	
}) ()

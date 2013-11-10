"use strict";

(function () {
	var pkg = devhd.pkg("control");
	
	var BaseControl    = pkg.BaseControl.prototype
	var FlickrControl  = pkg.createClass ( "FlickrControl", pkg.BaseControl ) 
	
	/////////////////////////////////////////////////
	// Dependency injection  
	/////////////////////////////////////////////////
	FlickrControl.setSherlock = function( value ) 
	{
		this.sherlock = value;	
	};

	FlickrControl.setMax = function( m )
	{
		this.max = m;
	};

	FlickrControl.setQuery = function ( value ) 
	{
		this.query = value;
	};

	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	FlickrControl.destroy = function () 
	{
		this.sherlock  	 = null;
		this.query		 = null;

		BaseControl.destroy.call( this );
	};		
	
		
	/////////////////////////////////////////////////
	// Control contract 
	/////////////////////////////////////////////////
	FlickrControl.display = function () 
	{		
		var that = this;
		this.sherlock.askSearchFlickr( 	this.query, 
										function( imageItems )
										{	
											// Page destroyed before callback
											if( that.isDestroyed() == null )
												return;
																														
											that.part.innerHTML = 
												templates.modules.layoutFlickrImages( imageItems.slice( 0, that.max || 4 ), 60, that.home )
										}
										);
	};
	
})();

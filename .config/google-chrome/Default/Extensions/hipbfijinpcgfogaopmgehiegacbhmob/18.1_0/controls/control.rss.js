"use strict";

(function () {
	var pkg = devhd.pkg("control");
	
	
	var BaseControl    = pkg.BaseControl.prototype
	var RSSControl  = pkg.createClass ( "RSSControl", pkg.BaseControl ) 
	
	/////////////////////////////////////////////////
	// Dependency injection  
	/////////////////////////////////////////////////
	RSSControl.setReader = function( value ) 
	{
		this.reader = value;	
	}

	RSSControl.setFeedId = function ( feedId ) 
	{
		this.feedId = feedId;
	}

	RSSControl.setMax = function ( value ) 
	{
		this.max = value;
	}

	RSSControl.setWidth = function ( value ) 
	{
		this.width = value;
	}


	RSSControl.setPage = function ( value ) 
	{
		this.page = value;
	}


	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	RSSControl.destroy = function () 
	{
		this.reader  = null;
		this.feedId = null;
		this.page = null;

		BaseControl.destroy.call(this)
	}		
		
	/////////////////////////////////////////////////
	// Control contract 
	/////////////////////////////////////////////////
	RSSControl.display = function () 
	{
		var that = this;
		this.reader.askEntries( this.feedId,
								{},
								this.max + 5,
								function( entries )
								{
									if( that.isDestroyed() == true )
										return;

									var parts = [];
									for( var j = 0; j < entries.length && parts.length < that.max; j++ )
									{	
										var anEntry = entries[ j ];
										parts.push( { entry: anEntry, type: 15 } );
									}
									
									parts = parts.sort( function( iA, iB){ return iB.entry.lastModifiedTime - iA.entry.lastModifiedTime })
						
									that.part.innerHTML = 
										templates.page.base.layoutEntries(  parts,
																			that.width, 
																			{
																				includeSourceTitle : true, 
																				includeCategoryLabel: false, 
																				includeNoThanks: false
																			}, 
																			that.home 
																			);

									for( var j = 0; j < parts.length; j++ )
										that.page.askFindVisual( parts[ j ].entry, "U15" );
								},
								function( code, message )
								{
									if( that.isDestroyed() == true )
										return;

									that.part.innerHTML = "error:" + code + " -- " + message;
								} 
								);
	}
	
}) ()

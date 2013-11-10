"use strict";

(function () {
	var pkg = devhd.pkg("control");


	var BaseControl    = pkg.BaseControl.prototype;
	var AdzControl  = pkg.createClass ( "AdzControl", pkg.BaseControl );

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	AdzControl.setAdz = function( value )
	{
		this.adz = value;
	};

	AdzControl.setTags = function ( tags )
	{
		this.tags = tags;
	};

	AdzControl.setMax = function ( value )
	{
		this.max = value;
	};

	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	AdzControl.destroy = function ()
	{
		this.adz  	= null;
		this.tags	  	= null;

		BaseControl.destroy.call( this );
	};

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	AdzControl.display = function ()
	{
		var that = this;
		this.adz.askRecommendProducts(	this.tags,
											function( products )
											{
		 										if( that.isDestroyed() )
													return;

												// destroyed before async call had the time to return
											 	if( that.part == null )
													return;

												if( products == null || products.length == 0 )
												{
													that.part.style.display = "none";
													return;
												}

											 	that.part.innerHTML =
														templates.control.adz.layoutProducts( 	products.slice( 0, that.max ),
																									that.max,
																									that.themes,
																									that.tags,
																									that.home
																									);
											}
											);
	}

}) ();


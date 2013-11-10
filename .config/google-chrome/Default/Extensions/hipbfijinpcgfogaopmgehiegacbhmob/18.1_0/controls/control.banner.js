"use strict";

( function () 
{	
	var pkg = devhd.pkg( "control" );
	
	var BaseControl	 = pkg.BaseControl.prototype;
	var BannerControl = pkg.createClass ( "BannerControl", pkg.BaseControl ); 
		
	BannerControl.setPreferences = function( p )  
	{
		this.preferences = p;			
	};

	BannerControl.setFeedly = function( f )  
	{
		this.feedly = f;			
	};

	BannerControl.setBannerType = function( t )  
	{
		this.bannerType = t;			
	};

	BannerControl.destroy = function()  
	{
		BaseControl.destroy.call( this );			

		this.preferences = null;
		this.feedly = null;
	};

	//////// CONTROL CONTRACT /////////////////////////////////////////////////
	BannerControl.display = function()
	{
		this.part.innerHTML = templates[ "proBanner" +  this.bannerType ]();
	};

	BannerControl.onClose = function()
	{
		window.localStorage.setItem( "pro.banner.closed", new Date().getTime() );
		this.feedly.showProBar();
	};	


})();


"use strict";

(function () {
	var pkg = devhd.pkg("control");

	var BaseControl     = pkg.BaseControl.prototype;
	var TumblrDashboardControl = pkg.createClass ( "TumblrDashboardControl", pkg.BaseControl );

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	TumblrDashboardControl.setTumblr = function( value )
	{
		this.tumblr = value;
	};

	TumblrDashboardControl.setDialog = function( d )
	{
		this.dialog = d;
	};

	TumblrDashboardControl.setSigns = function( d )
	{
		this.signs = d;
	};

	TumblrDashboardControl.setMax = function( m )
	{
		this.max = m;
	};


	/////////////////////////////////////////////////
	// Life Cycle
	/////////////////////////////////////////////////
 	TumblrDashboardControl.destroy = function ()
	{
		this.tumblr.unregisterObserver( this );

		destroyShareControl.call( this );

		this.tumblr  	 = null;
		this.dialog 	 = null;
		this.tinyURL 	 = null;
		this.signs 		 = null;

		BaseControl.destroy.call( this )
	}

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	TumblrDashboardControl.display = function ()
	{
		this.tumblr.registerObserver( this );
		
		this.part.innerHTML = templates.modules.loadingTumblrDashboard( this.home );

		var that = this;
				
		this.tumblr.askDashboard(	20,
									function( me, posts )
									{
										// cancelled in flight.
										if( that.part == null )
											return;

										// user not logged in
										if( posts == null )
										{
											that.part.innerHTML = templates.modules.layoutTumblrDashboardLogin( posts, that.home );
										}
										else
										{
											that.part.innerHTML = templates.modules.layoutTumblrDashboard( me, posts, that.max || 5, that.home );
											
											that.bind( that.element( "tu_post" ), "click", TumblrDashboardControl.post );
	
											// selection section 0
											that.bind( that.element( "tumblrDashboard_selector" ), "click", onSectionSelectorClicked );
	
											selectedSection = null;
	
											showSection.call( that, 0 );
										}
										
										that.tumblr.askDecorate();	
									});
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
			this.element( "tumblrDashboard_" + selectedSection ).style.display = "none";
			this.element( "tumblrDashboard_" + selectedSection + "_selector").className = "";
			selectedSection = null;
		}

		this.element( "tumblrDashboard_" + section ).style.display = "block";
		this.element( "tumblrDashboard_" + section + "_selector").className = "selected";
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

	TumblrDashboardControl.onTumblrIdentityChanged = function()
	{
		this.refresh();
	}
	
	TumblrDashboardControl.refresh = function()
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

	TumblrDashboardControl.post = function()
	{
		try
		{
		}
		catch( e )
		{
			$feedly( "[tumblrDashboard][post] failed because:" + e.name + " -- " + e.message + " -- " + e.fileName + " -- " + e.lineNumber );
		}
	}

	TumblrDashboardControl.reblog = function( screen_name, text )
	{
	}

}) ()

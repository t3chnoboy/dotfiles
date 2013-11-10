"use strict";

(function () {
	var pkg = devhd.pkg("control");

	var BaseControl    = pkg.BaseControl.prototype
	var TumblrLinkControl  = pkg.createClass ( "TumblrLinkControl", pkg.BaseControl )

    var _L = devhd.i18n.L;

	TumblrLinkControl.initialize = function()
	{
		BaseControl.initialize.call( this )
	}

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	TumblrLinkControl.setTumblr = function ( value )
	{
		this.tumblr = value
	}

	TumblrLinkControl.setTitle = function ( value )
	{
		this.title = value
	}

	TumblrLinkControl.setLink = function ( value )
	{
		this.link = value;
	}


	TumblrLinkControl.destroy = function ()
	{
		this.tumblr = null;

		BaseControl.destroy.call(this);
	}

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	TumblrLinkControl.display = function ()
	{
		this.part.innerHTML = templates.tumblr.linkForm( this.title, this.link, this.home );

		this.bind( "tumblrCancelAction", "click", TumblrLinkControl.cancelIt )
		this.bind( "tumblrCreateAction", "click", TumblrLinkControl.createLink )
	}

	TumblrLinkControl.createLink = function ()
	{
		var description = this.element( "tumblrDescription"  ).value;

		this.showSending()

		var that = this
		this.tumblr.askLink( 	this.title,
								this.link,
								description,
						        function ( obj )
								{
									if( that.isDestroyed() == true )
										return;

									// so now the control has to be "hidden"
									that.fire("onControlDoneSending", _L(18) );
								},
								function (code,msg)
								{
									if( that.isDestroyed() == true )
										return;

									that.showPanel()
									that.setMessage(_L(_L(17), "Tumblr post", code,msg)) // no-i18n
								})
	}

	TumblrLinkControl.cancelIt = function ()
	{
		this.fire("onControlDoneSending")
	}

	TumblrLinkControl.reset = function ()
	{
	}

	TumblrLinkControl.showPanel = function ()
	{
		this.element( "panelSending" ).style.display 	= "none";
		this.element( "panelTumblr" ).style.display 	= "block";
	}

	TumblrLinkControl.showSending = function ()
	{
		this.element( "panelSending" ).style.display 	= "block";
		this.element( "panelTumblr" ).style.display 	= "none";
	}
}) ()

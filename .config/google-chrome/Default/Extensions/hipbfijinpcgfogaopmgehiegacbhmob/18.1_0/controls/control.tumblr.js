"use strict";

(function () {
	var pkg = devhd.pkg("control");

	var BaseControl    = pkg.BaseControl.prototype
	var TumblrControl  = pkg.createClass ( "TumblrControl", pkg.BaseControl )

	var _L = devhd.i18n.L;

	TumblrControl.initialize = function()
	{
		BaseControl.initialize.call( this )
	}

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	TumblrControl.setTumblr = function ( value )
	{
		this.tumblr = value
	}

	TumblrControl.setTitle = function ( value )
	{
		this.title = value
	}

	TumblrControl.setBody = function ( value )
	{
		this.body = value;

		if( this.body == null )
			this.body = "";
	}


	TumblrControl.destroy = function ()
	{
		this.tumblr = null;

		BaseControl.destroy.call(this);
	}

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	TumblrControl.display = function ()
	{
		this.part.innerHTML = templates.tumblr.postForm( this.title, this.body, this.home );

		this.bind( "tumblrCancelAction", "click", TumblrControl.cancelIt )
		this.bind( "tumblrCreateAction", "click", TumblrControl.createPost )
	}

	TumblrControl.createPost = function ()
	{
		var title = this.element( "tumblrTitle" ).value;
		var tags =  this.element( "tumblrTags"  ).value;

		this.showSending()

		var that = this
		this.tumblr.askPost( 	title,
								this.body,
								tags,
						        function ( obj )
								{
									if( that.isDestroyed() == true )
										return;

									// so now the control has to be "hidden"
									that.fire("onControlDoneSending",  _L(18));
								},
								function (code,msg)
								{
									if( that.isDestroyed() == true )
										return;

									that.showPanel()
									that.setMessage_L(_L(17), "Share Article", code, msg ); // non-l10n
								})
	}

	TumblrControl.cancelIt = function ()
	{
		this.fire("onControlDoneSending")
	}

	TumblrControl.reset = function ()
	{
	}

	TumblrControl.showPanel = function ()
	{
		this.element( "panelSending" ).style.display 	= "none";
		this.element( "panelTumblr" ).style.display 	= "block";
	}

	TumblrControl.showSending = function ()
	{
		this.element( "panelSending" ).style.display 	= "block";
		this.element( "panelTumblr" ).style.display 	= "none";
	}

})();



"use strict";

(function () {
	var pkg = devhd.pkg("control");


	var BaseControl    	  = pkg.BaseControl.prototype
	var OpenSocialControl = pkg.createClass ( "OpenSocialControl", pkg.BaseControl )
	var _L = devhd.i18n.L

	OpenSocialControl.initialize = function () {
		BaseControl.initialize.call(this)
		this.charsize = 140
	}

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	OpenSocialControl.setTinyURL = function (t) {
		this.tinyURL = t
	}

	OpenSocialControl.setEntry = function ( entry )
	{
		this.entry = entry;
	}

	OpenSocialControl.destroy = function ()
	{
		this.openSocialNoteElem  = null;
		this.msgSizeElem      = null;
		this.panelOpenSocialElem = null;
		this.panelSendingElem = null;

		this.tinyURL 		  = null;
		this.entry			  = null;

		BaseControl.destroy.call(this)
	}


	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	OpenSocialControl.display = function ()
	{
		// make sure that the user is logged in to an open social environment
		if( this.home.isGadget() == false || typeof opensocial == "undefined" )
		{
			this.fire( "onControlDoneSending" );

			this.signs.setMessage( _L(11) );
			return;
		}

		var that = this;

		var req = opensocial.newDataRequest();
  		req.add( req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "req");
  		req.send( function( data ){
  			var userName = data.get("req").getData().getDisplayName();
			var photoURL = data.get("req").getData().getField( opensocial.Person.Field.THUMBNAIL_URL );

			if( userName == "You" || photoURL == null )
			{
				that.fire( "onControlDoneSending" );

				that.signs.setMessage( _L(12) );

				return;
			}

			that.prepare( userName, photoURL )
		});
	}

	OpenSocialControl.prepare = function( userName, photoURL )
	{
		// FIRST CHOICE
		var message = this.getModel("message");

		// SECOND CHOICE
		var url   	= this.getModel("url");
		var title 	= this.getModel("title");

		// THIRD CHOICE
		// If an entry has been attached to this control, then use the
		// if formation associated with the entry for default values.
		if( title == null && this.entry != null )
			title = this.entry.getCleanTitle();

		if( url == null && this.entry != null )
			url = this.entry.getAlternateLink();

		if( message != null ) // existing preformatted message
		{
			this.doDisplay( message, userName, photoURL )
		}
		else if (url == null )
		{
			this.doDisplay( title, userName, photoURL );
		}
		else
		{
			this.part.innerHTML = templates.control.openSocial.minimizing();

			var that = this;
			this.tinyURL.askTinyURL(url,
									function (turl,url, bitlyUser )
									{
										that.doDisplay( title + " " +  turl, userName, photoURL )
									},
									function (msg,err)
									{
										$feedly( "[tiny] failed to shorten URL because " + msg );
										that.doDisplay( title + " " +  url, userName, photoURL )
									}
									);
		}
	}


	OpenSocialControl.doDisplay = function ( message, userName, photoURL )
	{
		if( this.isDestroyed() == true )
			return;

		this.part.innerHTML = templates.control.openSocial.form( message, userName, photoURL );

		///////////////////////////////////////////////////////////////////////////////
		// form binding
		//
		this.openSocialNoteElem  	= this.element( "openSocialNote" );
		this.msgSizeElem    	= this.element( "msgSize" );

		// The parts
		this.panelOpenSocialElem 	= this.element( "panelOpenSocial" );
		this.panelSendingElem	= this.element( "panelSending" );

		///////////////////////////////////////////////////////////////////////////////
		// event binding
		//
		this.bind( "openSocialCancelAction","click", 	OpenSocialControl.cancelIt 	);
		this.bind( "openSocialSendAction", 	"click", 	OpenSocialControl.sendIt 		);
		this.bind( this.part, 				"keydown",  OpenSocialControl.dispatchKeys );
		this.bind( this.part, 				"keyup", 	OpenSocialControl.noteSize 	);

		this.noteSize();

		this.reset();
	}

	OpenSocialControl.dispatchKeys = function( e )
	{
		if( e.keyCode == 27 )
		{
			this.cancelIt()
			devhd.events.cancelEvent (e)
			return;
		}

		if( (e.keyCode == 77 && e.ctrlKey) || (e.keyCode == 13 && (e.metaKey || e.ctrlKey) ) )
		{
			this.sendIt()
			devhd.events.cancelEvent (e)
			return;
		}
	}

	OpenSocialControl.sendIt = function ()
	{
		// do some basic validation
		if( this.getNote().length > this.charsize )
		{
			this.setMessage(_L(_L(13)),1000)
			return
		}
		else if( this.getNote().length == 0 )
		{
			this.setMessage(_L(_L(14)) ,1000 )
			return
		}

		this.showSending()

		var that = this;

		var activity = {};
		activity[ opensocial.Activity.Field.TITLE ] = this.getNote().replace( /(http:[^\s]*)/gi, "<a href='$1'>$1</a>" );

		opensocial.requestCreateActivity( 	opensocial.newActivity( activity ),
											opensocial.CreateActivityPriority.HIGH,
											function()
											{
												// so now the control has to be "hidden"
												that.fire( "onControlDoneSending", _L(_L(15)) );
											}
											);
	}

	OpenSocialControl.cancelIt = function ()
	{
		this.fire( "onControlDoneSending" )
	}

	OpenSocialControl.getNote = function ()
	{
		return devhd.str.trim( this.openSocialNoteElem.value )
	}

	OpenSocialControl.reset = function ()
	{
		if( this.openSocialNoteElem == null )
			return;

		this.showPanel();
		this.openSocialNoteElem.focus();
	}

	OpenSocialControl.showPanel = function ()
	{
		this.panelSendingElem.style.display = "none";
		this.panelOpenSocialElem.style.display = "block";
	}

	OpenSocialControl.showSending = function ()
	{
		this.panelSendingElem.style.display = "block";
		this.panelOpenSocialElem.style.display = "none";
	}

	OpenSocialControl.noteSize = function ()
	{
		var size = (this.charsize - this.openSocialNoteElem.value.length );
		this.msgSizeElem.innerHTML = "" + size;

		if( size < 0 )
		{
			this.msgSizeElem.style.color = "red";
		}
		else if( size < 10 )
		{
			this.msgSizeElem.style.color = "orange";
		}
		else
		{
			this.msgSizeElem.style.color = "#1a3f7a";
		}
	}

}) ()

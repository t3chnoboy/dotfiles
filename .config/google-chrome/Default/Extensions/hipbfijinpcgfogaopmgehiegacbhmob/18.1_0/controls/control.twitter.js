"use strict";

(function () {
	var pkg = devhd.pkg("control");


	var BaseControl    = pkg.BaseControl.prototype
	var TwitterControl = pkg.createClass ( "TwitterControl", pkg.BaseControl )
	var LOG = devhd.log.get("control.twitter");

	var _L = devhd.i18n.L

	TwitterControl.initialize = function () {
		BaseControl.initialize.call(this)
		this.completionModel = {}
		this.charsize = 140
	};

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	TwitterControl.setTwitter = function (t) {
		this.twitter = t;
	};

	TwitterControl.setTinyURL = function (t) {
		this.tinyURL = t;
	};

	TwitterControl.setEntry = function ( entry )
	{
		this.entry = entry;
	};
	
	TwitterControl.setPostfix = function ( pf )
	{
		this.postfix = pf;
	};
	

	TwitterControl.destroy = function ()
	{
		this.twitter.unregisterObserver( this );
		
		this.twitterNoteElem  = null;
		this.msgSizeElem      = null;
		this.panelTwitterElem = null;
		this.panelSendingElem = null;

		this.twitter 		  = null;
		this.tinyURL 		  = null;
		this.entry			  = null;

		BaseControl.destroy.call(this);
	};


	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	TwitterControl.onTwitterIdentityChanged = function()
	{
		this.refresh();
	};
	
	TwitterControl.display = function ()
	{
		this.twitter.registerObserver( this );
	
		this.refresh();
	};
	
	TwitterControl.refresh = function()
	{	
		var that = this;
		this.twitter.askAvailable( 	function( me )
									{
										if( that.isDestroyed() == true )
											return;

										that.showForm( me );
										
									},
									function()
									{
										that.part.innerHTML = templates.twitter.login();
										that.twitter.askDecorate();
									}
									);
	};
	
	TwitterControl.showForm = function( me )
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
			this.doDisplay( message, null, me.screen_name, me.profile_image_url );
		}
		else if (url == null )
		{
			this.doDisplay( title, null, me.screen_name, me.profile_image_url );
		}
		else
		{
			this.part.innerHTML = templates.twitter.minimizing();
			var that = this;
			this.tinyURL.askTinyURL(url,
									function (turl,url, bitlyUser )
									{
										if( that.isDestroyed() == true )
											return;
										
										that.doDisplay( title + " " +  turl, bitlyUser, me.screen_name, me.profile_image_url );
									},
									function (msg,err)
									{
										if( that.isDestroyed() == true )
											return;

										LOG.error(135, "failed to shorten URL because ", msg );
										that.doDisplay( title + " " +  url, null, me.screen_name, me.profile_image_url );
									}
									);
		}
	};

	TwitterControl.doDisplay = function ( message, bitlyUser, screen_name, photoURL )
	{
		if( this.isDestroyed() == true )
			return;

		this.part.innerHTML = templates.twitter.form( message, this.postfix != null ? " " + this.postfix : "", screen_name, photoURL, bitlyUser );

		///////////////////////////////////////////////////////////////////////////////
		// form binding
		//
		this.twitterNoteElem  	= this.element( "twitterNote" );
		this.msgSizeElem    	= this.element( "msgSize" );

		// The parts
		this.panelTwitterElem 	= this.element( "panelTwitter" );
		this.panelSendingElem	= this.element( "panelSending" );

		///////////////////////////////////////////////////////////////////////////////
		// event binding
		//
		this.bind( "twitterCancelAction", 	"click", 	TwitterControl.cancelIt 	);
		this.bind( "twitterSendAction", 	"click", 	TwitterControl.sendIt 		);
		this.bind( this.part, 				"keydown",  TwitterControl.dispatchKeys );
		this.bind( this.part, 				"keyup", 	TwitterControl.tweetSize 	);

		this.tweetSize();

		this.reset();
	}

	TwitterControl.dispatchKeys = function( e )
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

	TwitterControl.sendIt = function ()
	{
		var request = createTwitterRequest.call(this)

		// do some basic validation
		if( request.status.length > this.charsize )
		{
			this.setMessage(_L(19) ,1000)
			return
		}
		else if( request.status.length == 0 )
		{
			this.setMessage(_L(20) ,1000 )
			return
		}

		var that = this

		this.showSending()

		// now it can be sent
		this.twitter.askUpdate(request,
		        function () {
					// so now the control has to be "hidden"
					that.fire( "onControlDoneSending", _L(_L(21)) );
				},
				function (code,msg) {
					// show the error.
					that.showPanel()
					that.setMessage(_L(_L(22),msg),1000)
				});
	}

	TwitterControl.cancelIt = function ()
	{
		this.fire( "onControlDoneSending" )
	}

	TwitterControl.getNote = function ()
	{
		return devhd.str.trim( this.twitterNoteElem.value )
	}

	TwitterControl.reset = function ()
	{
		if( this.twitterNoteElem == null )
			return;

		this.showPanel();
		this.twitterNoteElem.focus();
	}

	TwitterControl.showPanel = function ()
	{
		this.panelSendingElem.style.display = "none";
		this.panelTwitterElem.style.display = "block";
	}

	TwitterControl.showSending = function ()
	{
		this.panelSendingElem.style.display = "block";
		this.panelTwitterElem.style.display = "none";
	}

	TwitterControl.tweetSize = function ()
	{
		var size = (this.charsize - this.twitterNoteElem.value.length );
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
			this.msgSizeElem.style.color = "#707070";
		}
	}

	function createTwitterRequest ()
	{
		var r = { status: this.getNote() };

		// if possible, correlate this request with an entry
		if( this.entry != null )
			r.entryId = this.entry.getId();

		return r;
	}

}) ()

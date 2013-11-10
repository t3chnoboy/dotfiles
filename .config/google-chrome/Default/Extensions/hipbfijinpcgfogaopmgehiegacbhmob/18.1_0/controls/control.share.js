"use strict";

(function () {
	var pkg = devhd.pkg( "control" );

	var BaseControl	 = pkg.BaseControl.prototype
	var ShareControl = pkg.createClass ( "ShareControl", pkg.BaseControl )

	var _L = devhd.i18n.L;
	var LOG = devhd.log.get("control.share");

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	ShareControl.setReader = function( value )
	{
		this.reader = value;
	}

	ShareControl.setEntry = function( value )
	{
		this.entry = value;
	}

	/////////////////////////////////////////////////
	// Lifecyle
	/////////////////////////////////////////////////

	ShareControl.destroy = function ()
	{
		this.reader 			= null;
		this.shareNoteElem 	 	= null;
		this.panelShareElem   	= null;
		this.panelSendingElem 	= null;

		BaseControl.destroy.call(this);
	}

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	ShareControl.display = function ()
	{
		this.part.innerHTML = templates.control.share.form( this.home.getEmail(), this.home.getPhotoURL() );

		////////////////////////////////////////////////////////////////
		// element binding
		//
		this.shareNoteElem 		= this.element( "shareNote" );
		this.panelShareElem 	= this.element( "panelShare" );
		this.panelSendingElem	= this.element( "panelSending" );

		////////////////////////////////////////////////////////////////
		// event binding
		//
		this.bind( "shareCancelAction", "click", 	ShareControl.cancelIt 		);
		this.bind( "shareSendAction", 	"click", 	ShareControl.sendIt 		);
		this.bind( this.part, 			"keydown",  ShareControl.dispatchKeys 	);

		this.reset();
	}

	/////////////////////////////////////////////////
	// Controller Logic
	/////////////////////////////////////////////////

	ShareControl.sendIt = function ()
	{
		var that = this
		this.showSending()

		var note = this.getModel( "note" );

		// If control can be configured to either use an entry or a note as input
		if( note == null )
		{
			note = {
				linkify : 	false,
				share: 		true,
				snippet: 	templates.control.share.snippet( this.entry, [] ),
				srcTitle: 	this.entry.getSourceTitle(),
				srcUrl: 	this.entry.getSourceAlternateLink(),
				tags: 		[],
				title: 		this.entry.getCleanTitle(),
				url: 		this.entry.getAlternateLink()
			};
		}

		if( this.entry != null )
			note.entryId = this.entry.getId();

		note.annotation = this.getNote();
		
		// now it can be sent
		this.reader.askCreateNote( 	note,
							        function() 
									{
										// so now the control has to be "hidden"
										that.fire( "onControlDoneSending", _L(16) );
									},
									function( code, msg ) 
									{
										// show the error.
										that.showPanel();
										that.setMessage( _L(_L(17),"Share Note", code,msg) ); // no-l10n
									}
									);
	};

	ShareControl.cancelIt = function ()
	{
		this.fire( "onControlDoneSending" );
	};

	ShareControl.dispatchKeys = function( e )
	{
		if (e.keyCode == 27) {
			devhd.events.cancelEvent ( e );
			this.cancelIt();
			return
		}
		if ((e.keyCode == 77 && e.ctrlKey) || (e.keyCode == 13 && (e.metaKey || e.ctrlKey) ) ) {
			devhd.events.cancelEvent ( e );
			this.sendIt();
			return
		}
	};


	/////////////////////////////////////////////////
	// Util Functions
	/////////////////////////////////////////////////
	ShareControl.reset = function ()
	{
		if( this.shareNoteElem == null )
			return;

		this.showPanel();
		this.shareNoteElem.focus();
	};

	ShareControl.showPanel = function ()
	{
		this.panelSendingElem.style.display = "none";
		this.panelShareElem.style.display  	= "block";
	};

	ShareControl.showSending = function ()
	{
		this.panelSendingElem.style.display = "block";
		this.panelShareElem.style.display  	= "none";
	}


	ShareControl.getNote = function ()
	{
		return devhd.str.trim( this.shareNoteElem.value )
	}
}) ()

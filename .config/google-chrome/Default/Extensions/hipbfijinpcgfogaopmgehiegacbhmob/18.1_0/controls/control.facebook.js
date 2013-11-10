"use strict";

(function () {
	var pkg = devhd.pkg("control");


	var BaseControl    = pkg.BaseControl.prototype
	var FacebookControl = pkg.createClass ( "FacebookControl", pkg.BaseControl )
	var LOG = devhd.log.get("control.facebook");

	var _L = devhd.i18n.L

	FacebookControl.initialize = function () 
	{
		BaseControl.initialize.call( this );
	};

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	FacebookControl.setFacebook = function( value ) 
	{
		this.facebook = value;
		this.facebook.registerObserver( this );
	};

	FacebookControl.setEntry = function ( entry )
	{
		this.entry = entry;
	};

	FacebookControl.destroy = function ()
	{
		this.facebook.unregisterObserver( this );
		
		this.facebookMessageElem  = null;
		this.panelFacebookElem = null;
		this.panelSendingElem  = null;

		this.facebook 		   = null;
		this.entry			   = null;
		this.accounts		   = null;

		BaseControl.destroy.call( this );
	};


	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	FacebookControl.onTwitterIdentityChanged = function()
	{
		this.refresh();
	};
	
	FacebookControl.display = function ()
	{
		this.refresh();
	};
	
	FacebookControl.refresh = function()
	{	
		var that = this;
		this.facebook.askAvailable( 	function( me, accounts )
										{
											if( that.isDestroyed() == true )
												return;
	
											that.showForm( me.name , "http://graph.facebook.com/" + me.id + "/picture" , accounts );
										},
										function()
										{
											that.part.innerHTML = templates.control.facebook.login();
										}
										);
	};
	
	FacebookControl.showForm = function ( name, photoURL, accounts  )
	{
		if( this.isDestroyed() == true )
			return;
		
		this.accounts = accounts;
		
		this.part.innerHTML = templates.control.facebook.form( name, photoURL, accounts );

		///////////////////////////////////////////////////////////////////////////////
		// form binding
		//
		this.facebookMessageElem  	= this.element( "facebookMessage" );

		// The parts
		this.panelFacebookElem 	= this.element( "panelFacebook" );
		this.panelSendingElem	= this.element( "panelSending" );

		///////////////////////////////////////////////////////////////////////////////
		// event binding
		//
		this.bind( "facebookCancelAction", 	"click", 	FacebookControl.cancelIt 	);
		this.bind( "facebookSendAction", 	"click", 	FacebookControl.sendIt 		);
		this.bind( this.part, 				"keydown",  FacebookControl.dispatchKeys );

		this.reset();
	};

	FacebookControl.dispatchKeys = function( e )
	{
		if( e.keyCode == 27 )
		{
			this.cancelIt();
			devhd.events.cancelEvent( e );
			return;
		}

		if( (e.keyCode == 77 && e.ctrlKey) || (e.keyCode == 13 && (e.metaKey || e.ctrlKey) ) )
		{
			this.sendIt();
			devhd.events.cancelEvent( e );
			return;
		}
	};

	FacebookControl.sendIt = function ()
	{
		var update = { 
				message: this.getMessage(),
				link: this.entry.getAlternateLink(),
				name: this.entry.getCleanTitle(),
				caption: this.entry.getSourceTitle(),
				description: this.entry.getDescription(),
				actions: "{'name':'A Better Reader','link':'http://www.feedly.com/index.html'}"
		};
		
		var p = this.entry.suggestVisual();
		if( p != null )
			update.picture = p;
		
		var that = this;

		this.showSending();
				
		// now it can be sent
		var account = this.getAccount();
		
		this.facebook.askPostUpdate(	account.id + "/feed",
										account.access_token,
										update,
								        function() 
								        {
											// so now the control has to be "hidden"
											that.fire( "onControlDoneSending", _L(_L(5)) );
										},
										function (code,msg) 
										{
											$feedly( "[facebook control] post update failed because: " + code + " -- " + msg );
											
											// show the error.
											that.showPanel();
											that.setMessage( _L(_L(6), code + " -- " + msg ), 3000 );
										}
										);
	};

	FacebookControl.cancelIt = function ()
	{
		this.fire( "onControlDoneSending" );
	};

	FacebookControl.getMessage = function ()
	{
		return devhd.str.trim( this.facebookMessageElem.value );
	};

	FacebookControl.getAccount = function ()
	{
		var accountSelectorElem = this.element( "facebookAccount" );
		if( accountSelectorElem == null )
			return this.accounts[ 0 ];
		else
			return this.accounts[ parseInt( accountSelectorElem.value || "0" ) ];
	};

	FacebookControl.reset = function ()
	{
		if( this.facebookMessageElem == null )
			return;

		this.showPanel();
		this.facebookMessageElem.focus();
	};

	FacebookControl.showPanel = function ()
	{
		this.panelSendingElem.style.display = "none";
		this.panelFacebookElem.style.display = "block";
	};

	FacebookControl.showSending = function ()
	{
		this.panelSendingElem.style.display = "block";
		this.panelFacebookElem.style.display = "none";
	};

}) ();

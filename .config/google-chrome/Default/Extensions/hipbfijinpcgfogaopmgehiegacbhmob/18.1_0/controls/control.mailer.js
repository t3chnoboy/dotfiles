"use strict";

(function () {
	var pkg = devhd.pkg("control");

	var BaseControl   = devhd.control.BaseControl.prototype
	var MailerControl = pkg.createClass ( "MailerControl", pkg.BaseControl )
	// i18n hook
	var _L = devhd.i18n.L;
	var LOG = devhd.log.get("control.mailer");

	MailerControl.initialize = function ()
	{
		BaseControl.initialize.call(this)
		//
		this.completionModel = {
			    data: [],
			    max: 15,
				multiple: ',' ,
				getValue: getABEntry,
				onSelect: {$this: this, $fn: selectEntry}
		}
	}

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	MailerControl.setMailer = function( mailer )
	{
		this.mailer = mailer
	}

	MailerControl.setEntry = function( entry )
	{
		this.entry = entry
	}

	MailerControl.setAddressBook = function( addressBook )
	{
		this.addressBook = addressBook
	}

	MailerControl.setEmailAddress = function( emailAddress )
	{
		this.emailAddress = emailAddress
	}

	MailerControl.setMailRequestFiller = function( filler )
	{
		this.filler = filler
	}

	MailerControl.destroy = function ()
	{
		// unbind everything.
		devhd.bindml.innerHTML(this.part,"");

		this.mailToElem  		= null;
		this.mailNoteElem 		= null;
		this.panelMailerElem 	= null;
		this.panelSendingElem	= null;
		this.panelErrorElem    	= null;

		this.addressBook 		= null;
		this.mailer 			= null;
		this.filter				= null;
		this.entry				= null;

		// Destroy the base
		BaseControl.destroy.call(this)
	}

	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	MailerControl.display = function ()
	{
		// post the email form to the
		var refid = this.part.getAttribute( "data-refid" )

		devhd.bindml.innerHTML( this.part,
								templates.mailer.form( this.completionModel, refid, this.emailAddress, this.home ),
								false, /// do it SYNCHRONSOUSLY
								this.home
								)

		this.mailToElem  	 	   = this.element( "mailTo" );
		this.mailNoteElem 		   = this.element( "mailNote" );
		this.panelMailerElem 	   = this.element( "panelMailer" );
		this.panelSendingElem	   = this.element( "panelSending" );
		this.panelErrorElem        = this.element( "panelError" );

		// Behavior injection
		this.bind( "mailCancelAction", 	"click", 		MailerControl.cancelIt 		);
		this.bind( "mailSendAction", 	"click", 		MailerControl.sendIt 		);
		this.bind( this.part, 			"keydown", 		MailerControl.dispatchKeys 	);

		// ask the addressbook for the list of e-mail contacts
		var that = this
		this.addressBook.askContacts(  	function( ab )
										{
											that.completionModel.data = ab
										},
				                        function( code, msg )
										{
											// don't display the error if some of the retrievals failed
										});

		// set the focus on the mail to field
		this.reset();
	}



	/////////////////////////////////////
	// IMPLEMENTATIONS OF THE ACTIONS
	/////////////////////////////////////
	MailerControl.sendIt = function ()
	{
		// do some basic validation, like recipients must be set
		var to = this.getRecipients()
		if( to.length == 0 || to.indexOf("@" ) < 0 )
		{
			this.setMessage(_L(7),1000)
			return;
		}

		this.showSending()

		// now it can be sent
		var that = this
		this.mailer.askSendMail(createMailRequest.call( this ),
						        function ()
								{
									// so now the control has to be "hidden"
									that.fire("onControlDoneSending",_L(8))
								},
								function (code,msg)
								{
									// show the error.
									that.showMailTo()
									that.setMessage(_L(9) ,1000)
								})
	}

	MailerControl.cancelIt = function ()
	{
		this.fire( "onControlDoneSending" )
	}

	MailerControl.dispatchKeys = function( e )
	{
		if (e.keyCode == 27) {
			this.cancelIt()
			devhd.events.cancelEvent (e)
			return
		}
		if ((e.keyCode == 77 && e.ctrlKey) || (e.keyCode == 13 && (e.metaKey || e.ctrlKey) )) {
			this.sendIt()
			devhd.events.cancelEvent (e)
			return
		}
	}



	/////////////////////////////////////
	// UI HELPER FUNCTIONS
	/////////////////////////////////////
	MailerControl.reset = function ()
	{
		// to early.
		if( this.mailToElem == null )
			return;

		this.mailToElem.value 	= "";
		this.mailNoteElem.value = "";

		this.showMailTo()

		// Do not remove the blur() before focus(). This causes the drop-down
		// to position correctly which is handle off the .focus() event.
		// focus does not happen if element has focus already, so we blur it first, then focus() it.
		this.mailToElem.blur()
		this.mailToElem.focus()
	}

	MailerControl.showMailTo = function ()
	{
		this.panelSendingElem.style.display = "none";
		this.panelMailerElem.style.display 	= "block";
	}

	MailerControl.showSending = function ()
	{
		this.panelSendingElem.style.display = "block";
		this.panelMailerElem.style.display 	= "none";
	}

	MailerControl.getRecipients = function ()
	{
		return devhd.str.trim( this.mailToElem.value || "" );
	}

	MailerControl.getNote = function ()
	{
		return devhd.str.trim( this.mailNoteElem.value || "" );
	}

	function createMailRequest ()
	{
		var mailRequest = {
			to: this.getRecipients()
		}

		// the control provides the to and note ... someone has to fill in the body and
		// the subject
		if( this.filler )
			devhd.fn.callback( this.filler, mailRequest );

		return mailRequest
	}

	/////////////////////////////////////
	// UTILS
	/////////////////////////////////////


	/**
	 *
	 * @param {Object} entry model object
	 * @param {Object} how key (0 what is shown in the drop down, 1 the key, 2 the "type")
	 *           all of this information is passed to the pick callback.
	 */
	function getABEntry ( entry, how )
	{
		if (entry.displayName)  {
			if (how == 0) return _L(_L(10), entry.displayName , entry.userEmails[0]);
			if (how == 1) return entry.userEmails[0];
			if (how == 2) return "u";
		}
		if (entry.userEmails) {
			if (how == 1 || how == 0) return entry.userEmails[0]
			if (how == 2) return "u"
		}
		return "+x+x+x+"
	}

	function selectEntry ( obj ) {
		return obj.text
	}
	
}) ()


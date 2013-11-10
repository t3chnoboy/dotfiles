"use strict";

( function () 
{	
	var pkg = devhd.pkg( "control" );
	
	var BaseControl	 = pkg.BaseControl.prototype;
	var EntryMessageAreaControl = pkg.createClass ( "EntryMessageAreaControl", pkg.BaseControl ); 

							
	//////// PAGE CUSTOMIZER CONTRACT  ////////////////////////////////////////	
	EntryMessageAreaControl.setReader = function( r )
	{
		this.reader = r;
	};
	
	EntryMessageAreaControl.setEntryId = function( value )
	{
		this.entryId = value;
	};
	
	EntryMessageAreaControl.destroy = function()  
	{
		// If there a message, flag is as dismissed
		this.reader = null;

		BaseControl.destroy.call( this );			
	};

	//////// CONTROL CONTRACT /////////////////////////////////////////////////
	EntryMessageAreaControl.display = function()
	{
		var that = this;

		this.reader.askEntry( 	this.entryId, 
								function( anEntry )
								{
									that.crawledTime = anEntry.crawledTime;
			
									that.part.innerHTML = anEntry.getContentOrSummary(); 
									that.bind( that.part, "click", function(){
										that.onClose();
									});
								}
								);
	};	

	EntryMessageAreaControl.onClose = function()
	{
		var window = this.home.getDocument().defaultView;
		
		if( window == null || window.localStorage == null )
			return;
				
		window.localStorage.setItem( "channel.crawledTime", this.crawledTime );
	};
}) ();

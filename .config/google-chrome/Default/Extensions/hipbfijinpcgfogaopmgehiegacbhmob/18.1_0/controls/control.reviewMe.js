"use strict";

( function () 
{	
	var pkg = devhd.pkg( "control" );
	
	var BaseControl	 = pkg.BaseControl.prototype;
	var ReviewMeControl = pkg.createClass ( "ReviewMeControl", pkg.BaseControl ); 

							
	//////// PAGE CUSTOMIZER CONTRACT  ////////////////////////////////////////	
	ReviewMeControl.setPreferences = function( r )
	{
		this.preferences = r;
	};
		
	ReviewMeControl.destroy = function()  
	{
		this.preferences = null;

		BaseControl.destroy.call( this );			
	};

	//////// CONTROL CONTRACT /////////////////////////////////////////////////
	ReviewMeControl.display = function()
	{
		var reviewURL = null;
		var env = this.home.getEnvironment();
		if( env == "firefox" )
		{
			reviewURL = "http://bit.ly/feedly-mozilla";
		}
		else
		{
			reviewURL = "http://bit.ly/feedly-plus";
		}

		this.part.innerHTML = templates.reviewMe( reviewURL );

	};

	ReviewMeControl.onClose = function()
	{
		this.preferences.askSetPreference( feedlyEnjoyed, "0", null, true );
	};	


})();


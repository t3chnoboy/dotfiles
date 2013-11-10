"use strict";

(function () {
	var pkg = devhd.pkg("control");


	var BaseControl    = pkg.BaseControl.prototype
	var BufferControl = pkg.createClass ( "BufferControl", pkg.BaseControl )
	var LOG = devhd.log.get("control.buffer");

	var _L = devhd.i18n.L

	BufferControl.initialize = function () {
		BaseControl.initialize.call(this)
		this.completionModel = {}
		this.charsize = 140
	};

	/////////////////////////////////////////////////
	// Dependency injection
	/////////////////////////////////////////////////
	BufferControl.setTinyURL = function (t) {
		this.tinyURL = t;
	};

	BufferControl.setEntry = function ( entry )
	{
		this.entry = entry;
	};
	
	BufferControl.setPostfix = function ( pf )
	{
		this.postfix = pf;
	};
	

	BufferControl.destroy = function ()
	{
		this.tinyURL 		  = null;
		this.entry			  = null;

		BaseControl.destroy.call(this);
	};


	/////////////////////////////////////////////////
	// Control contract
	/////////////////////////////////////////////////
	
	BufferControl.display = function ()
	{
		// FIRST CHOICE
		var message = this.getModel("message");

		// SECOND CHOICE
		var url   	= this.getModel("url");
		var title 	= this.getModel("title");
		var preferredLogin = this.getModel( "preferredLogin" );

		// THIRD CHOICE
		// If an entry has been attached to this control, then use the
		// if formation associated with the entry for default values.
		if( title == null && this.entry != null )
			title = this.entry.getCleanTitle();

		if( url == null && this.entry != null )
			url = this.entry.getAlternateLink();

		if( message != null ) // existing preformatted message
		{
			this.doDisplay( message, null, preferredLogin );
		}
		else if (url == null )
		{
			this.doDisplay( title, null, preferredLogin );
		}
		else
		{
			var that = this;
			this.tinyURL.askTinyURL(url,
									function (turl,url, bitlyUser )
									{
										if( that.isDestroyed() == true )
											return;
										
										that.doDisplay( title, turl, preferredLogin );
									},
									function (msg,err)
									{
										if( that.isDestroyed() == true )
											return;

										LOG.error(93, "failed to shorten URL because ", msg );
										that.doDisplay( title + " " +  url, null, preferredLogin );
									}
									);
		}
	};

    function genid() 
    {
        return (S4()+S4()+S4()+S4());
    };

    function S4() 
    {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
	
	BufferControl.doDisplay = function ( message, url, preferredLogin )
	{
		if( this.isDestroyed() == true )
			return;

		var doc = this.home.getDocument();

		var src = "https://bufferapp.com/add/?id=" + genid() + "&url=" + encodeURIComponent( url )+ "&text=" + encodeURIComponent( message ) + "&count=vertical&placement=button&partner_source=feedly";
		if( preferredLogin != null )
			src += "&preferred_login=" + preferredLogin;
		
        var temp = doc.createElement('iframe');
        
        temp.allowtransparency = 'true';
		temp.scrolling = 'no';
		temp.id = 'buffer_overlay';
		temp.name = 'buffer_overlay';
		temp.style.cssText = "border:none;margin-top:0px;height:100%;width:100%;position:fixed;z-index:99999999;top:0;left:0; visibility:hidden";
		temp.src = src;
		doc.body.appendChild(temp);
	
		bindEvent( doc.defaultView, "message", receiveMessage, false );
		 	
		var that = this;
		
	    function receiveMessage( event )
		{
			if( event.data.indexOf( "buffermessage" ) > 0 )
			{
				doc.body.removeChild( temp );
				doc.defaultView.removeEventListener( "message", receiveMessage, false);

				that.fire( "onControlDoneSending" );
			}
		}		
	    
	    this.home.getDocument().defaultView.setTimeout( function(){
	    	temp.style.visibility = "visible";
	    },
	    devhd.utils.BrowserUtils.isIE() ? 200 : 10
	    );
 	};
	
})();

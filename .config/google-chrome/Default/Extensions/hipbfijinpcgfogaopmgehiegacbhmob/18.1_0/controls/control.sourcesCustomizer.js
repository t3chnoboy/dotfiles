"use strict";


(function () {

	var pkg = devhd.pkg("control");

	var BaseControl = devhd.control.BaseControl.prototype
	var SourcesCustomizerControl = pkg.createClass("SourcesCustomizerControl", pkg.BaseControl)

	SourcesCustomizerControl.setPreferences = function( p )
	{
		this.preferences = p;
	}

	SourcesCustomizerControl.setPageInfo = function( pi )
	{
		this.pageInfo = pi;
	}

	SourcesCustomizerControl.destroy = function()
	{
		this.preferences = null;

		BaseControl.destroy.call( this );
	}

	//////// CONTROL CONTRACT /////////////////////////////////////////////////
	SourcesCustomizerControl.display = function()
	{
		this.part.innerHTML = templates.control.sourcesCustomizer.layout( this.home );

		this.bind( 	this.element( "sourcesFavoritesOnlyToggle" ),
					"click",
					SourcesCustomizerControl.onToggleFavoritesOnlyFilter
					);

		var that = this;
		this.preferences.askPreference( "sourcesFavoritesOnlyFilter", function( sourcesFavoritesOnlyFilter ){
			that.element( "sourcesFavoritesOnlyCheck" ).src = sourcesFavoritesOnlyFilter == "on" 
																	? devhd.s3( "images/customizer-checkbox-checked.png" ) 
																	: devhd.s3( "images/customizer-checkbox-unchecked.png" );
		});
	}

	//////// INTERNAL IMPLEMENTATION //////////////////////////////////////////

	SourcesCustomizerControl.onToggleFavoritesOnlyFilter = function()
	{
		var that = this;
		this.preferences.askPreference( "sourcesFavoritesOnlyFilter", function( sourcesFavoritesOnlyFilter ){
			if( sourcesFavoritesOnlyFilter == "on" )
				that.preferences.askSetPreference( "sourcesFavoritesOnlyFilter", "off" );
			else
				that.preferences.askSetPreference( "sourcesFavoritesOnlyFilter", "on" );
		});
	}
}) ();



// ---------------------------------------------------------------------
// FEEDLY AND ASSOCIATED MODULES
// ---------------------------------------------------------------------
var feedlyStreets = 
{
	feedly:
	{
		factory: "devhd.services.createFeedly",
		dependencies: ["preferences", "reader", "reco", "suggesto", "trends", "popup",
		               "quicklook", "edito", "sherlock", "keywords",
					   "signs", "helpSigns", "mailer", "twitter", "facebook",
					   "profile", "progressDialog", "io", "repo",
					   "addressBook", "analytics", "tumblr", "quickGoto", "adz",
					   "kodak", "store", "memory", "dialog", "effects", "channel",
					   "leftNav", "portfolio", "tinyURL", "back", "lang"
					   ],
		properties:
		{
			sideAreaModuleIds:[ 	

								"featuredModule",
								"dashboardModule",

								"sourcesModule",

								"sponsorsModule",

			                    "discoverModule",

// 								"aboutModule",

								"portfolioModule", 
								
			                    "fusionModule",

//								"adzModule",
								
								"timelineModule", 

								// "tumblrModule", 
			                    
								"newsfeedModule",

								"giftsModule",

								// "tweetsModule",
								// "youtubeModule",
								// "flickrModule",

								// "financeModule",
								// "tipsModule"
							  ]		
			}
	},

	addSubscriptionForm:
	{
		factory: "devhd.forms.createAddSubscriptionForm",
		dependencies: [ "reader", "dialog", "signs" ]
	},

	editSubscriptionForm:
	{
		factory: "devhd.forms.createEditSubscriptionForm",
		dependencies: [ "reader", "dialog", "signs" ]
	},

	
// ---------------------------------------------------------------------
// SIDEAREA MODULES
// ---------------------------------------------------------------------

    leftNav:
	{
		factory: "devhd.services.createLeftNav",
		dependencies: [ "reader", "preferences", "feedly", "trends", "suggesto", "profile" ]
	},
	
    timelineModule:
	{
		factory: "devhd.modules.createTimelineModule",
		dependencies: [ "twitter", "preferences", "dialog", "tinyURL", "signs", "sherlock" ]
	},

    tumblrModule:
	{
		factory: "devhd.modules.createTumblrModule",
		dependencies: [ "tumblr", "preferences", "dialog", "signs" ]
	},

    newsfeedModule:
	{
		factory: "devhd.modules.createNewsfeedModule",
		dependencies: [ "facebook", "sherlock", "preferences" ]
	},

   	portfolioModule:
	{
		factory: "devhd.modules.createPortfolioModule",
		dependencies: [ "preferences", "portfolio", "sherlock", "reader" ]
	},

    tweetsModule:
	{
		factory: "devhd.modules.createTweetsModule",
		dependencies: [ "twitter", "reader", "preferences" ]
	},

    flickrModule:
	{
		factory: "devhd.modules.createFlickrModule",
		dependencies: ["sherlock", "preferences" ]
	},

	youtubeModule:
	{
		factory: "devhd.modules.createYoutubeModule",
		dependencies: ["sherlock", "preferences"]
	},
		
	discoverModule:
	{
		factory: "devhd.modules.createDiscoverModule",
		dependencies: [ "reader", "preferences", "suggesto", "feedly", "trends" ]
	},
				
	sponsorsModule:
	{
		factory: "devhd.modules.createSponsorsModule",
		dependencies: [ "reader", "adz", "preferences", "analytics" ]		
	},

	adzModule:
	{
		factory: "devhd.modules.createAdzModule",
		dependencies: [ "adz" ]		
	},

	giftsModule:
	{
		factory: "devhd.modules.createGiftsModule",
		dependencies: [ "adz" ]		
	},

	fusionModule:
	{
		factory: "devhd.modules.createFusionModule",
		dependencies: [ "io", "analytics", "adz" ]		
	},

	aboutModule:
	{
		factory: "devhd.modules.createAboutModule",
		dependencies: [ "reader", "preferences" ]		
	},

	financeModule:
	{
		factory: "devhd.modules.createFinanceModule",
		dependencies: [ "preferences", "quotes" ]		
	},
	
	dashboardModule:
	{
		factory: "devhd.modules.createDashboardModule",
		dependencies: [ "reader", "preferences", "feedly", "trends" ]
	},

	sourcesModule:
	{
		factory: "devhd.modules.createSourcesModule",
		dependencies: [ "reader", "preferences", "feedly", "trends" ]
	},
		
	featuredModule:
	{
		factory: "devhd.modules.createFeaturedModule",
		dependencies: [ "reader", "preferences", "feedly", "trends", "suggesto", "repo" ]
	},

	tipsModule:
	{
		factory: "devhd.modules.createTipsModule",
		dependencies: []
	},	
	
// ---------------------------------------------------------------------
// VARIOUS UI RELATED SERVICES
// ---------------------------------------------------------------------
	twitter:
	{
		factory: "devhd.services.createTwitter",
		dependencies: [ "preferences", "locator", "io","timers", "repo", "cache", "signs", "sherlock" ]
	},

	tumblr:
	{
		factory: "devhd.services.createTumblr",
		dependencies: [ "preferences", "locator", "io","timers", "repo", "cache", "signs" ]
	},

	facebook:
	{
		factory: "devhd.services.createFacebook",
		dependencies: [ "preferences", "locator", "io","timers", "repo", "cache" ]
	},

	channel:
	{
		factory: "devhd.services.createChannel",
		dependencies: [ "reader", "feedly" ]
	},
	
	edito:
	{
		factory: "devhd.services.createEdito",
		dependencies: [ "reader", "preferences", "trends" ]
	},
	
	effects:
	{
		factory: "devhd.services.createEffects"
	},
	
	popup:
	{
		factory: "devhd.services.createPopup",
		dependencies: [ "preferences" ]
	}, 
	
	back:
	{
		factory: "devhd.services.createBack"
	},
	
	dialog:
	{
		factory: "devhd.services.createDialog"
	},
	
	progressDialog:
	{
		factory: "devhd.services.createProgressDialog",
		dependencies: [ "dialog" ]
	},

	quicklook:
	{
		factory: "devhd.services.createQuicklook",
		dependencies: [ "reader" ]
	},

	signs:
	{
		factory: "devhd.services.createSigns",
		dependencies: [ "preferences" ]
	},
	
    analytics:
	{
		factory: "devhd.services.createAnalytics",
		dependencies: [],
		properties:
		{
			accountId: "UA-3571881-3"
		}
	},

	helpSigns:
	{
		factory: "devhd.services.createHelpSigns",
		dependencies: [ "preferences" ]
	},
	
	quickGoto:
	{
		factory: "devhd.services.createQuickGoto",
		dependencies: [ "preferences", "reader", "feedly" , "sherlock" ,"effects" ]
	},

	store:
	{
		factory: "devhd.services.createStore",
		dependencies: [ "repo", "preferences", "reader", "feedly", "twitter", "sherlock", "adz", "suggesto" ]
	},
	
	kodak:
	{
		factory: "devhd.services.createKodak"
	}	
};

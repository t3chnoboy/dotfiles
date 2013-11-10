var coreStreets = 
{
    locator:
	{
		factory: "devhd.services.createLocator"
	},
	
   cache:
   {
		factory: "devhd.services.createCache",
		dependencies: [ "timers", "storage" ]
   },

   storage:
   [
		{
			environment:  	"firefox",
			factory: 	  	"devhd.services.createFirefoxStorage",
			dependencies: 	[ "timers" ]
		},
		{
			environment: 	"others",
			factory: 	 	"devhd.services.createStorage"
		}
	],

	timers: 
	[
		{
			environment:  	"firefox",
			factory: 	  	"devhd.services.createFirefoxTimers",
			dependencies: 	[]
		},
		{
			environment: 	"others",
			factory: 	 	"devhd.services.createTimers"
		}
	],
	
	io: 
	[
		{
			environment:  	"@cloud",
			factory: 		"devhd.cloud.createIO"
		},
		{
			environment:  	"others",
			factory: 		"devhd.services.createIO"
		}
	],
	
	reco:
	{
		factory: 			"devhd.services.createReco",
		dependencies: 		[ "io", "locator", "preferences", "reader", "timers" ]
	},

	memory: 
	{
		factory: 			"devhd.services.createMemory"
	},
	
	addressBook:
	{
		factory: 			"devhd.services.createAddressBook",
		dependencies: 		[ "preferences","locator", "io" , "mailer" ]
	},
	
	mailer:
	{
		factory: 			"devhd.services.createMailer",
		dependencies: 		[ "preferences", "locator", "io", "timers" ]
	},
		
	facebook:
	{
		factory: 			"devhd.services.createFacebook",
		dependencies: 		[ "preferences", "locator", "io","timers", "cache", "reader" ]
	},

	google:
	{
		factory: 			"devhd.services.createGoogle",
		dependencies: 		[ "repo", "io" ]
	},
	
	tinyURL:
	{
		factory: 			"devhd.services.createTinyURL",
		dependencies: 		[ "locator", "io" ]
	},
	
	profile: 
	[
		{
			environment:  	"@cloud",
			factory: 	 	"devhd.cloud.createProfile",
			dependencies: 	[ "io" ]
		},
		{
			environment:  	"others",
			factory: 	 	"devhd.services.createProfile",
			dependencies: 	[ "locator", "io", "reader" ]
		}
	],

	preferences: 
	[
		{
			environment:  	"@cloud",
			factory: 		"devhd.cloud.createPreferences",
			dependencies: 	[ "io", "timers", "storage" ]
		},
		{
			environment:  	"others",
			factory: 		"devhd.services.createPreferences",
			dependencies: 	["locator", "io", "timers", "storage" ]
		}
	],

	reader: 
	[
		{
			environment:  	"@cloud",
			factory: 	  	"devhd.cloud.createReader",
			dependencies: 	 ["preferences", "io", "timers", "cache" ]
		},
		{
			environment:  	"others",
			factory: 	  	"devhd.services.createReader",
			dependencies: 	["preferences", "io", "locator", "timers", "cache" ]
		}
	],

    keywords:
	{
		factory:          	"devhd.services.createKeywords",
		dependencies:     	[ "locator", "io" ]
	},

	sherlock:
	{
		factory:			"devhd.services.createSherlock",
		dependencies: 		[ "preferences", "locator", "io", "reader" ]
	},

	extractor:
	{
		factory: 			"devhd.services.createExtractor",
		dependencies: 		[ "io" ]
	},

	repo:
	{
		factory:	 		"devhd.services.createRepo",
		dependencies: 		[ "io", "timers", "cache", "reader" ]
	},

	lang:
	{
		factory: 			"devhd.services.createLang",
		dependencies: 		[ "io" ]
	},
	
	adz:
	{
		factory: 			"devhd.services.createAdz",
		dependencies: 		[ "io" ]
	},
	
	trends:
	{
		factory: 			"devhd.services.createTrends",
		dependencies: 		[ "locator", "preferences", "reader", "reco", "io", "timers", "suggesto" ]
	},

	suggesto:
	{
		factory: 			"devhd.services.createSuggesto",
		dependencies: 		[ "locator", "io", "reader", "repo", "preferences" ]
	},

	quotes:
	{
		factory: 			"devhd.services.createQuoteService",
		dependencies:		[ "io" ] 
	},

	portfolio:
	{
		factory: 			"devhd.services.createPortfolioService",
		dependencies:		[ "io", "quotes", "preferences" ]
	}
};

var App = Backbone.View.extend({
	initialize:function () {
		var variableProcessor = this.model.get("variableProcessor");
		var globals = this.model.get("globals");

		this.on("modalClose", this.onModalClose, this);
		this.on("modalOpen", this.onModalOpen, this);

		variableProcessor.on('change:selectedEnv', this.renderContextMenu, this);
		globals.on('change', this.renderContextMenu, this);

		var view = this;
		view.menuIdPrefix = guid();
		view.contextMenuIds = {};

	    $('a[rel="tooltip"]').tooltip();
	    $('input[rel="popover"]').popover();

	    var resizeTimeout;

	    $(window).on("resize", function () {
	        clearTimeout(resizeTimeout);
	        resizeTimeout = setTimeout(function() {
	            view.setLayout();
	        }, 500);
	    });

	    $('body').on('keydown', 'textarea', function (event) {
	        if(view.isModalOpen()) {
	            return;
	        }

	        if (event.keyCode === 27) {
	            $(event.target).blur();
	        }
	    });

	    $('body').on('keydown', 'select', function (event) {
	        if (event.keyCode === 27) {
	            $(event.target).blur();
	        }
	    });

	    $(document).bind('keydown', 'esc', function () {
	        if(view.isModalOpen()) {
	            var activeModal = view.model.get("activeModal");
	            if(activeModal !== "") {
	                $(activeModal).modal("hide");
	            }
	        }
	    });

	    var donated = pm.settings.getSetting("haveDonated");

	    if(donated) {
	    	$("#donate-link").css("display", "none");
	    }
	    else {
	    	$("#donate-link").css("display", "inline");
	    }

	    pm.mediator.on("donatedStatusChanged", function(donated) {
	    	if(donated) {
	    		$("#donate-link").css("display", "none");
	    	}
	    	else {
	    		$("#donate-link").css("display", "inline");
	    	}
	    });

	    pm.mediator.on("notifySuccess", function(message) {
	    	noty(
	    	    {
	    	        type:'success',
	    	        text: message,
	    	        layout:'topCenter',
	    	        timeout:750
	    	    });
	    });

	    pm.mediator.on("notifyError", function(message) {
	    	noty(
	    	    {
	    	        type:'error',
	    	        text: message,
	    	        layout:'topCenter',
	    	        timeout:750
	    	    });
	    });

	    pm.mediator.on("error", function() {
	    	noty(
	    	    {
	    	        type:'error',
	    	        text:'Something went wrong.',
	    	        layout:'topCenter',
	    	        timeout:750
	    	    });
	    });

	    pm.mediator.on("openModule", this.openModule, this);

	    this.renderContextMenu();
	    this.setLayout();
	},

	createOrUpdateContextMenuItem: function(id, title, parentId) {
		var view = this;

		var contextMenuIds = view.contextMenuIds;
		var obj = {
			title: title,
			contexts: ['selection']
		};

		if (contextMenuIds[id]) {
			id = chrome.contextMenus.update(id, obj);
		}
		else {
			obj.id = id;
			if (parentId) {
				obj.parentId = parentId;
			}
			id = chrome.contextMenus.create(obj);
			contextMenuIds[id] = true;
		}
	},

	createEnvironmentContextMenu: function(environment) {
		var view = this;
		var i;
		var count;
		var targetId;
		var value;
		var values;

		if (environment) {
			targetId = view.menuIdPrefix + "/postman_current_environment";

			this.createOrUpdateContextMenuItem(targetId, "Set: " + environment.get("name"), false);

			values = environment.get("values");
			count = values.length;

			for(i = 0; i < count; i++) {
				value = values[i];
				targetId = view.menuIdPrefix + "/environment/" + value.key;
				this.createOrUpdateContextMenuItem(targetId, value.key, view.menuIdPrefix + "/postman_current_environment");
			}
		}
	},

	createGlobalsContextMenu: function(globals) {
		var view = this;
		var i;
		var count;
		var targetId;
		var value;
		var values;

		if (globals) {
			targetId = view.menuIdPrefix + "/postman_globals";
			this.createOrUpdateContextMenuItem(targetId, "Set: Globals", false);

			values = globals.get("globals");
			count = values.length;

			for(i = 0; i < count; i++) {
				value = values[i];
				targetId = view.menuIdPrefix + "/globals/" + value.key;
				this.createOrUpdateContextMenuItem(targetId, value.key, view.menuIdPrefix + "/postman_globals");
			}
		}
	},


	createContextMenu: function(environment, globals) {
		this.createEnvironmentContextMenu(environment);
		this.createGlobalsContextMenu(globals);
	},

	renderContextMenu: function() {
		var variableProcessor = this.model.get("variableProcessor");
		var globals = this.model.get("globals");
		var environment = variableProcessor.get("selectedEnv");
		var view = this;

		chrome.contextMenus.removeAll(function() {
			view.contextMenuIds = {};
			_.bind(view.createContextMenu, view)(environment, globals);
		});


		chrome.contextMenus.onClicked.addListener(function(info) {
			if (!document.hasFocus()) {
				console.log('Ignoring context menu click that happened in another window');
				return;
			}

			var menuItemParts = info.menuItemId.split("/");
			var category = menuItemParts[1];
			var variable = menuItemParts[2];
			_.bind(view.updateVariableFromContextMenu, view)(category, variable, info.selectionText);
		});
	},

	updateEnvironmentVariableFromContextMenu: function(variable, selectionText) {
		var variableProcessor = this.model.get("variableProcessor");
		var environments = this.model.get("environments");
		var selectedEnv = variableProcessor.get("selectedEnv");

		if (selectedEnv) {
			var values = _.clone(selectedEnv.get("values"));
			var count = values.length;
			for(var i = 0; i < count; i++) {
				value = values[i];
				if (value.key === variable) {
					value.value = selectionText;
					break;
				}
			}
			var id = selectedEnv.get("id");
			var name = selectedEnv.get("name");
			environments.updateEnvironment(id, name, values);
		}
	},

	updateGlobalVariableFromContextMenu: function(variable, selectionText) {
		var variableProcessor = this.model.get("variableProcessor");
		var globals = this.model.get("globals");
		var globalValues = _.clone(globals.get("globals"));

		var count = globalValues.length;
		var value;

		for(var i = 0; i < count; i++) {
			value = globalValues[i];
			if (value.key === variable) {
				value.value = selectionText;
				break;
			}
		}

		globals.saveGlobals(globalValues);
		globals.trigger("change:globals");
	},

	updateVariableFromContextMenu: function(category, variable, selectionText) {
		if (category === "globals") {
			this.updateGlobalVariableFromContextMenu(variable, selectionText);
		}
		else if (category === "environment") {
			this.updateEnvironmentVariableFromContextMenu(variable, selectionText);
		}
	},

	onModalOpen:function (activeModal) {
		this.model.set("activeModal", activeModal);
		this.model.set("isModalOpen", true);
	},

	onModalClose:function () {
		// Shift focus to disable last shown tooltip
		$("#url").focus();
		this.model.set("activeModal", null);
		this.model.set("isModalOpen", false);
	},

	isModalOpen: function() {
		return this.model.get("isModalOpen");
	},

	setLayout:function () {
	    this.refreshScrollPanes();
	},

	refreshScrollPanes:function () {
	    var newMainHeight = $(document).height() - 55;
	    $('#main').height(newMainHeight + "px");
	    var newMainWidth = $('#container').width() - $('#sidebar').width();
	    $('#main').width(newMainWidth + "px");

	    $('#directory-browser').height(newMainHeight + "px");
	},

	openModule: function(module) {
		if (module === "requester") {
			$("#directory-browser").css("display", "none");
			$("#main-container").css("display", "block");
			pm.mediator.trigger("showSidebar");
		}
		else if (module === "directory") {
			$("#main-container").css("display", "none");
			$("#directory-browser").css("display", "block");
			pm.mediator.trigger("hideSidebar");
		}
		else if (module === "test_runner") {
		}
	}
});
var AppState = Backbone.Model.extend({
    defaults: function() {
        return {
        	variableProcessor:null,
            isModalOpen:false,
            activeModal: ""            
        };
    },

    initialize: function(options) {
    }
});
var FEATURES = {
	USER: "user",
	DIRECTORY: "directory",
	DRIVE_SYNC: "drive_sync"
};

var Features = Backbone.Model.extend({
	defaults: function() {
		var obj = {};
		obj[FEATURES.USER] = true;
		obj[FEATURES.DIRECTORY] = true;
		obj[FEATURES.DRIVE_SYNC] = false;

	    return obj;
	},

	isFeatureEnabled: function(feature) {
		return this.get(feature);
	}
})
var Header = Backbone.View.extend({
	initialize: function() {
		var donated = pm.settings.getSetting("haveDonated");

		if(donated) {
			$("#donate-link").css("display", "none");
		}
		else {
			$("#donate-link").css("display", "inline-block");
		}

		pm.mediator.on("donatedStatusChanged", function(donated) {
			if(donated) {
				$("#donate-link").css("display", "none");
			}
			else {
				$("#donate-link").css("display", "inline-block");
			}
		});

		$("#add-on-directory").on("click", function() {
			pm.mediator.trigger("openModule", "directory");
			pm.mediator.trigger("initializeDirectory");
		});

		$("#add-on-test-runner").on("click", function() {
			pm.mediator.trigger("openModule", "test_runner");
		});

		$("#logo").on("click", function() {
			pm.mediator.trigger("openModule", "requester");
		});

		$("#back-to-request").on("click", function() {
			pm.mediator.trigger("openModule", "requester");
		});

		pm.mediator.on("openModule", this.onOpenModule, this);

		this.render();
	},

	createSupporterPopover: function() {
		var supportContent = "<div class='supporters'><div class='supporter clearfix'>";
		supportContent += "<div class='supporter-image supporter-image-mashape'>";
		supportContent += "<a href='http://www.getpostman.com/r?url=https://www.mashape.com/?utm_source=chrome%26utm_medium=app%26utm_campaign=postman' target='_blank'>";
		supportContent += "<img src='img/supporters/mashape.png'/></a></div>";
		supportContent += "<div class='supporter-tag'>Consume or provide cloud services with the Mashape API Platform.</div></div>";
		supportContent += "<div class='supporter clearfix'>";
		supportContent += "<div class='supporter-image'>";
		supportContent += "<a href='http://www.getpostman.com/donate' target='_blank' class='donate-popover-link'>";
		supportContent += "Donate</a></div>";
		supportContent += "<div class='supporter-tag'>If you like Postman help support the project!</div>";
		supportContent += "</div></div>";

		$('#donate-link').popover({
		    animation: false,
		    content: supportContent,
		    placement: "bottom",
		    trigger: "manual",
		    html: true,
		    title: "Postman is supported by amazing companies"
		}).on("mouseenter", function () {
		    var _this = this;
		    $(this).popover("show");
		    $(this).siblings(".popover").on("mouseleave", function () {
		        $(_this).popover('hide');
		    });
		}).on("mouseleave", function () {
		    var _this = this;
		    setTimeout(function () {
		        if (!$(".popover:hover").length) {
		            $(_this).popover("hide")
		        }
		    }, 100);
		});
	},

	render: function() {
		this.createSupporterPopover();

		if (pm.features.isFeatureEnabled(FEATURES.DIRECTORY)) {
			$("#add-ons").css("display", "block");
		}
	},

	onOpenModule: function(module) {
		if (module === "directory") {
			$("#add-ons").css("display", "none");
			$("#back-to-requester-container").css("display", "block");
		}
		else if (module === "requester") {
			$("#add-ons").css("display", "block");
			$("#back-to-requester-container").css("display", "none");
		}
	}

});
var Mediator = Backbone.Model.extend({
    defaults: function() {
        return {
        }
    }
});
/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
"use strict";

var pm = {};

pm.targets = {
    CHROME_LEGACY_APP: 0,
    CHROME_PACKAGED_APP: 1
};

pm.target = pm.targets.CHROME_PACKAGED_APP;

pm.isTesting = postman_flag_is_testing;
pm.databaseName = postman_database_name;
pm.webUrl = postman_web_url;

pm.features = new Features();

pm.debug = false;

pm.indexedDB = {};
pm.indexedDB.db = null;
pm.indexedDB.modes = {
    readwrite:"readwrite",
    readonly:"readonly"
};

pm.fs = {};
pm.hasPostmanInitialized = false;

pm.bannedHeaders = [
    'accept-charset',
    'accept-encoding',
    'access-control-request-headers',
    'access-control-request-method',
    'connection',
    'content-length',
    'cookie',
    'cookie2',
    'content-transfer-encoding',
    'date',
    'expect',
    'host',
    'keep-alive',
    'origin',
    'referer',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'user-agent',
    'via'
];

// IndexedDB implementations still use API prefixes
var indexedDB = window.indexedDB || // Use the standard DB API
    window.mozIndexedDB || // Or Firefox's early version of it
    window.webkitIndexedDB;            // Or Chrome's early version
// Firefox does not prefix these two:
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

pm.init = function () {
    Handlebars.partials = Handlebars.templates;

    function initializePostmanAPI() {
        pm.api = new PostmanAPI();
    }

    function initializeCollections() {
        var pmCollections = new PmCollections();

        var addCollectionModal = new AddCollectionModal({model: pmCollections});
        var addFolderModal = new AddFolderModal({model: pmCollections});
        var editFolderModal = new EditFolderModal({model: pmCollections});
        var deleteFolderModal = new DeleteFolderModal({model: pmCollections});
        var editCollectionModal = new EditCollectionModal({model: pmCollections});
        var deleteCollectionModal = new DeleteCollectionModal({model: pmCollections});
        var importCollectionModal = new ImportCollectionModal({model: pmCollections});
        var shareCollectionModal = new ShareCollectionModal({model: pmCollections});
        var overwriteCollectionModal = new OverwriteCollectionModal({model: pmCollections});

        var addCollectionRequestModal = new AddCollectionRequestModal({model: pmCollections});
        var editCollectionRequestModal = new EditCollectionRequestModal({model: pmCollections});
        var deleteCollectionRequestModal = new DeleteCollectionRequestModal({model: pmCollections});
        pm.collections = pmCollections;
    }

    function initializeHistory() {
        var history = new History();
        pm.history = history;
    }

    function initializeEnvironments() {
        var globals = new Globals();
        var environments = new Environments();

        var variableProcessor = new VariableProcessor({
            "environments": environments,
            "globals": globals
        });

        var environmentSelector = new EnvironmentSelector({
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var environmentManagerModal = new EnvironmentManagerModal({
            "environments": environments,
            "globals": globals
        });

        var quicklookPopOver = new QuickLookPopOver({
            "environments": environments,
            "globals": globals,
            "variableProcessor": variableProcessor
        });

        pm.envManager = variableProcessor;

        var appState = new AppState({
            "globals": globals,
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var appView = new App({model: appState});
        pm.app = appView;
    }

    function initializeHeaderPresets() {
        pm.headerPresets = new HeaderPresets();

        var headerPresetsModal = new HeaderPresetsModal({model: pm.headerPresets});
        var headerPresetsRequestEditor = new HeaderPresetsRequestEditor({model: pm.headerPresets});
    }

    function initializeRequester() {
        var urlCache = new URLCache();
        pm.urlCache = urlCache;

        var request = new Request();
        var requestEditor = new RequestEditor({model: request});
        var responseViewer = new ResponseViewer({model: request});

        var basicAuthProcessor = new BasicAuthProcessor({request: request});
        var digestAuthProcessor = new DigestAuthProcessor({request: request});
        var oAuth1Processor = new OAuth1Processor({request: request});
        var oAuth2TokenFetcher = new OAuth2TokenFetcher({request: request});

        var helpers = new Helpers({
            "basicAuth": basicAuthProcessor,
            "digestAuth": digestAuthProcessor,
            "oAuth1": oAuth1Processor,
            "oAuth2": oAuth2TokenFetcher,
            "request": request
        });

        var oAuth2Tokens = new OAuth2Tokens();
        var oAuth2TokenList = new OAuth2TokenList({model: oAuth2Tokens});

        var helperManager = new HelperManager({model: helpers});
        pm.helpers = helperManager;

        pm.request = request;
    }

    function initializeStorage() {
        var storage = new Storage();
        pm.storage = storage;
    }

    function initializeSidebar() {
        var sidebarState = new SidebarState({history: pm.history, collections: pm.collections});
        var sidebar = new Sidebar({ model: sidebarState });
    }

    function initializeDriveSync() {
        if (pm.features.isFeatureEnabled(FEATURES.DRIVE_SYNC)) {
            var driveSyncLog = new DriveSyncLog();
            var driveSyncLogger = new DriveSyncLogger({model: driveSyncLog});
            var driveSync = new DriveSync({log: driveSyncLog});
            var driveSyncIntroduction = new DriveSyncIntroduction({model: driveSync});
        }
        else {
            console.log("Drive sync is disabled");
        }
    }

    function initializeDirectory() {
        var directory = new Directory();
        var directoryBrowser = new DirectoryBrowser({model: directory});
    }

    function initializeUser() {
        var header = new Header();

        var user = new User();
        var userStatus = new UserStatus({model: user});
        var userCollections = new UserCollections({model: user});
        pm.user = user;
    }

    pm.mediator = new Mediator();

    initializeStorage();
    pm.settings = new Settings();

    pm.settings.init(function() {
        var settingsModal = new SettingsModal({model: pm.settings});
        pm.filesystem.init();
        pm.indexedDB.open(function() {
            initializePostmanAPI();
            initializeRequester();
            initializeHistory();
            initializeCollections();

            initializeEnvironments();
            initializeHeaderPresets();

            initializeSidebar();

            pm.broadcasts.init();

            initializeDriveSync();
            initializeUser();
            initializeDirectory();

            pm.hasPostmanInitialized = true;
        });
    });
};

$(document).ready(function () {
    pm.init();
});
pm.broadcasts = {
    items: [],

    init:function () {
        pm.storage.getValue("broadcasts", function(broadcasts) {
            pm.storage.getValue("broadcast_last_update_time", function(last_update_time) {
                var today = new Date();

                pm.broadcasts.showBlank();
                pm.broadcasts.fetch();
                if (last_update_time) {
                    var last_update = new Date(last_update_time);
                    pm.broadcasts.setLastUpdateTime(today);
                }
                else {
                    pm.broadcasts.setLastUpdateTime(today);
                }

                $("#broadcasts-count").on("click", function () {
                    pm.broadcasts.markAllAsRead();
                });
            });
        });
    },

    showBlank:function() {
        var $broadcasts_count = $("#broadcasts-count");
        $broadcasts_count.removeClass();
        $broadcasts_count.addClass("no-new-broadcasts");
        $broadcasts_count.html("0");
    },

    fetch:function () {
        var broadcast_url = "http://www.getpostman.com/broadcasts";
        $.get(broadcast_url, function (data) {
            pm.broadcasts.setBroadcasts(data["broadcasts"]);
            pm.broadcasts.renderBroadcasts();
        });
    },

    setLastUpdateTime:function (last_update) {
        pm.storage.setValue({"broadcast_last_update_time": last_update.toUTCString()});
    },

    setBroadcasts:function (broadcasts) {
        var old_broadcasts;
        var broadcastsJson;
        var b;

        function oldBroadCastsFinder(br) {
            return br.id === b.id;
        }

        pm.storage.getValue("broadcasts", function(broadcastsJson) {
            if (broadcastsJson) {
                old_broadcasts = JSON.parse(broadcastsJson);
            }
            else {
                old_broadcasts = [];
            }

            var i, c, count;
            if (old_broadcasts.length === 0) {
                c = broadcasts.length;
                for (i = 0; i < c; i++) {
                    broadcasts[i]["status"] = "unread";
                }
                count = broadcasts.length;
                broadcastsJson = JSON.stringify(broadcasts);
                pm.storage.setValue({"broadcasts": broadcastsJson}, function() {
                });
            }
            else {
                c = broadcasts.length;
                var new_broadcasts = [];
                for (i = 0; i < c; i++) {
                    b = broadcasts[i];

                    var existing = _.find(old_broadcasts, oldBroadCastsFinder);

                    if (!existing) {
                        b["status"] = "unread";
                        new_broadcasts.push(b);
                    }
                }

                count = new_broadcasts.length;
                old_broadcasts = _.union(new_broadcasts, old_broadcasts);
                broadcastsJson = JSON.stringify(old_broadcasts);
                pm.storage.setValue({"broadcasts": broadcastsJson}, function() {
                });
            }

            var $broadcasts_count = $("#broadcasts-count");
            $broadcasts_count.html(count);
            $broadcasts_count.removeClass();
            if (count > 0) {
                $broadcasts_count.addClass("new-broadcasts");
            }
            else {
                $broadcasts_count.addClass("no-new-broadcasts");
            }
        });
    },

    markAllAsRead:function () {
        var $broadcasts_count = $("#broadcasts-count");
        $broadcasts_count.removeClass();
        $broadcasts_count.addClass("no-new-broadcasts");
        $broadcasts_count.html("0");

        pm.storage.getValue("broadcasts", function(broadcastsJson) {
            var broadcasts;

            if (broadcastsJson) {
                broadcasts = JSON.parse(broadcastsJson);
            }
            else {
                broadcasts = [];
            }

            var c = broadcasts.length;
            for (var i = 0; i < c; i++) {
                broadcasts[i]["status"] = "read";
            }

            var outBroadcastsJsons = JSON.stringify(broadcasts);
            pm.storage.setValue({"broadcasts": outBroadcastsJsons}, function() {
            });

            pm.broadcasts.renderBroadcasts();
        });
    },

    renderBroadcasts:function () {
        pm.storage.getValue("broadcasts", function(broadcastsJson) {
            var broadcasts = JSON.parse(broadcastsJson);
            $("#broadcasts .dropdown-menu").html("");
            $("#broadcasts .dropdown-menu").append(Handlebars.templates.broadcasts({"items":broadcasts}));
        });
    }
};
/****

collectionRequest = {
    id: guid(),
    headers: request.getPackedHeaders(),
    url: url,
    method: request.get("method"),
    data: body.get("dataAsObjects"),
    dataMode: body.get("dataMode"),
    name: newRequestName,
    description: newRequestDescription,
    descriptionFormat: "html",
    time: new Date().getTime(),
    version: 2,
    responses: []
};

*****/
var PmCollection = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "description": "",
            "order": [],
            "folders": [],
            "requests": [],
            "timestamp": 0,
            "synced": false,
            "syncedFilename": "",
            "remote_id": 0
        };
    },

    toSyncableJSON: function() {
        var j = this.getAsJSON();
        j.synced = true;
        return j;
    },

    setRequests: function(requests) {
        this.set("requests", requests);
    },

    getRequestIndex: function(newRequest) {
    	var requests = this.get("requests");
    	var count = requests.length;
    	var request;
    	var found;
    	var location;

    	for(var i = 0; i < count; i++) {
    		request = requests[i];
    		if(request.id === newRequest.id) {
    			found = true;
    			location = i;
    			break;
    		}
    	}

    	if (found) {
    		return location;
    	}
    	else {
    		return -1;
    	}
    },

    addRequest: function(newRequest) {
        var location = this.getRequestIndex(newRequest);
        var requests = this.get("requests");
        if (location !== -1) {
            requests.splice(location, 1, newRequest);
        }
        else {
            requests.push(newRequest);
        }
    },

    deleteRequest: function(requestId) {
        var requests = _.clone(this.get("requests"));
    	var location = arrayObjectIndexOf(requests, requestId, "id");
    	if (location !== -1) {
            this.removeRequestIdFromOrderOrFolder(requestId);
    		requests.splice(location, 1);
            this.set("requests", requests);
    	}
    },

    updateRequest: function(newRequest) {
    	var location = this.getRequestIndex(newRequest);
    	var requests = this.get("requests");
    	if (location !== -1) {
    		requests.splice(location, 1, newRequest);
    	}
    },

    addFolder: function(folder) {
        var folders = _.clone(this.get("folders"));
        folders.push(folder);
        this.set("folders", folders);
    },

    editFolder: function(folder) {
        function existingFolderFinder(f) {
            return f.id === id;
        }

        var id = folder.id;
        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");

        if (index !== -1) {
            folders.splice(index, 1, folder);
            this.set("folders", folders);
        }
    },

    deleteFolder: function(id) {
        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");
        folders.splice(index, 1);
        this.set("folders", folders);
    },

    getAsJSON: function() {
        return {
            "id": this.get("id"),
            "name": this.get("name"),
            "description": this.get("description"),
            "order": this.get("order"),
            "folders": this.get("folders"),
            "timestamp": this.get("timestamp"),
            "synced": this.get("synced"),
            "remote_id": this.get("remote_id")
        }
    },

    addRequestIdToFolder: function(id, requestId) {
        this.removeRequestIdFromOrderOrFolder(requestId);

        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");
        folders[index].order.push(requestId);
        this.set("folders", folders);
    },

    addRequestIdToOrder: function(requestId) {
        this.removeRequestIdFromOrderOrFolder(requestId);

        var order = _.clone(this.get("order"));
        order.push(requestId);
        this.set("order", order);
    },

    removeRequestIdFromOrderOrFolder: function(requestId) {
        var order = _.clone(this.get("order"));
        var indexInFolder;
        var folders = _.clone(this.get("folders"));

        var indexInOrder = order.indexOf(requestId);

        if (indexInOrder >= 0) {
            order.splice(indexInOrder, 1);
            this.set("order", order);
        }

        for(var i = 0; i < folders.length; i++) {
            indexInFolder = folders[i].order.indexOf(requestId);
            if(indexInFolder >= 0) {
                break;
            }
        }

        if(indexInFolder >= 0) {
            folders[i].order.splice(indexInFolder, 1);
            this.set("folders", folders);
        }
    },

    isUploaded: function() {
        return this.get("remote_id") !== 0;
    }
});
var PmCollectionRequest = Backbone.Model.extend({
    defaults: function() {
        return {
        };
    }
});
var PmCollections = Backbone.Collection.extend({
    originalCollectionId: "",
    toBeImportedCollection:{},

    model: PmCollection,

    isLoaded: false,
    initializedSyncing: false,
    syncFileTypeCollection: "collection",
    syncFileTypeCollectionRequest: "collection_request",

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    initialize: function() {
        this.loadAllCollections();

        pm.mediator.on("addDirectoryCollection", this.onAddDirectoryCollection, this);
        pm.mediator.on("addResponseToCollectionRequest", this.addResponseToCollectionRequest, this);
        pm.mediator.on("updateResponsesForCollectionRequest", this.updateResponsesForCollectionRequest, this);
        pm.mediator.on("deletedSharedCollection", this.onDeletedSharedCollection, this);
        pm.mediator.on("overwriteCollection", this.onOverwriteCollection, this);
        pm.mediator.on("uploadAllLocalCollections", this.onUploadAllLocalCollections, this);
    },

    onUploadAllLocalCollections: function() {
        console.log("Uploading all local collections");

        var uploaded = 0;
        var count = this.models.length;

        function callback() {
            console.log("Uploaded collection");
            uploaded++;

            if (uploaded === count) {
                console.log("Uploaded all collections");
                pm.mediator.trigger("refreshSharedCollections");
            }
        }

        for(var i = 0; i < this.models.length; i++) {
            this.uploadCollection(this.models[i].get("id"), false, false, callback);
        }
    },

    // Load all collections
    loadAllCollections:function () {
        var pmCollection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.getCollections(function (items) {
            var itemsLength = items.length;
            var loaded = 0;

            function onGetAllRequestsInCollection(collection, requests) {
                var c = new PmCollection(collection);
                c.setRequests(requests);
                pmCollection.add(c, {merge: true});

                loaded++;

                for(var i = 0; i < requests.length; i++) {
                    pm.mediator.trigger("addToURLCache", requests[i].url);
                }

                if (loaded === itemsLength) {
                    pmCollection.isLoaded = true;
                    pmCollection.trigger("startSync");
                }
            }

            if (itemsLength === 0) {
                pmCollection.isLoaded = true;
                pmCollection.trigger("startSync");
            }
            else {
                for (var i = 0; i < itemsLength; i++) {
                    var collection = items[i];
                    pm.indexedDB.getAllRequestsInCollection(collection, onGetAllRequestsInCollection);
                }
            }
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var pmCollection = this;
        var isLoaded = pmCollection.isLoaded;
        var initializedSyncing = pmCollection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            pmCollection.initializedSyncing = true;
            pmCollection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i;
        var j;
        var pmCollection = this;
        var collection;
        var requests;
        var request;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {

            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "collection") {
                    pmCollection.onRemoveSyncableFile(id);
                }
                else if (type === "collection_request") {
                    pmCollection.onRemoveSyncableFileForRequests(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                collection = this.models[i];
                synced = collection.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(collection.get("id"));
                }

                requests = collection.get("requests");

                for(j = 0; j < requests.length; j++) {
                    request = requests[j];

                    if (request.hasOwnProperty("synced")) {
                        if (!request.synced) {
                            this.addRequestToSyncableFilesystem(request.id);
                        }
                    }
                    else {
                        this.addRequestToSyncableFilesystem(request.id);
                    }
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var collection = JSON.parse(data);
        this.addCollectionFromSyncableFileSystem(collection);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteCollectionFromDataStore(id, false, function() {
        });
    },

    onReceivingSyncableFileDataForRequests: function(data) {
        var request = JSON.parse(data);
        this.addRequestFromSyncableFileSystem(request);
    },

    onRemoveSyncableFileForRequests: function(id) {
        this.deleteRequestFromDataStore(id, false, false, function() {
        });
    },

    onOverwriteCollection: function(collection) {
        console.log("Collection data is", collection);
        this.overwriteCollection(collection.id, collection);
    },

    onDeletedSharedCollection: function(collection) {
        console.log("Deleted shared collection", collection);
        var c;
        var pmCollection = this;

        for(var i = 0; i < this.models.length; i++) {
            var c = this.models[i];
            if (c.get("remote_id") === collection.remote_id) {
                c.set("remote_id", 0);
                pmCollection.updateCollectionInDataStore(c.getAsJSON(), true, function (c) {
                });
                break;
            }
        }
    },

    getAsSyncableFile: function(id) {
        var collection = this.get(id);
        var name = id + ".collection";
        var type = "collection";

        var data = JSON.stringify(collection.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    getRequestAsSyncableFile: function(id) {
        var request = this.getRequestById(id);
        var name = id + ".collection_request";
        var type = "collection_request";

        request.synced = true;

        var data = JSON.stringify(request);

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".collection";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    addRequestToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getRequestAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionRequestSyncStatus(id, true);
            }
        });
    },

    removeRequestFromSyncableFilesystem: function(id) {
        var name = id + ".collection_request";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    /* Base data store functions*/
    addCollectionToDataStore: function(collectionJSON, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.addCollection(collectionJSON, function (c) {
            var collection = new PmCollection(c);

            pmCollection.add(collection, {merge: true});

            if (sync) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    updateCollectionInDataStore: function(collectionJSON, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.updateCollection(collectionJSON, function (c) {
            var collection = pmCollection.get(c.id);
            pmCollection.add(collection, {merge: true});

            if (sync) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    deleteCollectionFromDataStore: function(id, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.deleteCollection(id, function () {
            pmCollection.remove(id);

            if (sync) {
                pmCollection.removeFromSyncableFilesystem(id);
            }

            pm.indexedDB.getAllRequestsForCollectionId(id, function(requests) {
                var deleted = 0;
                var requestCount = requests.length;
                var request;
                var i;

                if (requestCount > 0) {
                    for(i = 0; i < requestCount; i++) {
                        request = requests[i];

                        pm.indexedDB.deleteCollectionRequest(request.id, function (requestId) {
                            deleted++;

                            if (sync) {
                                pmCollection.removeRequestFromSyncableFilesystem(requestId);
                            }

                            if (deleted === requestCount) {
                                if (callback) {
                                    callback();
                                }
                            }
                        });
                    }
                }
                else {
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    },

    addRequestToDataStore: function(request, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.addCollectionRequest(request, function (req) {
            pm.mediator.trigger("addToURLCache", request.url);

            var collection = pmCollection.get(request.collectionId);

            if (collection) {
                collection.addRequest(request);
            }

            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(request);
            }
        });
    },

    updateRequestInDataStore: function(request, sync, callback) {
        var pmCollection = this;

        if (!request.name) {
            request.name = request.url;
        }

        pm.indexedDB.updateCollectionRequest(request, function (req) {
            var collection = pmCollection.get(request.collectionId);

            if (collection) {
                collection.updateRequest(request);
            }

            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(request);
            }
        });
    },

    deleteRequestFromDataStore: function(id, sync, syncCollection, callback) {
        var pmCollection = this;

        var request = this.getRequestById(id);

        var targetCollection;

        if (request) {
            targetCollection = this.get(request.collectionId);
        }

        pm.indexedDB.deleteCollectionRequest(id, function () {
            if (targetCollection) {
                targetCollection.deleteRequest(id);
                collection = targetCollection.getAsJSON();

                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                }

                if(callback) {
                    callback();
                }

                // This is called because the request would be deleted from "order"
                pmCollection.updateCollectionInDataStore(collection, syncCollection, function(c) {
                });
            }
            else {
                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                }

                if(callback) {
                    callback();
                }
            }
        });
    },

    /* Finish base data store functions*/

    // Get collection by folder ID
    getCollectionForFolderId: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return collection;
            }
        }

        return null;
    },

    // Add collection
    addCollection:function (name, description) {
        var pmCollection = this;

        var collection = {};

        if (name) {
            collection.id = guid();
            collection.name = name;
            collection.description = description;
            collection.order = [];
            collection.timestamp = new Date().getTime();

            pmCollection.addCollectionToDataStore(collection, true);
        }
    },

    addCollectionFromSyncableFileSystem:function (collection) {
        var pmCollection = this;

        pmCollection.addCollectionToDataStore(collection, false, function(c) {
            pm.indexedDB.getAllRequestsInCollection(c, function(c, requests) {
                var collectionModel = pmCollection.get(c.id);
                collectionModel.set("synced", true);
                collectionModel.setRequests(requests);
                pmCollection.trigger("updateCollection", collectionModel);
            });
        });
    },

    addRequestFromSyncableFileSystem: function(request) {
        var pmCollection = this;

        pmCollection.addRequestToDataStore(request, false, function(r) {
            var collectionModel = pmCollection.get(request.collectionId);
            var folderId;
            var folder;
            var requestLocation;

            if (collectionModel) {
                requestLocation = pmCollection.getRequestLocation(request.id);

                if (requestLocation.type === "collection") {
                    pmCollection.trigger("moveRequestToCollection", collectionModel, request);
                }
                else if (requestLocation.type === "folder") {
                    folder = pmCollection.getFolderById(requestLocation.folderId);
                    pmCollection.trigger("moveRequestToFolder", collectionModel, folder, request);
                }
            }

        });
    },

    // Add collection data to the database with new IDs
    addAsNewCollection:function(collection) {
        var pmCollection = this;
        var folders = [];
        var folder;
        var order;
        var j, count;
        var idHashTable = {};

        var dbCollection = _.clone(collection);
        dbCollection["requests"] = [];

        pmCollection.addCollectionToDataStore(dbCollection, true, function(c) {
            var collectionModel;
            var requests;
            var ordered;
            var i;
            var request;
            var newId;
            var currentId;
            var loc;

            collectionModel = pmCollection.get(c.id);

            // Shows successs message
            pmCollection.trigger("importCollection", {
                name:collection.name,
                action:"added"
            });

            requests = [];

            ordered = false;

            // Check against legacy collections which do not have an order
            if ("order" in collection) {
                ordered = true;
            }
            else {
                collection["order"] = [];
                collection.requests.sort(sortAlphabetical);
            }

            // Change ID of request - Also need to change collection order
            // and add request to indexedDB
            for (i = 0; i < collection.requests.length; i++) {
                request = collection.requests[i];
                request.collectionId = collection.id;

                var newId = guid();
                idHashTable[request.id] = newId;

                if (ordered) {
                    currentId = request.id;
                    loc = _.indexOf(collection["order"], currentId);
                    collection["order"][loc] = newId;
                }
                else {
                    collection["order"].push(newId);
                }

                request.id = newId;

                if ("responses" in request) {
                    for (j = 0, count = request["responses"].length; j < count; j++) {
                        request["responses"][j].id = guid();
                        request["responses"][j].collectionRequestId = newId;
                    }
                }

                requests.push(request);
            }

            // Change order inside folders with new IDs
            if ("folders" in collection) {
                folders = collection["folders"];

                for(i = 0; i < folders.length; i++) {
                    folders[i].id = guid();
                    order = folders[i].order;
                    for(j = 0; j < order.length; j++) {
                        order[j] = idHashTable[order[j]];
                    }

                }
            }

            collectionModel.setRequests(requests);
            collectionModel.set("folders", folders);
            collectionModel.set("order", collection["order"]);


            // Check for remote_id

            if (pm.user.isLoggedIn()) {
                var remoteId = pm.user.getRemoteIdForCollection(c.id);
                collectionModel.set("remote_id", remoteId);
            }

            // Add new collection to the database
            pmCollection.updateCollectionInDataStore(collectionModel.getAsJSON(), true, function() {
                var i;
                var request;

                for (i = 0; i < requests.length; i++) {
                    request = requests[i];
                    pmCollection.addRequestToDataStore(request, true, function(r) {
                    });
                }

                pmCollection.trigger("updateCollection", collectionModel);
            });
        });
    },

    updateCollectionOrder: function(id, order) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("order", order);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (collection) {
        });
    },

    updateCollectionSyncStatus: function(id, status) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("synced", status);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), false, function (collection) {
        });
    },

    updateCollectionMeta: function(id, name, description) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("name", name);
        targetCollection.set("description", description);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (collection) {
            pmCollection.trigger("updateCollectionMeta", targetCollection);
        });
    },

    deleteCollection:function (id, sync, callback) {
        this.deleteCollectionFromDataStore(id, true, function() {
        });
    },

    // Get collection data for file
    getCollectionDataForFile:function (id, callback) {
        pm.indexedDB.getCollection(id, function (data) {
            var c = data;
            var i;
            var name;
            var type;
            var filedata;

            pm.indexedDB.getAllRequestsInCollection(c, function (collection, requests) {
                for (i = 0, count = requests.length; i < count; i++) {
                    requests[i]["synced"] = false;
                }

                if (collection.hasOwnProperty("remote_id")) {
                    delete collection['remote_id'];
                }

                //Get all collection requests with one call
                collection['synced'] = false;
                collection['requests'] = requests;

                name = collection['name'] + ".json";
                type = "application/json";

                filedata = JSON.stringify(collection);
                callback(name, type, filedata);
            });
        });
    },

    // Save collection as a file
    saveCollection:function (id) {
        this.getCollectionDataForFile(id, function (name, type, filedata) {
            var filename = name + ".postman_collection";
            pm.filesystem.saveAndOpenFile(filename, filedata, type, function () {
                noty(
                    {
                        type:'success',
                        text:'Saved collection to disk',
                        layout:'topCenter',
                        timeout:750
                    });
            });
        });
    },

    // Upload collection
    uploadCollection:function (id, isPublic, refreshSharedCollections, callback) {
        var pmCollection = this;

        this.getCollectionDataForFile(id, function (name, type, filedata) {
            pm.api.uploadCollection(filedata, isPublic, function (data) {
                var link = data.link;

                if (callback) {
                    callback(link);
                }

                if (refreshSharedCollections) {
                    pm.mediator.trigger("refreshSharedCollections");
                }

                var collection = pmCollection.get(id);
                var remote_id = parseInt(data.id, 10);
                collection.set("remote_id", remote_id);
                pmCollection.updateCollectionInDataStore(collection.getAsJSON(), true, function (c) {
                });
            });
        });
    },

    // Overwrite collection
    overwriteCollection:function(originalCollectionId, collection) {
        this.deleteCollection(originalCollectionId);
        this.addAsNewCollection(collection);
    },

    // Duplicate collection
    duplicateCollection:function(collection) {
        this.addAsNewCollection(collection);
    },

    // Merge collection
    // Being used in IndexedDB bulk import
    mergeCollection: function(collection) {
        var pmCollection = this;

        //Update local collection
        var newCollection = {
            id: collection.id,
            name: collection.name,
            timestamp: collection.timestamp
        };

        var targetCollection;
        targetCollection = new PmCollection(newCollection);
        targetCollection.set("name", collection.name);

        if ("order" in collection) {
            targetCollection.set("order", collection.order);
        }

        if ("folders" in collection) {
            targetCollection.set("folders", collection.folders);
        }

        targetCollection.set("requests", collection.requests);

        pmCollection.add(targetCollection, {merge: true});

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (c) {
            var driveCollectionRequests = collection.requests;

            pm.indexedDB.getAllRequestsInCollection(collection, function(collection, oldCollectionRequests) {
                var updatedRequests = [];
                var deletedRequests = [];
                var newRequests = [];
                var finalRequests = [];
                var i = 0;
                var driveRequest;
                var existingRequest;
                var sizeOldRequests;
                var loc;
                var j;
                var sizeUpdatedRequests;
                var sizeNewRequests;
                var sizeDeletedRequests;
                var size = driveCollectionRequests.length;

                function existingRequestFinder(r) {
                    return driveRequest.id === r.id;
                }

                for (i = 0; i < size; i++) {
                    driveRequest = driveCollectionRequests[i];
                    existingRequest = _.find(oldCollectionRequests, existingRequestFinder);

                    if (existingRequest) {
                        updatedRequests.push(driveRequest);

                        sizeOldRequests = oldCollectionRequests.length;
                        loc = -1;
                        for (j = 0; j < sizeOldRequests; j++) {
                            if (oldCollectionRequests[j].id === existingRequest.id) {
                                loc = j;
                                break;
                            }
                        }

                        if (loc >= 0) {
                            oldCollectionRequests.splice(loc, 1);
                        }
                    }
                    else {
                        newRequests.push(driveRequest);
                    }
                }

                deletedRequests = oldCollectionRequests;

                sizeUpdatedRequests = updatedRequests.length;
                for(i = 0; i < sizeUpdatedRequests; i++) {
                    pmCollection.updateRequestInDataStore(updatedRequests[i], true);
                }

                sizeNewRequests = newRequests.length;
                for(i = 0; i < sizeNewRequests; i++) {
                    pmCollection.addRequestToDataStore(newRequests[i], true);
                }

                sizeDeletedRequests = deletedRequests.length;
                for(i = 0; i < sizeDeletedRequests; i++) {
                    pmCollection.deleteRequestFromDataStore(deletedRequests[i], true);
                }

                pmCollection.trigger("updateCollection", targetCollection);
            });
        });
    },

    // Merge multiple collections. Used in bulk data import
    mergeCollections: function (collections) {
        var pmCollection = this;

        var size = collections.length;
        for(var i = 0; i < size; i++) {
            var collection = collections[i];
            pmCollection.mergeCollection(collection, true);
        }
    },

    // Import collection
    importCollectionData:function (collection) {
        var originalCollection = this.findWhere({name: collection.name});

        if (originalCollection) {
            this.originalCollectionId = originalCollection.id;
            this.toBeImportedCollection = collection;
            this.trigger("overwriteCollection", collection);
        }
        else {
            this.addAsNewCollection(collection);
        }
    },

    onAddDirectoryCollection: function(collection) {
        collection.id = guid();
        this.addAsNewCollection(collection);
    },

    // Import multiple collections
    importCollections:function (files) {
        var pmCollection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        var collection = JSON.parse(data);
                        collection.id = guid();
                        pmCollection.importCollectionData(collection);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedCollectionImport");
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    importCollectionFromUrl:function (url) {
        var pmCollection = this;

        $.get(url, function (data) {
            try {
                var collection = data;
                collection.id = guid();
                pmCollection.importCollectionData(collection);
            }
            catch(e) {
                pm.mediator.trigger("failedCollectionImport");
            }

        });
    },

    // Get request by ID
    getRequestById: function(id) {
        function existingRequestFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.models.length; i++) {
            var collection = this.models[i];

            var requests = collection.get("requests");

            var request = _.find(requests, existingRequestFinder);
            if (request) {
                return request;
            }
        }

        return null;
    },

    getRequestLocation: function(id) {
        var i;
        var collection;
        var indexCollection;
        var folders;
        var indexFolder;

        for(var i = 0; i < this.models.length; i++) {
            collection = this.models[i];

            indexCollection = _.indexOf(collection.get("order"), id);

            if (indexCollection >= 0) {
                return {
                    "type": "collection",
                    "collectionId": collection.get("id")
                };
            }
            else {
                folders = collection.get("folders");
                for(j = 0; j < folders.length; j++) {
                    indexFolder = _.indexOf(folders[j].order, id);

                    if (indexFolder >= 0) {
                        return {
                            "type": "folder",
                            "folderId": folders[j].id,
                            "collectionId": collection.get("id")
                        };
                    }
                }
            }
        }

        return {
            "type": "not_found"
        };
    },

    // Load collection request in the editor
    loadCollectionRequest:function (id) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (request) {
            request.isFromCollection = true;
            request.collectionRequestId = id;
            pm.mediator.trigger("loadRequest", request, true);
            pmCollection.trigger("selectedCollectionRequest", request);
        });
    },

    // Add request to collection
    addRequestToCollection:function (collectionRequest, collection) {
        var pmCollection = this;

        if (collection.name) {
            collection.requests = [];
            collection.order = [collectionRequest.id];
            collection.timestamp = new Date().getTime();

            pmCollection.addCollectionToDataStore(collection, true, function(newCollection) {
                collectionRequest.collectionId = newCollection.id;

                pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                    pmCollection.trigger("addCollectionRequest", req);
                    pmCollection.loadCollectionRequest(req.id);
                });
            });
        }
        else {
            collectionRequest.collectionId = collection.id;

            var targetCollection = pmCollection.get(collection.id);
            targetCollection.addRequestIdToOrder(collectionRequest.id);


            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
                pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                    pmCollection.trigger("addCollectionRequest", req);
                    pmCollection.loadCollectionRequest(req.id);
                });
            });
        }

        this.trigger("updateCollectionRequest", collectionRequest);
        pm.mediator.trigger("updateCollectionRequest", collectionRequest);
    },


    // Add request to folder
    addRequestToFolder: function(collectionRequest, collectionId, folderId) {
        var pmCollection = this;

        var collection = this.get(collectionId);
        collectionRequest.collectionId = collectionId;
        collection.addRequestIdToOrder(collectionRequest.id);

        pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
            pmCollection.moveRequestToFolder(req.id, folderId);
            pmCollection.loadCollectionRequest(req.id);
        });
    },


    addResponseToCollectionRequest: function(collectionRequestId, response) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var responses;

            if (collectionRequest.hasOwnProperty("responses")) {
                responses = collectionRequest["responses"];
            }
            else {
                responses = [];
            }

            responses.push(response);

            pmCollection.updateRequestInDataStore(collectionRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateResponsesForCollectionRequest: function(collectionRequestId, responses) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var c = _.clone(collectionRequest);
            c.responses = responses;
            pmCollection.updateRequestInDataStore(c, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    // Update collection request
    updateCollectionRequest:function (collectionRequest) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequest.id, function (req) {
            collectionRequest.name = req.name;
            collectionRequest.description = req.description;
            collectionRequest.collectionId = req.collectionId;
            collectionRequest.responses = req.responses;

            pmCollection.updateRequestInDataStore(collectionRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateCollectionRequestMeta: function(id, name, description) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.name = name;
            req.description = description;

            pmCollection.updateRequestInDataStore(req, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateCollectionRequestSyncStatus: function(id, status) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.synced = status;

            pmCollection.updateRequestInDataStore(req, false, function(request) {
            });
        });
    },

    // Delete collection request
    deleteCollectionRequest:function (id, callback) {
        var pmCollection = this;

        pmCollection.deleteRequestFromDataStore(id, true, true, function() {
            pmCollection.trigger("removeCollectionRequest", id);

            if (callback) {
                callback();
            }
        });
    },

    moveRequestToFolder: function(requestId, targetFolderId) {
        var pmCollection = this;
        var request = _.clone(this.getRequestById(requestId));
        var folder = this.getFolderById(targetFolderId);
        var targetCollection = this.getCollectionForFolderId(targetFolderId);

        if(targetCollection.id === request.collectionId) {
            targetCollection.addRequestIdToFolder(folder.id, request.id);
            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
                pmCollection.trigger("moveRequestToFolder", targetCollection, folder, request);
            });
        }
        else {
            // Different collection
            pmCollection.deleteCollectionRequest(requestId, function() {
                request.id = guid();
                request.collectionId = targetCollection.get("id");

                targetCollection.addRequestIdToOrder(request.id);

                pmCollection.addRequestToDataStore(request, true, function(req) {
                    targetCollection.addRequestIdToFolder(folder.id, req.id);
                    var collection = targetCollection.getAsJSON();
                    pmCollection.updateCollectionInDataStore(collection, true, function(c) {
                        pmCollection.trigger("moveRequestToFolder", targetCollection, folder, request);
                    });
                });
            });

        }
    },

    moveRequestToCollection: function(requestId, targetCollectionId) {
        var pmCollection = this;
        var targetCollection = this.get(targetCollectionId);
        var request = _.clone(this.getRequestById(requestId));

        if(targetCollectionId === request.collectionId) {
            targetCollection.addRequestIdToOrder(request.id);

            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function(c) {
                pmCollection.trigger("moveRequestToCollection", targetCollection, request);
            });
        }
        else {
            var oldCollection = pmCollection.get(request.collectionId);

            pmCollection.deleteCollectionRequest(requestId, function() {
                request.id = guid();
                request.collectionId = targetCollectionId;

                targetCollection.addRequestIdToOrder(request.id);

                pmCollection.addRequestToDataStore(request, true, function(req) {
                    pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function(c) {
                        pmCollection.trigger("moveRequestToCollection", targetCollection, request);
                    });
                });
            });
        }
    },

    // Get folder by ID
    getFolderById: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return folder;
            }
        }

        return null;
    },

    addFolder: function(parentId, folderName) {
        var collection = this.get(parentId);

        var newFolder = {
            "id": guid(),
            "name": folderName,
            "description": "",
            "order": []
        };

        collection.addFolder(newFolder);
        this.trigger("addFolder", collection, newFolder);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    updateFolderOrder: function(collectionId, folderId, order) {
        var folder = this.getFolderById(folderId);
        folder.order = order;
        var collection = this.get(collectionId);
        collection.editFolder(folder);

        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    updateFolderMeta: function(id, name) {
        var folder = this.getFolderById(id);
        folder.name = name;
        var collection = this.getCollectionForFolderId(id);
        collection.editFolder(folder);
        this.trigger("updateFolder", collection, folder);

        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    deleteFolder: function(id) {
        var folder = this.getFolderById(id);
        var folderRequestsIds = _.clone(folder.order);
        var i;
        var collection;

        for(i = 0; i < folderRequestsIds.length; i++) {
            this.deleteRequestFromDataStore(folderRequestsIds[i], true, false);
        }

        collection = this.getCollectionForFolderId(id);
        collection.deleteFolder(id);

        this.trigger("deleteFolder", collection, id);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    filter: function(term) {
        term = term.toLowerCase();
        var collections = this.toJSON();
        var collectionCount = collections.length;
        var filteredCollections = [];
        var name;
        var requests;
        var requestsCount;
        var i, j, k, c, r, f;
        var folders;
        var folderOrder;
        var visibleRequestHash = {};

        for(i = 0; i < collectionCount; i++) {
            c = {
                id: collections[i].id,
                name: collections[i].name,
                requests: [],
                folders: [],
                toShow: false,
            };

            name = collections[i].name.toLowerCase();

            if (name.search(term) >= 0) {
                c.toShow = true;
            }

            requests = collections[i].requests;

            if (requests) {
                requestsCount = requests.length;

                for(j = 0; j < requestsCount; j++) {
                    r = {
                        id: requests[j].id,
                        name: requests[j].name,
                        toShow: false
                    };

                    name = requests[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        r.toShow = true;
                        c.toShow = true;
                        visibleRequestHash[r.id] = true;
                    }
                    else {
                        r.toShow = false;
                        visibleRequestHash[r.id] = false;
                    }

                    c.requests.push(r);
                }
            }

            if("folders" in collections[i]) {
                folders = collections[i].folders;
                for (j = 0; j < folders.length; j++) {
                    f = {
                        id: folders[j].id,
                        name: folders[j].name,
                        toShow: false
                    };

                    name = folders[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        f.toShow = true;
                        c.toShow = true;
                    }

                    folderOrder = folders[j].order;

                    // Check if any requests are to be shown
                    for(k = 0; k < folderOrder.length; k++) {
                        if (visibleRequestHash[folderOrder[k]] === true) {
                            f.toShow = true;
                            c.toShow = true;
                            break;
                        }
                    }

                    c.folders.push(f);
                }
            }

            filteredCollections.push(c);
        }

        this.trigger("filter", filteredCollections);
        return filteredCollections;
    },

    revert: function() {
        this.trigger("revertFilter");
    }
});
var AddCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        $('#form-new-collection').submit(function () {
            var name = $('#new-collection-blank').val();
            var description = view.editor.getValue();
            model.addCollection(name, description);
            $('#new-collection-blank').val("");
            $('#modal-new-collection').modal('hide');
            return false;
        });

        $('#modal-new-collection .btn-primary').click(function () {
            var name = $('#new-collection-blank').val();
            var description = view.editor.getValue();
            model.addCollection(name, description);
            $('#new-collection-blank').val("");
            $('#modal-new-collection').modal('hide');
            return false;
        });

        $("#modal-new-collection").on("shown", function () {
            $("#new-collection-blank").focus();
            pm.app.trigger("modalOpen", "#modal-new-collection");

            if (!view.editor) {
                view.initializeEditor();
            }
        });

        $("#modal-new-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = CodeMirror.fromTextArea(document.getElementById("new-collection-description"), {
            mode: 'markdown',
            theme: "eclipse",
            lineWrapping: true,
            lineNumbers:true,
            extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
        });

        pm.addCollectionEditor = this.editor;

        this.editor.refresh();
    }
});

var AddCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("add", this.onChanged, this);
        model.on("remove", this.onChanged, this);
        model.on("change", this.onChanged, this);

        model.on("updateCollection", this.onChanged, this);
        model.on("updateCollectionMeta", this.onChanged, this);

        model.on("addFolder", this.onChanged, this);
        model.on("updateFolder", this.onChanged, this);
        model.on("deleteFolder", this.onChanged, this);

        var view = this;

        $('#form-add-to-collection').submit(function () {
            _.bind(this.addRequestToCollection, view)();
            $('#modal-add-to-collection').modal('hide');
            $('#new-collection').val("");
        });

        $('#modal-add-to-collection .btn-primary').click(function () {
            _.bind(view.addRequestToCollection, view)();
            $('#modal-add-to-collection').modal('hide');
            $('#new-collection').val("");
        });

        $("#modal-add-to-collection").on("shown", function () {
            $("#select-collection").focus();
            pm.app.trigger("modalOpen", "#modal-add-to-collection");

            if (!view.editor) {
                view.initializeEditor();
            }
        });

        $("#modal-add-to-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        //Initialize select-collection options

        $(document).bind('keydown', 'a', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-add-to-collection').modal({
                keyboard:true,
                backdrop:"static"
            });

            $('#modal-add-to-collection').modal('show');
            return false;
        });
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = CodeMirror.fromTextArea(document.getElementById("new-request-description"), {
            mode: 'markdown',
            theme: "eclipse",
            lineWrapping: true,
            lineNumbers:true,
            extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
        });

        //TODO Fix this
        pm.addRequestToCollectionEditor = this.editor;

        this.editor.refresh();
    },

    add: function(model, pmCollection) {
        $('#select-collection').append(Handlebars.templates.item_collection_selector_list(model.toJSON()));
    },

    remove: function(model, pmCollection) {
        var collection = model.toJSON();
        $('#select-collection option[value="' + collection.id + '"]').remove();
    },

    onChanged: function() {
        var items = _.clone(this.model.toJSON());
        var folders;

        for(var i = 0; i < items.length; i++) {
            if("folders" in items[i]) {
                folders = items[i].folders;

                folders.sort(sortAlphabetical);

                for(var j = 0; j < folders.length; j++) {
                    folders[j].collection_name = items[i].name;
                    folders[j].collection_id = items[i].id;
                }
            }
        }

        $('#select-collection').html("<option>Select</option>");
        $('#select-collection').append(Handlebars.templates.collection_selector_list({items: this.model.toJSON()}));
    },

    addRequestToCollection: function() {
        var selectValue = $("#select-collection").val();
        var $option = $("#select-collection option[value='" + selectValue + "']");
        var targetType = $option.attr("data-type");

        var collectionId;
        var folderId;

        if (targetType === "collection") {
            collectionId = $option.attr("data-collection-id");
        }
        else if (targetType === "folder") {
            collectionId = $option.attr("data-collection-id");
            folderId = $option.attr("data-folder-id");
        }

        var newCollection = $("#new-collection").val();

        var collection = {};

        if (newCollection) {
            targetType = "collection";
            collection.id = guid();
            collection.name = newCollection;
        }
        else {
            collection.id = collectionId;
        }

        var newRequestName = $('#new-request-name').val();
        var newRequestDescription = this.editor.getValue();

        var model = this.model;

        pm.mediator.trigger("getRequest", function(request) {
            var body = request.get("body");

            var url = request.get("url");
            if (newRequestName === "") {
                newRequestName = url;
            }

            // TODO Get some of this from getAsJson
            var collectionRequest = {
                id: guid(),
                headers: request.getPackedHeaders(),
                url: url,
                method: request.get("method"),
                data: body.get("dataAsObjects"),
                dataMode: body.get("dataMode"),
                name: newRequestName,
                description: newRequestDescription,
                descriptionFormat: "html",
                time: new Date().getTime(),
                version: 2,
                responses: []
            };

            if (targetType === "folder") {
                model.addRequestToFolder(collectionRequest, collectionId, folderId);
            }
            else {
                model.addRequestToCollection(collectionRequest, collection);
            }
        });
    }
});
var AddFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("showAddFolderModal", this.render, this);

        $('#add-folder').submit(function () {
            var parentId = $('#add-folder-parent-id').val();
            var name = $('#add-folder-name').val();
            model.addFolder(parentId, name);
            $('#add-folder-name').val("");
            $('#modal-add-folder').modal('hide');
            return false;
        });

        $('#modal-add-folder .btn-primary').click(function () {
            var parentId = $('#add-folder-parent-id').val();
            var name = $('#add-folder-name').val();
            model.addFolder(parentId, name);
            $('#add-folder-name').val("");
            $('#modal-add-folder').modal('hide');
            return false;
        });

        $("#modal-add-folder").on("shown", function () {
            $("#add-folder-name").focus();
            pm.app.trigger("modalOpen", "#modal-add-folder");
        });

        $("#modal-add-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    render: function(c) {
        $("#add-folder-header").html("Add folder inside " + c.get("name"));
        $("#add-folder-parent-id").val(c.get("id"));
        $('#modal-add-folder').modal('show');
    }
});

var CollectionSidebar = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("add", this.renderOneCollection, this);
        model.on("remove", this.removeOneCollection, this);

        model.on("updateCollection", this.renderOneCollection, this);
        model.on("updateCollectionMeta", this.updateCollectionMeta, this);

        model.on("addCollectionRequest", this.addCollectionRequest, this);
        model.on("selectedCollectionRequest", this.selectedCollectionRequest, this);
        model.on("removeCollectionRequest", this.removeCollectionRequest, this);
        model.on("updateCollectionRequest", this.updateCollectionRequest, this);

        model.on("moveRequestToCollection", this.onMoveRequestToCollection, this);
        model.on("moveRequestToFolder", this.onMoveRequestToFolder, this);

        model.on("addFolder", this.onAddFolder, this);
        model.on("updateFolder", this.onUpdateFolder, this);
        model.on("deleteFolder", this.onDeleteFolder, this);

        model.on("filter", this.onFilter, this);
        model.on("revertFilter", this.onRevertFilter, this);

        $('#collection-items').html("");
        $('#collection-items').append(Handlebars.templates.message_no_collection({}));

        var $collection_items = $('#collection-items');

        $collection_items.on("mouseenter", ".sidebar-collection .sidebar-collection-head", function () {
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".sidebar-collection .sidebar-collection-head", function () {
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'none');
        });

        $collection_items.on("mouseenter", ".folder .folder-head", function () {
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".folder .folder-head", function () {
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'none');
        });

        $collection_items.on("click", ".sidebar-collection-head-name", function () {
            var id = $(this).attr('data-id');
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".folder-head-name", function () {
            var id = $(this).attr('data-id');
            view.toggleSubRequestList(id);
        });

        $collection_items.on("click", ".collection-head-actions .label", function () {
            var id = $(this).parent().parent().parent().attr('data-id');
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".collection-actions-add-folder", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showAddFolderModal", c);
        });

        $collection_items.on("click", ".collection-actions-edit", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showEditModal", c);
        });

        $collection_items.on("click", ".collection-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            $('#modal-delete-collection-yes').attr('data-id', id);
            $('#modal-delete-collection-name').html(name);
        });

        $collection_items.on("click", ".folder-actions-edit", function () {
            var id = $(this).attr('data-id');
            var folder = model.getFolderById(id);
            console.log("trigger action", folder);
            model.trigger("showEditFolderModal", folder);
        });

        $collection_items.on("click", ".folder-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            $('#modal-delete-folder-yes').attr('data-id', id);
            $('#modal-delete-folder-name').html(name);
        });

        $collection_items.on("click", ".collection-actions-download", function () {
            var id = $(this).attr('data-id');
            model.trigger("shareCollectionModal", id);
        });

        $('#collection-items').on("mouseenter", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#collection-items').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });

        $collection_items.on("click", ".request-actions-load", function () {
            var id = $(this).attr('data-id');
            model.loadCollectionRequest(id);
        });

        $collection_items.on("click", ".request-actions-delete", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);
            console.log("Request is ", request);
            model.trigger("deleteCollectionRequest", request);
        });

        $collection_items.on("click", ".request-actions-edit", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);

            model.trigger("editCollectionRequest", request);
        });
    },

    selectedCollectionRequest: function(request) {
        var id = request.id;
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + id).addClass('sidebar-collection-request-active');
    },

    addRequestListeners:function () {
        $('#sidebar-sections').on("mouseenter", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#sidebar-sections').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });
    },

    emptyCollectionInSidebar:function (id) {
        $('#collection-requests-' + id).html("");
    },

    removeOneCollection:function (model, pmCollection) {
        var collection = model.toJSON();
        $('#collection-' + collection.id).remove();

        if(pmCollection.length === 0) {
            $('#sidebar-section-collections .empty-message').css("display", "block");
        }
    },

    organizeRequestsInFolders: function(collection) {
        if(!("folders" in collection)) {
            return collection;
        }

        if(!("requests" in collection)) {
            return collection;
        }

        var folders = _.clone(collection["folders"]);
        var requests = _.clone(collection["requests"]);

        var folderCount = folders.length;
        var folder;
        var folderOrder;
        var id;
        var existsInOrder;
        var folderRequests;

        var newFolders = [];

        for(var i = 0; i < folderCount; i++) {
            folder = _.clone(folders[i]);
            folderOrder = folder.order;
            folderRequests = [];

            for(var j = 0; j < folderOrder.length; j++) {
                id = folderOrder[j];

                var index = arrayObjectIndexOf(requests, id, "id");

                if(index >= 0) {
                    folderRequests.push(requests[index]);
                    requests.splice(index, 1);
                }
            }

            folder["requests"] = this.orderRequests(folderRequests, folderOrder);
            newFolders.push(folder);
        }

        collection.folders = newFolders;
        collection.requests = requests;

        collection.requests = this.orderRequests(collection.requests, collection.order);

        return collection;
    },

    orderRequests: function(inRequests, order) {
        var requests = _.clone(inRequests);

        function requestFinder(request) {
            return request.id === order[j];
        }

        if (order.length === 0) {
            requests.sort(sortAlphabetical);
        }
        else {
            var orderedRequests = [];
            for (var j = 0, len = order.length; j < len; j++) {
                var element = _.find(requests, requestFinder);
                if(element) {
                    orderedRequests.push(element);
                }
            }

            requests = orderedRequests;
        }

        return requests;
    },

    renderOneCollection:function (model, pmCollection) {
        var folders = [];
        var wasOpen = false;
        var collection = _.clone(model.toJSON());

        collection = this.organizeRequestsInFolders(collection);

        $('#sidebar-section-collections .empty-message').css("display", "none");

        var currentEl = $("#collection-" + collection.id + " .sidebar-collection-head-dt");
        if (currentEl.length) {
            var currentClass = currentEl.attr("class");
            wasOpen = currentClass.search("open") >= 0;
        }

        this.renderCollectionContainerInSidebar(collection);
        this.renderFoldersInSidebar(collection);

        var requests = collection.requests;
        var targetElement = "#collection-requests-" + collection.id;

        this.renderRequestsInSidebar(targetElement, requests);

        if (wasOpen) {
            this.openCollection(collection.id, false);
        }
    },

    renderCollectionContainerInSidebar: function(collection) {
        var currentEl = $('#collection-' + collection.id);

        var collectionSidebarListPosition = -1;
        var insertionType;
        var insertTarget;

        var model = this.model;
        var view = this;
        var collections = this.model.toJSON();

        collectionSidebarListPosition = arrayObjectIndexOf(collections, collection.id, "id");

        if (currentEl.length) {
            if (collectionSidebarListPosition === 0) {
                if(collections[collectionSidebarListPosition + 1]) {
                    insertionType = "before";
                    insertTarget = $('#collection-' + collections[collectionSidebarListPosition + 1].id);
                }
                else {
                    insertionType = "none";
                }
            }
            else {
                insertionType = "after";
                insertTarget = $('#collection-' + collections[collectionSidebarListPosition - 1].id);
            }

            currentEl.remove();
        }
        else {
            //New element
            if (collectionSidebarListPosition === collections.length - 1) {
                insertionType = "append";
            }
            else {
                var nextCollectionId = collections[collectionSidebarListPosition + 1].id;
                insertTarget = $("#collection-" + nextCollectionId);

                if (insertTarget.length > 0) {
                    insertionType = "before";
                }
                else {
                    insertionType = "append";
                }
            }
        }

        if (insertionType) {
            if (insertionType === "after") {
                $(insertTarget).after(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else if (insertionType === "before") {
                $(insertTarget).before(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else {
                $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
            }
        } else {
            $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
        }

        // TODO Need a better way to initialize these tooltips
        $('a[rel="tooltip"]').tooltip();

        $('#collection-' + collection.id + " .sidebar-collection-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnCollection, this)
        });
    },

    renderFoldersInSidebar: function(collection) {
        var folders;
        var targetElement;
        var folderContainer;
        var i;

        if("folders" in collection) {
            folders = collection["folders"];
            folders.sort(sortAlphabetical);

            folderContainer = "#folders-" + collection.id;
            $(folderContainer).append(Handlebars.templates.collection_sidebar_folders({"folders": folders}));

            $('#collection-' + collection.id + " .folder-head").droppable({
                accept: ".sidebar-collection-request",
                hoverClass: "ui-state-hover",
                drop: _.bind(this.handleRequestDropOnFolder, this)
            });

            for(i = 0; i < folders.length; i++) {
                targetElement = "#folder-requests-" + folders[i].id;
                this.renderRequestsInSidebar(targetElement, folders[i].requests);
            }
        }
    },

    renderRequestsInSidebar: function(targetElement, requests) {
        if (!requests) return;

        var view = this;

        var count = requests.length;
        var requestTargetElement;

        if (count > 0) {
            for (var i = 0; i < count; i++) {
                if (typeof requests[i].name === "undefined") {
                    requests[i].name = requests[i].url;
                }
                requests[i].name = limitStringLineWidth(requests[i].name, 40);
                requestTargetElement = "#sidebar-request-" + requests[i].id;
                $(requestTargetElement).draggable({});
            }

            $(targetElement).html("");

            $(targetElement).append(Handlebars.templates.collection_sidebar_requests({"items":requests}));
            $(targetElement).sortable({
                update: _.bind(view.onUpdateSortableCollectionRequestList, view)
            });
        }
    },

    onUpdateSortableCollectionRequestList: function(event, ui) {
        var pmCollection = this.model;

        var isInFolder = $(event.target).attr("class").search("folder-requests") >= 0;

        if(isInFolder) {
            var folder_id = $(event.target).attr("data-id");
            var target_parent = $(event.target).parent(".folder-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            for (var i = 0; i < count; i++) {
                var li_id = $(collection_requests[i]).attr("id");
                var request_id = $("#" + li_id + " .request").attr("data-id");
                order.push(request_id);
            }

            pmCollection.updateFolderOrder(collection_id, folder_id, order);
        }
        else {
            console.log("Inside collection list");
            var target_parent = $(event.target).parents(".sidebar-collection-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            for (var i = 0; i < count; i++) {
                var li_id = $(collection_requests[i]).attr("id");
                var request_id = $("#" + li_id + " .request").attr("data-id");
                order.push(request_id);
            }

            pmCollection.updateCollectionOrder(collection_id, order);
        }
    },

    updateCollectionMeta: function(collection) {
        var id = collection.get("id");

        var currentClass = $("#collection-" + id + " .sidebar-collection-head-dt").attr("class");
        var collectionHeadHtml = '<span class="sidebar-collection-head-dt"><img src="img/dt.png"/></span>';
        collectionHeadHtml += " " + collection.get("name");

        $('#collection-' + collection.id + " .sidebar-collection-head-name").html(collectionHeadHtml);
        $('#select-collection option[value="' + collection.get("id") + '"]').html(collection.get("name"));

        if(currentClass.indexOf("open") >= 0) {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
        }
    },

    onAddFolder: function(collection, folder) {
        var folderContainer = "#folders-" + collection.id;
        $(folderContainer).append(Handlebars.templates.item_collection_folder(folder));

        $('#collection-' + collection.id + " .folder-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnFolder, this)
        });
    },

    onUpdateFolder: function(collection, folder) {
        console.log("onUpdateFolder", collection, folder);
        $("#folder-" + folder.id + " .folder-head-name .name").html(folder.name);
    },

    onDeleteFolder: function(collection, id) {
        $("#folder-" + id).remove();
    },

    onMoveRequestToFolder: function(targetCollection, folder, request) {
        this.removeCollectionRequest(request.id);
        var targetElement = $("#folder-requests-" + folder.id);
        this.addRequestToFolder(folder, request);
    },

    onMoveRequestToCollection: function(targetCollection, request) {
        this.removeCollectionRequest(request.id);

        var targetElement = "#collection-requests-" + request.collectionId;
        this.addRequestToList(targetElement, request);
    },

    addRequestToList: function(targetElement, request) {
        var view = this;

        $('#sidebar-request-' + request.id).draggable({});

        if (typeof request.name === "undefined") {
            request.name = request.url;
        }

        request.name = limitStringLineWidth(request.name, 43);

        $(targetElement).append(Handlebars.templates.item_collection_sidebar_request(request));

        request.isFromCollection = true;
        request.collectionRequestId = request.id;

        $(targetElement).sortable({
            update: _.bind(view.onUpdateSortableCollectionRequestList, view)
        });

        $('#collection-' + request.collectionId + " .sidebar-collection-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnCollection, this)
        });
    },

    addRequestToFolder: function(folder, request) {
        var targetElement = "#folder-requests-" + folder.id;
        this.addRequestToList(targetElement, request);
    },

    addCollectionRequest: function(request) {
        var targetElement = "#collection-requests-" + request.collectionId;

        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + request.id).addClass('sidebar-collection-request-active');

        this.addRequestToList(targetElement, request);
        this.openCollection(request.collectionId);
        pm.mediator.trigger("loadRequest", request);
    },

    removeCollectionRequest: function(id) {
        $('#sidebar-request-' + id).remove();
    },

    updateCollectionRequest: function(request) {
        var requestName;
        requestName = limitStringLineWidth(request.name, 43);
        $('#sidebar-request-' + request.id + " .request .request-name").html(requestName);
        $('#sidebar-request-' + request.id + " .request .label").html(request.method);
        $('#sidebar-request-' + request.id + " .request .label").addClass('label-method-' + request.method);

        noty({
            type:'success',
            text:'Saved request',
            layout:'topCenter',
            timeout:750
        });
    },

    openCollection:function (id, toAnimate) {
        var target = "#collection-children-" + id;
        $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
        $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

        if ($(target).css("display") === "none") {
            if(toAnimate === false) {
                $(target).css("display", "block");
            }
            else {
                $(target).slideDown(100, function () {
                });
            }
        }
    },

    toggleRequestList:function (id) {
        var target = "#collection-children-" + id;
        if ($(target).css("display") === "none") {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-open");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    toggleSubRequestList: function(id) {
        var target = "#folder-requests-" + id;

        if ($(target).css("display") === "none") {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-close");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-open");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    handleRequestDropOnCollection: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetCollectionId = $($(event.target).find('.sidebar-collection-head-name')[0]).attr('data-id');
        this.model.moveRequestToCollection(requestId, targetCollectionId);
    },

    handleRequestDropOnFolder: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetFolderId = $($(event.target).find('.folder-head-name')[0]).attr('data-id');
        console.log(requestId, targetFolderId);
        this.model.moveRequestToFolder(requestId, targetFolderId);
    },

    onFilter: function(filteredCollectionItems) {
        var collectionsCount = filteredCollectionItems.length;
        console.log(filteredCollectionItems);

        for(var i = 0; i < collectionsCount; i++) {
            var c = filteredCollectionItems[i];
            var collectionDomId = "#collection-" + c.id;
            var collectionFoldersDomId = "#folders-" + c.id;
            var collectionChildrenDomId = "#collection-children-" + c.id;
            var dtDomId = "#collection-" + c.id + " .sidebar-collection-head-dt";

            if(c.toShow) {
                $(collectionDomId).css("display", "block");
                $(collectionChildrenDomId).css("display", "block");

                $(dtDomId).removeClass("disclosure-triangle-close");
                $(dtDomId).addClass("disclosure-triangle-open");

                var requests = c.requests;

                if(requests) {
                    var requestsCount = requests.length;
                    for(var j = 0; j < requestsCount; j++) {
                        var r = requests[j];
                        var requestDomId = "#sidebar-request-" + r.id;
                        if(r.toShow) {
                            $(requestDomId).css("display", "block");
                        }
                        else {
                            $(requestDomId).css("display", "none");
                        }
                    }
                }

                if("folders" in c) {
                    var folders = c["folders"];
                    for(var k = 0; k < folders.length; k++) {
                        var folderDomId = "#folder-" + folders[k].id;
                        var folderRequestsDomId = folderDomId + " .folder-requests";
                        var dtFolderDomId = folderDomId + " .folder-head .folder-head-dt";

                        if(folders[k].toShow) {
                            $(folderDomId).css("display", "block");
                            $(folderRequestsDomId).css("display", "block");
                            $(dtFolderDomId).removeClass("disclosure-triangle-close");
                            $(dtFolderDomId).addClass("disclosure-triangle-open");
                        }
                        else {
                            $(folderDomId).css("display", "none");
                            $(folderRequestsDomId).css("display", "none");
                            $(dtFolderDomId).addClass("disclosure-triangle-close");
                            $(dtFolderDomId).removeClass("disclosure-triangle-open");
                        }
                    }
                }
            }
            else {
                $(collectionDomId).css("display", "none");
                $(collectionChildrenDomId).css("display", "none");
                $(dtDomId).removeClass("disclosure-triangle-open");
                $(dtDomId).addClass("disclosure-triangle-close");
            }
        }
    },

    onRevertFilter: function() {
        $(".sidebar-collection").css("display", "block");
        $(".folder").css("display", "block");
        $(".sidebar-collection-request").css("display", "block");
    }
});
var DeleteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        $('#modal-delete-collection-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteCollection(id);
        });

        $("#modal-delete-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-collection");
        });

        $("#modal-delete-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    render: function() {

    }
});

var DeleteCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("deleteCollectionRequest", this.render, this);

        $('#modal-delete-collection-request-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteCollectionRequest(id);
        });
    },

    render: function(request) {
        $('#modal-delete-collection-request-yes').attr('data-id', request.id);
        $('#modal-delete-collection-request-name').html(request.name);
        $('#modal-delete-collection-request').modal('show');
    }
});

var DeleteFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        $('#modal-delete-folder-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteFolder(id, true);
        });

        $("#modal-delete-folder").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-folder");
        });

        $("#modal-delete-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    render: function() {

    }
});

var EditCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("showEditModal", this.render, this);

        $('#form-edit-collection').submit(function() {
            var id = $('#form-edit-collection .collection-id').val();
            var name = $('#form-edit-collection .collection-name').val();
            model.updateCollectionMeta(id, name);
            $('#modal-edit-collection').modal('hide');
            return false;
        });

        $('#modal-edit-collection .btn-primary').click(function () {
            var id = $('#form-edit-collection .collection-id').val();
            var name = $('#form-edit-collection .collection-name').val();
            var description = view.editor.getValue();
            model.updateCollectionMeta(id, name, description);
            $('#modal-edit-collection').modal('hide');
        });

        $("#modal-edit-collection").on("shown", function () {
            $("#modal-edit-collection .collection-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-collection");
        });

        $("#modal-edit-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = CodeMirror.fromTextArea(document.getElementById("edit-collection-description"), {
            mode: 'markdown',
            theme: "eclipse",
            lineWrapping: true,
            lineNumbers:true,
            extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
        });

        pm.editCollectionEditor = this.editor;

        this.editor.refresh();
    },

    render: function(c) {
        var collection = c.toJSON();

        $('#form-edit-collection .collection-id').val(collection.id);
        $('#form-edit-collection .collection-name').val(collection.name);

        $('#modal-edit-collection').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            view.editor.setValue(collection.description);
            view.editor.refresh();

            CodeMirror.commands["goDocStart"](view.editor);
        }, 750);
    }
});
var EditCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("editCollectionRequest", this.render, this);

        var view = this;

        $('#form-edit-collection-request').submit(function() {
            var id = $('#form-edit-collection-request .collection-request-id').val();
            var name = $('#form-edit-collection-request .collection-request-name').val();
            var description = view.editor.getValue();
            model.updateCollectionRequestMeta(id, name, description);
            return false;
        });

        $('#modal-edit-collection-request .btn-primary').click(function () {
            var id = $('#form-edit-collection-request .collection-request-id').val();
            var name = $('#form-edit-collection-request .collection-request-name').val();
            var description = view.editor.getValue();
            console.log("Update with", description);
            model.updateCollectionRequestMeta(id, name, description);
            $('#modal-edit-collection-request').modal('hide');
        });

        $("#modal-edit-collection-request").on("shown", function () {
            $("#modal-edit-collection-request .collection-request-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-collection-request");
        });

        $("#modal-edit-collection-request").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = CodeMirror.fromTextArea(document.getElementById("collection-request-description"), {
            mode: 'markdown',
            theme: "eclipse",
            lineWrapping: true,
            lineNumbers:true,
            extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
        });

        //TODO Will be changed to something else later
        pm.editCollectionRequestEditor = this.editor;

        this.editor.refresh();
    },

    render: function(request) {
        $('#form-edit-collection-request .collection-request-id').val(request.id);
        $('#form-edit-collection-request .collection-request-name').val(request.name);
        $('#modal-edit-collection-request').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            view.editor.setValue(request.description);
            view.editor.refresh();

            CodeMirror.commands["goDocStart"](view.editor);
        }, 750);

    }
});

var EditFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("showEditFolderModal", this.render, this);

        $('#form-edit-folder').submit(function() {
            var id = $('#form-edit-folder .folder-id').val();
            var name = $('#form-edit-folder .folder-name').val();
            model.updateFolderMeta(id, name);
            $('#modal-edit-folder').modal('hide');
            return false;
        });

        $('#modal-edit-folder .btn-primary').click(function () {
            var id = $('#form-edit-folder .folder-id').val();
            var name = $('#form-edit-folder .folder-name').val();
            model.updateFolderMeta(id, name);
            $('#modal-edit-folder').modal('hide');
        });

        $("#modal-edit-folder").on("shown", function () {
            $("#modal-edit-folder .folder-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-folder");
        });

        $("#modal-edit-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    render: function(folder) {
        console.log("Render edit folder");
                
        $('#form-edit-folder .folder-id').val(folder.id);
        $('#form-edit-folder .folder-name').val(folder.name);

        $('#modal-edit-folder').modal('show');
    }
});
var ImportCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("importCollection", this.addAlert, this);

        $('#import-collection-url-submit').on("click", function () {
            var url = $('#import-collection-url-input').val();
            model.importCollectionFromUrl(url);
        });

        var dropZone = document.getElementById('import-collection-dropzone');
        dropZone.addEventListener('dragover', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }, false);

        dropZone.addEventListener('drop', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.dataTransfer.files; // FileList object.

            model.importCollections(files);
        }, false);

        $('#collection-files-input').on('change', function (event) {
            var files = event.target.files;
            model.importCollections(files);
            $('#collection-files-input').val("");
        });

        $("#modal-import-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-import-collection");
        });

        $("#modal-import-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        pm.mediator.on("failedCollectionImport", function() {
            noty(
                {
                    type:'error',
                    text:'Failed importing collection. Check your file',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    addAlert: function(message) {
        $('.modal-import-alerts').append(Handlebars.templates.message_collection_added(message));
    }
});
var OverwriteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("overwriteCollection", this.render, this);

        $('#modal-overwrite-collection-overwrite').on("click", function () {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;

            model.overwriteCollection(originalCollectionId, toBeImportedCollection);
        });

        $('#modal-overwrite-collection-duplicate').on("click", function () {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;

            model.duplicateCollection(toBeImportedCollection);
        });
    },

    render: function(collection) {
        $("#modal-overwrite-collection-name").html(collection.name);
        $("#modal-overwrite-collection-overwrite").attr("data-collection-id", collection.id);
        $("#modal-overwrite-collection-duplicate").attr("data-collection-id", collection.id);
        $("#modal-overwrite-collection").modal("show");
    }
});

var ShareCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        if (pm.features.isFeatureEnabled(FEATURES.DIRECTORY)) {
            $("share-collection-directory-features").css("display", "block");
        }

        $('#share-collection-get-link').on("click", function () {
            var id = $(this).attr('data-collection-id');
            var isChecked = $("#share-collection-is-public").is(":checked");

            model.uploadCollection(id, isChecked, true, function (link) {
                $('#share-collection-link').css("display", "block");
                $('#share-collection-link').html(link);
            });
        });

        $('#share-collection-download').on("click", function () {
            var id = $(this).attr('data-collection-id');
            model.saveCollection(id);
        });

        $("#modal-share-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-share-collection");
        });

        $("#modal-share-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        model.on("shareCollectionModal", this.show, this);
    },

    show: function(id) {
        var collection = this.model.get(id);

        $("#modal-share-collection").modal("show");

        $('#share-collection-get-link').attr("data-collection-id", id);
        $('#share-collection-download').attr("data-collection-id", id);
        $('#share-collection-link').css("display", "none");

        if (pm.user.isLoggedIn()) {
            if (collection.get("remote_id") !== 0) {
                $('#share-collection-directory-features').css("display", "none");
                $('#share-collection-get-link').html("Update");
            }
            else {
                $('#share-collection-directory-features').css("display", "block");
                $('#share-collection-get-link').html("Upload");
            }
        }
        else {
            $('#share-collection-directory-features').css("display", "none");
            $('#share-collection-get-link').html("Upload");
        }
    },

    render: function() {

    }
});

var DirectoryCollection = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "description": "",
            "order": [],
            "folders": [],
            "requests": [],
            "timestamp": 0,
            "updated_at": "",
            "updated_at_formatted": ""
        };
    }
});

var Directory = Backbone.Collection.extend({
    model: DirectoryCollection,

    startId: 0,
    fetchCount: 42,
    lastCount: 0,
    totalCount: 0,
    order: "descending",

    isInitialized: false,

    reload: function() {
        this.startId = 0;
        this.fetchCount = 42;
        this.lastCount = 0;
        this.totalCount = 0;
        this.getCollections(this.startId, this.fetchCount, "descending");
    },

    initialize: function() {
    	pm.mediator.on("initializeDirectory", this.onInitializeDirectory, this);
        pm.mediator.on("getDirectoryCollection", this.onGetDirectoryCollection, this);
        pm.mediator.on("showNextDirectoryPage", this.onShowNextDirectoryPage, this);
        pm.mediator.on("showNextDirectoryPage", this.onShowNextDirectoryPage, this);
    },

    onInitializeDirectory: function() {
    	if (!this.isInitialized) {
    		this.isInitialized = true;
    		this.getCollections(this.startId, this.fetchCount, "descending");
    	}
    },

    onGetDirectoryCollection: function(link_id) {
        this.downloadCollection(link_id);
    },

    loadNext: function() {
        this.getCollections(this.startId, this.fetchCount, "descending");
    },

    loadPrevious: function() {
        this.getCollections(this.startId, this.fetchCount, "ascending");
    },

    getCollections: function(startId, count, order) {
    	var collection = this;

    	pm.api.getDirectoryCollections(startId, count, order, function (collections) {
            var c;
            var i;
            var updated_at_formatted;

            if (order === "descending") {
                collection.startId = parseInt(collections[collections.length - 1].id, 10);
                collection.totalCount += collections.length;
            }
            else {
                collection.startId = parseInt(collections[0].id, 10);
                collection.totalCount -= collection.lastCount;
            }

            collection.lastCount = collections.length;

	    	if(collections.hasOwnProperty("message")) {
	    		// Signal error
	    	}
	    	else {
                for(i = 0; i < collections.length; i++) {
                    c = collections[i];
                    updated_at_formatted = new Date(c.updated_at).toDateString();
                    c.updated_at_formatted = updated_at_formatted;
                }

                collection.reset([]);
                collection.add(collections, {merge: true});
	    	}
        });
    },

    downloadCollection: function(linkId) {
        // TODO Check if the collection is uploaded by the user
        // TODO Download using remote ID
        var remoteId = pm.user.getRemoteIdForLinkId(linkId);

        console.log("Found remoteId", remoteId);
        if (remoteId) {
            pm.user.downloadSharedCollection(remoteId, function() {

                pm.mediator.trigger("notifySuccess", "Downloaded collection");
            });
        }
        else {
            pm.api.downloadDirectoryCollection(linkId, function (data) {
                try {
                    var collection = data;
                    pm.mediator.trigger("notifySuccess", "Downloaded collection");

                    pm.mediator.trigger("addDirectoryCollection", collection);
                }
                catch(e) {
                    pm.mediator.trigger("notifyError", "Failed to download collection");
                    pm.mediator.trigger("failedCollectionImport");
                }
            });
        }
    }

});
var DirectoryBrowser = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        this.directoryCollectionViewer = new DirectoryCollectionViewer({model: this.model});

        model.on("add", this.addDirectoryCollection, this);
        model.on("remove", this.removeDirectoryCollection, this);
        model.on("reset", this.render, this);

        $(".directory-browser-header").on("click", function() {
            model.reload();
        });

        $("#directory-collections").on("click", ".directory-collection-action-view", function() {
            var id = $(this).attr("data-id");
            var collection = model.get(id);
            view.directoryCollectionViewer.showCollection(collection);
        });

        $("#directory-collections").on("click", ".directory-collection-action-download", function() {
            var link_id = $(this).attr("data-link-id");
            pm.mediator.trigger("getDirectoryCollection", link_id);
        });

        $(".directory-browser-navigator-next").on("click", function() {
            if(!$(this).hasClass("disabled")) {
                model.loadNext();
            }
        });

        $(".directory-browser-navigator-previous").on("click", function() {
            if(!$(this).hasClass("disabled")) {
                model.loadPrevious();
            }
        });
    },

    render: function() {
        $("#directory-collections").html("");
    },

    renderNavigator: function() {
        var model = this.model;
        var startId = model.startId;
        var length = model.length;

        if (model.lastCount < model.fetchCount) {
            // Disable next
            $(".directory-browser-navigator-next").removeClass("enabled");
            $(".directory-browser-navigator-next").addClass("disabled");
        }
        else {
            $(".directory-browser-navigator-next").removeClass("disabled");
            $(".directory-browser-navigator-next").addClass("enabled");
        }

        if (model.totalCount <= model.fetchCount) {
            $(".directory-browser-navigator-previous").removeClass("enabled");
            $(".directory-browser-navigator-previous").addClass("disabled");
        }
        else {
            $(".directory-browser-navigator-previous").removeClass("disabled");
            $(".directory-browser-navigator-previous").addClass("enabled");
        }

        var start = model.totalCount - model.fetchCount + 1;

        if (start < 0) {
            start = 1;
        }

        var end = model.totalCount;

        $(".directory-browser-navigator-status .start").html(start);
        $(".directory-browser-navigator-status .end").html(end);
    },

    addDirectoryCollection: function(collection) {
        this.renderNavigator();
        var c = _.clone(collection.toJSON());
        c.description = markdown.toHTML(c.description);
        $("#directory-collections").append(Handlebars.templates.item_directory_collection(c));
    },

    removeDirectoryCollection: function(collection) {
        this.renderNavigator();
    },
});
var DirectoryCollectionViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        $("#directory-collection-viewer").on("click", ".btn-primary", function() {
        	var link_id = $(this).attr("data-link-id");
        	pm.mediator.trigger("getDirectoryCollection", link_id);
        });
    },

    showCollection: function(collection) {
    	$("#directory-collection-viewer-name").html(collection.get("name"));
    	$("#directory-collection-viewer-description").html(markdown.toHTML(collection.get("description")));
    	$("#directory-collection-viewer-updated-at").html("Last updated: " + collection.get("updated_at_formatted"));
    	$("#directory-collection-viewer-count-requests").html(collection.get("count_requests") + " endpoints");
    	$("#directory-collection-viewer-download").attr("data-id", collection.get("id"));
    	$("#directory-collection-viewer-download").attr("data-link-id", collection.get("link_id"));

    	$("#directory-collection-viewer").modal("show");
    }
});
var DriveSync = Backbone.Model.extend({
    defaults: function() {
        return {
        	initializedSync: false,
        	lastSynced: "",
        	canSync: false,
        	isSyncing: false,
        	fileSystem: null,
        	queue: [],
            log: null
        };
    },

    initialize: function(options) {
        var model = this;

        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if (canSync) {
            this.openSyncableFileSystem();
        }

        pm.mediator.on("driveSyncStatusChanged", function() {
            canSync = pm.settings.getSetting("driveSyncEnabled");

            if (canSync) {
                model.openSyncableFileSystem();
            }

        });
    },

    errorHandler:function (e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }

        this.get("log").addToLog("DriveSync", 'Error: ' + msg);
    },

    openSyncableFileSystem: function() {
        this.get("log").addToLog("Opening Google Drive file system");

    	var model = this;

        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if (!canSync) {
            this.get("log").addToLog("Can not sync");
            return false;
        }
        else {
            chrome.syncFileSystem.requestFileSystem(function (fs) {
                model.get("log").addToLog("Opened Google Drive file system");

                if (chrome.runtime.lastError) {
                    // TODO Need to handle this in a better way
                    model.errorHandler('requestFileSystem: ' + chrome.runtime.lastError.message);
                    return;
                }

                _.bind(model.onFileSystemOpened, model)(fs);
            });

            return true;
        }
    },

    isSyncingInitialized: function() {
    	return this.get("initializedSync");
    },

    onFileSystemOpened: function(fs) {
    	var model = this;

    	this.set("fileSystem", fs);
    	this.set("initializedSync", true);
    	pm.mediator.trigger("initializedSyncableFileSystem");

    	pm.mediator.on("addSyncableFile", function(syncableFile, callback) {
    		model.get("log").logChangeOnDrive("addSyncableFile", syncableFile.name);
    		model.syncFile(syncableFile, callback);
    	});

    	pm.mediator.on("updateSyncableFile", function(syncableFile, callback) {
    		model.get("log").logChangeOnDrive("updateSyncableFile", syncableFile.name);
    		model.syncFile(syncableFile, callback);
    	});

    	pm.mediator.on("removeSyncableFile", function(name, callback) {
    		model.get("log").logChangeOnDrive("removeSyncableFile", name);
    		model.removeFile(name);
    	});

    	pm.mediator.on("getSyncableFileData", function(fileEntry, callback) {
            model.get("log").logChangeOnDrive("getSyncableFileData");
    		model.getFile(fileEntry, callback);
    	});

    	this.startListeningForChanges();
    },

    removeFileIfExists:function (name, callback) {
    	var fileSystem = this.get("fileSystem");

        fileSystem.root.getFile(name, {create:false},
        	function (fileEntry) {
                fileEntry.remove(function () {
                	if (callback) {
                		callback();
                	}

                }, function () {
                	if (callback) {
                		callback();
                	}

                });
            },
            function () {
            	if (callback) {
            		callback();
            	}
        	}
    	);
    },

    // Add/edit file
    syncFile: function(syncableFile, callback) {

    	var fileSystem = this.get("fileSystem");
    	var name = syncableFile.name;
    	var data = syncableFile.data;
    	var errorHandler = this.errorHandler;

    	fileSystem.root.getFile(name,
    	    {create:true},
    	    function (fileEntry) {
    	        if (!fileEntry) {
                    return;
                }

                fileEntry.createWriter(function(writer) {
                    var truncated = false;

                    writer.onerror = function (e) {
                    	if (callback) {
                    		callback("failed");
                    	}
                    };

                    writer.onwriteend = function(e) {
                        if (!truncated) {
                            truncated = true;
                            this.truncate(this.position);
                            return;
                        }

                        if (callback) {
                        	callback("success");
                        }

                    };

                    blob = new Blob([data], {type:'text/plain'});

                    writer.write(blob);
                }, errorHandler);
    	    }, errorHandler
    	);
    },

    getFile: function(fileEntry, callback) {

    	var errorHandler = this.errorHandler;

    	fileEntry.file(function(file) {

			var reader = new FileReader();
			reader.readAsText(file, "utf-8");

			reader.onload = function(ev) {
				if (callback) {
					callback(ev.target.result);
				}
			};
    	}, errorHandler);
    },

    // Remove file
    removeFile: function(name, callback) {
    	this.removeFileIfExists(name, callback);
    },

    startListeningForChanges: function() {
    	var model = this;

    	chrome.syncFileSystem.onFileStatusChanged.addListener(
			function(detail) {
				_.bind(model.onSyncableFileStatusChanged, model)(detail);
			}
		);
    },

    onSyncableFileStatusChanged: function(detail) {
        var model = this;

    	var direction = detail.direction;
    	var action = detail.action;
    	var name = detail.fileEntry.name;
    	var status = detail.status;
    	var s = splitSyncableFilename(name);

    	var id = s.id;
    	var type = s.type;

    	if (status === "synced") {
    	    if (direction === "remote_to_local") {
    	        if (action === "added") {
    	            model.get("log").logFileStatusChange("Add file", name);
    	            this.getFile(detail.fileEntry, function(data) {
    	            	pm.mediator.trigger("addSyncableFileFromRemote", type, data);
    	            });
    	        }
    	        else if (action === "updated") {
    	        	model.get("log").logFileStatusChange("Update file", name);
    	        	this.getFile(detail.fileEntry, function(data) {
    	        		pm.mediator.trigger("updateSyncableFileFromRemote", type, data);
    	        	});
    	        }
    	        else if (action === "deleted") {
    	            model.get("log").logFileStatusChange("Delete file", name);
    	            pm.mediator.trigger("deleteSyncableFileFromRemote", type, id);
    	        }
    	    }
    	    else {
                model.get("log").logFileStatusChange("local_to_remote", name);
    	    }
    	}
    	else {
            model.get("log").logFileStatusChange("Not synced", name);
    	}
    }
});
var DriveSyncIntroduction = Backbone.View.extend({
    initialize: function() {
        var permissionStatus = pm.settings.getSetting("driveSyncPermissionStatus");
        console.log("Permission status is ", permissionStatus);
        if (permissionStatus === "not_asked") {
            $("#modal-drive-first-time-sync").modal("show");
        }

        $("#drive-sync-backup").on("click", function() {
            pm.indexedDB.downloadAllData(function() {
                noty(
                {
                    type:'success',
                    text:'Saved the data dump',
                    layout:'topCenter',
                    timeout:750
                });
            });
        });

        $("#drive-sync-start").on("click", function() {
            pm.settings.setSetting("driveSyncPermissionStatus", "asked");
            pm.settings.setSetting("driveSyncEnabled", true);
            $("#modal-drive-first-time-sync").modal("hide");
        });

        $("#drive-sync-cancel").on("click", function() {
            pm.settings.setSetting("driveSyncPermissionStatus", "disabled");
            pm.settings.setSetting("driveSyncEnabled", false);
            $("#modal-drive-first-time-sync").modal("hide");
        });
    }
});

var DriveSyncLog = Backbone.Collection.extend({
	model: DriveSyncLogItem,

	initialize: function() {
		console.log("Initialized DriveSyncLog");
	},

	addToLog: function(message) {
	    var obj = new DriveSyncLogItem({
	    	class: "default",
	        time: new Date().toUTCString(),
	        message: message
	    });

	    this.add(obj);
	},

	logChangeOnDrive: function(event, filename) {
		var obj = new DriveSyncLogItem({
			class: "change-on-drive",
		    time: new Date().toUTCString(),
		    message: "Local DB to Google Drive: " + event + ", " + filename
		});

		this.add(obj);
	},

	logFileStatusChange: function(event, filename) {
		var obj = new DriveSyncLogItem({
			class: "file-status-change",
		    time: new Date().toUTCString(),
		    message: "Google Drive to local DB: " + event + ", " + filename
		});

		this.add(obj);
	}
});

var DriveSyncLogItem = Backbone.Model.extend({
    defaults: function() {
        return {
            "class": "",
            "time": 0,
            "message": ""
        };
    }
});

var DriveSyncLogger = Backbone.View.extend({
    initialize: function() {
    	var wait;

    	var view = this;
        this.model.on("add", this.render, this);

        $("#google-drive-toggle").on("click", function() {
            view.toggleGoogleDriveSync();
        });

        $("#google-drive-status a").on("click", function() {
            view.toggleLoggerDisplay();
        });

        $("#google-drive-close-logger").on("click", function() {
            view.toggleLoggerDisplay();
        });

        $(document).bind('keydown', 'alt+g', function () {
            view.toggleLoggerDisplay();
        });

        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if(canSync) {
            $("#logger-drivesync-log-empty-view").css("display", "none");
            $("#logger-drivesync-log-container").css("display", "block");
            $("#google-drive-toggle").html("Disable syncing with Google Drive");
            $("#google-drive-toggle").addClass("btn btn-danger");
        }
        else {
            $("#logger-drivesync-log-empty-view").css("display", "block");
            $("#logger-drivesync-log-container").css("display", "none");
            $("#google-drive-toggle").html("Enable syncing with Google Drive");
            $("#google-drive-toggle").addClass("btn btn-primary");
        }
    },

    toggleGoogleDriveSync: function() {
        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if(canSync) {
            pm.settings.setSetting("driveSyncEnabled", false);
            $("#google-drive-toggle").html("Enable syncing with Google Drive");
            $("#logger-drivesync-log-empty-view").css("display", "block");
            $("#logger-drivesync-log-container").css("display", "none");
            $("#google-drive-toggle").removeClass();
            $("#google-drive-toggle").addClass("btn btn-primary");
            $("#google-drive-toggle").html("Enable syncing with Google Drive");

            pm.mediator.trigger("driveSyncStatusChanged");
        }
        else {
            pm.settings.setSetting("driveSyncEnabled", true);

            $("#logger-drivesync-log-empty-view").css("display", "none");
            $("#logger-drivesync-log-container").css("display", "block");

            $("#google-drive-toggle").html("Disable syncing with Google Drive");
            $("#google-drive-toggle").removeClass();
            $("#google-drive-toggle").addClass("btn btn-danger");

            pm.mediator.trigger("driveSyncStatusChanged");
        }
    },

    toggleLoggerDisplay: function() {
        var displayed = $("#logger-drivesync").css("display") === "block";

        if (displayed) {
            $("#logger-drivesync").css("display", "none");
        }
        else {
            $("#logger-drivesync").css("display", "block");
        }
    },

    render: function() {
        var logItems = this.model.toJSON();
        $('#logger-drivesync-items').html("");
        $('#logger-drivesync-items').append(Handlebars.templates.logger_drivesync({items: logItems}));
        $('#logger-drivesync-log-container').scrollTop($('#logger-drivesync-items').height());
    }

});

var Environment = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "values": [],
            "timestamp": 0,
            "synced": false,
            "syncedFilename": ""
        };
    },

    toSyncableJSON: function() {
        var j = this.toJSON();
        j.synced = true;
        return j;
    }
});

var Environments = Backbone.Collection.extend({
    model: Environment,

    isLoaded: false,
    initializedSyncing: false,

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    initialize:function () {
        var collection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.environments.getAllEnvironments(function (environments) {

            environments.sort(sortAlphabetical);
            collection.add(environments, {merge: true});

            collection.isLoaded = true;
            collection.trigger("startSync");
        })
    },

    startListeningForFileSystemSyncEvents: function() {
        var collection = this;
        var isLoaded = collection.isLoaded;
        var initializedSyncing = collection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            collection.initializedSyncing = true;
            collection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var collection = this;
        var environment;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "environment") {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "environment") {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "environment") {
                    collection.onRemoveSyncableFile(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                environment = this.models[i];
                synced = environment.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(environment.get("id"));
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        this.importEnvironment(data, true);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteEnvironment(id, true);
    },

    getAsSyncableFile: function(id) {
        var environment = this.get(id);
        var name = id + ".environment";
        var type = "environment";
        var data = JSON.stringify(environment.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var collection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                collection.updateEnvironmentSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".environment";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    addEnvironment:function (name, values, doNotSync) {
        var collection = this;

        var environment = {
            id:guid(),
            name:name,
            values:values,
            timestamp:new Date().getTime(),
            synced: false
        };

        var envModel = new Environment(environment);
        collection.add(envModel);

        pm.indexedDB.environments.addEnvironment(environment, function () {
            if (doNotSync) {
                console.log("Do not sync this change");
            }
            else {
                collection.addToSyncableFilesystem(environment.id);
            }

        });
    },

    updateEnvironment:function (id, name, values, doNotSync) {
        var collection = this;

        var environment = {
            id:id,
            name:name,
            values:values,
            timestamp:new Date().getTime()
        };

        pm.indexedDB.environments.updateEnvironment(environment, function () {
            var envModel = new Environment(environment);
            collection.add(envModel, {merge: true});

            if (doNotSync) {
                console.log("Do not sync this change");
            }
            else {
                collection.addToSyncableFilesystem(environment.id);
            }
        });
    },

    updateEnvironmentSyncStatus: function(id, status) {
        var collection = this;

        var environment = this.get(id);
        environment.set("synced", status);
        collection.add(environment, {merge: true});

        pm.indexedDB.environments.updateEnvironment(environment.toJSON(), function () {
        });
    },

    deleteEnvironment:function (id, doNotSync) {
        var collection = this;

        pm.indexedDB.environments.deleteEnvironment(id, function () {
            collection.remove(id);

            if (doNotSync) {
                console.log("Do not sync this");
            }
            else {
                collection.removeFromSyncableFilesystem(id);
            }
        });
    },

    downloadEnvironment:function (id) {
        var environment = this.get(id);

        environment.set("synced", false);

        var name = environment.get("name") + ".postman_environment";
        var type = "application/json";
        var filedata = JSON.stringify(environment.toJSON());
        pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved environment to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    duplicateEnvironment:function (id) {
        var environment = this.get(id).toJSON();
        environment.name = environment.name + " " + "copy";
        environment.id = guid();

        var collection = this;

        pm.indexedDB.environments.addEnvironment(environment, function () {
            var envModel = new Environment(environment);
            collection.add(envModel);
            collection.addToSyncableFilesystem(environment.id);
        });
    },

    importEnvironment: function(data, doNotSync) {
        var collection = this;

        var environment = JSON.parse(data);

        pm.indexedDB.environments.addEnvironment(environment, function () {
            var envModel = new Environment(environment);
            collection.add(envModel, {merge: true});

            if (doNotSync) {
                console.log("Do not sync this");
            }
            else {
                collection.trigger("importedEnvironment", environment);
                collection.addToSyncableFilesystem(environment.id);
            }

        });
    },

    importEnvironments:function (files) {
        var collection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    collection.importEnvironment(e.currentTarget.result);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    mergeEnvironments: function(environments) {
        var size = environments.length;
        var collection = this;

        function onUpdateEnvironment(environment) {
            var envModel = new Environment(environment);
            collection.add(envModel, {merge: true});

            collection.addToSyncableFilesystem(environment.id);
        }

        for(var i = 0; i < size; i++) {
            var environment = environments[i];
            pm.indexedDB.environments.updateEnvironment(environment, onUpdateEnvironment);
        }
    }
});

var Globals = Backbone.Model.extend({
    isLoaded: false,
    initializedSyncing: false,

    defaults: function() {
        return {
            "globals": [],
            "syncFileID": "postman_globals",
            "synced": false
        };
    },

    initialize:function () {
        this.set({"globals": []});

        var model = this;

        this.startListeningForFileSystemSyncEvents();

        pm.storage.getValue('globals', function(s) {
            if (s) {
                model.set({"globals": JSON.parse(s)});
            }
            else {
                model.set({"globals": []});
            }

            model.isLoaded = true;
            model.trigger("startSync");
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var model = this;
        var isLoaded = model.isLoaded;
        var initializedSyncing = model.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            model.initializedSyncing = true;
            model.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var model = this;
        var globals;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "globals") {
                    model.onRemoveSyncableFile(id);
                }
            });

            synced = pm.settings.getSetting("syncedGlobals");

            if (!synced) {
                this.addToSyncableFilesystem(this.get("syncFileID"));
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var globals = JSON.parse(data);
        this.mergeGlobals(globals);
    },

    onRemoveSyncableFile: function(id) {
        console.log("Do nothing");
        // this.deleteEnvironment(id, true);
    },

    getAsSyncableFile: function(id) {
        var name = id + ".globals";
        var type = "globals";
        var data = JSON.stringify(this.get("globals"));

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var model = this;

        var syncableFile = this.getAsSyncableFile(id);

        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                model.updateGlobalSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".globals";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
            model.saveGlobals([]);
        });
    },

    updateGlobalSyncStatus: function(id, status) {
        pm.settings.setSetting("syncedGlobals", status);
    },

    saveGlobals:function (globals) {
        var model = this;

        this.set({"globals": globals});

        var o = {'globals': JSON.stringify(globals)};

        pm.storage.setValue(o, function() {
            model.addToSyncableFilesystem(model.get("syncFileID"));
        });
    },

    mergeGlobals: function(globals) {
        this.set({"globals": globals});
        var o = {'globals': JSON.stringify(globals)};
        pm.storage.setValue(o, function() {
        });
    }
});
var VariableProcessor = Backbone.Model.extend({
    defaults: function() {
        return {
            environments: null,
            globals: null,
            functions: {},
            selectedEnv:null,
            selectedEnvironmentId:""
        };
    },

    initialize: function() {
        this.get("environments").on("reset", this.setCurrentEnvironment, this);
        this.get("environments").on("change", this.setCurrentEnvironment, this);
        this.get("environments").on("add", this.setCurrentEnvironment, this);
        this.get("environments").on("remove", this.setCurrentEnvironment, this);

        this.set("selectedEnvironmentId", pm.settings.getSetting("selectedEnvironmentId"));
        this.set("selectedEnv", this.get("environments").get(pm.settings.getSetting("selectedEnvironmentId")));

        this.initializeFunctions();
    },

    initializeFunctions: function() {
        var functions = {
            "$guid": {
                run: function() {
                    return guid();
                }
            },

            "$timestamp": {
                run: function() {
                    return Math.round(new Date().getTime() / 1000);
                }
            },

            "$randomInt": {
                run: function(min, max) {
                    if (!min) min = 0;
                    if (!max) max = 1000;
                    return getRandomInt(min, max);
                }
            },

            "\\$random [0-9]+,[0-9]+": {
                run: function(min, max) {
                    if (!min) min = 0;
                    if (!max) max = 1000;

                    return getRandomArbitrary(min, max);
                }
            }
        };

        this.set("functions", functions);
    },

    setCurrentEnvironment: function() {
        this.set("selectedEnvironmentId", pm.settings.getSetting("selectedEnvironmentId"));
        this.set("selectedEnv", this.get("environments").get(pm.settings.getSetting("selectedEnvironmentId")));
    },

    containsVariable:function (string, values) {
        var variableDelimiter = pm.settings.getSetting("variableDelimiter");
        var startDelimiter = variableDelimiter.substring(0, 2);
        var endDelimiter = variableDelimiter.substring(variableDelimiter.length - 2);
        var patString = startDelimiter + "[^\r\n]*" + endDelimiter;
        var pattern = new RegExp(patString, 'g');
        var matches = string.match(pattern);
        var count = values.length;
        var variable;

        if(matches === null) {
            return false;
        }

        for(var i = 0; i < count; i++) {
            variable = startDelimiter + values[i].key + endDelimiter;
            if(_.indexOf(matches, variable) >= 0) {
                return true;
            }
        }

        return false;
    },

    processString:function (string, values) {
        if (!values) return string;

        var count = values.length;
        var finalString = string;
        var patString;
        var pattern;

        var variableDelimiter = pm.settings.getSetting("variableDelimiter");
        var startDelimiter = variableDelimiter.substring(0, 2);
        var endDelimiter = variableDelimiter.substring(variableDelimiter.length - 2);

        for (var i = 0; i < count; i++) {
            patString = startDelimiter + values[i].key + endDelimiter;
            pattern = new RegExp(patString, 'g');

            if(typeof values[i].value === "object") {
                var result = values[i].value.run();
                finalString = finalString.replace(patString, result);
            }
            else {
                finalString = finalString.replace(patString, values[i].value);
            }

        }

        if (this.containsVariable(finalString, values)) {
            finalString = this.processString(finalString, values);
            return finalString;
        }
        else {
            return finalString;
        }
    },

    getCurrentValue: function(string) {
        if (typeof string === "number") {
            return string;
        }

        var envModel = this.get("selectedEnv");
        var envValues = [];

        if (envModel) {
            var environment = envModel.toJSON();
            if (environment !== null) {
                envValues = environment.values;
            }
        }

        var globals = this.get("globals").get("globals");
        var values;

        if (globals) {
            values = _.union(envValues, globals);
        }

        var functions = this.get("functions");
        var fs = [];
        for(f in functions) {
            if(functions.hasOwnProperty(f)) {
                var kvpair = {
                    "key": f,
                    "value": functions[f]
                };

                fs.push(kvpair);
            }
        }

        values = _.union(values, fs);

        if (string) {
            return this.processString(string, values);
        }
        else {
            return string;
        }

    },
});
var EnvironmentManagerModal = Backbone.View.extend({
    environments: null,
    globals: null,

    initialize: function() {
        this.environments = this.options.environments;
        this.globals = this.options.globals;

        this.environments.on('change', this.render, this);
        this.environments.on('reset', this.render, this);
        this.environments.on('add', this.render, this);
        this.environments.on('remove', this.render, this);
        this.environments.on("importedEnvironment", this.onImportedEnvironment, this);

        this.globals.on('change:globals', this.render, this);

        var environments = this.environments;
        var globals = this.globals;
        var view = this;

        $("#modal-environments").on("shown", function () {
            $('.environments-actions-add').focus();
            pm.app.trigger("modalOpen", "#modal-environments");
        });

        $("#modal-environments").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $('#environments-list').on("click", ".environment-action-delete", function () {
            var id = $(this).attr('data-id');
            $('a[rel="tooltip"]').tooltip('hide');
            environments.deleteEnvironment(id);
        });

        $('#environments-list').on("click", ".environment-action-edit", function () {
            var id = $(this).attr('data-id');
            view.showEditor(id);
        });

        $('#environments-list').on("click", ".environment-action-duplicate", function () {
            var id = $(this).attr('data-id');
            environments.duplicateEnvironment(id);
        });

        $('#environments-list').on("click", ".environment-action-download", function () {
            var id = $(this).attr('data-id');
            environments.downloadEnvironment(id);
        });

        $('.environment-action-back').on("click", function () {
            view.showSelector();
        });

        $('#environment-files-input').on('change', function (event) {
            var files = event.target.files;
            console.log("Start importEnvironments");
            environments.importEnvironments(files);
            $('#environment-files-input').val("");
        });

        $('.environments-actions-add').on("click", function () {
            view.showEditor();
        });

        $('.environments-actions-import').on('click', function () {
            view.showImporter();
        });

        $('.environments-actions-manage-globals').on('click', function () {
            view.showGlobals();
        });

        function submitEnvironmentEditorForm() {
            var id = $('#environment-editor-id').val();
            var name = $('#environment-editor-name').val();
            var values = $('#environment-keyvaleditor').keyvalueeditor('getValues');

            if (id === "0") {
                environments.addEnvironment(name, values);
            }
            else {
                environments.updateEnvironment(id, name, values);
            }

            $('#environment-editor-name').val("");
            $('#environment-keyvaleditor').keyvalueeditor('reset', []);

            view.showSelector();
        }

        $('#environment-editor-form').submit(function() {            
            submitEnvironmentEditorForm();
        });            

        $('.environments-actions-add-submit').on("click", function () {
            submitEnvironmentEditorForm();
        });

        $('.environments-actions-add-back').on("click", function () {
            var values = $('#globals-keyvaleditor').keyvalueeditor('getValues');
            globals.saveGlobals(values);
            view.showSelector();
            $('#environment-editor-name').val("");
            $('#environment-keyvaleditor').keyvalueeditor('reset', []);
        });

        $('#environments-list-help-toggle').on("click", function (event) {
            var d = $('#environments-list-help-detail').css("display");
            if (d === "none") {
                $('#environments-list-help-detail').css("display", "inline");
                $(event.currentTarget).html("Hide");
            }
            else {
                $('#environments-list-help-detail').css("display", "none");
                $(event.currentTarget).html("Tell me more");
            }
        });

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            deleteButton:'<img class="deleteButton" src="img/delete.png">'
        };

        $('#environment-keyvaleditor').keyvalueeditor('init', params);
        $('#globals-keyvaleditor').keyvalueeditor('init', params);        

        $(document).bind('keydown', 'e', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-environments').modal({
                keyboard:true,
                backdrop:"static"
            });
        });

        this.render();
    },

    onImportedEnvironment: function(environment) {
        noty(
        {
            type:'success',
            dismissQueue: true,
            text:'Imported ' + environment.name,
            layout:'topCenter',
            timeout: 2500
        });
    },

    showEditor:function (id) {
        if (id) {
            var environment = this.environments.get(id).toJSON();
            $('#environment-editor-name').val(environment.name);
            $('#environment-editor-id').val(id);
            $('#environment-keyvaleditor').keyvalueeditor('reset', environment.values);
        }
        else {
            $('#environment-editor-id').val(0);
        }

        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "block");
        $('#globals-editor').css("display", "none");
        $('#modal-environments .modal-footer').css("display", "block");
    },

    showSelector:function () {
        $('#environments-list-wrapper').css("display", "block");
        $('#environment-editor').css("display", "none");
        $('#environment-importer').css("display", "none");
        $('#globals-editor').css("display", "none");
        $('.environments-actions-add-submit').css("display", "inline");
        $('#modal-environments .modal-footer').css("display", "none");
    },

    showImporter:function () {
        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "none");
        $('#globals-editor').css("display", "none");
        $('#environment-importer').css("display", "block");
        $('.environments-actions-add-submit').css("display", "none");
        $('#modal-environments .modal-footer').css("display", "block");
    },

    showGlobals:function () {
        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "none");
        $('#globals-editor').css("display", "block");
        $('#environment-importer').css("display", "none");
        $('.environments-actions-add-submit').css("display", "none");
        $('#modal-environments .modal-footer').css("display", "block");
    },

    render: function() {        
        $('#environments-list tbody').html("");
        $('#environments-list tbody').append(Handlebars.templates.environment_list({"items":this.environments.toJSON()}));
        $('#globals-keyvaleditor').keyvalueeditor('reset', this.globals.get("globals"));
    }
});
var EnvironmentSelector = Backbone.View.extend({
    environments: null,
    variableProcessor: null,

    initialize: function() {
        this.environments = this.options.environments;
        this.variableProcessor = this.options.variableProcessor;

        this.environments.on('change', this.render, this);
        this.environments.on('reset', this.render, this);
        this.environments.on('add', this.render, this);
        this.environments.on('remove', this.render, this);

        this.variableProcessor.on('change:selectedEnv', this.render, this);

        var environments = this.environments;
        var variableProcessor = this.variableProcessor;

        $('#environment-selector').on("click", ".environment-list-item", function () {
            var id = $(this).attr('data-id');
            var selectedEnv = environments.get(id);

            variableProcessor.set({"selectedEnv": selectedEnv});
            pm.settings.setSetting("selectedEnvironmentId", selectedEnv.id);
            $('#environment-selector .environment-list-item-selected').html(selectedEnv.name);
        });

        $('#environment-selector').on("click", ".environment-list-item-noenvironment", function () {
            variableProcessor.set({"selectedEnv": null});
            pm.settings.setSetting("selectedEnvironmentId", "");
            $('#environment-selector .environment-list-item-selected').html("No environment");
        });

        this.render();
    },

    render: function() {
        $('#environment-selector .dropdown-menu').html("");
        $('#environment-selector .dropdown-menu').append(Handlebars.templates.environment_selector({"items":this.environments.toJSON()}));
        $('#environment-selector .dropdown-menu').append(Handlebars.templates.environment_selector_actions());

        var selectedEnv = this.variableProcessor.get("selectedEnv");

        if (selectedEnv) {
            $('#environment-selector .environment-list-item-selected').html(selectedEnv.toJSON().name);
        }
        else {
            $('#environment-selector .environment-list-item-selected').html("No environment");
        }
    }
});

var QuickLookPopOver = Backbone.View.extend({
    initialize: function() {
        var view = this;
        
        this.environments = this.options.environments;
        this.variableProcessor = this.options.variableProcessor;
        this.globals = this.options.globals;

        this.environments.on('change', this.render, this);
        this.variableProcessor.on('change:selectedEnv', this.render, this);

        this.globals.on('change:globals', this.render, this);

        $('#environment-quicklook').on("mouseenter", function () {
            $('#environment-quicklook-content').css("display", "block");
        });

        $('#environment-quicklook').on("mouseleave", function () {
            $('#environment-quicklook-content').css("display", "none");
        });


        $(document).bind('keydown', 'q', function () {
            view.toggleDisplay();
            return false;
        });

        this.render();
    },

    render: function() {
        var environment = this.environments.get(this.variableProcessor.get("selectedEnv"));

        if (!environment) {
            $('#environment-quicklook-environments h6').html("No environment");
            $('#environment-quicklook-environments ul').html("");
        }
        else {
            $('#environment-quicklook-environments h6').html(environment.get("name"));
            $('#environment-quicklook-environments ul').html("");
            $('#environment-quicklook-environments ul').append(Handlebars.templates.environment_quicklook({
                "items":environment.toJSON().values
            }));
        }

        if (!this.globals) {
            return;
        }

        $('#environment-quicklook-globals ul').html("");
        $('#environment-quicklook-globals ul').append(Handlebars.templates.environment_quicklook({
            "items":this.globals.get("globals")
        }));
    },

    toggleDisplay:function () {
        var display = $('#environment-quicklook-content').css("display");

        if (display === "none") {
            $('#environment-quicklook-content').css("display", "block");
        }
        else {
            $('#environment-quicklook-content').css("display", "none");
        }
    }
});
var HeaderPreset = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "headers": [],
            "timestamp": 0,
            "synced": false
        };
    },

    toSyncableJSON: function() {
        var j = this.toJSON();
        j.synced = true;
        return j;
    }
});

var HeaderPresets = Backbone.Collection.extend({
    model: HeaderPreset,

    isLoaded: false,
    initializedSyncing: false,
    syncFileType: "header_preset",

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    presetsForAutoComplete:[],

    initialize:function () {
        this.on("change", this.refreshAutoCompleteList, this);
        this.loadPresets();
    },

    // Initialize all models
    loadPresets:function () {
        var collection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.headerPresets.getAllHeaderPresets(function (items) {
            collection.add(items, {merge: true});
            collection.refreshAutoCompleteList();

            collection.isLoaded = true;
            collection.trigger("startSync");
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var collection = this;
        var isLoaded = collection.isLoaded;
        var initializedSyncing = collection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            collection.initializedSyncing = true;
            collection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var collection = this;
        var headerPreset;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === collection.syncFileType) {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === collection.syncFileType) {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === collection.syncFileType) {
                    collection.onRemoveSyncableFile(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                headerPreset = this.models[i];
                synced = headerPreset.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(headerPreset.get("id"));
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        this.mergeHeaderPreset(JSON.parse(data), true);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteHeaderPreset(id, true);
    },

    getAsSyncableFile: function(id) {
        var collection = this;
        var headerPreset = this.get(id);
        var name = id + "." + collection.syncFileType;
        var type = collection.syncFileType;
        var data = JSON.stringify(headerPreset.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var collection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                collection.updateHeaderPresetSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var collection = this;

        var name = id + "." + collection.syncFileType;
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    // Iterate through models
    getHeaderPreset:function (id) {
        var presets = this.models;
        var preset;
        for (var i = 0, count = presets.length; i < count; i++) {
            preset = presets[i];
            if (preset.get("id") === id) {
                break;
            }
        }

        return preset;
    },

    // Add to models
    addHeaderPreset:function (name, headers, doNotSync) {
        var id = guid();

        var headerPreset = {
            "id":id,
            "name":name,
            "headers":headers,
            "timestamp":new Date().getTime()
        };

        var collection = this;

        pm.indexedDB.headerPresets.addHeaderPreset(headerPreset, function () {
            collection.add(headerPreset, {merge: true});

            if (!doNotSync) {
                collection.addToSyncableFilesystem(id);
            }
        });
    },

    // Update local model
    editHeaderPreset:function (id, name, headers, doNotSync) {
        var collection = this;

        pm.indexedDB.headerPresets.getHeaderPreset(id, function (preset) {
            var headerPreset = {
                "id":id,
                "name":name,
                "headers":headers,
                "timestamp":preset.timestamp
            };

            pm.indexedDB.headerPresets.updateHeaderPreset(headerPreset, function () {
                collection.add(headerPreset, {merge: true});

                if (!doNotSync) {
                    collection.addToSyncableFilesystem(id);
                }
            });
        });
    },

    updateHeaderPresetSyncStatus: function(id, status) {
        var collection = this;

        var headerPreset = this.get(id);
        headerPreset.set("synced", status);
        collection.add(headerPreset, {merge: true});

        pm.indexedDB.headerPresets.updateHeaderPreset(headerPreset.toJSON(), function () {
        });
    },

    // Remove from local model
    deleteHeaderPreset:function (id, doNotSync) {
        var collection = this;

        pm.indexedDB.headerPresets.deleteHeaderPreset(id, function () {
            collection.remove(id);

            if (!doNotSync) {
                collection.removeFromSyncableFilesystem(id);
            }
        });
    },

    getPresetsForAutoComplete:function () {
        var list = [];
        var presets = this.toJSON();

        for (var i = 0, count = presets.length; i < count; i++) {
            var preset = presets[i];
            var item = {
                "id":preset.id,
                "type":"preset",
                "label":preset.name,
                "category":"Header presets"
            };

            list.push(item);
        }

        list = _.union(list, allowedChromeHeaders);
        list = _.union(list, restrictedChromeHeaders);

        return list;
    },

    refreshAutoCompleteList:function () {
        var presets = this.getPresetsForAutoComplete();
        this.presetsForAutoComplete = presets;
    },

    mergeHeaderPreset: function(preset, doNotSync) {
        var collection = this;

        pm.indexedDB.headerPresets.addHeaderPreset(preset, function(headerPreset) {
            collection.add(headerPreset, {merge: true});

            if (!doNotSync) {
                collection.addToSyncableFilesystem(headerPreset.id);
            }
        });

    },

    mergeHeaderPresets: function(hp) {
        var size = hp.length;
        var collection = this;
        var headerPreset;

        for(var i = 0; i < size; i++) {
            headerPreset = hp[i];
            collection.mergeHeaderPreset(headerPreset);
        }
    }
});
var HeaderPresetsModal = Backbone.View.extend({
    el: $("#modal-header-presets"),

    initialize: function() {
        this.model.on('add', this.render, this);
        this.model.on('remove', this.render, this);
        this.model.on('change', this.render, this);

        var headerPresets = this.model;
        var view = this;

        $("#modal-header-presets").on("shown", function () {
            $(".header-presets-actions-add").focus();
            pm.app.trigger("modalOpen", "#modal-header-presets");
        });

        $("#modal-header-presets").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $(".header-presets-actions-add").on("click", function () {
            view.showEditor();
        });

        $(".header-presets-actions-back").on("click", function () {
            view.showList();
        });

        $(".header-presets-actions-submit").on("click", function () {
            var id = $('#header-presets-editor-id').val();
            var name = $("#header-presets-editor-name").val();
            var headers = $("#header-presets-keyvaleditor").keyvalueeditor("getValues");

            // TODO Hacky
            if (id === "0") {
                _.bind(headerPresets.addHeaderPreset, headerPresets)(name, headers);
            }
            else {
                _.bind(headerPresets.editHeaderPreset, headerPresets)(id, name, headers);
            }

            view.showList();
        });

        $("#header-presets-list").on("click", ".header-preset-action-edit", function (event) {
            var id = $(event.currentTarget).attr("data-id");
            var preset = _.bind(headerPresets.getHeaderPreset, headerPresets)(id);
            $('#header-presets-editor-name').val(preset.get("name"));
            $('#header-presets-editor-id').val(preset.get("id"));
            $('#header-presets-keyvaleditor').keyvalueeditor('reset', preset.get("headers"));
            view.showEditor();
        });

        $("#header-presets-list").on("click", ".header-preset-action-delete", function (event) {
            var id = $(event.currentTarget).attr("data-id");
            headerPresets.deleteHeaderPreset(id);
        });
    },


    showList:function () {
        $("#header-presets-list-wrapper").css("display", "block");
        $("#header-presets-editor").css("display", "none");
        $("#header-presets-editor-name").attr("value", "");
        $("#header-presets-editor-id").attr("value", 0);
        $('#header-presets-keyvaleditor').keyvalueeditor('reset', []);
        $("#modal-header-presets .modal-footer").css("display", "none");
    },

    showEditor:function () {
        $("#modal-header-presets .modal-footer").css("display", "block");
        $("#header-presets-list-wrapper").css("display", "none");
        $("#header-presets-editor").css("display", "block");
    },

    render: function() {
        $('#header-presets-list tbody').html("");
        $('#header-presets-list tbody').append(Handlebars.templates.header_preset_list({"items":this.model.toJSON()}));
    }
});
var HeaderPresetsRequestEditor = Backbone.View.extend({
    initialize: function() {
        this.model.on('add', this.render, this);
        this.model.on('remove', this.render, this);

        var model = this.model;

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            deleteButton:'<img class="deleteButton" src="img/delete.png">'
        };

        $("#header-presets-keyvaleditor").keyvalueeditor("init", params);

        $("#headers-keyvaleditor-actions-manage-presets").on("click", function () {
            $("#modal-header-presets").modal("show");
        });

        $("#headers-keyvaleditor-actions-add-preset").on("click", ".header-preset-dropdown-item", function() {
            var id = $(this).attr("data-id");
            var preset = model.getHeaderPreset(id);
            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');

            var newHeaders = _.union(headers, preset.get("headers"));
            $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);
        });
    },

    render: function() {
        $('#headers-keyvaleditor-actions-add-preset ul').html("");
        $('#headers-keyvaleditor-actions-add-preset ul').append(Handlebars.templates.header_preset_dropdown({"items":this.model.toJSON()}));
    }
});
var BasicAuthProcessor = Backbone.Model.extend({
    defaults: function() {
        return {
            "username": null,
            "password": null,
            "request": null
        };
    },

    initialize: function() {
        this.on("change", this.updateDB, this);

        var model = this;

        pm.indexedDB.helpers.getHelper("basic", function(helper) {
            if (helper) {
                model.set(helper);
            }
        });
    },

    process: function() {
        var request = this.get("request");

        var headers = request.get("headers");
        var authHeaderKey = "Authorization";
        var pos = findPosition(headers, "key", authHeaderKey);

        var username = this.get("username");
        var password = this.get("password");

        username = pm.envManager.getCurrentValue(username);
        password = pm.envManager.getCurrentValue(password);

        var rawString = username + ":" + password;
        var encodedString = "Basic " + btoa(rawString);

        request.setHeader(authHeaderKey, encodedString);        
        request.trigger("customHeaderUpdate");
    },

    updateDB: function() {
        var helper = {
            id: "basic",
            username: this.get("username"),
            password: this.get("password"),
            timestamp: new Date().getTime()
        };

        pm.indexedDB.helpers.addHelper(helper, function(helper) {
        });
    }
});
var DigestAuthProcessor = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "time": 0,
            "algorithm": "",
            "username": "",
            "realm": "",
            "password": "",
            "nonce": "",
            "nonceCount": "",
            "clientNonce": "",
            "opaque": "",
            "qop": "",
            "request": null
        };
    },

    initialize: function() {
        this.on("change", this.updateDB, this);

        var model = this;

        pm.indexedDB.helpers.getHelper("digest", function(helper) {
            if (helper) {
                model.set(helper);
            }
        });
    },

    getHeader: function () {        
        var request = this.get("request");
        request.trigger("updateModel");
        
        var algorithm = pm.envManager.getCurrentValue(this.get("algorithm"));

        var username = pm.envManager.getCurrentValue(this.get("username"));
        var realm = pm.envManager.getCurrentValue(this.get("realm"));
        var password = pm.envManager.getCurrentValue(this.get("password"));

        var method = request.get("method");

        var nonce = pm.envManager.getCurrentValue(this.get("nonce"));
        var nonceCount = pm.envManager.getCurrentValue(this.get("nonceCount"));
        var clientNonce = pm.envManager.getCurrentValue(this.get("clientNonce"));

        var opaque = pm.envManager.getCurrentValue(this.get("opaque"));
        var qop = pm.envManager.getCurrentValue(this.get("qop"));
        var body = request.getRequestBodyPreview();        
        var url = request.processUrl(request.get("url"));

        var urlParts = request.splitUrlIntoHostAndPath(url);

        var digestUri = urlParts.path;

        var a1;

        if(algorithm === "MD5-sess") {
            var a0 = CryptoJS.MD5(username + ":" + realm + ":" + password);
            a1 = a0 + ":" + nonce + ":" + clientNonce;
        }
        else {
            a1 = username + ":" + realm + ":" + password;
        }

        var a2;

        if(qop === "auth-int") {
            a2 = method + ":" + digestUri + ":" + body;
        }
        else {
            a2 = method + ":" + digestUri;
        }


        var ha1 = CryptoJS.MD5(a1);
        var ha2 = CryptoJS.MD5(a2);

        var response;

        if(qop === "auth-int" || qop === "auth") {
            response = CryptoJS.MD5(ha1 + ":"
                + nonce + ":"
                + nonceCount + ":"
                + clientNonce + ":"
                + qop + ":"
                + ha2);
        }
        else {
            response = CryptoJS.MD5(ha1 + ":" + nonce + ":" + ha2);
        }

        var headerVal = " ";
        headerVal += "username=\"" + username + "\", ";
        headerVal += "realm=\"" + realm + "\", ";
        headerVal += "nonce=\"" + nonce + "\", ";
        headerVal += "uri=\"" + digestUri + "\", ";

        if(qop === "auth" || qop === "auth-int") {
            headerVal += "qop=" + qop + ", ";
        }

        if(qop === "auth" || qop === "auth-int" || algorithm === "MD5-sess") {
            headerVal += "nc=" + nonceCount + ", ";
            headerVal += "cnonce=\"" + clientNonce + "\", ";
        }

        headerVal += "response=\"" + response + "\", ";
        headerVal += "opaque=\"" + opaque + "\"";

        return headerVal;
    },

    process: function () {
        var request = this.get("request");
        
        var headers = request.get("headers");
        var authHeaderKey = "Authorization";

        //Generate digest header here
        var algorithm = $("#request-helper-digestAuth-realm").val();
        var headerVal = this.getHeader();
        headerVal = "Digest" + headerVal;

        request.setHeader(authHeaderKey, headerVal);
        request.trigger("customHeaderUpdate");
    },

    updateDB: function() {
        var h = {
            id: "digest",
            time: new Date().getTime(),
            realm: this.get("realm"),
            username: this.get("username"),
            password: this.get("password"),
            nonce: this.get("nonce"),
            algorithm: this.get("algorithm"),
            nonceCount: this.get("nonceCount"),
            clientNonce: this.get("clientNonce"),
            opaque: this.get("opaque"),
            qop: this.get("qop")
        };

        pm.indexedDB.helpers.addHelper(h, function(h) {
        });
    }
});

var Helpers = Backbone.Model.extend({
    defaults: function() {
        return {
            "activeHelper": "normal",
            "basicAuth": null,
            "digestAuth": null,
            "oAuth1": null,
            "oAuth2": null
        };
    }
});
var OAuth1Processor = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "oAuth1",
            "time": 0,
            "consumerKey": "",
            "consumerSecret": "",
            "token": "",
            "tokenSecret": "",
            "signatureMethod": "HMAC-SHA1",
            "timestamp": "",
            "nonce": "",
            "version": "",
            "realm": "",
            "header": "",
            "auto": "",
            "request": null
        };
    },

    initialize: function() {
        var model = this;

        this.on("change", this.updateDB, this);

        pm.indexedDB.helpers.getHelper("oAuth1", function(helper) {
            if (helper) {
                model.set(helper);
                model.generateHelper()
            }
        });
    },

    updateDB: function() {
        var helper = {
            id: "oAuth1",
            time: new Date().getTime(),
            consumerKey: this.get("consumerKey"),
            consumerSecret: this.get("consumerSecret"),
            token: this.get("token"),
            tokenSecret: this.get("tokenSecret"),
            signatureMethod: this.get("signatureMethod"),
            timestamp: this.get("timestamp"),
            nonce: this.get("nonce"),
            version: this.get("version"),
            realm: this.get("realm"),
            header: this.get("header"),
            auto: this.get("auto")
        };

        pm.indexedDB.helpers.addHelper(helper, function(helper) {
        });
    },

    generateHelper: function () {
        if(this.get("version") === "") {
            this.set("version", "1.0");
        }

        if(this.get("signatureMethod" === "")) {
            this.set("signatureMethod", "HMAC-SHA1");
        }

        this.set("timestamp", OAuth.timestamp() + "");
        this.set("nonce", OAuth.nonce(6));
    },

    generateSignature: function () {
        //Make sure the URL is urlencoded properly
        //Set the URL keyval editor as well. Other get params disappear when you click on URL params again
        var request = this.get("request");
        var i;
        var url = request.get("url");
        if (url === '') {
            noty(
                {
                    type:'success',
                    text:'Please enter a URL first',
                    layout:'topCenter',
                    timeout:750
                });

            return null;
        }

        var processedUrl;

        var realm = this.get("realm");
        var method = request.get("method");
        var requestBody = request.get("body");

        if (realm === '') {
            processedUrl = pm.envManager.getCurrentValue(url).trim();
        }
        else {
            processedUrl = pm.envManager.getCurrentValue(realm);
        }

        processedUrl = ensureProperUrl(processedUrl);

        if (processedUrl.indexOf('?') > 0) {
            processedUrl = processedUrl.split("?")[0];
        }

        var message = {
            action: processedUrl,
            method: method,
            parameters: []
        };

        var signatureParams = [
            {key: "oauth_consumer_key", value: this.get("consumerKey")},
            {key: "oauth_token", value: this.get("token")},
            {key: "oauth_signature_method", value: this.get("signatureMethod")},
            {key: "oauth_timestamp", value: this.get("timestamp")},
            {key: "oauth_nonce", value: this.get("nonce")},
            {key: "oauth_version", value: this.get("version")}
        ];

        for(i = 0; i < signatureParams.length; i++) {
            var param = signatureParams[i];
            param.value = pm.envManager.getCurrentValue(param.value);
            message.parameters.push([param.key, param.value]);
        }

        //Get parameters
        var urlParams = request.getUrlParams();

        var bodyParams;

        if (isMethodWithBody(method)) {
            bodyParams = requestBody.get("dataAsObjects");
        }
        else {
            bodyParams = [];
        }

        var params = _.union(urlParams, bodyParams);
        var param;
        var existingOAuthParams = _.union(signatureParams, [{key: "oauth_signature", value: ""}]);
        var pos;

        for (i = 0; i < params.length; i++) {
            param = params[i];
            if (param.key) {
                pos = findPosition(existingOAuthParams, "key", param.key);
                if (pos < 0) {
                    param.value = pm.envManager.getCurrentValue(param.value);
                    message.parameters.push([param.key, param.value]);
                }
            }
        }

        var accessor = {};
        if (this.get("consumerSecret") !=='') {
            accessor.consumerSecret = this.get("consumerSecret");
            accessor.consumerSecret = pm.envManager.getCurrentValue(accessor.consumerSecret);
        }
        if (this.get("tokenSecret") !=='') {
            accessor.tokenSecret = this.get("tokenSecret");
            accessor.tokenSecret = pm.envManager.getCurrentValue(accessor.tokenSecret);
        }

        return OAuth.SignatureMethod.sign(message, accessor);
    },

    removeOAuthKeys: function (params) {
        var i, count;
        var oauthParams = [
            "oauth_consumer_key",
            "oauth_token",
            "oauth_signature_method",
            "oauth_timestamp",
            "oauth_nonce",
            "oauth_version",
            "oauth_signature"
        ];

        var newParams = [];
        var oauthIndexes = [];
        for (i = 0, count = params.length; i < count; i++) {
            var index = _.indexOf(oauthParams, params[i].key);
            if (index < 0) {
                newParams.push(params[i]);
            }
        }

        return newParams;
    },

    process: function () {
        var request = this.get("request");
        request.trigger("updateModel");

        var i, j, count, length;
        var params = [];

        var urlParams = request.getUrlParams();
        var bodyParams = [];

        var url = request.get("url");
        var body = request.get("body");
        var dataMode = body.get("dataMode");
        var method = request.get("method");

        // TODO Need to test if this works
        var bodyParams = body.get("dataAsObjects");

        params = params.concat(urlParams);
        params = params.concat(bodyParams);

        params = this.removeOAuthKeys(params);

        var signatureKey = "oauth_signature";

        var oAuthParams = [];

        var signatureParams = [
            {key: "oauth_consumer_key", value: this.get("consumerKey")},
            {key: "oauth_token", value: this.get("token")},
            {key: "oauth_signature_method", value: this.get("signatureMethod")},
            {key: "oauth_timestamp", value: this.get("timestamp")},
            {key: "oauth_nonce", value: this.get("nonce")},
            {key: "oauth_version", value: this.get("version")}
        ];

        for(i = 0; i < signatureParams.length; i++) {
            var param = signatureParams[i];
            param.value = pm.envManager.getCurrentValue(param.value);
            oAuthParams.push(param);
        }

        //Convert environment values
        for (i = 0, length = params.length; i < length; i++) {
            params[i].value = pm.envManager.getCurrentValue(params[i].value);
        }

        var signature = this.generateSignature();

        if (signature === null) {
            return;
        }

        oAuthParams.push({key: signatureKey, value: signature});

        var addToHeader = this.get("header");

        if (addToHeader) {
            var realm = this.get("realm");

            if (realm === '') {
                realm = pm.envManager.getCurrentValue(url.trim());
            }

            if (realm.indexOf('?') > 0) {
                realm = realm.split("?")[0];
            }

            var authHeaderKey = "Authorization";
            var rawString = "OAuth realm=\"" + realm + "\",";
            var len = oAuthParams.length;

            for (i = 0; i < len; i++) {
                rawString += encodeURIComponent(oAuthParams[i].key) + "=\"" + encodeURIComponent(oAuthParams[i].value) + "\",";
            }

            rawString = rawString.substring(0, rawString.length - 1);
            request.setHeader(authHeaderKey, rawString);
            request.trigger("customHeaderUpdate");
        } else {
            params = params.concat(oAuthParams);

            if (!request.isMethodWithBody(method)) {
                request.setUrlParamString(params);
                request.trigger("customURLParamUpdate");
            } else {
                if (dataMode === 'urlencoded') {
                    body.loadData("urlencoded", params, true);
                }
                else if (dataMode === 'params') {
                    body.loadData("params", params, true);
                }
                else if (dataMode === 'raw') {
                    request.setUrlParamString(params);
                    request.trigger("customURLParamUpdate");
                }
            }
        }
    }
});

var OAuth2TokenFetcher = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "oAuth2",
            "authorization_url": "",
            "access_token_url": "",
            "client_id": "",
            "client_secret": "",
            "scope": ""
        };
    },

    initialize: function() {
        var model = this;

        this.on("startAuthorization", this.startAuthorization);

        this.on("change", this.updateDB, this);

        pm.indexedDB.helpers.getHelper("oAuth2", function(helper) {
            if (helper) {
                model.set(helper);
            }
        });
    },

    updateDB: function() {
        var helper = {
            "id": this.get("id"),
            "authorization_url": this.get("authorization_url"),
            "access_token_url": this.get("access_token_url"),
            "client_id": this.get("client_id"),
            "client_secret": this.get("client_secret"),
            "scope": this.get("scope"),
            "timestamp": new Date().getTime()
        };

        pm.indexedDB.helpers.addHelper(helper, function(h) {
        });
    },

    startAuthorization: function(params) {
        this.set(params);

        var postmanAuthUrl = pm.webUrl + "/oauth2/start";
        postmanAuthUrl += "?authorization_url=" + encodeURIComponent(this.get("authorization_url"));
        postmanAuthUrl += "&access_token_url=" + encodeURIComponent(this.get("access_token_url"));
        postmanAuthUrl += "&client_id=" + encodeURIComponent(this.get("client_id"));
        postmanAuthUrl += "&client_secret=" + encodeURIComponent(this.get("client_secret"));
        postmanAuthUrl += "&scope=" + encodeURIComponent(this.get("scope"));

        console.log(postmanAuthUrl);

        chrome.identity.launchWebAuthFlow({'url': postmanAuthUrl, 'interactive': true},
            function(redirect_url) {
                if (chrome.runtime.lastError) {
                    pm.mediator.trigger("notifyError", "Could not initiate OAuth 2 flow");
                }
                else {
                    var params = getUrlVars(redirect_url);
                    console.log("Show form", params);
                    pm.mediator.trigger("addOAuth2Token", params);
                }
            }
        );
    }
});
var OAuth2Token = Backbone.Model.extend({
	defaults: function() {
		return {
		    "id": "",
		    "name": "OAuth2 Token",
		    "access_token": "",
		    "expires_in": 0,
		    "timestamp": 0
		};
	}

});

var OAuth2Tokens = Backbone.Collection.extend({
	model: OAuth2Token,

	comparator: function(a, b) {
	    var counter;

	    var at = a.get("timestamp");
	    var bt = b.get("timestamp");

	    return at > bt;
	},

	initialize: function() {
		pm.mediator.on("addOAuth2Token", this.addAccessToken, this);
		pm.mediator.on("updateOAuth2Token", this.updateAccessToken, this);
		this.loadAllAccessTokens();
	},

	loadAllAccessTokens: function() {
		var collection = this;

		pm.indexedDB.oAuth2AccessTokens.getAllAccessTokens(function(accessTokens) {
			collection.add(accessTokens, {merge: true});
			collection.trigger("change");
		});
	},

	addAccessToken: function(tokenData) {
		var collection = this;

		var id = guid();
		var accessToken = {
			"id": guid(),
			"timestamp": new Date().getTime(),
			"data": tokenData
		};

		if (tokenData.hasOwnProperty("access_token")) {
			accessToken.access_token = tokenData.access_token;
		}

		pm.indexedDB.oAuth2AccessTokens.addAccessToken(accessToken, function(a) {
			var at = new OAuth2Token(accessToken);
			collection.add(at, {merge: true});
			console.log("OAuth2Tokens, Calling addedOAuth2Token");
			pm.mediator.trigger("addedOAuth2Token", a);
		});
	},

	updateAccessToken: function(params) {
		var token = this.get(params.id);
		token.set("name", params.name);
		pm.indexedDB.oAuth2AccessTokens.updateAccessToken(token.toJSON(), function(a) {
			console.log("Updated access token");
			pm.mediator.trigger("updatedOAuth2Token", a.id);
		});
	},

	deleteAccessToken: function(id) {
		console.log("Removing access token");
		this.remove(id);
		pm.indexedDB.oAuth2AccessTokens.deleteAccessToken(id, function() {
			console.log("Deleted token");
		});
	},

	addAccessTokenToRequest: function(id, type) {
		var token = this.get(id);
		var data = token.get("data");
		var index = arrayObjectIndexOf(data, "access_token", "key");

		if (type === "url") {
			var accessTokenParam = {
				key: "access_token",
				value: data[index].value
			};
			pm.mediator.trigger("addRequestURLParam", accessTokenParam);
		}
		else if (type === "header") {
			var accessTokenHeader = {
				key: "Authorization",
				value: "Bearer " + data[index].value
			};
			pm.mediator.trigger("addRequestHeader", accessTokenHeader);
			// TODO Not implemented yet
		}

	}
});
var BasicAuthForm = Backbone.View.extend({
    initialize: function() {
        this.model.on("change:username", this.render, this);
        this.model.on("change:password", this.render, this);

        var view = this;
        var model = this.model;

        $('#request-helper-basicAuth .request-helper-submit').on("click", function () {
            $('#request-helpers').css("display", "none");
            var username = $('#request-helper-basicAuth-username').val();
            var password = $('#request-helper-basicAuth-password').val();

            model.set({"username": username, "password": password});
            model.process();
        });

        $('#request-helper-basicAuth .request-helper-clear').on("click", function () {
            view.clearFields();
        });
    },

    clearFields: function() {
        this.model.set({"username": "", "password": ""});
        $('#request-helper-basicAuth-username').val("");
        $('#request-helper-basicAuth-password').val("");
    },

    save: function() {
        var username = $('#request-helper-basicAuth-username').val();
        var password = $('#request-helper-basicAuth-password').val();
        this.model.set({"username": username, "password": password});
    },

    render: function() {
        $('#request-helper-basicAuth-username').val(this.model.get("username"));
        $('#request-helper-basicAuth-password').val(this.model.get("password"));
    }
});

var DigestAuthForm = Backbone.View.extend({
    initialize: function() {
        this.model.on("change", this.render, this);

        var view = this;
        var model = this.model;

        $('#request-helper-digestAuth .request-helper-submit').on("click", function () {
            $('#request-helpers').css("display", "none");
            var helper = {
                id: "digest",
                time: new Date().getTime(),
                realm: $("#request-helper-digestAuth-realm").val(),
                username: $("#request-helper-digestAuth-username").val(),
                password: $("#request-helper-digestAuth-password").val(),
                nonce: $("#request-helper-digestAuth-nonce").val(),
                algorithm: $("#request-helper-digestAuth-algorithm").val(),
                nonceCount: $("#request-helper-digestAuth-nonceCount").val(),
                clientNonce: $("#request-helper-digestAuth-clientNonce").val(),
                opaque: $("#request-helper-digestAuth-opaque").val(),
                qop: $("#request-helper-digestAuth-qop").val()
            };

            model.set(helper);
            model.process();
        });

        $('#request-helper-digestAuth .request-helper-clear').on("click", function () {
            view.clearFields();
        });
    },

    clearFields: function () {
        $("#request-helper-digestAuth-realm").val("");
        $("#request-helper-digestAuth-username").val("");
        $("#request-helper-digestAuth-password").val("");
        $("#request-helper-digestAuth-nonce").val("");
        $("#request-helper-digestAuth-algorithm").val("");
        $("#request-helper-digestAuth-nonceCount").val("");
        $("#request-helper-digestAuth-clientNonce").val("");
        $("#request-helper-digestAuth-opaque").val("");
        $("#request-helper-digestAuth-qop").val("");

        //set values in the model
        var helper = {
            id: "digest",
            time: new Date().getTime(),
            realm: "",
            username: "",
            password: "",
            nonce: "",
            algorithm: "",
            nonceCount: "",
            clientNonce: "",
            opaque: "",
            qop: ""
        };

        this.model.set(helper);
    },

    save: function() {
        var helper = {
            id: "digest",
            time: new Date().getTime(),
            realm: $("#request-helper-digestAuth-realm").val(),
            username: $("#request-helper-digestAuth-username").val(),
            password: $("#request-helper-digestAuth-password").val(),
            nonce: $("#request-helper-digestAuth-nonce").val(),
            algorithm: $("#request-helper-digestAuth-algorithm").val(),
            nonceCount: $("#request-helper-digestAuth-nonceCount").val(),
            clientNonce: $("#request-helper-digestAuth-clientNonce").val(),
            opaque: $("#request-helper-digestAuth-opaque").val(),
            qop: $("#request-helper-digestAuth-qop").val()
        };

        //Replace this with the call to the model
        this.model.set(helper);
    },

    render: function() {
        $("#request-helper-digestAuth-realm").val(this.model.get("realm"));
        $("#request-helper-digestAuth-username").val(this.model.get("username"));
        $("#request-helper-digestAuth-algorithm").val(this.model.get("algorithm"));
        $("#request-helper-digestAuth-password").val(this.model.get("password"));
        $("#request-helper-digestAuth-nonce").val(this.model.get("nonce"));
        $("#request-helper-digestAuth-nonceCount").val(this.model.get("nonceCount"));
        $("#request-helper-digestAuth-clientNonce").val(this.model.get("clientNonce"));
        $("#request-helper-digestAuth-opaque").val(this.model.get("opaque"));
        $("#request-helper-digestAuth-qop").val(this.model.get("qop"));
    }
});
var HelperManager = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        var basicAuthForm = new BasicAuthForm({model: model.get("basicAuth")});
        var digestAuthForm = new DigestAuthForm({model: model.get("digestAuth")});
        var oAuth1Form = new OAuth1Form({model: model.get("oAuth1")});
        var oAuth2Manager = new OAuth2Manager({model: model.get("oAuth2")});

        this.model.on("change:activeHelper", this.render, this);

        var request = model.get("request");

        request.on("loadRequest", this.onLoadRequest, this);

        var view = this;

        $("#request-types .request-helper-tabs li").on("click", function () {
            $("#request-types .request-helper-tabs li").removeClass("active");
            $(event.currentTarget).addClass("active");
            var type = $(event.currentTarget).attr('data-id');
            view.showRequestHelper(type);
            view.render();
        });
    },

    onLoadRequest: function() {
        this.showRequestHelper("normal");
    },

    getActiveHelperType: function() {
        return this.model.get("activeHelper");
    },

    getHelper: function(type) {
        return this.model.get(type);
    },

    showRequestHelper: function (type) {
        this.model.set("activeHelper", type);
        return false;
    },

    render: function() {
        var type = this.model.get("activeHelper");

        $("#request-types ul li").removeClass("active");
        $('#request-types ul li[data-id=' + type + ']').addClass('active');
        if (type !== "normal") {
            $('#request-helpers').css("display", "block");
        }
        else {
            $('#request-helpers').css("display", "none");
        }

        if (type.toLowerCase() === 'oauth1') {
            this.model.get("oAuth1").generateHelper();
        }

        $('.request-helpers').css("display", "none");
        $('#request-helper-' + type).css("display", "block");
    }
});
var OAuth1Form = Backbone.View.extend({
    initialize: function() {
        this.model.on("change", this.render, this);

        var view = this;
        var model = this.model;

        $('#request-helper-oAuth1 .request-helper-submit').on("click", function () {
            $('#request-helpers').css("display", "none");
            _.bind(view.save, view)();
            _.bind(model.process, model)();
        });

        $('#request-helper-oAuth1 .request-helper-clear').on("click", function () {
            view.clearFields();
        });

        $('#request-helper-oauth1-auto').click(function () {
            var isAutoEnabled = $('#request-helper-oauth1-auto').attr('checked') ? true : false;

            model.set("auto", isAutoEnabled);

            if (!isAutoEnabled) {
                $('#request-helper-oAuth1 .request-helper-submit').css("display", "inline-block");
            }
            else {
                $('#request-helper-oAuth1 .request-helper-submit').css("display", "none");
            }
        });

        $('#request-helper-oauth1-header').click(function () {
            view.save();
        });
    },

    clearFields: function() {
        $("#request-helper-oauth1-consumerKey").val("");
        $("#request-helper-oauth1-consumerSecret").val("");
        $("#request-helper-oauth1-token").val("");
        $("#request-helper-oauth1-tokenSecret").val("");
        $("#request-helper-oauth1-signatureMethod").val("HMAC-SHA1");
        $("#request-helper-oauth1-timestamp").val("");
        $("#request-helper-oauth1-nonce").val("");
        $("#request-helper-oauth1-version").val("");
        $("#request-helper-oauth1-realm").val("");
        $("#request-helper-oauth1-header").prop("checked", false);
        $("#request-helper-oauth1-auto").prop("checked", false);

        var helper = {
            id: "oAuth1",
            time: new Date().getTime(),
            consumerKey: "",
            consumerSecret: "",
            token: "",
            tokenSecret: "",
            signatureMethod: "HMAC-SHA1",
            timestamp: "",
            nonce: "",
            version: "",
            realm: "",
            header: false,
            auto: false
        };

        this.model.set(helper);
    },

    save: function() {
        var helper = {
            id: "oAuth1",
            time: new Date().getTime(),
            consumerKey: $("#request-helper-oauth1-consumerKey").val(),
            consumerSecret: $("#request-helper-oauth1-consumerSecret").val(),
            token: $("#request-helper-oauth1-token").val(),
            tokenSecret: $("#request-helper-oauth1-tokenSecret").val(),
            signatureMethod: $("#request-helper-oauth1-signatureMethod").val(),
            timestamp: $("#request-helper-oauth1-timestamp").val(),
            nonce: $("#request-helper-oauth1-nonce").val(),
            version: $("#request-helper-oauth1-version").val(),
            realm: $("#request-helper-oauth1-realm").val(),
            header: $("#request-helper-oauth1-header").prop("checked"),
            auto: $("#request-helper-oauth1-auto").prop("checked")
        };

        this.model.set(helper);
    },

    render: function() {
        $("#request-helper-oauth1-consumerKey").val(this.model.get("consumerKey"));
        $("#request-helper-oauth1-consumerSecret").val(this.model.get("consumerSecret"));
        $("#request-helper-oauth1-token").val(this.model.get("token"));
        $("#request-helper-oauth1-tokenSecret").val(this.model.get("tokenSecret"));
        $("#request-helper-oauth1-signatureMethod").val(this.model.get("signatureMethod"));
        $("#request-helper-oauth1-timestamp").val(this.model.get("timestamp"));
        $("#request-helper-oauth1-nonce").val(this.model.get("nonce"));
        $("#request-helper-oauth1-version").val(this.model.get("version"));
        $("#request-helper-oauth1-realm").val(this.model.get("realm"));

        $("#request-helper-oauth1-header").prop("checked", this.model.get("header"));
        $("#request-helper-oauth1-auto").prop("checked", this.model.get("auto"));

        if (this.model.get("auto")) {
            $('#request-helper-oAuth1 .request-helper-submit').css("display", "none");
        }
        else {
            $('#request-helper-oAuth1 .request-helper-submit').css("display", "inline-block");
        }
    }
});

var OAuth2Form = Backbone.View.extend({
    initialize: function() {
        this.model.on("change", this.render, this);

        var view = this;
        var model = this.model;

        $("#request-helper-oauth2-authorization-url").autocomplete({
            source: oAuth2AuthorizationUrls,
            delay: 50
        });

        $("#request-helper-oauth2-access-token-url").autocomplete({
            source: oAuth2TokenUrls,
            delay: 50
        });

        $("#request-helper-oAuth2 .request-helper-back").on("click", function () {
            view.save();
            view.showAccessTokens();
        });

        $('#request-helper-oAuth2 .request-helper-submit').on("click", function () {
            var params = {
                "authorization_url": pm.envManager.getCurrentValue($("#request-helper-oauth2-authorization-url").val()),
                "access_token_url": pm.envManager.getCurrentValue($("#request-helper-oauth2-access-token-url").val()),
                "client_id": pm.envManager.getCurrentValue($("#request-helper-oauth2-client-id").val()),
                "client_secret": pm.envManager.getCurrentValue($("#request-helper-oauth2-client-secret").val()),
                "scope": pm.envManager.getCurrentValue($("#request-helper-oauth2-scope").val())
            };

            view.save();
            model.trigger("startAuthorization", params);
        });

        $('#request-helper-oAuth2 .request-helper-save').on("click", function () {
            var name = $("#request-helper-oauth2-name").val();
            var id = $(this).attr("data-id");

            var params = {
                "id": id,
                "name": name
            };

            pm.mediator.trigger("updateOAuth2Token", params);
        });

        pm.mediator.on("addedOAuth2Token", this.onAddedOAuth2Token, this);
    },

    onAddedOAuth2Token: function(params) {
        console.log(params);
        $('#request-helper-oAuth2-access-token-data').html("");
        $('#request-helper-oAuth2-access-token-data').append(Handlebars.templates.environment_quicklook({"items": params.data}));
        $("#request-helper-oAuth2 .request-helper-save").attr("data-id", params.id);
        this.showSaveForm();
    },

    showSaveForm: function() {
        $("#request-helper-oAuth2-access-tokens-container").css("display", "none");
        $("#request-helper-oAuth2-access-token-form").css("display", "none");
        $("#request-helper-oAuth2-access-token-save-form").css("display", "block");
    },

    showAccessTokens: function() {
        $("#request-helper-oAuth2-access-tokens-container").css("display", "block");
        $("#request-helper-oAuth2-access-token-save-form").css("display", "none");
        $("#request-helper-oAuth2-access-token-form").css("display", "none");
    },

    save: function() {
        var helper = {
            "id": "oAuth2",
            "authorization_url": $("#request-helper-oauth2-authorization-url").val(),
            "access_token_url": $("#request-helper-oauth2-access-token-url").val(),
            "client_id": $("#request-helper-oauth2-client-id").val(),
            "client_secret": $("#request-helper-oauth2-client-secret").val(),
            "scope": $("#request-helper-oauth2-scope").val(),
            "time": new Date().getTime()
        };

        console.log("Save", helper);

        this.model.set(helper);
    },

    render: function() {
        $("#request-helper-oauth2-authorization-url").val(this.model.get("authorization_url"));
        $("#request-helper-oauth2-access-token-url").val(this.model.get("access_token_url"));
        $("#request-helper-oauth2-client-id").val(this.model.get("client_id"));
        $("#request-helper-oauth2-client-secret").val(this.model.get("client_secret"));
        $("#request-helper-oauth2-scope").val(this.model.get("scope"));
    }
});

var OAuth2Manager = Backbone.View.extend({
	initialize: function() {
		var model = this;
		var view = this;

		var oAuth2Form = new OAuth2Form({model: this.model});

		pm.mediator.on("showAccessTokens", this.showAccessTokens, this);
		pm.mediator.on("updatedOAuth2Token", this.showAccessTokens, this);

		// Click event to load access_token
		// Delete event
		$("#request-helper-oAuth2-access-token-get").on("click", function () {
		    view.showAccessTokenForm();
		});
	},

	showAccessTokenForm: function() {
	    $("#request-helper-oAuth2-access-tokens-container").css("display", "none");
	    $("#request-helper-oAuth2-access-token-save-form").css("display", "none");
	    $("#request-helper-oAuth2-access-token-form").css("display", "block");
	},

	showAccessTokens: function() {
	    $("#request-helper-oAuth2-access-tokens-container").css("display", "block");
	    $("#request-helper-oAuth2-access-token-save-form").css("display", "none");
	    $("#request-helper-oAuth2-access-token-form").css("display", "none");
	},

	render: function() {
		// Render list event
	}

});
var OAuth2TokenList = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("add", this.render, this);
		model.on("remove", this.render, this);
		model.on("change", this.render, this);

		// Click event to load access_token
		// Delete event

		$("#request-helper-oAuth2-access-tokens").on("mouseenter", ".oauth2-access-token-container", function() {
			var actionsEl = $('.oauth2-access-token-actions', this);
			actionsEl.css('display', 'block');
		});

		$("#request-helper-oAuth2-access-tokens").on("mouseleave", ".oauth2-access-token-container", function() {
		    var actionsEl = $('.oauth2-access-token-actions', this);
		    actionsEl.css('display', 'none');
		});

		$("#request-helper-oAuth2-access-tokens").on("click", ".oauth2-access-token-actions-load", function() {
		    var id = $(this).attr("data-id");
		    var location = $("#request-helper-oAuth2-options input[name='oAuth2-token-location']:checked").val();
		    model.addAccessTokenToRequest(id, location);
		});

		$("#request-helper-oAuth2-access-tokens").on("click", ".oauth2-access-token-actions-delete", function() {
		    var id = $(this).attr("data-id");
		    model.deleteAccessToken(id);
		});
	},

	render: function() {
		var tokens = this.model.toJSON();
		$("#request-helper-oAuth2-access-tokens").html("");
		$("#request-helper-oAuth2-access-tokens").append(Handlebars.templates.oauth2_access_tokens({"items": tokens}));
	}

});
var HistoryRequest = Backbone.Model.extend({
    defaults: function() {
        return {
        };
    }
});

var History = Backbone.Collection.extend({
    model: HistoryRequest,

    initialize: function() {
        var model = this;

        pm.indexedDB.getAllRequestItems(function (historyRequests) {
            var outAr = [];
            var count = historyRequests.length;

            if (count === 0) {
                historyRequests = [];
            }
            else {
                for (var i = 0; i < count; i++) {
                    var r = historyRequests[i];
                    pm.mediator.trigger("addToURLCache", r.url);

                    var request = r;
                    request.position = "top";

                    outAr.push(request);
                }
            }

            model.add(outAr, {merge: true});
        });
    },

    requestExists:function (request) {
        var index = -1;
        var method = request.method.toLowerCase();

        if (isMethodWithBody(method)) {
            return -1;
        }

        var requests = this.toJSON();
        var len = requests.length;

        for (var i = 0; i < len; i++) {
            var r = requests[i];
            if (r.url.length !== request.url.length ||
                r.headers.length !== request.headers.length ||
                r.method !== request.method) {
                index = -1;
            }
            else {
                if (r.url === request.url) {
                    if (r.headers === request.headers) {
                        index = i;
                    }
                }
            }

            if (index >= 0) {
                break;
            }
        }

        return index;
    },

    loadRequest:function (id) {
        var request = this.get(id).toJSON();
        pm.mediator.trigger("loadRequest", request, false, false);
        this.trigger("loadRequest");
    },

    addRequest:function (url, method, headers, data, dataMode) {
        var id = guid();
        var maxHistoryCount = pm.settings.getSetting("historyCount");
        var requests = this.toJSON();
        var requestsCount = requests.length;

        var collection = this;

        if(maxHistoryCount > 0) {
            if (requestsCount >= maxHistoryCount) {
                //Delete the last request
                var lastRequest = requests[0];
                this.deleteRequest(lastRequest.id);
            }
        }

        var historyRequest = {
            "id":id,
            "url":url.toString(),
            "method":method.toString(),
            "headers":headers.toString(),
            "data":data,
            "dataMode":dataMode.toString(),
            "timestamp":new Date().getTime(),
            "version": 2
        };

        var index = this.requestExists(historyRequest);

        if (index >= 0) {
            var deletedId = requests[index].id;
            this.deleteRequest(deletedId);
        }

        pm.indexedDB.addRequest(historyRequest, function (request) {
            pm.mediator.trigger("addToURLCache", request.url);
            var historyRequestModel = new HistoryRequest(request);
            historyRequestModel.set("position", "top");
            collection.add(historyRequestModel);
        });
    },


    deleteRequest:function (id) {
        var collection = this;

        pm.indexedDB.deleteRequest(id, function (request_id) {
            collection.remove(request_id);
        });
    },

    clear:function () {
        var collection = this;
        pm.indexedDB.deleteHistory(function () {
            collection.reset([]);
        });
    },

    filter: function(term) {
        var requests = this.toJSON();

        var count = requests.length;
        var filteredItems = [];
        for (var i = 0; i < count; i++) {
            var id = requests[i].id;
            var url = requests[i].url;

            var filteredItem = {
                id: id,
                url: url,
                toShow: false
            };
            url = url.toLowerCase();
            if (url.indexOf(term) >= 0) {
                filteredItem.toShow = true;
            }
            else {
                filteredItem.toShow = false;
            }

            filteredItems.push(filteredItem);
        }

        this.trigger("filter", filteredItems);

        return filteredItems;
    },

    revert: function() {
        this.trigger("revertFilter");
    }
});

var HistorySidebar = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        //Event: Load all
        //Event: Add request
        this.model.on("reset", this.render, this);
        this.model.on("add", this.addOne, this);
        this.model.on("remove", this.removeOne, this);

        this.model.on("filter", this.onFilter, this);
        this.model.on("revertFilter", this.onRevertFilter, this);
        //Event: Delete request

        $('.history-actions-delete').click(function () {
            model.clear();
        });

        $('#history-items').on("click", ".request-actions-delete", function () {
            var request_id = $(this).attr('data-request-id');
            model.deleteRequest(request_id);
        });

        $('#history-items').on("click", ".request", function () {
            var request_id = $(this).attr('data-request-id');
            model.loadRequest(request_id);
        });

        $('#history-items').on("mouseenter", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#history-items').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });

        var clearHistoryHandler = function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            pm.history.clear();
            return false;
        };

        $(document).bind('keydown', 'alt+c', clearHistoryHandler);

        this.showEmptyMessage();
    },

    addOne: function(model, collection) {
        var request = model.toJSON();

        var displayUrl = _.clone(request.url);
        var method = request.method;
        var id = request.id;
        var position = request.position;

        if (displayUrl.length > 80) {
            displayUrl = displayUrl.substring(0, 80) + "...";
        }

        displayUrl = limitStringLineWidth(displayUrl, 40);

        var request = {
            url:displayUrl,
            method:method,
            id:id,
            position:position
        };

        if (position === "top") {
            $('#history-items').prepend(Handlebars.templates.item_history_sidebar_request(request));
        }
        else {
            $('#history-items').append(Handlebars.templates.item_history_sidebar_request(request));
        }

        this.hideEmptyMessage();
    },

    showEmptyMessage:function () {
        $('#history-items').append(Handlebars.templates.message_no_history());
    },

    hideEmptyMessage:function () {
        $('#history-items .empty-message').remove();
    },

    removeOne:function (model, collection) {
        var historyRequest = model.toJSON();
        var id = historyRequest.id;

        $("#sidebar-request-" + model.id).remove();

        var requests = collection.toJSON();

        if (requests.length === 0) {
            this.showEmptyMessage();
        }
        else {
            this.hideEmptyMessage();
        }
    },

    render: function() {
        var requests = this.model.toJSON();

        if (requests.length === 0) {
            $('#history-items').html("");
            this.showEmptyMessage();
        }
        else {
            this.hideEmptyMessage();
            $('#history-items').append(Handlebars.templates.history_sidebar_requests({"items":requests}));
            $('#history-items').fadeIn();
        }
    },

    onFilter: function(filteredHistoryItems) {
        var count = filteredHistoryItems.length;
        for(var i = 0; i < count; i++) {
            var item = filteredHistoryItems[i];
            var id = "#sidebar-request-" + item.id;

            if(item.toShow) {
                $(id).css("display", "block");
            }
            else {
                $(id).css("display", "none");
            }
        }
    },

    onRevertFilter: function() {
        $("#history-items li").css("display", "block");
    }
});
var PostmanAPI = Backbone.Model.extend({
	defaults: function() {
		return {
			"web_url": pm.webUrl
		}
	},

	initialize: function() {
		console.log("This is going to be the awesome postman API!");
	},

	isTokenValid: function() {
		var user = pm.user;

		var expiresIn = user.get("expires_in");
		var loggedInAt = user.get("logged_in_at");

		var now = new Date().getTime();

		if (loggedInAt + expiresIn > now) {
			return true;
		}
		else {
			return false;
		}
	},

	exchangeRefreshToken: function(successCallback) {
		console.log("Trying to exchangeRefreshToken");

		var postUrl = pm.webUrl + "/client-oauth2-refresh";
		postUrl += "?user_id=" + pm.user.get("id");

		var parameters = {
			"grant_type": "refresh_token",
			"refresh_token": pm.user.get("refresh_token")
		};

		$.ajax({
			type: 'POST',
			url: postUrl,
			data: parameters,
			success: function(data) {
				console.log("Received refresh_token", data);

				if (data.hasOwnProperty("result")) {
					var result = data.hasOwnProperty("result");
					if (!result) {
						pm.mediator.trigger("invalidRefreshToken");
					}
				}
				else if (data.hasOwnProperty("access_token")) {
					pm.user.setAccessToken(data);
					if (successCallback) {
						successCallback();
					}
				}
			}
		})
	},

	logoutUser: function(userId, accessToken, successCallback) {
		var postUrl = pm.webUrl + '/client-logout';
	    postUrl += "?user_id=" + userId;
	    postUrl += "&access_token=" + accessToken;

		$.ajax({
			type: 'POST',
			url: postUrl,
			success: function() {
				if (successCallback) {
					successCallback();
				}
			}
		})
	},

	executeAuthenticatedRequest: function(func) {
		var isTokenValid = this.isTokenValid();

		if (isTokenValid) {
			func();
		}
		else {
			this.exchangeRefreshToken(function() {
				func();
			});
		}
	},

	uploadCollection: function(collectionData, isPublic, successCallback) {
		var uploadUrl = pm.webUrl + '/collections?is_public=' + isPublic;

		if (pm.user.isLoggedIn()) {
		    this.executeAuthenticatedRequest(function() {
		    	uploadUrl += "&user_id=" + pm.user.get("id");
		    	uploadUrl += "&access_token=" + pm.user.get("access_token");

		    	$.ajax({
		    	    type:'POST',
		    	    url:uploadUrl,
		    	    data:collectionData,
		    	    success:function (data) {
		    	    	if (successCallback) {
		    	    		successCallback(data);
		    	    	}
		    	    }
		    	});
		    });
		}
		else {
			$.ajax({
			    type:'POST',
			    url:uploadUrl,
			    data:collectionData,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		}
	},

	getDirectoryCollections: function(startId, count, order, successCallback) {
		var getUrl = pm.webUrl + "/collections";
		getUrl += "?user_id=" + pm.user.get("id");
		getUrl += "&access_token=" + pm.user.get("access_token");
		getUrl += "&start_id=" + startId;
		getUrl += "&count=" + count;
		getUrl += "&order=" + order;

		$.ajax({
		    type:'GET',
		    url:getUrl,
		    success:function (collections) {
		    	if (successCallback) {
		    		successCallback(collections);
		    	}
		    }
		});
	},

	downloadDirectoryCollection: function(link_id, successCallback) {
	    var getUrl = pm.webUrl + "/collections/" + link_id;
	    getUrl += "?user_id=" + pm.user.get("id");
	    getUrl += "&access_token=" + pm.user.get("access_token");

	    $.get(getUrl, function (data) {
	    	if (successCallback) {
	    		successCallback(data);
	    	}
	    });
	},

	getUserCollections: function(successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var getUrl = pm.webUrl + "/users/" + user.get("id") + "/collections";
			getUrl += "?user_id=" + user.get("id");
			getUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'GET',
			    url:getUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	deleteSharedCollection: function(id, successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var deleteUrl = pm.webUrl + "/users/" + user.get("id") + "/collections/" + id;
			deleteUrl += "?user_id=" + user.get("id");
			deleteUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'DELETE',
			    url:deleteUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	getCollectionFromRemoteId: function(id, successCallback) {
		var getUrl = pm.webUrl + "/collections/" + id;
		getUrl += "?id_type=remote&user_id=" + pm.user.get("id");
		getUrl += "&access_token=" + pm.user.get("access_token");

		$.get(getUrl, function (data) {
			if (successCallback) {
				successCallback(data);
			}
		});
	}

})
var Request = Backbone.Model.extend({
    defaults: function() {
        return {
            url:"",
            urlParams:{},
            name:"",
            description:"",
            descriptionFormat:"markdown",
            bodyParams:{},
            headers:[],
            method:"GET",
            dataMode:"params",
            isFromCollection:false,
            collectionRequestId:"",
            methodsWithBody:["POST", "PUT", "PATCH", "DELETE", "LINK", "UNLINK"],
            areListenersAdded:false,
            startTime:0,
            endTime:0,
            xhr:null,
            editorMode:0,
            responses:[],
            body:null,
            data:null,
            previewHtml:"",
            curlHtml:""
        };
    },

    // Fixed
    initialize: function() {
        var requestBody = new RequestBody();
        var response = new Response();

        this.set("body", requestBody);
        this.set("response", response);

        this.on("cancelRequest", this.onCancelRequest, this);
        this.on("startNew", this.onStartNew, this);
        this.on("send", this.onSend, this);

        pm.mediator.on("addRequestURLParam", this.onAddRequestURLParam, this);
        pm.mediator.on("addRequestHeader", this.onAddRequestHeader, this);

        pm.mediator.on("loadRequest", this.loadRequest, this);
        pm.mediator.on("saveSampleResponse", this.saveSampleResponse, this);
        pm.mediator.on("loadSampleResponse", this.loadSampleResponse, this);
        pm.mediator.on("getRequest", this.onGetRequest, this);
        pm.mediator.on("updateCollectionRequest", this.checkIfCurrentRequestIsUpdated, this);
    },

    onAddRequestURLParam: function(param) {
        var urlParams = this.getUrlParams();
        var index = arrayObjectIndexOf(urlParams, "access_token", "key");

        if (index >= 0) {
            urlParams.splice(index, 1);
        }

        urlParams.push(param);
        this.setUrlParamString(urlParams);
        this.trigger("customURLParamUpdate");
    },

    onAddRequestHeader: function(param) {
        this.setHeader(param.key, param.value);
        this.trigger("customHeaderUpdate");
    },

    onGetRequest: function(callback) {
        callback(this);
    },

    onCancelRequest: function() {
        this.startNew();
    },

    onStartNew: function() {
        this.startNew();
    },

    onSend: function(type, action) {
        this.send(type, action);
    },

    isMethodWithBody:function (method) {
        return isMethodWithBody(method);
    },

    packHeaders:function (headers) {
        var headersLength = headers.length;
        var paramString = "";
        for (var i = 0; i < headersLength; i++) {
            var h = headers[i];
            if (h.name && h.name !== "") {
                paramString += h.name + ": " + h.value + "\n";
            }
        }

        return paramString;
    },

    getHeaderValue:function (key) {
        var headers = this.get("headers");

        key = key.toLowerCase();
        for (var i = 0, count = headers.length; i < count; i++) {
            var headerKey = headers[i].key.toLowerCase();

            if (headerKey === key) {
                return headers[i].value;
            }
        }

        return false;
    },

    saveCurrentRequestToLocalStorage:function () {
        pm.settings.setSetting("lastRequest", this.getAsJson());
    },

    getTotalTime:function () {
        var totalTime = this.get("endTime") - this.get("startTime");
        this.set("totalTime", totalTime);
        return totalTime;
    },

    getPackedHeaders:function () {
        return this.packHeaders(this.get("headers"));
    },

    unpackHeaders:function (data) {
        if (data === null || data === "") {
            return [];
        }
        else {
            var vars = [], hash;
            var hashes = data.split('\n');
            var header;

            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i];
                if (!hash) {
                    continue;
                }

                var loc = hash.search(':');

                if (loc !== -1) {
                    var name = $.trim(hash.substr(0, loc));
                    var value = $.trim(hash.substr(loc + 1));
                    header = {
                        "name":$.trim(name),
                        "key":$.trim(name),
                        "value":$.trim(value),
                        "description":headerDetails[$.trim(name).toLowerCase()]
                    };

                    vars.push(header);
                }
            }

            return vars;
        }
    },

    // Add Github bug number
    decodeLink:function (link) {
        return $(document.createElement('div')).html(link).text();
    },

    getUrlParams: function() {
        var params = getUrlVars(this.get("url"));
        return params;
    },

    setUrlParams: function(params) {
        this.set("urlParams", params);
    },

    setUrlParamString:function (params, silent) {
        var paramArr = [];
        var url = this.get("url");

        for (var i = 0; i < params.length; i++) {
            var p = params[i];
            if (p.key && p.key !== "") {
                p.key = p.key.replace(/&/g, '%26');
                p.value = p.value.replace(/&/g, '%26');

                paramArr.push(p.key + "=" + p.value);
            }
        }

        var baseUrl = url.split("?")[0];
        if (paramArr.length > 0) {
            url = baseUrl + "?" + paramArr.join('&');
        }
        else {
            //Has key/val pair
            if (url.indexOf("?") > 0 && url.indexOf("=") > 0) {
                url = baseUrl;
            }
        }

        if (silent) {
            this.set("url", url, { "silent": true });
            this.trigger("updateURLInputText");
        }
        else {
            this.set("url", url);
        }

    },

    encodeUrl:function (url) {
        var quesLocation = url.indexOf('?');

        if (quesLocation > 0) {
            var urlVars = getUrlVars(url);
            var baseUrl = url.substring(0, quesLocation);
            var urlVarsCount = urlVars.length;
            var newUrl = baseUrl + "?";
            for (var i = 0; i < urlVarsCount; i++) {
                newUrl += encodeURIComponent(urlVars[i].key) + "=" + encodeURIComponent(urlVars[i].value) + "&";
            }

            newUrl = newUrl.substr(0, newUrl.length - 1);
            return url;
        }
        else {
            return url;
        }
    },

    prepareHeadersForProxy:function (headers) {
        var count = headers.length;
        for (var i = 0; i < count; i++) {
            var key = headers[i].key.toLowerCase();
            if (_.indexOf(pm.bannedHeaders, key) >= 0) {
                headers[i].key = "Postman-" + headers[i].key;
                headers[i].name = "Postman-" + headers[i].name;
            }
        }

        return headers;
    },

    processUrl:function (url) {
        var finalUrl = pm.envManager.getCurrentValue(url);
        finalUrl = ensureProperUrl(finalUrl);
        return finalUrl;
    },

    splitUrlIntoHostAndPath: function(url) {
        var path = "";
        var host;

        var parts = url.split('/');
        host = parts[2];
        var partsCount = parts.length;
        for(var i = 3; i < partsCount; i++) {
            path += "/" + parts[i];
        }

        var quesLocation = path.indexOf('?');
        var hasParams = quesLocation >= 0 ? true : false;

        if (hasParams) {
            parts = getUrlVars(path);
            var count = parts.length;
            var encodedPath = path.substr(0, quesLocation + 1);
            for (var j = 0; j < count; j++) {
                var value = parts[j].value;
                var key = parts[j].key;
                value = encodeURIComponent(value);
                key = encodeURIComponent(key);

                encodedPath += key + "=" + value + "&";
            }

            encodedPath = encodedPath.substr(0, encodedPath.length - 1);

            path = encodedPath;
        }

        return { host: host, path: path };
    },

    getAsObject: function() {
        var body = this.get("body");

        var request = {
            url: this.get("url"),
            data: body.get("dataAsObjects"),
            headers: this.getPackedHeaders(),
            dataMode: body.get("dataMode"),
            method: this.get("method"),
            version: 2
        };

        return request;
    },

    getAsJson:function () {
        var body = this.get("body");

        var request = {
            url: this.get("url"),
            data: body.get("dataAsObjects"), //TODO This should be available in the model itself, asObjects = true
            headers: this.getPackedHeaders(),
            dataMode: body.get("dataMode"),
            method: this.get("method"),
            version: 2
        };

        return JSON.stringify(request);
    },

    startNew:function () {
        var body = this.get("body");
        var response = this.get("response");

        // TODO RequestEditor should be listening to this
        // TODO Needs to be made clearer
        this.set("editorMode", 0);

        var xhr = this.get("xhr");

        if (xhr) {
            xhr.abort();
            this.unset("xhr");
        }

        this.set("url", "");
        this.set("urlParams", {});
        this.set("bodyParams", {});
        this.set("name", "");
        this.set("description", "");
        this.set("headers", []);
        this.set("method", "GET");
        this.set("dataMode", "");
        this.set("isFromCollection", false);
        this.set("collectionRequestId", "");
        this.set("responses", []);

        body.set("data", "");

        this.trigger("loadRequest", this);
        response.trigger("clearResponse");
    },

    cancel:function () {
        var response = this.get("response");
        var xhr = this.get("xhr");
        if (xhr !== null) {
            xhr.abort();
        }

        response.clear();
    },

    saveSampleResponse: function(r) {
        var sampleRequest = this.getAsObject();
        var response = r;
        var collectionRequestId = this.get("collectionRequestId");

        response.request = sampleRequest;

        if (collectionRequestId) {
            var responses = this.get("responses");
            responses.push(response);
            this.trigger("change:responses");
            pm.mediator.trigger("addResponseToCollectionRequest", collectionRequestId, response);
        }
    },

    loadSampleResponseById: function(responseId) {
        var responses = this.get("responses");
        var location = arrayObjectIndexOf(responses, responseId, "id");
        console.log("Loading", responses, responses[location]);
        this.loadSampleResponse(responses[location]);
    },

    deleteSampleResponseById: function(responseId) {
        var collectionRequestId = this.get("collectionRequestId");

        if (collectionRequestId) {
            var responses = this.get("responses");
            var location = arrayObjectIndexOf(responses, responseId, "id");
            responses.splice(location, 1);
            this.trigger("change:responses");
            pm.mediator.trigger("updateResponsesForCollectionRequest", collectionRequestId, responses);
        }
    },

    loadSampleResponse: function(response) {
        this.set("url", response.request.url);
        this.set("method", response.request.method);

        console.log("Loading sample response headers", response.request.headers);

        this.set("headers", this.unpackHeaders(response.request.headers));
        this.set("data", response.request.data);
        this.set("dataMode", response.request.dataMode);

        this.trigger("loadRequest", this);

        var r = this.get("response");
        r.loadSampleResponse(this, response);
    },

    loadRequest: function(request, isFromCollection, isFromSample) {
        var body = this.get("body");
        var response = this.get("response");

        this.set("editorMode", 0);

        this.set("url", request.url);

        this.set("isFromCollection", isFromCollection);
        this.set("isFromSample", isFromSample);
        this.set("method", request.method.toUpperCase());

        if (isFromCollection) {
            this.set("collectionid", request.collectionid);
            this.set("collectionRequestId", request.id);

            if (typeof request.name !== "undefined") {
                this.set("name", request.name);
            }
            else {
                this.set("name", "");
            }

            if (typeof request.description !== "undefined") {
                this.set("description", request.description);
            }
            else {
                this.set("description", "");
            }

            if ("responses" in request) {
                this.set("responses", request.responses);
                if (request.responses) {
                }
                else {
                    this.set("responses", []);
                }

            }
            else {
                this.set("responses", []);
            }
        }
        else if (isFromSample) {
        }
        else {
            this.set("name", "");
        }

        if (typeof request.headers !== "undefined") {
            this.set("headers", this.unpackHeaders(request.headers));
        }
        else {
            this.set("headers", []);
        }

        response.clear();

        if (this.isMethodWithBody(this.get("method"))) {
            body.set("dataMode", request.dataMode);

            if("version" in request) {
                if(request.version === 2) {
                    body.loadData(request.dataMode, request.data, true);
                }
                else {
                    body.loadData(request.dataMode, request.data, false);
                }
            }
            else {
                body.loadData(request.dataMode, request.data, false);
            }

        }
        else {
            body.set("dataMode", "params");
        }

        response.trigger("clearResponse");
        this.trigger("loadRequest", this);
    },

    loadRequestFromLink:function (link, headers) {
        this.trigger("startNew");

        this.set("url", this.decodeLink(link));
        this.set("method", "GET");
        this.set("isFromCollection", false);

        if (pm.settings.getSetting("retainLinkHeaders") === true) {
            if (headers) {
                this.set("headers", headers);
            }
        }
    },

    prepareForSending: function() {
        console.log("Preparing request for sending", pm.helpers.getActiveHelperType(), pm.helpers.getHelper("oAuth1").get("auto"));

        if (pm.helpers.getActiveHelperType() === "oAuth1" && pm.helpers.getHelper("oAuth1").get("auto")) {
            console.log("Generating oAuth1 helper");
            pm.helpers.getHelper("oAuth1").generateHelper();
            pm.helpers.getHelper("oAuth1").process();
        }

        this.set("startTime", new Date().getTime());
    },

    setHeader: function(key, value) {
        var headers = _.clone(this.get("headers"));
        var contentTypeHeaderKey = key;
        var pos = findPosition(headers, "key", contentTypeHeaderKey);

        if (value === 'text') {
            if (pos >= 0) {
                headers.splice(pos, 1);
            }
        }
        else {
            if (pos >= 0) {
                headers[pos] = {
                    key: contentTypeHeaderKey,
                    name: contentTypeHeaderKey,
                    value: value
                };
            }
            else {
                headers.push({key: contentTypeHeaderKey, name: contentTypeHeaderKey, value: value});
            }
        }

        this.set("headers", headers);
    },

    getXhrHeaders: function() {
        var body = this.get("body");

        var headers = _.clone(this.get("headers"));
        if(pm.settings.getSetting("sendNoCacheHeader") === true) {
            var noCacheHeader = {
                key: "Cache-Control",
                name: "Cache-Control",
                value: "no-cache"
            };

            headers.push(noCacheHeader);
        }

        if(pm.settings.getSetting("sendPostmanTokenHeader") === true) {
            var postmanTokenHeader = {
                key: "Postman-Token",
                name: "Postman-Token",
                value: guid()
            };

            headers.push(postmanTokenHeader);
        }

        if (this.isMethodWithBody(this.get("method"))) {
            if(body.get("dataMode") === "urlencoded") {
                this.setHeader("Content-Type", "application/x-www-form-urlencoded");
            }

            headers = _.clone(this.get("headers"));
        }

        if (pm.settings.getSetting("usePostmanProxy") === true) {
            headers = this.prepareHeadersForProxy(headers);
        }


        var i;
        var finalHeaders = [];
        for (i = 0; i < headers.length; i++) {
            var header = headers[i];
            if (!_.isEmpty(header.value)) {
                header.value = pm.envManager.getCurrentValue(header.value);
                finalHeaders.push(header);
            }
        }

        return finalHeaders;
    },

    getRequestBodyPreview: function() {
        var body = this.get("body");
        return body.get("dataAsPreview");
    },

    getRequestBodyForCurl: function() {
        var body = this.get("body");
        return body.getBodyForCurl();
    },

    send:function (responseRawDataType, action) {
        this.set("action", action);

        var model = this;
        var body = this.get("body");
        var response = this.get("response");

        this.prepareForSending();

        if (this.get("url") === "") {
            return;
        }

        var originalUrl = this.get("url"); //Store this for saving the request

        var url = this.encodeUrl(this.get("url"));
        url = pm.envManager.getCurrentValue(url);
        url = ensureProperUrl(url);

        var method = this.get("method").toUpperCase();

        //Start setting up XHR
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true); //Open the XHR request. Will be sent later
        xhr.onreadystatechange = function (event) {
            _.bind(response.load, model)(event.target);
        };

        //Response raw data type is used for fetching binary responses while generating PDFs
        if (!responseRawDataType) {
            responseRawDataType = "text";
        }

        xhr.responseType = responseRawDataType;
        var headers = this.getXhrHeaders();
        for (var i = 0; i < headers.length; i++) {
            xhr.setRequestHeader(headers[i].name, headers[i].value);
        }

        // Prepare body
        if (this.isMethodWithBody(method)) {
            var data = body.get("data");
            console.log("Sending data", data);
            if(data === false) {
                xhr.send();
            }
            else {
                xhr.send(data);
            }
        } else {
            xhr.send();
        }

        this.unset("xhr");
        this.set("xhr", xhr);

        //Save the request
        if (pm.settings.getSetting("autoSaveRequest")) {
            console.log("Saving data", body.get("dataAsObjects"));
            pm.history.addRequest(originalUrl,
                method,
                this.getPackedHeaders(),
                body.get("dataAsObjects"),
                body.get("dataMode"));
        }

        var response = this.get("response");
        this.saveCurrentRequestToLocalStorage();
        response.trigger("sentRequest", this);
        this.trigger("sentRequest", this);
    },

    generateCurl: function() {
        var method = this.get("method").toUpperCase();

        var url = this.encodeUrl(this.get("url"));
        url = pm.envManager.getCurrentValue(url);
        url = ensureProperUrl(url);

        var headers = this.getXhrHeaders();
        var hasBody = this.isMethodWithBody(method);
        var body;

        if(hasBody) {
            body = this.getRequestBodyForCurl();
        }

        var requestPreview = "curl -X " + method;
        var headersCount = headers.length;

        for(var i = 0; i < headersCount; i++) {
            requestPreview += " -H " + headers[i].key + ":" + headers[i].value;
        }

        if(hasBody && body !== false) {
            requestPreview += body;
        }

        requestPreview += " " + url;

        requestPreview += "<br/><br/>";

        this.set("curlHtml", requestPreview);
    },

    generateHTTPRequest:function() {
        var method = this.get("method").toUpperCase();
        var httpVersion = "HTTP/1.1";

        var url = this.encodeUrl(this.get("url"));
        url = pm.envManager.getCurrentValue(url);
        url = ensureProperUrl(url);

        var hostAndPath = this.splitUrlIntoHostAndPath(url);

        var path = hostAndPath.path;
        var host = hostAndPath.host;

        var headers = this.getXhrHeaders();
        var hasBody = this.isMethodWithBody(method);
        var body;

        if(hasBody) {
            body = this.getRequestBodyPreview();
        }

        var requestPreview = method + " " + path + " " + httpVersion + "<br/>";
        requestPreview += "Host: " + host + "<br/>";

        var headersCount = headers.length;
        for(var i = 0; i < headersCount; i++) {
            requestPreview += headers[i].key + ": " + headers[i].value + "<br/>";
        }

        if(hasBody && body !== false) {
            requestPreview += "<br/>" + body + "<br/><br/>";
        }
        else {
            requestPreview += "<br/><br/>";
        }

        this.set("previewHtml", requestPreview);
    },

    generatePreview: function() {
        this.generateCurl();
        this.generateHTTPRequest();
    },

    stripScriptTag:function (text) {
        if (!text) return text;

        var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
        text = text.replace(re, "");
        return text;
    },

    checkIfCurrentRequestIsUpdated: function(request) {
        console.log("Is current request updated", request);

        var id = this.get("collectionRequestId");
        if(id === request.id) {
            this.set("name", request.name);
            this.set("description", request.description);
        }
    }
});
var RequestBody = Backbone.Model.extend({
    defaults: function() {
        return {
            data: "",
            dataMode:"params",
            isEditorInitialized:false,
            codeMirror:false,
            rawEditorType:"editor",
            bodyParams: {},
            editorMode:"html",
            language:""
        };
    },

    initialize: function() {

    },

    getFormDataForCurl: function() {
        var dataAsObjects = this.get("dataAsObjects");
        var kv;
        var value;

        var body = "";
        for(var i = 0; i < dataAsObjects.length; i++) {
            value = pm.envManager.getCurrentValue(dataAsObjects[i].value);
            body += " -F " + dataAsObjects[i].key + "=" + value;
        }

        return body;
    },

    getBodyForCurl: function() {
        var dataMode = this.get("dataMode");
        var preview;

        if (dataMode !== "params") {
            preview = pm.envManager.getCurrentValue(this.get("dataAsPreview"));
            return " -d '" + preview + "'";
        }
        else {
            return this.getFormDataForCurl();
        }
    },

    // Fixed
    getBodyParamString:function (params) {
        var paramsLength = params.length;
        var paramArr = [];
        for (var i = 0; i < paramsLength; i++) {
            var p = params[i];
            if (p.key && p.key !== "") {
                paramArr.push(p.key + "=" + p.value);
            }
        }
        return paramArr.join('&');
    },

    getDataMode:function () {
        return this.get("dataMode");
    },

    loadData:function (mode, data, asObjects) {
        this.set("dataMode", mode);
        this.set("asObjects", asObjects);

        if (mode !== "raw") {
            if (asObjects) {
                if (mode === "params") {
                    // Change made through an event in RequestBodyFormDataEditor
                    this.set("dataAsObjects", _.clone(data));
                }
                else {
                    this.set("data", _.clone(data));
                    this.set("dataAsObjects", _.clone(data));
                }
            }
            else {
                var params = getBodyVars(data, false);
                this.set("data", _.clone(params));
                this.set("dataAsObjects", _.clone(params));
            }
        }
        else {
            //No need for objects
            this.set("data", _.clone(data));
        }

        this.trigger("dataLoaded", this);
    }
});
var Response = Backbone.Model.extend({
    defaults: function() {
        return {
            status:"",
            responseCode:{},
            time:0,
            headers:[],
            cookies:[],
            mime:"",
            text:"",
            language:"",
            rawDataType:"",
            state:{size:"normal"},
            previewType:"parsed"
        };
    },

    initialize: function() {
    },

    setResponseCode: function(response) {
        var responseCodeName;
        var responseCodeDetail;

        if ("statusText" in response) {
            responseCodeName = response.statusText;
            responseCodeDetail = "";

            if (response.status in httpStatusCodes) {
                responseCodeDetail = httpStatusCodes[response.status]['detail'];
            }
        }
        else {
            if (response.status in httpStatusCodes) {
                responseCodeName = httpStatusCodes[response.status]['name'];
                responseCodeDetail = httpStatusCodes[response.status]['detail'];
            }
            else {
                responseCodeName = "";
                responseCodeDetail = "";
            }
        }

        var responseCode = {
            'code':response.status,
            'name':responseCodeName,
            'detail':responseCodeDetail
        };

        this.set("responseCode", responseCode);
    },

    setResponseTime: function(startTime) {
        var endTime = new Date().getTime();
        var diff = endTime - startTime;
        this.set("time", diff);
    },

    setResponseData: function(response) {
        var responseData;

        if (response.responseType === "arraybuffer") {
            this.set("responseData", response.response);
        }
        else {
            this.set("text", response.responseText);
        }
    },

    // getAllResponseHeaders - Headers are separated by \n
    setHeaders: function(response) {
        var headers = this.unpackResponseHeaders(response.getAllResponseHeaders());

        if(pm.settings.getSetting("usePostmanProxy") === true) {
            var count = headers.length;
            for(var i = 0; i < count; i++) {
                if(headers[i].key === "Postman-Location") {
                    headers[i].key = "Location";
                    headers[i].name = "Location";
                    break;
                }
            }
        }

        // TODO Set this in the model
        headers = _.sortBy(headers, function (header) {
            return header.name;
        });

        this.set("headers", headers);
    },

    setCookies: function(url) {
        var model = this;
        /* TODO: Not available in Chrome packaged apps
        chrome.cookies.getAll({url:url}, function (cookies) {
            var count;
            model.set("cookies", cookies);
        });
        */
    },

    doesContentTypeExist: function(contentType) {
        return (!_.isUndefined(contentType) && !_.isNull(contentType))
    },

    isContentTypeJavascript: function(contentType) {
        return (contentType.search(/json/i) !== -1 || contentType.search(/javascript/i) !== -1 || pm.settings.getSetting("languageDetection") === 'javascript');
    },

    isContentTypeImage: function(contentType) {
        return (contentType.search(/image/i) >= 0);
    },

    isContentTypePDF: function(contentType) {
        return (contentType.search(/pdf/i) >= 0);
    },

    saveAsSample: function(name) {
        var response = this.toJSON();
        response.state = {size: "normal"};
        response.id = guid();
        response.name = name;

        console.log("Save this response", response);

        pm.mediator.trigger("saveSampleResponse", response);
    },

    loadSampleResponse: function(requestModel, response) {
        console.log("Load sample response", requestModel, response);

        this.set("status", response.status);
        this.set("responseCode", response.responseCode);
        this.set("time", response.time);
        this.set("headers", response.headers);
        this.set("cookies", response.cookies);
        this.set("mime", response.mime);
        this.set("language", response.language);
        this.set("text", response.text);
        this.set("rawDataType", response.rawDataType);
        this.set("state", response.state);
        this.set("previewType", response.previewType);

        this.trigger("loadResponse", requestModel);
    },

    // Renders the response from a request
    // Called with this = request
    load:function (response) {
        console.log(response);

        var request = this;
        var model = request.get("response");

        // TODO These need to be renamed something else
        var presetPreviewType = pm.settings.getSetting("previewType");
        var languageDetection = pm.settings.getSetting("languageDetection");

        if (response.readyState === 4) {
            //Something went wrong
            if (response.status === 0) {
                var errorUrl = pm.envManager.getCurrentValue(request.get("url"));
                model.trigger("failedRequest", errorUrl);
                return;
            }
            else {
                var url = request.get("url");
                model.setResponseCode(response);
                model.setResponseTime(request.get("startTime"));

                model.setResponseData(response);
                model.setHeaders(response);
                model.setCookies(url);

                var contentType = response.getResponseHeader("Content-Type");
                var language = 'html';

                var responsePreviewType = 'html';

                if (model.doesContentTypeExist(contentType)) {
                    if (model.isContentTypeJavascript(contentType)) {
                        language = 'javascript';
                    }

                    if (model.isContentTypeImage(contentType)) {
                        responsePreviewType = 'image';
                    }
                    else if (model.isContentTypePDF(contentType) && response.responseType === "arraybuffer") {
                        responsePreviewType = 'pdf';
                    }
                    else if (model.isContentTypePDF(contentType) && response.responseType === "text") {
                        responsePreviewType = 'pdf';
                    }
                    else {
                        responsePreviewType = 'html';
                    }
                }
                else {
                    if (languageDetection === 'javascript') {
                        language = 'javascript';
                    }
                    else {
                        language = 'html';
                    }
                }

                model.set("language", language);
                model.set("previewType", responsePreviewType);
                model.set("rawDataType", response.responseType);
                model.set("state", {size: "normal"});

                model.trigger("loadResponse", model);
            }
        }
    },

    unpackResponseHeaders: function(data) {
        if (data === null || data === "") {
            return [];
        }
        else {
            var vars = [], hash;
            var hashes = data.split('\n');
            var header;

            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i];
                var loc = hash.search(':');

                if (loc !== -1) {
                    var name = $.trim(hash.substr(0, loc));
                    var value = $.trim(hash.substr(loc + 1));

                    header = {
                        "name":name,
                        "key":name,
                        "value":value,
                        "description":headerDetails[name.toLowerCase()]
                    };

                    vars.push(header);
                }
            }

            return vars;
        }
    }
});
var ResponseBody = Backbone.Model.extend({

});
var RequestBodyBinaryEditor = Backbone.View.extend({
    initialize: function() {
        this.model.on("startNew", this.onStartNew, this);
        var body = this.model.get("body");        
        var model = this.model;
        var view = this;

        $('#body-data-binary').on('change', function (event) {
            var files = event.target.files;
            console.log(files);
            _.bind(view.readFile, view)(files[0]);            
        });
    },

    onStartNew: function() {
    },

    readFile: function(f) {
        var model = this.model;        
        var reader = new FileReader();
        var view = this;

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                view.binaryData = e.currentTarget.result;                
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsArrayBuffer(f);
    },

    getBinaryBody: function() {
        console.log(this.binaryData);
        return this.binaryData;
    }
});
var RequestBodyEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        var body = model.get("body");

        model.on("change:method", this.onChangeMethod, this);

        body.on("change:dataMode", this.onChangeDataMode, this);
        body.on("change:data", this.onChangeData, this);

        this.bodyFormDataEditor = new RequestBodyFormDataEditor({model: this.model});
        this.bodyURLEncodedEditor = new RequestBodyURLEncodedEditor({model: this.model});
        this.bodyRawEditor = new RequestBodyRawEditor({model: this.model});
        this.bodyBinaryEditor = new RequestBodyBinaryEditor({model: this.model});

        $('#data-mode-selector').on("click", "a", function () {
            var mode = $(this).attr("data-mode");
            view.setDataMode(mode);
        });

        $('#body-editor-mode-selector .dropdown-menu').on("click", "a", function (event) {
            var editorMode = $(event.target).attr("data-editor-mode");
            var language = $(event.target).attr("data-language");
            view.bodyRawEditor.setEditorMode(editorMode, language, true);
        });

        // 'Format code' button listener.
        $('#body-editor-mode-selector-format').on('click.postman', function(evt) {
            var editorMode = $(event.target).attr("data-editor-mode");

            if ($(evt.currentTarget).hasClass('disabled')) {
                return;
            }
        });

        var type = pm.settings.getSetting("requestBodyEditorContainerType");
        $('#request-body-editor-container-type a').removeClass('active');
        $('#request-body-editor-container-type a[data-container-type="' + type + '"]').addClass('active');

        $('#request-body-editor-container-type').on('click', 'a', function(evt) {
            var type = $(this).attr('data-container-type');
            pm.settings.setSetting("requestBodyEditorContainerType", type);
        });


        $(document).bind('keydown', 'p', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            if (model.isMethodWithBody(model.get("method"))) {
                $('#formdata-keyvaleditor div:first-child input:first-child').focus();
                return false;
            }
        });

        this.setDataMode("params");
    },

    onChangeData: function() {
    },

    getRequestBodyPreview: function() {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");

        if (dataMode === 'raw') {
            var rawBodyData = body.get("data");
            rawBodyData = htmlEncode(rawBodyData);
            rawBodyData = pm.envManager.getCurrentValue(rawBodyData);
            return rawBodyData;
        }
        else if (dataMode === 'params') {
            var formDataBody = this.bodyFormDataEditor.getFormDataPreview();
            if(formDataBody !== false) {
                return formDataBody;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'urlencoded') {
            var urlEncodedBodyData = this.bodyURLEncodedEditor.getUrlEncodedBody();
            if(urlEncodedBodyData !== false) {
                return urlEncodedBodyData;
            }
            else {
                return false;
            }
        }
    },

    getRequestBodyToBeSent: function() {
        var model = this.model;
        var body = model.get("body");

        var dataMode = body.get("dataMode");

        if (dataMode === 'raw') {
            var rawBodyData = _.clone(this.getData(true));
            rawBodyData = pm.envManager.getCurrentValue(rawBodyData);
            return rawBodyData;
        }
        else if (dataMode === 'params') {
            var formDataBody = this.bodyFormDataEditor.getFormDataBody();
            if(formDataBody !== false) {
                return formDataBody;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'urlencoded') {
            var urlEncodedBodyData = this.bodyURLEncodedEditor.getUrlEncodedBody();
            if(urlEncodedBodyData !== false) {
                return urlEncodedBodyData;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'binary') {
            var binaryBody = this.bodyBinaryEditor.getBinaryBody();
            return binaryBody;
        }
    },

    getData:function (asObjects) {
        var model = this.model;
        var body = this.model.get("body");
        var mode = body.get("dataMode");

        var data;
        var params;
        var newParams;
        var param;
        var i;

        if (mode === "params") {
            params = $('#formdata-keyvaleditor').keyvalueeditor('getValues');
            newParams = [];
            for (i = 0; i < params.length; i++) {
                param = {
                    key:params[i].key,
                    value:params[i].value,
                    type:params[i].type
                };

                newParams.push(param);
            }

            if(asObjects === true) {
                return newParams;
            }
            else {
                data = model.getBodyParamString(newParams);
            }

            console.log("Params data in RequestBodyEditor is", data);
        }
        else if (mode === "raw") {
            data = this.bodyRawEditor.getRawData();
            console.log("Raw data in RequestBodyEditor is", data);
        }
        else if (mode === "urlencoded") {
            params = $('#urlencoded-keyvaleditor').keyvalueeditor('getValues');
            newParams = [];
            for (i = 0; i < params.length; i++) {
                param = {
                    key:params[i].key,
                    value:params[i].value,
                    type:params[i].type
                };

                newParams.push(param);
            }

            if(asObjects === true) {
                return newParams;
            }
            else {
                data = model.getBodyParamString(newParams);
            }
        }

        return data;
    },

    // TODO Needs to be in this order for updating the data property
    updateModel: function() {
        var body = this.model.get("body");
        var data = this.getRequestBodyToBeSent();
        body.set("data", data);

        var dataAsObjects = this.getData(true);
        body.set("dataAsObjects", dataAsObjects);

        var dataAsPreview = this.getRequestBodyPreview();
        body.set("dataAsPreview", dataAsPreview);
    },

    openFormDataEditor:function () {
        var containerId = "#formdata-keyvaleditor-container";
        $(containerId).css("display", "block");

        var editorId = "#formdata-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }
    },

    closeFormDataEditor:function () {
        var containerId = "#formdata-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    openUrlEncodedEditor:function () {
        var containerId = "#urlencoded-keyvaleditor-container";
        $(containerId).css("display", "block");

        var editorId = "#urlencoded-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }
    },

    closeUrlEncodedEditor:function () {
        var containerId = "#urlencoded-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    onChangeMethod: function(event) {
        var method = this.model.get("method");

        if (this.model.isMethodWithBody(method)) {
            $("#data").css("display", "block");
        } else {
            $("#data").css("display", "none");
        }
    },

    onChangeDataMode: function(event) {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");
        this.setDataMode(dataMode);
    },

    setDataMode:function (mode) {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");

        body.set("dataMode", mode);

        $('#data-mode-selector a').removeClass("active");
        $('#data-mode-selector a[data-mode="' + mode + '"]').addClass("active");

        $("#body-editor-mode-selector").css("display", "none");
        if (mode === "params") {
            view.openFormDataEditor();
            view.closeUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "raw") {
            view.closeUrlEncodedEditor();
            view.closeFormDataEditor();
            $('#body-data-container').css("display", "block");

            var isEditorInitialized = body.get("isEditorInitialized");
            var codeMirror = body.get("codeMirror");
            if (isEditorInitialized === false) {
                view.bodyRawEditor.initCodeMirrorEditor();
            }
            else {
                codeMirror.refresh();
            }

            $("#body-editor-mode-selector").css("display", "block");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "urlencoded") {
            view.closeFormDataEditor();
            view.openUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "binary") {
            view.closeFormDataEditor();
            view.closeUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "block");
        }
    },
});
var RequestBodyFormDataEditor = Backbone.View.extend({
    initialize: function() {
        this.model.on("startNew", this.onStartNew, this);

        var body = this.model.get("body");
        body.on("change:dataAsObjects", this.onChangeBodyData, this);

        var editorId = "#formdata-keyvaleditor";

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            valueTypes:["text", "file"],
            deleteButton:'<img class="deleteButton" src="img/delete.png">',
            onDeleteRow:function () {
            },

            onBlurElement:function () {
            }
        };

        $(editorId).keyvalueeditor('init', params);
    },

    onStartNew: function() {
        $('#formdata-keyvaleditor').keyvalueeditor('reset');
    },

    onChangeBodyData: function() {
        var body = this.model.get("body");
        var mode = body.get("dataMode");
        var asObjects = body.get("asObjects");
        var data = body.get("dataAsObjects");

        if (mode === "params") {
            if (data) {
                try {
                    $('#formdata-keyvaleditor').keyvalueeditor('reset', data);
                    body.set("data", this.getFormDataBody());
                }
                catch(e) {
                }
            }
        }
    },

    getFormDataBody: function() {
        var rows, count, j;
        var i;
        var row, key, value;
        var paramsBodyData = new FormData();
        rows = $('#formdata-keyvaleditor').keyvalueeditor('getElements');
        count = rows.length;

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                key = row.keyElement.val();
                var valueType = row.valueType;
                var valueElement = row.valueElement;

                if (valueType === "file") {
                    var domEl = valueElement.get(0);
                    var len = domEl.files.length;
                    for (i = 0; i < len; i++) {
                        paramsBodyData.append(key, domEl.files[i]);
                    }
                }
                else {
                    value = valueElement.val();
                    value = pm.envManager.getCurrentValue(value);
                    paramsBodyData.append(key, value);
                }
            }

            return paramsBodyData;
        }
        else {
            return false;
        }
    },

    // Fixed
    getDummyFormDataBoundary: function() {
        var boundary = "----WebKitFormBoundaryE19zNvXGzXaLvS5C";
        return boundary;
    },

    getFormDataPreview: function() {
        var rows, count, j;
        var row, key, value;
        var i;
        rows = $('#formdata-keyvaleditor').keyvalueeditor('getElements');
        count = rows.length;
        var params = [];

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                key = row.keyElement.val();
                var valueType = row.valueType;
                var valueElement = row.valueElement;

                if (valueType === "file") {
                    var domEl = valueElement.get(0);
                    var len = domEl.files.length;
                    for (i = 0; i < len; i++) {
                        var fileObj = {
                            key: key,
                            value: domEl.files[i],
                            type: "file",
                        }
                        params.push(fileObj);
                    }
                }
                else {
                    value = valueElement.val();
                    value = pm.envManager.getCurrentValue(value);
                    var textObj = {
                        key: key,
                        value: value,
                        type: "text",
                    }
                    params.push(textObj);
                }
            }

            var paramsCount = params.length;
            var body = "";
            for(i = 0; i < paramsCount; i++) {
                var param = params[i];
                body += this.getDummyFormDataBoundary();
                if(param.type === "text") {
                    body += "<br/>Content-Disposition: form-data; name=\"" + param.key + "\"<br/><br/>";
                    body += param.value;
                    body += "<br/>";
                }
                else if(param.type === "file") {
                    body += "<br/>Content-Disposition: form-data; name=\"" + param.key + "\"; filename=";
                    body += "\"" + param.value.name + "\"<br/>";
                    body += "Content-Type: " + param.value.type;
                    body += "<br/><br/><br/>"
                }
            }

            body += this.getDummyFormDataBoundary();

            return body;
        }
        else {
            return false;
        }
    }
});
var RequestBodyRawEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");

        body.on("change:data", this.onChangeBodyData, this);
        model.on("change:headers", this.onChangeHeaders, this);
    },

    onChangeHeaders: function() {
        var body = this.model.get("body");

        //Set raw body editor value if Content-Type is present
        var contentType = this.model.getHeaderValue("Content-Type");
        var editorMode = "text";
        var language = "text";

        if (contentType) {
            if (contentType.search(/json/i) !== -1 || contentType.search(/javascript/i) !== -1) {
                editorMode = 'javascript';
                language = contentType;
            }
            else if (contentType.search(/xml/i) !== -1) {
                editorMode = 'xml';
                language = contentType;
            }
            else if (contentType.search(/html/i) !== -1) {
                editorMode = 'xml';
                language = contentType;
            }
            else {
                editorMode = 'text';
                language = 'text';
            }
        }


        body.set("editorMode", editorMode);
        body.set("language", language);

        this.setEditorMode(editorMode, language, false);
    },

    onChangeBodyData: function() {
        var body = this.model.get("body");
        var mode = body.get("dataMode");
        var asObjects = body.get("asObjects");
        var data = body.get("data");
        var language = body.get("language");
        var editorMode = body.get("editorMode");

        if (mode === "raw") {
            if (data) {
                this.loadRawData(data);
            }
            else {
                this.loadRawData("");
            }
        }
        else {
            this.loadRawData("");
        }
    },

    initCodeMirrorEditor:function () {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");
        var editorMode = body.get("editorMode");

        body.set("isEditorInitialized", true);

        var bodyTextarea = document.getElementById("body");
        var codeMirror = CodeMirror.fromTextArea(bodyTextarea,
        {
            mode:"htmlmixed",
            lineWrapping: true,
            lineNumbers:true,
            theme:'eclipse'
        });

        body.set("codeMirror", codeMirror);


        $("#request .CodeMirror").resizable({
            stop: function() { codeMirror.refresh(); },
            resize: function(event, ui) {
                ui.size.width = ui.originalSize.width;
                $(".CodeMirror-scroll").height($(this).height());
                codeMirror.refresh();
            }
        });

        if (editorMode) {
            if (editorMode === "javascript") {
                codeMirror.setOption("mode", {"name":"javascript", "json":true});
            }
            else {
                codeMirror.setOption("mode", editorMode);
            }

            if (editorMode === "text") {
                $('#body-editor-mode-selector-format').addClass('disabled');
            } else {
                $('#body-editor-mode-selector-format').removeClass('disabled');
            }
        }

        $("#request .CodeMirror-scroll").css("height", "200px");
        codeMirror.refresh();
    },

    setEditorMode:function (mode, language, toSetHeader) {
        var model = this.model;
        var body = model.get("body");
        var codeMirror = body.get("codeMirror");
        var isEditorInitialized = body.get("isEditorInitialized");

        var displayMode = $("#body-editor-mode-selector a[data-language='" + language + "']").html();

        $('#body-editor-mode-item-selected').html(displayMode);

        if (isEditorInitialized) {
            if (mode === "javascript") {
                codeMirror.setOption("mode", {"name":"javascript", "json":true});
            }
            else {
                codeMirror.setOption("mode", mode);
            }

            if (mode === "text") {
                $('#body-editor-mode-selector-format').addClass('disabled');
            } else {
                $('#body-editor-mode-selector-format').removeClass('disabled');
            }

            if (toSetHeader) {
                model.setHeader("Content-Type", language);
            }

            codeMirror.refresh();
        }
    },

    autoFormatEditor:function (mode) {
        var model = this.model;
        var view = this;
        var body = model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        var content = codeMirror.getValue(),
        validated = null, result = null;

        $('#body-editor-mode-selector-format-result').empty().hide();

        if (isEditorInitialized) {
            // In case its a JSON then just properly stringify it.
            // CodeMirror does not work well with pure JSON format.
            if (mode === 'javascript') {

                // Validate code first.
                try {
                    validated = pm.jsonlint.instance.parse(content);
                    if (validated) {
                        content = JSON.parse(codeMirror.getValue());
                        codeMirror.setValue(JSON.stringify(content, null, 4));
                    }
                } catch(e) {
                    result = e.message;
                    // Show jslint result.
                    // We could also highlight the line with error here.
                    $('#body-editor-mode-selector-format-result').html(result).show();
                }
            } else { // Otherwise use internal CodeMirror.autoFormatRage method for a specific mode.
                var totalLines = codeMirror.lineCount(),
                totalChars = codeMirror.getValue().length;

                codeMirror.autoFormatRange(
                    {line: 0, ch: 0},
                    {line: totalLines - 1, ch: codeMirror.getLine(totalLines - 1).length}
                );
            }
        }
    },

    loadRawData:function (data) {
        var body = this.model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        if (isEditorInitialized === true) {
            if (data) {
                codeMirror.setValue(data);
            }
            else {
                codeMirror.setValue("");
            }

            codeMirror.refresh();
        }
    },

    getRawData:function () {
        var model = this.model;
        var body = model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        if (isEditorInitialized) {
            var data = codeMirror.getValue();

            if (pm.settings.getSetting("forceWindowsLineEndings") === true) {
                data = data.replace(/\r/g, '');
                data = data.replace(/\n/g, "\r\n");
            }

            return data;
        }
        else {
            return "";
        }
    }
});
var RequestBodyURLEncodedEditor = Backbone.View.extend({
    initialize: function() {
        this.model.on("startNew", this.onStartNew, this);

        var body = this.model.get("body");
        body.on("change:dataAsObjects", this.onChangeBodyData, this);

        var editorId = "#urlencoded-keyvaleditor";

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            valueTypes:["text"],
            deleteButton:'<img class="deleteButton" src="img/delete.png">',
            onDeleteRow:function () {
            },

            onBlurElement:function () {
            }
        };

        $(editorId).keyvalueeditor('init', params);
    },

    onStartNew: function() {
        $('#urlencoded-keyvaleditor').keyvalueeditor('reset');
    },

    onChangeBodyData: function() {
        var body = this.model.get("body");
        var mode = body.get("dataMode");
        var asObjects = body.get("asObjects");
        var data = body.get("dataAsObjects");

        if (mode === "urlencoded") {
            if (data) {
                try {
                    $('#urlencoded-keyvaleditor').keyvalueeditor('reset', data);
                }
                catch(e) {
                    console.log(e);
                }

            }

        }
    },

    getUrlEncodedBody: function() {
        var rows, count, j;
        var row, key, value;
        var urlEncodedBodyData = "";
        rows = $('#urlencoded-keyvaleditor').keyvalueeditor('getElements');
        count = rows.length;

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                value = row.valueElement.val();
                value = pm.envManager.getCurrentValue(value);
                value = encodeURIComponent(value);
                value = value.replace(/%20/g, '+');
                key = encodeURIComponent(row.keyElement.val());
                key = key.replace(/%20/g, '+');

                urlEncodedBodyData += key + "=" + value + "&";
            }

            urlEncodedBodyData = urlEncodedBodyData.substr(0, urlEncodedBodyData.length - 1);

            return urlEncodedBodyData;
        }
        else {
            return false;
        }
    }
});
var RequestClipboard = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var response = model.get("response");

        $("#response-copy-button").on("click", function() {
            var scrollTop = $(window).scrollTop();
            copyToClipboard(response.get("text"));
            $(document).scrollTop(scrollTop);
        });
    }
})
var RequestEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var responseModel = model.get("response");
        var view = this;
        var body = model.get("body");

        this.requestMetaViewer = new RequestMetaViewer({model: this.model});
        this.requestMethodEditor = new RequestMethodEditor({model: this.model});
        this.requestHeaderEditor = new RequestHeaderEditor({model: this.model});
        this.requestURLEditor = new RequestURLEditor({model: this.model});
        this.requestBodyEditor = new RequestBodyEditor({model: this.model});
        this.requestClipboard = new RequestClipboard({model: this.model});
        this.requestPreviewer = new RequestPreviewer({model: this.model});

        model.on("loadRequest", this.onLoadRequest, this);
        model.on("sentRequest", this.onSentRequest, this);
        model.on("startNew", this.onStartNew, this);
        model.on("updateModel", this.updateModel, this);

        responseModel.on("failedRequest", this.onFailedRequest, this);
        responseModel.on("finishedLoadResponse", this.onFinishedLoadResponse, this);

        this.on("send", this.onSend, this);
        this.on("preview", this.onPreview, this);

        $("#update-request-in-collection").on("click", function () {
            view.updateModel();

            var current = model.getAsObject();
            var collectionRequest = {
                id: model.get("collectionRequestId"),
                url: current.url,
                data: current.data,
                headers: current.headers,
                dataMode: current.dataMode,
                method: current.method,
                version: current.version,
                time: new Date().getTime()
            };

            pm.collections.updateCollectionRequest(collectionRequest);
        });

        $("#cancel-request").on("click", function () {
            model.trigger("cancelRequest", model);
        });

        $("#request-actions-reset").on("click", function () {
            model.trigger("startNew", model);
        });

        $('#add-to-collection').on("click", function () {
            view.updateModel();
        });

        $("#submit-request").on("click", function () {
            view.trigger("send", "text");
        });

        $("#submit-request-download").on("click", function () {
            view.trigger("send", "arraybuffer", "download");
        });

        $("#preview-request").on("click", function () {
            _.bind(view.onPreviewRequestClick, view)();
        });


        $('body').on('keydown', 'input', function (event) {
            if(pm.app.isModalOpen()) {
                return;
            }

            if (event.keyCode === 27) {
                $(event.target).blur();
            }
            else if (event.keyCode === 13) {
                view.trigger("send", view);
            }

            return true;
        });


        $(document).bind('keydown', 'return', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            view.trigger("send", "text");
            return false;
        });

        var newRequestHandler = function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            model.trigger("startNew", model);
        };


        $(document).bind('keydown', 'alt+p', function() {
            _.bind(view.onPreviewRequestClick, view)();
        });

        $(document).bind('keydown', 'alt+n', newRequestHandler);

        this.loadLastSavedRequest();
    },

    loadLastSavedRequest: function() {
        var lastRequest = pm.settings.getSetting("lastRequest");

        // TODO Have a generic function for falsy values
        if (lastRequest !== "" && lastRequest !== undefined) {

            var lastRequestParsed = JSON.parse(lastRequest);
            // TODO Be able to set isFromCollection too
            this.model.set("isFromCollection", false);
            pm.mediator.trigger("loadRequest", lastRequestParsed, false, false);
        }
    },

    onStartNew: function() {
        // TODO Needs to be handled by the Sidebar
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#update-request-in-collection').css("display", "none");
    },

    updateModel: function() {
        this.requestHeaderEditor.updateModel();
        this.requestURLEditor.updateModel();
        this.requestBodyEditor.updateModel();
    },

    onSend: function(type, action) {
        if (!type) {
            type = "text";
        }

        if (!action) {
            action = "display";
        }

        this.updateModel();
        this.model.trigger("send", type, action);
    },

    onPreview: function() {
        this.updateModel();
        pm.mediator.trigger("showPreview");
    },

    onSentRequest: function() {
        $('#submit-request').button("loading");
    },

    onFailedRequest: function() {
        $('#submit-request').button("reset");
    },

    onFinishedLoadResponse: function() {
        $('#submit-request').button("reset");
    },

    onLoadRequest: function(m) {
        var model = this.model;
        var body = model.get("body");
        var method = model.get("method");
        var isMethodWithBody = model.isMethodWithBody(method);
        var url = model.get("url");
        var headers = model.get("headers");
        var data = model.get("data");
        var name = model.get("name");
        var description = model.get("description");
        var responses = model.get("responses");
        var isFromSample = model.get("isFromSample");
        var isFromCollection = model.get("isFromCollection");

        this.showRequestBuilder();

        if (isFromCollection) {
            $('#update-request-in-collection').css("display", "inline-block");
        }
        else if (isFromSample) {
            $('#update-request-in-collection').css("display", "inline-block");
        }
        else {
            $('#update-request-in-collection').css("display", "none");
        }

        $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);

        $('#url').val(url);

        var newUrlParams = getUrlVars(url, false);

        //@todoSet params using keyvalueeditor function
        $('#url-keyvaleditor').keyvalueeditor('reset', newUrlParams);
        $('#headers-keyvaleditor').keyvalueeditor('reset', headers);

        $('#request-method-selector').val(method);

        if (isMethodWithBody) {
            $('#data').css("display", "block");
        }
        else {
            $('#data').css("display", "none");
        }
    },

    showRequestBuilder: function() {
        $("#preview-request").html("Preview");
        this.model.set("editorMode", 0);
        $("#request-builder").css("display", "block");
        $("#request-preview").css("display", "none");
    },

    // TODO Implement this using events
    onPreviewRequestClick: function(event) {
        var editorMode = this.model.get("editorMode");
        if(editorMode === 1) {
            this.showRequestBuilder();
        }
        else {
            this.trigger("preview", this);
        }
    },
});
var RequestHeaderEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        model.on("change:headers", this.onChangeHeaders, this);
        model.on("customHeaderUpdate", this.onCustomHeaderUpdate, this);

        var contentTypes = [
            "application/json"
        ];

        var params = {
            placeHolderKey:"Header",
            placeHolderValue:"Value",
            deleteButton:'<img class="deleteButton" src="img/delete.png">',
            onInit:function () {
            },

            onAddedParam:function () {
                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        view.onHeaderAutoCompleteItemSelect(item.item);
                    }
                });
            },

            onDeleteRow:function () {
                var headers = view.getHeaderEditorParams();
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set(headers, { silent: true });
            },

            onFocusElement:function (event) {
                view.currentFocusedRow = $(event.currentTarget).parent()[0];

                var thisInputIsAValue = $(event.currentTarget).attr("class").search("keyvalueeditor-value") >= 0;

                if(thisInputIsAValue) {
                    var parent = view.currentFocusedRow;
                    var keyInput = $(parent).children(".keyvalueeditor-key")[0];
                    var keyValue = $(keyInput).val().toLowerCase();
                    if (keyValue === "content-type") {
                        $(event.currentTarget).autocomplete({
                            source: mediatypes,
                            delay: 50
                        });
                    }
                }

                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        console.log("Cat complete is on", event, item);
                        _.bind(view.onHeaderAutoCompleteItemSelect, view)(item.item);
                    }
                });
            },

            onBlurElement:function () {
                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        console.log("Cat complete is on", event, item);
                        view.onHeaderAutoCompleteItemSelect(item.item);
                    }
                });

                var headers = view.getHeaderEditorParams();
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set(headers, { silent: true });
            },

            onReset:function () {
                var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set(headers, { silent: true });
            }
        };

        $('#headers-keyvaleditor').keyvalueeditor('init', params);

        $('#headers-keyvaleditor-actions-close').on("click", function () {
            $('#headers-keyvaleditor-actions-open').removeClass("active");
            view.closeHeaderEditor();
        });

        $('#headers-keyvaleditor-actions-open').on("click", function () {
            var isDisplayed = $('#headers-keyvaleditor-container').css("display") === "block";
            if (isDisplayed) {
                view.closeHeaderEditor();
            }
            else {
                view.openHeaderEditor();
            }
        });


        $(document).bind('keydown', 'h', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            var display = $("#headers-keyvaleditor-container").css("display");

            if (display === "block") {
                view.closeHeaderEditor();
            }
            else {
                view.openHeaderEditor();
                $('#headers-keyvaleditor div:first-child input:first-child').focus();
            }

            return false;
        });
    },

    onCustomHeaderUpdate: function() {
        this.openHeaderEditor();
    },

    onChangeHeaders: function() {
        var headers = this.model.get("headers");
        console.log("Headers changed", headers);
        $('#headers-keyvaleditor').keyvalueeditor('reset', headers);
    },

    openHeaderEditor:function () {
        $('#headers-keyvaleditor-actions-open').addClass("active");
        var containerId = "#headers-keyvaleditor-container";
        $(containerId).css("display", "block");
    },

    closeHeaderEditor:function () {
        $('#headers-keyvaleditor-actions-open').removeClass("active");
        var containerId = "#headers-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    setHeaderValue:function (key, value) {
        var headers = this.model.get("headers");
        var origKey = key;
        key = key.toLowerCase();
        var found = false;
        for (var i = 0, count = headers.length; i < count; i++) {
            var headerKey = headers[i].key.toLowerCase();

            if (headerKey === key && value !== "text") {
                headers[i].value = value;
                found = true;
            }
        }

        var editorId = "#headers-keyvaleditor";
        if (!found && value !== "text") {
            var header = {
                "key":origKey,
                "value":value
            };
            headers.push(header);
        }

        $(editorId).keyvalueeditor('reset', headers);
    },

    updateModel: function() {
        this.model.set("headers", this.getHeaderEditorParams(), {silent: true});
        var headers = this.model.get("headers");
        $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
    },

    getHeaderEditorParams:function () {
        var hs = $('#headers-keyvaleditor').keyvalueeditor('getValues');
        var newHeaders = [];
        for (var i = 0; i < hs.length; i++) {
            var header = {
                key:hs[i].key,
                value:hs[i].value,
                name:hs[i].key
            };

            newHeaders.push(header);
        }
        return newHeaders;
    },

    onHeaderAutoCompleteItemSelect:function(item) {
        if(item.type === "preset") {
            $(this.currentFocusedRow).remove();

            var preset = pm.headerPresets.getHeaderPreset(item.id);

            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
            var newHeaders = _.union(headers, preset.get("headers"));
            $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);

            //Ensures that the key gets focus
            var element = $('#headers-keyvaleditor .keyvalueeditor-last input:first-child')[0];
            $('#headers-keyvaleditor .keyvalueeditor-last input:first-child')[0].focus();
            setTimeout(function() {
                element.focus();
            }, 10);

        }
    }
});
var RequestMetaViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("loadRequest", this.render, this);
        model.on("change:name", this.render, this);
        model.on("change:description", this.render, this);

        this.requestSampleResponseList = new RequestSampleResponseList({model: this.model});

        $('.request-meta-actions-togglesize').on("click", function () {
            var action = $(this).attr('data-action');

            if (action === "minimize") {
                $(this).attr("data-action", "maximize");
                $('.request-meta-actions-togglesize img').attr('src', 'img/circle_plus.png');
                $("#request-description-container").slideUp(100);
            }
            else {
                $('.request-meta-actions-togglesize img').attr('src', 'img/circle_minus.png');
                $(this).attr("data-action", "minimize");
                $("#request-description-container").slideDown(100);
            }
        });

        $('#request-meta').on("mouseenter", function () {
            $('.request-meta-actions').css("display", "block");
        });

        $('#request-meta').on("mouseleave", function () {
            $('.request-meta-actions').css("display", "none");
        });
    },

    show: function() {
        $("#request-description-container").css("display", "block");
        $('#request-meta').css("display", "block");
        $('#request-name').css("display", "block");
        $('#request-description').css("display", "block");
    },

    hide: function() {
        $('#request-meta').css("display", "none");
    },

    render: function() {
        var request = this.model;
        var isFromCollection = this.model.get("isFromCollection");

        if (isFromCollection) {
            this.show();

            var name = request.get("name");
            var description = _.clone(request.get("description"));

            var descriptionFormat = request.get("descriptionFormat");

            if(descriptionFormat === "markdown") {
                description = markdown.toHTML(description);
            }

            if (typeof name !== "undefined") {
                $('#request-meta').css("display", "block");
                $('#request-name').html(name);
                $('#request-name').css("display", "inline-block");
            }
            else {
                $('#request-meta').css("display", "none");
                $('#request-name').css("display", "none");
            }

            if (typeof description !== "undefined") {
                $('#request-description').html(description);
                $('#request-description').css("display", "block");
            }
            else {
                $('#request-description').css("display", "none");
            }

            $('.request-meta-actions-togglesize').attr('data-action', 'minimize');
            $('.request-meta-actions-togglesize img').attr('src', 'img/circle_minus.png');
        }
        else {
            this.hide();
        }
    }
});
var RequestMethodEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("startNew", this.onStartNew, this);

        $('#request-method-selector').change(function () {
            var val = $(this).val();
            _.bind(view.setMethod, view)(val);
        });
    },

    onStartNew: function() {
        $('#request-method-selector').val("GET");
    },

    setMethod:function (method) {
        var body = this.model.get("body");

        this.model.set("url", $('#url').val());
        this.model.set("method", method);

        // Change only for methods not with body to make sure
        // current body type is not switched
        if (!this.model.isMethodWithBody(method)) {
            body.set("dataMode", "params");
        }
    }
})
var RequestPreviewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var view = this;

        $(".request-preview-header-limitations").dropdown();

        pm.mediator.on("showPreview", this.showPreview, this);

        $("#request-preview-header .request-helper-tabs li").on("click", function () {
            $("#request-preview-header .request-helper-tabs li").removeClass("active");
            $(event.currentTarget).addClass("active");
            var type = $(event.currentTarget).attr('data-id');
            view.showPreviewType(type);
        });
    },

    showPreview: function() {
    	this.model.generatePreview();
    	this.render();
    },

    showPreviewType: function(type) {
    	$("#request-preview-content div").css("display", "none");
    	$("#request-preview-content-" + type).css("display", "block");
    },

    render: function() {
        this.model.set("editorMode", 1);

        var previewHtml = this.model.get("previewHtml");
        var curlHtml = this.model.get("curlHtml");

        $("#request-preview-content-http-request").html(previewHtml);
        $("#request-preview-content-curl").html(curlHtml);
        $("#preview-request").html("Build");
        $("#request-builder").css("display", "none");
        $("#request-preview").css("display", "block");
    }
});
var RequestSampleResponseList = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("loadRequest", this.render, this);
        model.on("change:responses", this.render, this);

        $("#request-samples").on("mouseenter", ".sample-response-container", function() {
        	var actionsEl = $('.sample-response-actions', this);
        	actionsEl.css('display', 'block');
        });

        $("#request-samples").on("mouseleave", ".sample-response-container", function() {
            var actionsEl = $('.sample-response-actions', this);
            actionsEl.css('display', 'none');
        });

        $("#request-samples").on("click", ".sample-response-actions-load", function() {
            var id = $(this).attr("data-id");
            view.loadResponse(id);
        });

        $("#request-samples").on("click", ".sample-response-actions-delete", function() {
            var id = $(this).attr("data-id");
            view.deleteResponse(id);
        });

        this.render();
    },

    loadResponse: function(id) {
        this.model.loadSampleResponseById(id);
    },

    deleteResponse: function(id) {
        this.model.deleteSampleResponseById(id);
    },

    render: function() {
    	var responses = this.model.get("responses");
        $("#request-samples-list").html("");

    	if (responses.length > 0) {
    		$("#request-samples").css("display", "block");
    		$("#request-samples-list").append(Handlebars.templates.sample_responses({"items": responses}));
    	}
    	else {
    		$("#request-samples").css("display", "none");
    	}
    }
});
var RequestURLEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        var editorId;
        editorId = "#url-keyvaleditor";

        this.editorId = editorId;

        model.on("change:url", this.onChangeUrl, this);
        model.on("updateURLInputText", this.onUpdateURLInputText, this);
        model.on("startNew", this.onStartNew, this);
        model.on("customURLParamUpdate", this.onCustomUrlParamUpdate, this);

        var params = {
            placeHolderKey:"URL Parameter Key",
            placeHolderValue:"Value",
            deleteButton:'<img class="deleteButton" src="img/delete.png">',
            onDeleteRow:function () {
                var params = view.getUrlEditorParams();
                model.set("url", $("#url").val());
                model.setUrlParams(params);
                model.setUrlParamString(view.getUrlEditorParams(), true);
            },

            onBlurElement:function () {
                var params = view.getUrlEditorParams();
                model.set("url", $("#url").val());
                model.setUrlParams(params);
                model.setUrlParamString(view.getUrlEditorParams(), true);
            }
        };

        $(editorId).keyvalueeditor('init', params);

        $('#url-keyvaleditor-actions-close').on("click", function () {
            view.closeUrlEditor();
        });

        $('#url-keyvaleditor-actions-open').on("click", function () {
            var isDisplayed = $('#url-keyvaleditor-container').css("display") === "block";
            if (isDisplayed) {
                view.closeUrlEditor();
            }
            else {
                var newRows = getUrlVars($('#url').val(), false);
                $(editorId).keyvalueeditor('reset', newRows);
                view.openUrlEditor();
            }

        });

        $('#url').keyup(function () {
            var newRows = getUrlVars($('#url').val(), false);
            $('#url-keyvaleditor').keyvalueeditor('reset', newRows);
        });


        var urlFocusHandler = function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#url').focus();
            return false;
        };

        try {
            $("#url").autocomplete({
                source: pm.urlCache.getUrls(),
                delay: 50
            });
        }
        catch(e) {

        }

        $(document).bind('keydown', 'backspace', urlFocusHandler);
    },

    onCustomUrlParamUpdate: function() {
        this.openUrlEditor();
    },

    onUpdateURLInputText: function() {
        var url = this.model.get("url");
        $("#url").val(url);
    },

    onChangeUrl: function() {
        var url = this.model.get("url");
        $("#url").val(url);

        var newRows = getUrlVars(url, false);
        $('#url-keyvaleditor').keyvalueeditor('reset', newRows);
    },

    onStartNew: function(model) {
        $("#url").val("");
        var newRows = [];
        $(this.editorId).keyvalueeditor('reset', newRows);
        $('#url').focus();
    },

    updateModel: function() {
        this.model.set("url", $("#url").val());
        this.model.setUrlParamString(this.getUrlEditorParams(), true);
    },

    openUrlEditor:function () {
        $('#url-keyvaleditor-actions-open').addClass("active");
        var containerId = "#url-keyvaleditor-container";
        $(containerId).css("display", "block");
    },

    closeUrlEditor:function () {
        $('#url-keyvaleditor-actions-open').removeClass("active");
        var containerId = "#url-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    getUrlEditorParams:function () {
        var editorId = "#url-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }

        return newParams;
    }
});
var ResponseBodyIFrameViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    render: function() {
    	var model = this.model;
    	var request = model;
    	var response = model.get("response");
    	var previewType = response.get("previewType");
    	var text = response.get("text");

    	if (previewType === "html") {
    	    $("#response-as-preview").html("");
    	    var cleanResponseText = model.stripScriptTag(text);
    	    pm.filesystem.renderResponsePreview("response.html", cleanResponseText, "html", function (response_url) {
    	        $("#response-as-preview").html("<iframe></iframe>");
    	        $("#response-as-preview iframe").attr("src", response_url);
    	    });
    	}
    }
});
var ResponseBodyImageViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    // Source: http://stackoverflow.com/questions/8022425/getting-blob-data-from-xhr-request
    renderAsImage: function(responseData) {
        var uInt8Array = new Uint8Array(responseData);
        var i = uInt8Array.length;
        var binaryString = new Array(i);
        while (i--)
        {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');

        var base64 = window.btoa(data);

        $("#response-as-image").html("<img id='response-as-image-inline'/>");
        document.getElementById("response-as-image-inline").src="data:image/png;base64,"+base64;
    },

    render: function() {
    	var model = this.model;
    	var request = model;
    	var response = model.get("response");
    	var previewType = response.get("previewType");
        var responseRawDataType = response.get("rawDataType");

    	if (previewType === "image" && responseRawDataType === "text") {
    		$('#response-as-image').css("display", "block");
            model.trigger("send", "arraybuffer");
        }
        else if (previewType === "image" && responseRawDataType === "arraybuffer") {
            var responseData = response.get("responseData");
            this.renderAsImage(responseData);
            console.log("Render arraybuffer data");
        }    	
    }
});
var ResponseBodyPDFViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    render: function() {
    	var model = this.model;
    	var response = model.get("response");
    	var previewType = response.get("previewType");
    	var responseRawDataType = response.get("rawDataType");

    	if (previewType === "pdf" && responseRawDataType === "arraybuffer") {
            console.log("Render the PDF");
            
	    	var responseData = response.get("responseData");    	
	    	$("#response-as-preview").html("");
	    	$("#response-as-preview").css("display", "block");

            var filename = "response.pdf";
            var type = "pdf";

            pm.filesystem.saveAndOpenFile(filename, responseData, type, function () {
                noty(
                    {
                        type:'success',
                        text:'Saved PDF to disk',
                        layout:'topCenter',
                        timeout:750
                    });
            });
    	}    	
    	else if (previewType === "pdf" && responseRawDataType === "text") {
    	 	// Trigger an arraybuffer request with the same parameters       	 	
            model.trigger("send", "arraybuffer");
    	}
    }
});
var ResponseBodyPrettyViewer = Backbone.View.extend({
	defineCodeMirrorLinksMode:function () {
	    var editorMode = this.mode;

	    CodeMirror.defineMode("links", function (config, parserConfig) {
	        var linksOverlay = {
	            startState:function () {
	                return { "link":"" }
	            },

	            token:function (stream, state) {
	                if (stream.eatSpace()) {
	                    return null;
	                }

	                var matches;
	                var targetString = stream.string.substr(stream.start);

	                if (matches = targetString.match(/https?:\/\/[^\\'"\n\t\s]*(?=[<"'\n\t\s])/, false)) {
	                    //Eat all characters before http link
	                    var m = targetString.match(/.*(?=https?:)/, true);
	                    if (m) {
	                        if (m[0].length > 0) {
	                            stream.next();
	                            return null;
	                        }
	                    }

	                    var match = matches[0];
	                    if (match !==state.link) {
	                        state.link = matches[0];
	                        for (var i = 0; i < state.link.length; i++) {
	                            stream.next();
	                        }
	                        state.link = "";
	                        return "link";
	                    }

	                    stream.skipToEnd();
	                    return null;
	                }

	                stream.skipToEnd();
	                return null;

	            }
	        };

	        return CodeMirror.overlayParser(CodeMirror.getMode(config, parserConfig.backdrop || editorMode), linksOverlay);
	    });
	},

	toggleLineWrapping:function () {
	    var codeMirror = this.codeMirror;

	    var lineWrapping = codeMirror.getOption("lineWrapping");
	    if (lineWrapping === true) {
	        $('#response-body-line-wrapping').removeClass("active");
	        lineWrapping = false;
	        codeMirror.setOption("lineWrapping", false);
	    }
	    else {
	        $('#response-body-line-wrapping').addClass("active");
	        lineWrapping = true;
	        codeMirror.setOption("lineWrapping", true);
	    }

	    pm.settings.setSetting("lineWrapping", lineWrapping);
	    codeMirror.refresh();
	},

    initialize: function() {
    	this.codeMirror = null;
    	this.mode = "text";
    	this.defineCodeMirrorLinksMode();

    	pm.cmp = this.codeMirror;

    	pm.mediator.on("focusPrettyViewer", this.onFocusPrettyViewer, this);
    },

    onFocusPrettyViewer: function() {
    	console.log("Trigger keydown on CodeMirror");
    }
});

var ResponseBodyRawViewer = Backbone.View.extend({
    initialize: function() {

    }
});
var ResponseBodyViewer = Backbone.View.extend({
    initialize: function() {
        var view = this;
        var model = this.model;
        var response = model.get("response");
        response.on("finishedLoadResponse", this.load, this);

        this.responseBodyPrettyViewer = new ResponseBodyPrettyViewer({model: this.model});
        this.responseBodyRawViewer = new ResponseBodyRawViewer({model: this.model});
        this.responseBodyIFrameViewer = new ResponseBodyIFrameViewer({model: this.model});

        this.responseBodyImageViewer = new ResponseBodyImageViewer({model: this.model});
        this.responseBodyPDFViewer = new ResponseBodyPDFViewer({model: this.model});

        $(document).bind('keydown', 'ctrl+f', function() {
            view.searchResponse();
        });

        $(document).bind('keydown', 'meta+f', function() {
            view.searchResponse();
        });

    },

    searchResponse: function() {
        this.changePreviewType("parsed");
        CodeMirror.commands.find(this.responseBodyPrettyViewer.codeMirror);
    },

    downloadBody: function(response) {
        var previewType = response.get("previewType");
        var responseRawDataType = response.get("rawDataType");
        var filedata;
        var type = previewType;
        var filename = "response" + "." + previewType;

        if (responseRawDataType === "arraybuffer") {
            filedata = response.get("responseData");
        }
        else {
            filedata = text;
        }

        pm.filesystem.saveAndOpenFile(filename, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved response to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    load: function() {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var previewType = response.get("previewType");
        var responseRawDataType = response.get("rawDataType");
        var presetPreviewType = pm.settings.getSetting("previewType");
        var language = response.get("language");
        var text = response.get("text");

        var action = model.get("action");

        if (action === "download") {
            $('#response-data-container').css("display", "none");
            this.downloadBody(response);
        }
        else {
            if (model.get("method") !== "HEAD") {
                $('#response-data-container').css("display", "block");
            }

            if (previewType === "image") {
                $('#response-as-code').css("display", "none");
                $('#response-as-text').css("display", "none");

                $('#response-formatting').css("display", "none");
                $('#response-actions').css("display", "none");
                $("#response-language").css("display", "none");
                $("#response-as-preview").css("display", "none");
                $("#response-copy-container").css("display", "none");
                $("#response-pretty-modifiers").css("display", "none");
            }
            else if (previewType === "pdf" && responseRawDataType === "arraybuffer") {
                // Hide everything else
                $('#response-as-code').css("display", "none");
                $('#response-as-text').css("display", "none");
                $('#response-as-image').css("display", "none");

                $('#response-formatting').css("display", "none");
                $('#response-actions').css("display", "none");
                $("#response-language").css("display", "none");
                $("#response-copy-container").css("display", "none");
                $("#response-pretty-modifiers").css("display", "none");
            }
            else if (previewType === "pdf" && responseRawDataType === "text") {
            }
            else {
                this.displayTextResponse(language, text, presetPreviewType, true);
            }
        }
    },

    displayTextResponse:function (language, response, format, forceCreate) {
        var codeDataArea = document.getElementById("code-data");
        var codeDataWidth = $(document).width() - $('#sidebar').width() - 60;
        var foldFunc;
        var mode;
        var lineWrapping;
        var renderMode = mode;

        //Keep CodeMirror div visible otherwise the response gets cut off
        $("#response-copy-container").css("display", "block");

        $('#response-as-code').css("display", "block");
        $('#response-as-text').css("display", "none");
        $('#response-as-image').css("display", "none");

        $('#response-formatting').css("display", "block");
        $('#response-actions').css("display", "block");

        $('#response-formatting a').removeClass('active');
        $('#response-formatting a[data-type="' + format + '"]').addClass('active');

        $('#code-data').css("display", "none");
        $('#code-data').attr("data-mime", language);

        $('#response-language').css("display", "block");
        $('#response-language a').removeClass("active");

        if (language === 'javascript') {
            try {
                if ('string' ===  typeof response && response.match(/^[\)\]\}]/)) {
                    response = response.substring(response.indexOf('\n'));
                }

                response = vkbeautify.json(response);
                mode = 'javascript';
                foldFunc = CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder);
            }
            catch (e) {
                mode = 'text';
            }

            console.log("Language is javascript");
            $('#response-language a[data-mode="javascript"]').addClass("active");

        }
        else if (language === 'html') {
            response = vkbeautify.xml(response);
            mode = 'xml';
            foldFunc = CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder);
            $('#response-language a[data-mode="html"]').addClass("active");
        }
        else {
            mode = 'text';
        }


        if (pm.settings.getSetting("lineWrapping") === true) {
            $('#response-body-line-wrapping').addClass("active");
            lineWrapping = true;
        }
        else {
            $('#response-body-line-wrapping').removeClass("active");
            lineWrapping = false;
        }

        this.responseBodyPrettyViewer.mode = mode;
        this.responseBodyPrettyViewer.defineCodeMirrorLinksMode();

        var codeMirror = this.responseBodyPrettyViewer.codeMirror;

        if ($.inArray(mode, ["javascript", "xml", "html"]) >= 0) {
            this.responseBodyPrettyViewer.mode = mode;
            renderMode = "links";
        }

        if (!codeMirror) {
            $('#response .CodeMirror').remove();
            codeMirror = CodeMirror.fromTextArea(codeDataArea,
            {
                mode:renderMode,
                lineNumbers:true,
                fixedGutter:true,
                onGutterClick:foldFunc,
                theme:'eclipse',
                lineWrapping:lineWrapping,
                readOnly:true
            });

            codeMirror.setValue(response);
            codeMirror.refresh();

            this.responseBodyPrettyViewer.codeMirror = codeMirror;
        }
        else {
            codeMirror.setOption("onGutterClick", foldFunc);
            codeMirror.setOption("mode", renderMode);
            codeMirror.setOption("lineWrapping", lineWrapping);
            codeMirror.setOption("theme", "eclipse");
            codeMirror.setOption("readOnly", false);
            codeMirror.setValue(response);
            codeMirror.refresh();

            CodeMirror.commands["goDocStart"](codeMirror);
            $(window).scrollTop(0);
        }

        if (format === "parsed") {
            $('#response-as-code').css("display", "block");
            $('#response-as-text').css("display", "none");
            $('#response-as-preview').css("display", "none");
            $('#response-pretty-modifiers').css("display", "block");
        }
        else if (format === "raw") {
            $('#code-data-raw').val(response);
            $('#code-data-raw').css("width", codeDataWidth + "px");
            $('#code-data-raw').css("height", "600px");
            $('#response-as-code').css("display", "none");
            $('#response-as-text').css("display", "block");
            $('#response-pretty-modifiers').css("display", "none");
        }
        else if (format === "preview") {
            $('#response-as-code').css("display", "none");
            $('#response-as-text').css("display", "none");
            $('#response-as-preview').css("display", "block");
            $('#response-pretty-modifiers').css("display", "none");
        }
    },

    loadImage: function(url) {
        var remoteImage = new RAL.RemoteImage({
            priority: 0,
            src: imgLink,
            headers: this.model.getXhrHeaders()
        });

        remoteImage.addEventListener('loaded', function(remoteImage) {
        });

        $("#response-as-image").html("");
        var container = document.querySelector('#response-as-image');
        container.appendChild(remoteImage.element);

        RAL.Queue.add(remoteImage);
        RAL.Queue.setMaxConnections(4);
        RAL.Queue.start();
    },

    changePreviewType:function (newType) {
        var request = this.model;
        var response = request.get("response");
        var previewType = response.get("previewType");
        var text = response.get("text");

        if (previewType === newType) {
            return;
        }

        previewType = newType;
        response.set("previewType", newType);
        pm.settings.setSetting("previewType", newType);

        $('#response-formatting a').removeClass('active');
        $('#response-formatting a[data-type="' + previewType + '"]').addClass('active');

        if (previewType === 'raw') {
            $('#response-as-text').css("display", "block");
            $('#response-as-code').css("display", "none");
            $('#response-as-preview').css("display", "none");
            $('#code-data-raw').val(text);
            var codeDataWidth = $(document).width() - $('#sidebar').width() - 60;
            $('#code-data-raw').css("width", codeDataWidth + "px");
            $('#code-data-raw').css("height", "600px");
            $('#response-pretty-modifiers').css("display", "none");
        }
        else if (previewType === 'parsed') {
            $('#response-as-text').css("display", "none");
            $('#response-as-code').css("display", "block");
            $('#response-as-preview').css("display", "none");
            $('#code-data').css("display", "none");
            $('#response-pretty-modifiers').css("display", "block");
            this.responseBodyPrettyViewer.codeMirror.refresh();
        }
        else if (previewType === 'preview') {
            $('#response-as-text').css("display", "none");
            $('#response-as-code').css("display", "none");
            $('#code-data').css("display", "none");
            $('#response-as-preview').css("display", "block");
            $('#response-pretty-modifiers').css("display", "none");
        }
    },

    toggleBodySize:function () {
        var request = this.model;
        var response = request.get("response");
        var state = response.get("state");

        if ($('#response').css("display") === "none") {
            return false;
        }

        $('a[rel="tooltip"]').tooltip('hide');

        if (state.size === "normal") {
            state.size = "maximized";
            $('#response-body-toggle img').attr("src", "img/full-screen-exit-alt-2.png");
            state.width = $('#response-data').width();
            state.height = $('#response-data').height();
            state.display = $('#response-data').css("display");
            state.overflow = $('#response-data').css("overflow");
            state.position = $('#response-data').css("position");

            $('#response-data').css("position", "absolute");
            $('#response-data').css("overflow", "scroll");
            $('#response-data').css("left", 0);
            $('#response-data').css("top", "-15px");
            $('#response-data').css("width", $(document).width() - 20);
            $('#response-data').css("height", $(document).height());
            $('#response-data').css("z-index", 100);
            $('#response-data').css("background-color", "#fff");
            $('#response-data').css("padding", "10px");
        }
        else {
            state.size = "normal";
            $('#response-body-toggle img').attr("src", "img/full-screen-alt-4.png");
            $('#response-data').css("position", state.position);
            $('#response-data').css("overflow", state.overflow);
            $('#response-data').css("left", 0);
            $('#response-data').css("top", 0);
            $('#response-data').css("width", state.width);
            $('#response-data').css("height", state.height);
            $('#response-data').css("z-index", 10);
            $('#response-data').css("background-color", "#fff");
            $('#response-data').css("padding", "0px");
        }

        $('#response-body-toggle').focus();

        response.set("state", state);
    },

    toggleLineWrapping: function() {
        this.responseBodyPrettyViewer.toggleLineWrapping();
    },

    setMode:function (mode) {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var responseBody = response.get("body");

        var text = response.get("text");

        // TODO Make sure this is being stored properly
        var previewType = pm.settings.getSetting("previewType");
        this.displayTextResponse(mode, text, previewType, true);
    }
});
var ResponseCookieViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var response = model.get("response");
        response.on("finishedLoadResponse", this.load, this);
    },

    load: function() {
        var model = this.model;
        var response = model.get("response");
        var cookies = response.get("cookies");

        if (cookies) {
            var count = 0;
            if (!cookies) {
                count = 0;
            }
            else {
                count = cookies.length;
            }

            if (count === 0) {
                $("#response-tabs-cookies").html("Cookies");
                $('#response-tabs-cookies').css("display", "none");
            }
            else {
                $("#response-tabs-cookies").html("Cookies (" + count + ")");
                $('#response-tabs-cookies').css("display", "block");
                cookies = _.sortBy(cookies, function (cookie) {
                    return cookie.name;
                });

                for (var i = 0; i < count; i++) {
                    var cookie = cookies[i];
                    cookie.name = limitStringLineWidth(cookie.name, 20);
                    cookie.value = limitStringLineWidth(cookie.value, 20);
                    cookie.path = limitStringLineWidth(cookie.path, 20);
                    if ("expirationDate" in cookie) {
                        var date = new Date(cookie.expirationDate * 1000);
                        cookies[i].expires = date.toLocaleString();
                    }
                }

                $('#response-cookies-items').html(Handlebars.templates.response_cookies({"items":cookies}));
            }
        }

    }
});
var ResponseHeaderViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var response = model.get("response");
        response.on("finishedLoadResponse", this.load, this);
    },

    load:function (data) {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var headers = response.get("headers");        

        $('.response-tabs li[data-section="headers"]').html("Headers (" + headers.length + ")");
        $('#response-headers').html("");
        $("#response-headers").append(Handlebars.templates.response_headers({"items":headers}));
        $('.response-header-name').popover({
            trigger: "hover",
        });
    },
});
var ResponseMetaViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    render: function() {
    	var model = this.model;
    	var request = model;
    	var response = model.get("response");
    	var time = response.get("time");

    	$('#response-status').css("display", "block");

    	$('#response-status').html(Handlebars.templates.item_response_code(response.get("responseCode")));
    	$('.response-code').popover({
    	    trigger: "hover"
    	});

    	$('#response-time .data').html(time + " ms");
    }
});
var ResponseSaver = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var view = this;

    	$("#response-sample-save-start").on("click", function() {
    		view.showSaveForm();
    	});

	    $("#response-sample-save").on("click", function() {
	    	view.saveResponse();
	    });

	    $("#response-sample-cancel").on("click", function() {
	    	view.cancelSaveResponse();
	    });
    },

    showSaveForm: function() {
		$("#response-sample-save-start").css("display", "none");
		$("#response-sample-save-form").css("display", "block");
    },

    hideSaveForm: function() {
    	$("#response-sample-save-start").css("display", "block");
    	$("#response-sample-save-form").css("display", "none");
    },

    saveResponse: function() {
    	this.hideSaveForm();

    	var name = $("#response-sample-name").val();

    	var response = this.model.get("response");
        $("#response-sample-name").val("");
    	response.saveAsSample(name);
    },

    cancelSaveResponse: function() {
        $("#response-sample-name").val("");
    	this.hideSaveForm();
    }
});
var ResponseViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var responseModel = model.get("response");
        var view = this;

        this.responseBodyViewer = new ResponseBodyViewer({model: this.model});
        this.responseHeaderViewer = new ResponseHeaderViewer({model: this.model});
        this.responseCookieViewer = new ResponseCookieViewer({model: this.model});
        this.responseMetaViewer = new ResponseMetaViewer({model: this.model});
        this.responseSaver = new ResponseSaver({model: this.model});

        responseModel.on("failedRequest", this.onFailedRequest, this);
        responseModel.on("clearResponse", this.clear, this);
        responseModel.on("sentRequest", this.onSentRequest, this);
        responseModel.on("loadResponse", this.load, this);

        $('#response-body-toggle').on("click", function () {
            view.responseBodyViewer.toggleBodySize();
        });

        $('#response-body-line-wrapping').on("click", function () {
            view.responseBodyViewer.toggleLineWrapping();
            return true;
        });

        $('#response-formatting').on("click", "a", function () {
            var previewType = $(this).attr('data-type');
            view.responseBodyViewer.changePreviewType(previewType);
        });

        $('#response-language').on("click", "a", function () {
            var language = $(this).attr("data-mode");
            view.responseBodyViewer.setMode(language);
        });

        $('#response-data').on("mousedown", ".cm-link", function () {
            var link = $(this).html();
            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
            model.loadRequestFromLink(link, headers);
        });

        $('.response-tabs').on("click", "li", function () {
            var section = $(this).attr('data-section');
            if (section === "body") {
                view.showBody();
            }
            else if (section === "headers") {
                view.showHeaders();
            }
            else if (section === "cookies") {
                view.showCookies();
            }
        });


        $(document).bind('keydown', 'f', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            view.responseBodyViewer.toggleBodySize();
        });
    },

    onSentRequest: function() {
        this.showScreen("waiting");
    },

    onFailedRequest: function(errorUrl) {
        $('#connection-error-url').html("<a href='" + errorUrl + "' target='_blank'>" + errorUrl + "</a>");
        this.showScreen("failed");
    },

    clear: function() {
        $('#response').css("display", "none");
    },

    load:function () {
        console.log("Load response called");

        var model = this.model;
        var request = model;
        var response = model.get("response");
        var headers = response.get("headers");
        var time = response.get("time");

        var previewType = response.get("previewType");
        var language = response.get("language");
        var responseRawDataType = response.get("rawDataType");
        var responseData = response.get("responseData");
        var text = response.get("text");
        var method = request.get("method");
        var action = model.get("action");
        var presetPreviewType = pm.settings.getSetting("previewType");

        this.showScreen("success");

        $('#response').css("display", "block");
        $("#response-data").css("display", "block");

        if (action === "download") {
            this.showHeaders();
        }
        else {
            if (method === "HEAD") {
                this.showHeaders();
            }
            else {
                this.showBody();
            }

        }

        if (request.get("isFromCollection") === true) {
            $("#response-collection-request-actions").css("display", "block");
        }
        else {
            $("#response-collection-request-actions").css("display", "none");
        }

        response.trigger("finishedLoadResponse");
    },

    showHeaders:function () {
        console.log("Hide response data container");

        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="headers"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "block");
        $('#response-cookies-container').css("display", "none");
    },

    showBody:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="body"]').addClass("active");
        $('#response-data-container').css("display", "block");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "none");
    },

    showCookies:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="cookies"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "block");
    },

    showScreen:function (screen) {
        $("#response").css("display", "block");
        var active_id = "#response-" + screen + "-container";
        var all_ids = ["#response-waiting-container",
            "#response-failed-container",
            "#response-success-container"];
        for (var i = 0; i < 3; i++) {
            $(all_ids[i]).css("display", "none");
        }

        $(active_id).css("display", "block");
    }
});
var URLCache = Backbone.Model.extend({
    defaults: function() {
        return {
            "urls": []
        }
    },

    initialize: function() {
        var model = this;

        pm.mediator.on("addToURLCache", function(url) {
            model.addUrl(url);
        });
    },

    addUrl:function (url) {
        var urls = this.get("urls");

        if ($.inArray(url, urls) === -1) {
            urls.push(url);
        }
    },

    getUrls: function() {
        return this.get("urls");
    }
});
pm.filesystem = {
    fs:{},

    onInitFs:function (filesystem) {
        pm.filesystem.fs = filesystem;
    },

    errorHandler:function (e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }

        console.log('Error: ' + msg);
    },

    init:function () {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, this.onInitFs, this.errorHandler);
    },

    removeFileIfExists:function (name, callback) {
        pm.filesystem.fs.root.getFile(name,
            {create:false}, function (fileEntry) {
                fileEntry.remove(function () {
                    callback();
                }, function () {
                    callback();
                });
            }, function () {
                callback();
            });
    },

    renderResponsePreview:function (name, data, type, callback) {
        name = encodeURI(name);
        name = name.replace("/", "_");
        pm.filesystem.removeFileIfExists(name, function () {
            pm.filesystem.fs.root.getFile(name,
                {create:true},
                function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {

                        fileWriter.onwriteend = function (e) {
                            var properties = {
                                url:fileEntry.toURL()
                            };

                            callback(properties.url);
                        };

                        fileWriter.onerror = function (e) {
                            callback(false);
                        };

                        var blob;
                        if (type === "pdf") {
                            blob = new Blob([data], {type:'application/pdf'});
                        }
                        else {
                            blob = new Blob([data], {type:'text/plain'});
                        }
                        fileWriter.write(blob);


                    }, pm.filesystem.errorHandler);


                }, pm.filesystem.errorHandler
            );
        });
    },

    saveAndOpenFile:function (name, data, type, callback) {
        chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: name}, function(writableFileEntry) {
            if (!writableFileEntry) {
                return;
            }

            writableFileEntry.createWriter(function(writer) {
                var truncated = false;

                writer.onerror = function (e) {
                    callback();
                };

                writer.onwriteend = function(e) {
                    if (!truncated) {
                        truncated = true;
                        this.truncate(this.position);
                        return;
                    }

                    console.log('write complete');
                    callback();
                };

                var blob;
                if (type === "pdf") {
                    blob = new Blob([data], {type:'application/pdf'});
                }
                else {
                    blob = new Blob([data], {type:'text/plain'});
                }
                
                writer.write(blob);
            }, pm.filesystem.errorHandler);
        });

    }
};
pm.indexedDB = {
    TABLE_HEADER_PRESETS: "header_presets",
    TABLE_HELPERS: "helpers",
    TABLE_DRIVE_FILES: "drive_files",
    TABLE_DRIVE_CHANGES: "drive_changes",
    TABLE_OAUTH2_ACCESS_TOKENS: "oauth2_access_tokens",

    onTransactionComplete: function(callback) {
        if (pm.isTesting) {
            pm.indexedDB.clearAllObjectStores(function() {
                callback();
            });
        }
        else {
            callback();
        }
    },

    onerror:function (event, callback) {
        pm.mediator.trigger("error");
    },

    open_v21:function (callback) {

        var request = indexedDB.open(pm.databaseName, "POSTman request history");
        request.onsuccess = function (e) {
            var v = "0.7.5";
            pm.indexedDB.db = e.target.result;
            var db = pm.indexedDB.db;

            //We can only create Object stores in a setVersion transaction
            if (v !== db.version) {
                var setVrequest = db.setVersion(v);

                setVrequest.onfailure = function (e) {
                    console.log(e);
                };

                setVrequest.onsuccess = function (event) {
                    //Only create if does not already exist
                    if (!db.objectStoreNames.contains("requests")) {
                        var requestStore = db.createObjectStore("requests", {keyPath:"id"});
                        requestStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("collections")) {
                        var collectionsStore = db.createObjectStore("collections", {keyPath:"id"});
                        collectionsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("collection_requests")) {
                        var collectionRequestsStore = db.createObjectStore("collection_requests", {keyPath:"id"});
                        collectionRequestsStore.createIndex("timestamp", "timestamp", { unique:false});
                        collectionRequestsStore.createIndex("collectionId", "collectionId", { unique:false});
                    }

                    if (db.objectStoreNames.contains("collection_responses")) {
                        db.deleteObjectStore("collection_responses");
                    }

                    if (!db.objectStoreNames.contains("environments")) {
                        var environmentsStore = db.createObjectStore("environments", {keyPath:"id"});
                        environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                        environmentsStore.createIndex("id", "id", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("header_presets")) {
                        var headerPresetsStore = db.createObjectStore("header_presets", {keyPath:"id"});
                        headerPresetsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_HELPERS)) {
                        var helpersStore = db.createObjectStore(pm.indexedDB.TABLE_HELPERS, {keyPath:"id"});
                        helpersStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_FILES)) {
                        var driveFilesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_FILES, {keyPath:"id"});
                        driveFilesStore.createIndex("timestamp", "timestamp", { unique:false});
                        driveFilesStore.createIndex("fileId", "fileId", { unique:false});
                    }
                    else {
                        var driveFilesStoreForIndex = request.transaction.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);
                        driveFilesStoreForIndex.createIndex("fileId", "fileId", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_CHANGES)) {
                        var driveChangesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_CHANGES, {keyPath:"id"});
                        driveChangesStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS)) {
                        var accessTokenStore = db.createObjectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS, {keyPath:"id"});
                        accessTokenStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    var transaction = event.target.result;
                    transaction.oncomplete = pm.indexedDB.onTransactionComplete;
                };

                setVrequest.onupgradeneeded = function (evt) {
                };
            }
        };

        request.onfailure = pm.indexedDB.onerror;
    },

    open_latest:function (callback) {
        var v = 21;
        var request = indexedDB.open(pm.databaseName, v);
        request.onupgradeneeded = function (e) {
            console.log("Upgrade DB");
            var db = e.target.result;
            pm.indexedDB.db = db;

            if (!db.objectStoreNames.contains("requests")) {
                var requestStore = db.createObjectStore("requests", {keyPath:"id"});
                requestStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains("collections")) {
                var collectionsStore = db.createObjectStore("collections", {keyPath:"id"});
                collectionsStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains("collection_requests")) {
                var collectionRequestsStore = db.createObjectStore("collection_requests", {keyPath:"id"});
                collectionRequestsStore.createIndex("timestamp", "timestamp", { unique:false});
                collectionRequestsStore.createIndex("collectionId", "collectionId", { unique:false});
            }

            if (db.objectStoreNames.contains("collection_responses")) {
                db.deleteObjectStore("collection_responses");
            }

            if (!db.objectStoreNames.contains("environments")) {
                var environmentsStore = db.createObjectStore("environments", {keyPath:"id"});
                environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                environmentsStore.createIndex("id", "id", { unique:false});
            }

            if (!db.objectStoreNames.contains("header_presets")) {
                var headerPresetsStore = db.createObjectStore("header_presets", {keyPath:"id"});
                headerPresetsStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_HELPERS)) {
                var helpersStore = db.createObjectStore(pm.indexedDB.TABLE_HELPERS, {keyPath:"id"});
                helpersStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_FILES)) {
                var driveFilesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_FILES, {keyPath:"id"});
                driveFilesStore.createIndex("timestamp", "timestamp", { unique:false});
                driveFilesStore.createIndex("fileId", "fileId", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_CHANGES)) {
                var driveChangesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_CHANGES, {keyPath:"id"});
                driveChangesStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS)) {
                var accessTokenStore = db.createObjectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS, {keyPath:"id"});
                accessTokenStore.createIndex("timestamp", "timestamp", { unique:false});
            }
        };

        request.onsuccess = function (e) {
            pm.indexedDB.db = e.target.result;
            pm.indexedDB.onTransactionComplete(callback);
        };

        request.onerror = pm.indexedDB.onerror;
    },

    open:function (callback) {
        if (parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) < 23) {
            pm.indexedDB.open_v21(callback);
        }
        else {
            pm.indexedDB.open_latest(callback);
        }

        pm.mediator.on("initiateBackup", pm.indexedDB.downloadAllData);
    },

    clearAllObjectStores: function(callback) {
        console.log("Clearing all object stores");
        //Make sure we are testing and the database is not postman
        if (pm.isTesting && pm.databaseName !== "postman") {
            var stores = [
                "requests", "collections", "header_presets",
                "collection_requests", "environments",
                pm.indexedDB.TABLE_HELPERS,
                pm.indexedDB.TABLE_DRIVE_FILES,
                pm.indexedDB.TABLE_DRIVE_CHANGES
            ];

            var db = pm.indexedDB.db;
            var transaction = db.transaction(stores, "readwrite");
            transaction.objectStore("requests").clear();
            transaction.objectStore("collections").clear();
            transaction.objectStore("collection_requests").clear();
            transaction.objectStore("environments").clear();
            transaction.objectStore("header_presets").clear();
            transaction.objectStore(pm.indexedDB.TABLE_HELPERS).clear();
            transaction.objectStore(pm.indexedDB.TABLE_DRIVE_FILES).clear();
            transaction.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES).clear();

            transaction.oncomplete = function(event) {
                console.log("Cleared the database");
                if (callback) {
                    callback();
                }
            };
        }
    },

    addCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        var request;

        request = store.put(collection);

        request.onsuccess = function () {
            callback(collection);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    updateCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        var boundKeyRange = IDBKeyRange.only(collection.id);
        var request = store.put(collection);

        request.onsuccess = function (e) {
            callback(collection);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    addCollectionRequest:function (req, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        var collectionRequest = store.put(req);

        collectionRequest.onsuccess = function () {
            callback(req);
        };

        collectionRequest.onerror = function (e) {
            console.log(e.value);
        };
    },

    updateCollectionRequest:function (req, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        var boundKeyRange = IDBKeyRange.only(req.id);
        var request = store.put(req);

        request.onsuccess = function (e) {
            callback(req);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    getCollection:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            callback(result);
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getCollections:function (callback) {
        var db = pm.indexedDB.db;

        if (db === null) {
            return;
        }

        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);
        var numCollections = 0;
        var items = [];
        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                callback(items);
                return;
            }

            var collection = result.value;
            numCollections++;

            items.push(collection);

            result['continue']();
        };

        cursorRequest.onerror = function (e) {
            console.log(e);
        };
    },

    getAllCollectionRequests:function (callback) {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("timestamp");
        var cursorRequest = index.openCursor(keyRange);
        var collectionRequests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                if (callback) {
                    callback(collectionRequests);
                }
                else {
                    console.log(collectionRequests);
                }

                return;
            }

            var request = result.value;
            collectionRequests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getAllRequestsForCollectionId:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        var requests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(requests);
                return;
            }

            var request = result.value;
            requests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getAllRequestsInCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(collection.id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        var requests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(collection, requests);
                return;
            }

            var request = result.value;
            requests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    addRequest:function (historyRequest, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");
        var request = store.put(historyRequest);

        request.onsuccess = function (e) {
            callback(historyRequest);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    getRequest:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                return;
            }

            callback(result);
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getCollectionRequest:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                return;
            }

            callback(result);
            return result;
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },


    getAllRequestItems:function (callback) {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("timestamp");
        var cursorRequest = index.openCursor(keyRange);
        var historyRequests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(historyRequests);
                return;
            }

            var request = result.value;
            historyRequests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    deleteRequest:function (id, callback) {
        try {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["requests"], "readwrite");
            var store = trans.objectStore(["requests"]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        }
        catch (e) {
            console.log(e);
        }
    },

    deleteHistory:function (callback) {
        var db = pm.indexedDB.db;
        var clearTransaction = db.transaction(["requests"], "readwrite");
        var clearRequest = clearTransaction.objectStore(["requests"]).clear();
        clearRequest.onsuccess = function (event) {
            callback();
        };
    },

    deleteCollectionRequest:function (id, callback) {
        pm.indexedDB.getCollectionRequest(id, function(collectionRequest) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["collection_requests"], "readwrite");
            var store = trans.objectStore(["collection_requests"]);

            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        });
    },

    deleteAllCollectionRequests:function (id) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                return;
            }

            var request = result.value;
            pm.indexedDB.deleteCollectionRequest(request.id, function() {
                console.log("Deleted from DB");
            });
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    deleteCollection:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore(["collections"]);

        var request = store['delete'](id);

        request.onsuccess = function () {
            // pm.indexedDB.deleteAllCollectionRequests(id);
            callback(id);
        };

        request.onerror = function (e) {
            console.log(e);
        };
    },

    environments:{
        addEnvironment:function (environment, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");
            var request = store.put(environment);

            request.onsuccess = function (e) {
                callback(environment);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getEnvironment:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteEnvironment:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore(["environments"]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllEnvironments:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var environments = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(environments);
                    return;
                }

                var request = result.value;
                environments.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateEnvironment:function (environment, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            var boundKeyRange = IDBKeyRange.only(environment.id);
            var request = store.put(environment);

            request.onsuccess = function (e) {
                callback(environment);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    helpers:{
        addHelper:function (helper, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HELPERS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HELPERS);
            var request = store.put(helper);

            request.onsuccess = function (e) {
                callback(helper);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getHelper:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HELPERS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HELPERS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    headerPresets:{
        addHeaderPreset:function (headerPreset, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);
            var request = store.put(headerPreset);

            request.onsuccess = function (e) {
                callback(headerPreset);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getHeaderPreset:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteHeaderPreset:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_HEADER_PRESETS]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllHeaderPresets:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                console.log("Db is null");
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var headerPresets = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(headerPresets);
                    return;
                }

                var request = result.value;
                headerPresets.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateHeaderPreset:function (headerPreset, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            var boundKeyRange = IDBKeyRange.only(headerPreset.id);
            var request = store.put(headerPreset);

            request.onsuccess = function (e) {
                callback(headerPreset);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    driveFiles: {
        addDriveFile:function (driveFile, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);
            var request = store.put(driveFile);

            request.onsuccess = function (e) {
                console.log("Added file");
                callback(driveFile);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getDriveFile:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        getDriveFileByFileId:function (fileId, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var keyRange = IDBKeyRange.only(fileId);
            var index = store.index("fileId");
            var cursorRequest = index.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                console.log(result);
                if(result) {
                    callback(result.value);
                }
                else {
                    callback(null);
                }

            };

            cursorRequest.onerror = function(e) {
                callback(null);
            };
        },

        deleteDriveFile:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_DRIVE_FILES]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllDriveFiles:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                console.log("Db is null");
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var driveFiles = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(driveFiles);
                    return;
                }

                var request = result.value;
                driveFiles.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateDriveFile:function (driveFile, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            var boundKeyRange = IDBKeyRange.only(driveFile.id);
            var request = store.put(driveFile);

            request.onsuccess = function (e) {
                callback(driveFile);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },


    driveChanges: {
        addDriveChange:function (driveChange, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);
            var request = store.put(driveChange);

            request.onsuccess = function (e) {
                callback(driveChange);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getDriveChange:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteDriveChange:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_DRIVE_CHANGES]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllDriveChanges:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                console.log("Db is null");
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var driveChanges = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    driveChanges.sort(sortAscending);
                    callback(driveChanges);
                    return;
                }

                var request = result.value;
                driveChanges.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateDriveChange:function (driveChange, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            var boundKeyRange = IDBKeyRange.only(driveChange.id);
            var request = store.put(driveChange);

            request.onsuccess = function (e) {
                callback(driveChange);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    oAuth2AccessTokens: {
        addAccessToken: function(token, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);
            var request = store.put(token);

            request.onsuccess = function (e) {
                callback(token);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        deleteAccessToken: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };
            request.onerror = pm.indexedDB.onerror;
        },

        getAllAccessTokens: function(callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                console.log("Db is null");
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var accessTokens = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(accessTokens);
                    return;
                }

                var request = result.value;
                accessTokens.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateAccessToken:function (accessToken, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            var boundKeyRange = IDBKeyRange.only(accessToken.id);
            var request = store.put(accessToken);

            request.onsuccess = function (e) {
                callback(accessToken);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        },

        getAccessToken: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    // TODO Refactor this. Needs to reduce dependencies
    downloadAllData: function(callback) {
        console.log("Starting to download all data");

        //Get globals
        var totalCount = 0;
        var currentCount = 0;
        var collections = [];
        var globals = [];
        var environments = [];
        var headerPresets = [];

        var onFinishGettingCollectionRequests = function(collection) {
            collections.push(collection);

            currentCount++;

            if (currentCount === totalCount) {
                onFinishExportingCollections(collections);
            }
        }

        var onFinishExportingCollections = function(c) {
            console.log(pm.envManager);

            globals = pm.envManager.get("globals").get("globals");

            //Get environments
            pm.indexedDB.environments.getAllEnvironments(function (e) {
                environments = e;
                pm.indexedDB.headerPresets.getAllHeaderPresets(function (hp) {
                    headerPresets = hp;
                    onFinishExporttingAllData(callback);
                });
            });
        }

        var onFinishExporttingAllData = function() {
            console.log("collections", collections);
            console.log("environments", environments);
            console.log("headerPresets", headerPresets);
            console.log("globals", globals);

            var dump = {
                version: 1,
                collections: collections,
                environments: environments,
                headerPresets: headerPresets,
                globals: globals
            };

            var name = "Backup.postman_dump";
            var filedata = JSON.stringify(dump);
            var type = "application/json";
            pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
                if (callback) {
                    callback();
                }
            });
        }

        //Get collections
        //Get header presets
        pm.indexedDB.getCollections(function (items) {
            totalCount = items.length;
            pm.collections.items = items;
            var itemsLength = items.length;

            function onGetAllRequestsInCollection(collection, requests) {
                collection.requests = requests;
                onFinishGettingCollectionRequests(collection);
            }

            if (itemsLength !== 0) {
                for (var i = 0; i < itemsLength; i++) {
                    var collection = items[i];
                    pm.indexedDB.getAllRequestsInCollection(collection, onGetAllRequestsInCollection);
                }
            }
            else {
                globals = pm.envManager.get("globals").get("globals");

                pm.indexedDB.environments.getAllEnvironments(function (e) {
                    environments = e;
                    pm.indexedDB.headerPresets.getAllHeaderPresets(function (hp) {
                        headerPresets = hp;
                        onFinishExporttingAllData(callback);
                    });
                });
            }
        });
    },

    importAllData: function(files, callback) {
        if (files.length !== 1) {
            return;
        }

        var f = files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var data = e.currentTarget.result;
                var j = JSON.parse(data);
                var version = j.version;
                pm.indexedDB.importDataForVersion(version, j, callback);
            };
        })(files[0]);

        // Read in the image file as a data URL.
        reader.readAsText(files[0]);
    },

    importDataForVersion: function(version, data, callback) {
        if (version === 1) {
            var environments = pm.envManager.get("environments");
            var globals = pm.envManager.get("globals");

            if ("collections" in data) {
                console.log("Import collections");
                pm.collections.mergeCollections(data.collections);
            }

            if ("environments" in data) {
                console.log("Import environments");
                environments.mergeEnvironments(data.environments);
            }

            if ("globals" in data) {
                console.log("Import globals");
                globals.mergeGlobals(data.globals);
            }

            if ("headerPresets" in data) {
                console.log("Import headerPresets");
                pm.headerPresets.mergeHeaderPresets(data.headerPresets);
            }
        }

        callback();
    }
};
var Logger = Backbone.Model.extend({
	defaults: function() {
		return {
			toShow: true
		};
	},

	//For debug messages
	debug: function() {
		console.log(arguments);
	},

	//For stuff that is ok to be logged in production code. For ex. error messages
	message: function() {
		console.log(arguments);
	}
});
var Storage = Backbone.Model.extend({
    defaults: function() {
    },

    getValue: function(key, callback) {
        if (pm.target === pm.targets.CHROME_LEGACY_APP) {            
            callback(localStorage[key]);
        }
        else if (pm.target === pm.targets.CHROME_PACKAGED_APP) {
            var obj = {};
            obj[key] = null;
            chrome.storage.local.get(obj, function(result) {
                callback(result[key]);
            });
        }
    },

    setValue: function(kvpair, callback) {
        if (pm.target === pm.targets.CHROME_LEGACY_APP) {
            //Implementation here
            console.log("Set value for legacy app");
            for(key in kvpair) {
                if (kvpair.hasOwnProperty(key)) {
                    localStorage[key] = kvpair[key];                    
                }
            }

            if (callback) {
                callback();    
            }            
        }
        else if (pm.target === pm.targets.CHROME_PACKAGED_APP) {
            chrome.storage.local.set(kvpair, function() {
                if (callback) {
                    callback();
                }                
            });
        }
    }
});
var Settings = Backbone.Model.extend({
    defaults: function() {
        return {
            lastRequest:"",
            autoSaveRequest:true,
            selectedEnvironmentId:"",
            type: "chromeStorageArea",
            items: {}
        };
    },

    resetSettings: function() {
        this.setSetting("historyCount", 100);
        this.setSetting("autoSaveRequest", true);
        this.setSetting("selectedEnvironmentId", true);
        this.setSetting("lineWrapping", true);
        this.setSetting("previewType", "parsed");
        this.setSetting("retainLinkHeaders", false);
        this.setSetting("sendNoCacheHeader", true);
        this.setSetting("sendPostmanTokenHeader", true);
        this.setSetting("usePostmanProxy", false);
        this.setSetting("proxyURL", "");
        this.setSetting("lastRequest", "");
        this.setSetting("launcherNotificationCount", 0);
        this.setSetting("variableDelimiter", "{{...}}");
        this.setSetting("languageDetection", "auto");
        this.setSetting("haveDonated", false);

        this.setSetting("responsePreviewDataSection", "body");
        this.setSetting("requestBodyEditorContainerType", "editor");

        //Google Drive related
        this.setSetting("driveSyncPermissionStatus", "disabled"); //notconnected, connected, disabled
        this.setSetting("driveSyncEnabled", false);
        this.setSetting("driveStartChangeId", 0);
        this.setSetting("driveAppDataFolderId", 0);
        this.setSetting("lastDriveChangeTime", "");
        this.setSetting("syncedGlobals", false);
    },

    initValues: function(callback) {
        this.set({"items": {}});

        var func = function(settingsJson) {
            if (settingsJson !== null) {
                this.set({"items": JSON.parse(settingsJson)});
            }

            this.create("historyCount", 100);
            this.create("autoSaveRequest", true);
            this.create("selectedEnvironmentId", true);
            this.create("lineWrapping", true);
            this.create("previewType", "parsed");
            this.create("retainLinkHeaders", false);
            this.create("sendNoCacheHeader", true);
            this.create("sendPostmanTokenHeader", true);
            this.create("usePostmanProxy", false);
            this.create("proxyURL", "");
            this.create("lastRequest", "");
            this.create("launcherNotificationCount", 0);
            this.create("variableDelimiter", "{{...}}");
            this.create("languageDetection", "auto");
            this.create("haveDonated", false);

            this.create("responsePreviewDataSection", "body");
            this.create("requestBodyEditorContainerType", "editor");

            //Google Drive related
            this.create("driveSyncPermissionStatus", "not_asked"); //not_asked, asked, disabled
            this.create("driveSyncEnabled", false);
            this.create("driveStartChangeId", 0);
            this.create("driveAppDataFolderId", 0);
            this.create("lastDriveChangeTime", "");

            this.create("syncedGlobals", false);
            this.create("syncedHeaderPresets", false);

            if (pm.isTesting) {
                this.resetSettings();
            }

            callback();
        };

        func = _.bind(func, this);
        pm.storage.getValue("settings", func);
    },

    //This moves to the view initialize script?
    initListeners: function() {
    },

    test: function() {
        console.log("Testing the function");
    },

    init:function (callback) {
        this.initValues(callback);
    },

    create:function (key, defaultVal) {
        if (!(key in this.get("items"))) {
            if (defaultVal !== "undefined") {
                this.setSetting(key, defaultVal);
            }
        }
    },

    setSetting:function (key, value) {
        //Need to clone otherwise Backbone will not fire the correct event
        var newItems = _.clone(this.get("items"));
        newItems[key] = value;
        this.set({items: newItems});

        var o = {'settings': JSON.stringify(this.get("items"))};
        pm.storage.setValue(o, function() {
        });
    },

    getSetting:function (key) {
        var val = this.get("items")[key];

        if (val === "true") {
            return true;
        }
        else if (val === "false") {
            return false;
        }
        else {
            return val;
        }
    },

    update: function(settings) {
        this.setSetting("historyCount", settings.historyCount, false);
        this.setSetting("autoSaveRequest", settings.autoSaveRequest, false);
        this.setSetting("retainLinkHeaders", settings.retainLinkHeaders, false);
        this.setSetting("sendNoCacheHeader", settings.sendNoCacheHeader, false);
        this.setSetting("variableDelimiter", settings.variableDelimiter, false);
        this.setSetting("languageDetection", settings.languageDetection, false);
        this.setSetting("haveDonated", settings.haveDonated, false);

        this.initValues();
        this.initListeners();
    },

    getAsJson: function() {
        var settings = {
            historyCount: this.getSetting("historyCount"),
            autoSaveRequest: this.getSetting("autoSaveRequest"),
            retainLinkHeaders: this.getSetting("retainLinkHeaders"),
            sendNoCacheHeader: this.getSetting("sendNoCacheHeader"),
            variableDelimiter: this.getSetting("variableDelimiter"),
            languageDetection: this.getSetting("languageDetection"),
            haveDonated: this.getSetting("haveDonated")
        };

        return settings;
    }
});
var SettingsModal = Backbone.View.extend({
    el: $("#modal-settings"),

    initialize: function() {
        var settings = this.model;
        this.model.on('change:items', this.render, this);

        $("#modal-settings").on("shown", function () {
            $("#history-count").focus();
            pm.app.trigger("modalOpen", "#modal-settings");
        });

        $("#modal-settings").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $('#history-count').change(function () {
            settings.setSetting("historyCount", $('#history-count').val());
        });

        $('#auto-save-request').change(function () {
            var val = $('#auto-save-request').val();
            if (val === "true") {
                settings.setSetting("autoSaveRequest", true);
            }
            else {
                settings.setSetting("autoSaveRequest", false);
            }
        });

        $('#retain-link-headers').change(function () {
            var val = $('#retain-link-headers').val();
            if (val === "true") {
                settings.setSetting("retainLinkHeaders", true);
            }
            else {
                settings.setSetting("retainLinkHeaders", false);
            }
        });

        $('#send-no-cache-header').change(function () {
            var val = $('#send-no-cache-header').val();
            if (val === "true") {
                settings.setSetting("sendNoCacheHeader", true);
            }
            else {
                settings.setSetting("sendNoCacheHeader", false);
            }
        });

        $('#send-postman-token-header').change(function () {
            var val = $('#send-postman-token-header').val();
            if (val === "true") {
                settings.setSetting("sendPostmanTokenHeader", true);
            }
            else {
                settings.setSetting("sendPostmanTokenHeader", false);
            }
        });

        $('#use-postman-proxy').change(function () {
            var val = $('#use-postman-proxy').val();
            if (val === "true") {
                settings.setSetting("usePostmanProxy", true);
                $('#postman-proxy-url-container').css("display", "block");
            }
            else {
                settings.setSetting("usePostmanProxy", false);
                $('#postman-proxy-url-container').css("display", "none");
            }
        });

        $('#postman-proxy-url').change(function () {
            settings.setSetting("postmanProxyUrl", $('#postman-proxy-url').val());
        });

        $('#variable-delimiter').change(function () {
            settings.setSetting("variableDelimiter", $('#variable-delimiter').val());
        });

        $('#language-detection').change(function () {
            settings.setSetting("languageDetection", $('#language-detection').val());
        });

        $('#have-donated').change(function () {
            var val = $('#have-donated').val();
            console.log("Donated status changed");
            if (val === "true") {
                settings.setSetting("haveDonated", true);
                pm.mediator.trigger("donatedStatusChanged", true);
            }
            else {
                settings.setSetting("haveDonated", false);
                pm.mediator.trigger("donatedStatusChanged", false);
            }
        });

        $('#force-windows-line-endings').change(function () {
            var val = $('#force-windows-line-endings').val();
            if (val === "true") {
                settings.setSetting("forceWindowsLineEndings", true);
            }
            else {
                settings.setSetting("forceWindowsLineEndings", false);
            }
        });

        $("#download-all-data").on("click", function() {
            pm.indexedDB.downloadAllData(function() {
                noty(
                {
                    type:'success',
                    text:'Saved the data dump',
                    layout:'topCenter',
                    timeout:750
                });
            });
        });

        $("#import-all-data-files-input").on("change", function(event) {
            console.log("Process file and import data");
            var files = event.target.files;
            pm.indexedDB.importAllData(files, function() {
                $("#import-all-data-files-input").val("");
                noty(
                {
                    type:'success',
                    text:'Imported all data',
                    layout:'topCenter',
                    timeout:750
                });
            });
        });

        $(document).bind('keydown', 'shift+/', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-settings').modal({
                keyboard: true
            });

            $('#modal-settings').modal('show');
            $('#modal-settings a[href="#settings-shortcuts"]').tab('show');
        });

        if (this.model.getSetting("usePostmanProxy") === true) {
            $('#postman-proxy-url-container').css("display", "block");
        }
        else {
            $('#postman-proxy-url-container').css("display", "none");
        }

        this.render();
    },

    render: function() {
        $('#history-count').val(this.model.getSetting("historyCount"));
        $('#auto-save-request').val(this.model.getSetting("autoSaveRequest") + "");
        $('#retain-link-headers').val(this.model.getSetting("retainLinkHeaders") + "");
        $('#send-no-cache-header').val(this.model.getSetting("sendNoCacheHeader") + "");
        $('#send-postman-token-header').val(this.model.getSetting("sendPostmanTokenHeader") + "");
        $('#use-postman-proxy').val(this.model.getSetting("usePostmanProxy") + "");
        $('#postman-proxy-url').val(this.model.getSetting("postmanProxyUrl"));
        $('#variable-delimiter').val(this.model.getSetting("variableDelimiter"));
        $('#language-detection').val(this.model.getSetting("languageDetection"));
        $('#have-donated').val(this.model.getSetting("haveDonated") + "");
    }
});

var SearchForm = Backbone.View.extend({
    initialize: function() {
    	var wait;

    	var view = this;
    	var model = this.model;

    	$("#sidebar-search").on("keyup", function(event) {
            $("#sidebar-search-cancel").css("display", "block");
    		clearTimeout(wait);
    		wait = setTimeout(function() {
    			var searchTerm = $("#sidebar-search").val();

    			if (searchTerm !== model.get("term")) {
    				model.set("term", searchTerm);
    			}

                if (searchTerm === "") {
                    $("#sidebar-search-cancel").css("display", "none");
                }
    		}, 250);
    	});

    	$("#sidebar-search-cancel").on("click", function() {
    		$("#sidebar-search").val("");
    		view.revertSidebar();
    	});
    },

    revertSidebar: function() {
        $("#sidebar-search-cancel").css("display", "none");
    	var history = this.model.get("history");
    	var collections = this.model.get("collections");
    	history.revert();
    	collections.revert();
    }
});

var SearchState = Backbone.Model.extend({
    defaults: function() {
        return {
            term: "",            
            history: null,
            collections: null
        };
    },

    initialize: function(options) {
        this.on("change:term", this.onChangeSearchTerm, this);
    },

    onChangeSearchTerm: function() {
        this.filterSidebar(this.get("term"));
    },

    filterSidebar: function(term) {
        var history = this.get("history");
        var collections = this.get("collections");

        if (term === "") {
            history.revert();
            collections.revert();
        }
        else {
            history.filter(term);
            collections.filter(term);
        }
    } 
});
var Sidebar = Backbone.View.extend({
    initialize: function() {
        var history = this.model.get("history");
        var collections = this.model.get("collections");

    	var historySidebar = new HistorySidebar({model: history});
    	var collectionSidebar = new CollectionSidebar({model: collections});
    	var view = this;

    	var searchState = new SearchState({
    		history: this.model.get("history"),
    		collections: this.model.get("collections")
    	});

    	var searchForm = new SearchForm({model: searchState});

    	var activeSidebarSection = pm.settings.getSetting("activeSidebarSection");


        $('#sidebar-toggle').on("click", function () {
            view.toggleSidebar();
        });

        this.model.set("width", $('#sidebar').width() + 10);

    	if (activeSidebarSection) {
    	    this.select(activeSidebarSection);
    	}
    	else {
    	    this.select("history");
    	}

    	$('#sidebar-selectors li').click(function () {
    	    var id = $(this).attr('data-id');
    	    view.select(id);
    	});

        pm.mediator.on("hideSidebar", this.hideSidebar, this);
        pm.mediator.on("showSidebar", this.showSidebar, this);

        history.on("loadRequest", this.onLoadHistoryRequest, this);
        collections.on("addCollectionRequest", this.onAddCollectionRequest, this);
    },

    hideSidebar: function() {
        $("#sidebar").css("display", "none");
        $("#sidebar-filler").css("display", "none");
        $("#sidebar-toggle").css("display", "none");
        $("#sidebar-search-container").css("display", "none");
    },

    showSidebar: function() {
        $("#sidebar").css("display", "block");
        $("#sidebar-filler").css("display", "block");
        $("#sidebar-toggle").css("display", "block");
        $("#sidebar-search-container").css("display", "block");
    },

    onLoadHistoryRequest: function() {
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
    },

    onAddCollectionRequest: function() {
        this.select("collections");
    },

    minimizeSidebar:function () {
    	var model = this.model;

        model.set("width", $("#sidebar").width());

        var animationDuration = model.get("animationDuration");

        $('#sidebar-toggle').animate({left:"0"}, animationDuration);
        $('#sidebar').animate({width:"0px", marginLeft: "-10px"}, animationDuration);
        $('#sidebar-filler').animate({width:"0px", marginLeft: "-10px"}, animationDuration);
        $('#sidebar-search-container').css("display", "none");
        $('#sidebar div').animate({opacity:0}, animationDuration);
        var newMainWidth = $(document).width();
        $('#main').animate({width:newMainWidth + "px", "margin-left":"5px"}, animationDuration);
        $('#sidebar-toggle img').attr('src', 'img/tri_arrow_right.png');
    },

    maximizeSidebar:function () {
    	var model = this.model;
    	var animationDuration = model.get("animationDuration");
    	var sidebarWidth = model.get("width");

        $('#sidebar-toggle').animate({left:"350px"}, animationDuration, function () {
        });

        $('#sidebar').animate({width:sidebarWidth + "px", marginLeft: "0px"}, animationDuration);
        $('#sidebar-filler').animate({width:sidebarWidth + "px", marginLeft: "0px"}, animationDuration);
        $('#sidebar-search-container').fadeIn(animationDuration);
        $('#sidebar div').animate({opacity:1}, animationDuration);
        $('#sidebar-toggle img').attr('src', 'img/tri_arrow_left.png');
        var newMainWidth = $(document).width() - sidebarWidth - 10;
        var marginLeft = sidebarWidth + 10;
        $('#main').animate({width:newMainWidth + "px", "margin-left": marginLeft+ "px"}, animationDuration);
    },

    toggleSidebar:function () {
    	var model = this.model;
    	var isSidebarMaximized = model.get("isSidebarMaximized");

        if (isSidebarMaximized) {
            this.minimizeSidebar();
        }
        else {
            this.maximizeSidebar();
        }

        model.set("isSidebarMaximized", !isSidebarMaximized);
    },

    select:function (section) {
    	var currentSection = this.model.get("currentSection");

        $("#sidebar-selectors li").removeClass("active");
        $("#sidebar-selectors-" + section).addClass("active");

        pm.settings.setSetting("activeSidebarSection", section);

        $('#sidebar-section-' + currentSection).css("display", "none");
        $('#' + currentSection + '-options').css("display", "none");

        this.model.set("currentSection", section);

        $('#sidebar-section-' + section).css("display", "block");
        $('#' + section + '-options').css("display", "block");
    }
});
var SidebarState = Backbone.Model.extend({
    defaults: function() {
        return {
            currentSection:"history",
            isSidebarMaximized:true,
            sections:[ "history", "collections" ],
            width:0,
            animationDuration:250,
            history:null,
            collections:null
        };
    },

    initialize: function(options) {
    }
});
$(document).ready(function() {
	var socketId;
	var ci;
	var IP = "127.0.0.1";
	var PORT = 5005;
	chrome.socket.create('tcp', {}, function(createInfo) {
		socketId = createInfo.socketId;
		ci = createInfo;
		console.log(createInfo);

		chrome.socket.connect(createInfo.socketId, IP, PORT, function() {
			console.log("Connected TCP socket");

			var func = setInterval(function() {
				chrome.socket.read(socketId, null, function(readInfo) {
					if (readInfo.resultCode > 0) {
						chrome.socket.write(socketId, readInfo.data, function() {
							console.log("Found data in socket", readInfo);
							console.log(ab2str(readInfo.data));
							console.log("Written the data");
							window.clearInterval(func);
						});
					}
				});
			}, 10);


		});
	});
	console.log("Start reading TCP calls");
});
var DeleteUserCollectionModal = Backbone.View.extend({
    initialize: function() {
        $('#modal-delete-user-collection-yes').on("click", function () {
            var id = $(this).attr('data-collection-id');
            pm.mediator.trigger("deleteSharedCollection", id)
        });

        $("#modal-delete-user-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-user-collection");
        });

        $("#modal-delete-user-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        pm.mediator.on("confirmDeleteSharedCollection", this.render, this);
    },

    render: function(id) {
        $('#modal-delete-user-collection-yes').attr("data-collection-id", id);
        $('#modal-delete-user-collection').modal("show");
    }
});

var User = Backbone.Model.extend({
	defaults: function() {
	    return {
	        "id": 0,
	        "name": "",
	        "access_token": "",
	        "refresh_token": "",
	        "expires_in": 0,
	        "logged_in_at": 0,
	        "link": "",
	        "collections": []
	    };
	},

	setDefaults: function() {
		this.set("id", 0);
		this.set("name", "");
		this.set("access_token", "");
		this.set("refresh_token", "");
		this.set("expires_in", 0);
		this.set("link", "");

		if (pm.features.isFeatureEnabled(FEATURES.USER)) {
			pm.storage.setValue({"user": this.toJSON()}, function() {
			});
		}
	},

	initialize: function() {
		var model = this;

		pm.storage.getValue("user", function(u) {
			if (u) {
				model.set("id", u.id);
				model.set("name", u.name);
				model.set("access_token", u.access_token);
				model.set("refresh_token", u.refresh_token);

				var expires_in = parseInt(u.expires_in, 10);

				model.set("expires_in", expires_in);
				model.set("logged_in_at", u.logged_in_at);

				if (pm.features.isFeatureEnabled(FEATURES.USER)) {
					if (u.id !== 0) {
						model.getCollections();
						model.trigger("login", model);
					}

				}
			}
		});

		pm.mediator.on("refreshSharedCollections", this.getCollections, this);
		pm.mediator.on("downloadSharedCollection", this.onDownloadSharedCollection, this);
		pm.mediator.on("deleteSharedCollection", this.onDeleteSharedCollection, this);
		pm.mediator.on("invalidAccessToken", this.onTokenNotValid, this);
		pm.mediator.on("downloadAllSharedCollections", this.onDownloadAllSharedCollections, this);
	},

	onTokenNotValid: function() {
		// Indicate error
	},

	isLoggedIn: function() {
		return this.get("id") !== 0;
	},

	setAccessToken: function(data) {
		var model = this;

		var expires_in = parseInt(data.expires_in, 10);

		model.set("access_token", data.access_token);
		model.set("refresh_token", data.refresh_token);
		model.set("expires_in", expires_in);
		model.set("logged_in_at", new Date().getTime());

		pm.storage.setValue({"user": model.toJSON()}, function() {
		});
	},

	getRemoteIdForCollection: function(id) {
		var collections = this.get("collections");
		var index = arrayObjectIndexOf(collections, id, "id");

		if (index >= 0) {
			return collections[index].remote_id;
		}
		else {
			return 0;
		}
	},

	login: function() {
		var model = this;

		chrome.identity.launchWebAuthFlow({'url': pm.webUrl + '/signup', 'interactive': true},
			function(redirect_url) {
				if (chrome.runtime.lastError) {
					model.trigger("logout", model);
					pm.mediator.trigger("notifyError", "Could not initiate OAuth 2 flow");
				}
				else {
					var params = getUrlVars(redirect_url, true);

					model.set("id", params.user_id);
					model.set("name", decodeURIComponent(params.name));
					model.set("access_token", decodeURIComponent(params.access_token));
					model.set("refresh_token", decodeURIComponent(params.refresh_token));
					model.set("expires_in", parseInt(params.expires_in, 10));
					model.set("logged_in_at", new Date().getTime());

					pm.storage.setValue({"user": model.toJSON()}, function() {
					});

					model.getCollections();

					model.trigger("login", model);
					/* Extract token from redirect_url */
				}

			}
		);
	},

	logout: function() {
		var model = this;

		pm.api.logoutUser(this.get("id"), this.get("access_token"), function() {
			model.setDefaults();
			model.trigger("logout");
		});

	},

	getCollections: function() {
		var model = this;

		if (this.isLoggedIn()) {
			pm.api.getUserCollections(function(data) {
		    	if (data.hasOwnProperty("collections")) {
			    	for(var i = 0; i < data.collections.length; i++) {
			    		c = data.collections[i];
			    		c.is_public = c.is_public === "1" ? true : false;
			    		c.updated_at_formatted = new Date(c.updated_at).toDateString();
			    	}

			    	model.set("collections", data.collections);
			    	model.trigger("change:collections");
		    	}
			});
		}
	},

	onDeleteSharedCollection: function(id) {
		var model = this;
		pm.api.deleteSharedCollection(id, function(data) {
			var collections = model.get("collections");
			var index = arrayObjectIndexOf(collections, id, "id");
			var collection = _.clone(collections[index]);

			if (index >= 0) {
				collections.splice(index, 1);
			}

			pm.mediator.trigger("deletedSharedCollection", collection);

			model.trigger("change:collections");
		});
	},

	downloadSharedCollection: function(id, callback) {
		pm.api.getCollectionFromRemoteId(id, function(data) {
			pm.mediator.trigger("overwriteCollection", data);

			if (callback) {
				callback();
			}
		});
	},

	onDownloadSharedCollection: function(id) {
		this.downloadSharedCollection(id);
	},

	onDownloadAllSharedCollections: function() {
		var collections = this.get("collections");

		for(var i = 0; i < collections.length; i++) {
			this.downloadSharedCollection(collections[i].remote_id);
		}
	},

	getRemoteIdForLinkId: function(linkId) {
		var link = pm.webUrl + "/collections/" + linkId;

		console.log("Link = ", link);

		var collections = this.get("collections");
		var index = arrayObjectIndexOf(collections, link, "link");

		if (index >= 0) {
			return collections[index].remote_id;
		}
		else {
			return 0;
		}
	}

});
var UserCollections = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("login", this.render, this);
		model.on("logout", this.render, this);
		model.on("change:collections", this.render, this);

		var deleteUserCollectionModal = new DeleteUserCollectionModal();

		$("#user-collections-actions-upload-all").on("click", function() {
			console.log("Upload all collections");
			pm.mediator.trigger("uploadAllLocalCollections");
		});

		$("#user-collections-actions-download-all").on("click", function() {
			console.log("Download all collections");
			pm.mediator.trigger("downloadAllSharedCollections");
		});

		$("#user-collections-list").on("click", ".user-collection-action-download", function() {
			var id = parseInt($(this).attr("data-remote-id"), 10);
			pm.mediator.trigger("downloadSharedCollection", id);
		});

		$("#user-collections-list").on("click", ".user-collection-action-delete", function() {
			var id = $(this).attr("data-id");
			pm.mediator.trigger("confirmDeleteSharedCollection", id);
		});

		this.render();
	},

	render: function() {
		var id = this.model.get("id");
		var name = this.model.get("name");

		if (id !== 0) {
			$('#user-collections-list tbody').html("");
			$('#user-collections-list tbody').append(Handlebars.templates.user_collections_list({"items":this.model.get("collections")}));
		}
		else {
			$('#user-collections-list tbody').html("");
		}
	}
});
var UserStatus = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("login", this.render, this);
		model.on("logout", this.render, this);

		$("#user-status-not-logged-in").on("click", function() {
			$("#user-status-not-logged-in").html("Loading...");
			model.login();
		});

		$("#user-status-shared-collections").on("click", function() {
			console.log("Open shared collections window");
		});

		$("#user-status-logout").on("click", function() {
			$("#user-status-not-logged-in").html("Log in");
			model.logout();
		});

		this.render();
	},

	render: function() {
		console.log("Logout triggered", this.model.get("id"));

		if (pm.features.isFeatureEnabled(FEATURES.USER)) {
			$("#user-status").css("display", "block");
		}

		var id = this.model.get("id");
		var name = this.model.get("name");

		if (id !== 0) {
			$("#user-status-false").css("display", "none");
			$("#user-status-true").css("display", "block");
			$("#user-status-username").html(name);
		}
		else {
			$("#user-status-not-logged-in").html("Sign in");
			$("#user-status-false").css("display", "block");
			$("#user-status-true").css("display", "none");
			$("#user-status-username").html("");
		}
	}
});
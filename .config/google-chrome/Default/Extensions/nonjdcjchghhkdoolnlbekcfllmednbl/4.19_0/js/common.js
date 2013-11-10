// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

// Load options from local storage
// Return default values if none exist
function loadOptions() {
    var options;
    if (localStorage.options == null) {
        localStorage.options = '{}';
    }
    options = JSON.parse(localStorage.options);

    options.extensionEnabled = options.hasOwnProperty('extensionEnabled') ? options.extensionEnabled : true;
    options.pageActionEnabled = options.hasOwnProperty('pageActionEnabled') ? options.pageActionEnabled : true;
    options.showCaptions = options.hasOwnProperty('showCaptions') ? options.showCaptions : true;
    options.showHighRes = options.hasOwnProperty('showHighRes') ? options.showHighRes : false;
    options.addToHistory = options.hasOwnProperty('addToHistory') ? options.addToHistory : true;
    options.alwaysPreload = options.hasOwnProperty('alwaysPreload') ? options.alwaysPreload : false;
    options.displayDelay = options.hasOwnProperty('displayDelay') ? options.displayDelay : 100;
    options.fadeDuration = options.hasOwnProperty('fadeDuration') ? options.fadeDuration : 200;
    options.excludedSites = options.hasOwnProperty('excludedSites') ? options.excludedSites : [];
    options.whiteListMode = options.hasOwnProperty('whiteListMode') ? options.whiteListMode : false;
    options.picturesOpacity = options.hasOwnProperty('picturesOpacity') ? options.picturesOpacity : 1;
    options.showWhileLoading = options.hasOwnProperty('showWhileLoading') ? options.showWhileLoading : true;
    //options.expAlwaysFullZoom = options.hasOwnProperty('expAlwaysFullZoom') ? options.expAlwaysFullZoom : false;
    options.mouseUnderlap = options.hasOwnProperty('mouseUnderlap') ? options.mouseUnderlap : true;
    options.updateNotifications = options.hasOwnProperty('updateNotifications') ? options.updateNotifications : true;
    options.enableAds = options.hasOwnProperty('enableAds') ? options.enableAds : 0;
    options.filterNSFW = options.hasOwnProperty('filterNSFW') ? options.filterNSFW : false;
    options.enableGalleries = options.hasOwnProperty('enableGalleries') ? options.enableGalleries : true;
    options.enableStats = options.hasOwnProperty('enableStats') ? options.enableStats : true;

    // Action keys
    options.actionKey = options.hasOwnProperty('actionKey') ? options.actionKey : 0;
    options.fullZoomKey = options.hasOwnProperty('fullZoomKey') ? options.fullZoomKey : 90;
    options.hideKey = options.hasOwnProperty('hideKey') ? options.hideKey : 88;
    options.openImageInWindowKey = options.hasOwnProperty('openImageInWindowKey') ? options.openImageInWindowKey : 87;
    options.openImageInTabKey = options.hasOwnProperty('openImageInTabKey') ? options.openImageInTabKey : 84;
    options.saveImageKey = options.hasOwnProperty('saveImageKey') ? options.saveImageKey : 83;
    options.prevImgKey = options.hasOwnProperty('prevImgKey') ? options.prevImgKey : 37;
    options.nextImgKey = options.hasOwnProperty('nextImgKey') ? options.nextImgKey : 39;

    localStorage.options = JSON.stringify(options);

    return options;
}

// Send options to all tabs and extension pages
function sendOptions(options) {
    var request = {action:'optionsChanged', 'options':options};

    // Send options to all tabs
    chrome.windows.getAll(null, function (windows) {
        for (var i = 0; i < windows.length; i++) {
            chrome.tabs.getAllInWindow(windows[i].id, function (tabs) {
                for (var j = 0; j < tabs.length; j++) {
                    chrome.tabs.sendRequest(tabs[j].id, request);
                }
            });
        }
    });

    // Send options to other extension pages
    chrome.extension.sendRequest(request);
}

// Return true is the url is part of an excluded site
function isExcludedSite(url) {
    var excluded = !options.whiteListMode;
    var siteAddress = url.substr(url.indexOf('://') + 3);
    if (siteAddress.substr(0, 4) == 'www.') {
        siteAddress = siteAddress.substr(4);
    }
    for (var i = 0; i < options.excludedSites.length; i++) {
        var es = options.excludedSites[i];
        if (es.substr(0, 4) == 'www.') {
            es = es.substr(4);
        }
        if (es && es.length <= siteAddress.length) {
            if (siteAddress.substr(0, es.length) == es) {
                return excluded;
            }
        }
    }
    return !excluded;
}

function compareVersionNumbers(v1, v2) {
    var aV1 = v1.split('.'),
        aV2 = v2.split('.'),
        l = Math.min(aV1.length, aV2.length),
        i, cmp;
    for (i = 0; i < l; i++) {
        cmp = parseInt(aV1[i]) < parseInt(aV2[i]);
        if (cmp !== 0) {
            return cmp;
        }
    }
    return aV1.length - aV2.length;
}

// Return true if the version of Chrome is superior or equal to minVersion
function hasMinChromeVersion(minVersion) {
    var matches = navigator.appVersion.match(/Chrome\/([^\s]+)/);
    if (!matches || matches.length < 2) {
        return;
    }
    var currentVersion = matches[1];
    return compareVersionNumbers(currentVersion, minVersion) >= 0;
}

function keyCodeToKeyName(keyCode) {
    if (keyCode == 16) {
        return 'Shift';
    } else if (keyCode == 17) {
        return 'Ctrl';
    } else if (keyCode == 17) {
        return 'Command';
    } else if (keyCode >= 65 && keyCode <= 90) {
        return String.fromCharCode(keyCode);
    } else {
        return 'None';
    }
}

function showUpdateNotification() {
    webkitNotifications.createHTMLNotification(chrome.extension.getURL('html/update-notif.html')).show();
}

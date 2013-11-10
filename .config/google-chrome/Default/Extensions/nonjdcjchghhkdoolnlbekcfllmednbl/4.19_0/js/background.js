// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

// True if the current version of the extension has something to show in an update notification
var hasReleaseNotes = false;

var options, _gaq, viewWindow = null;

// Performs an ajax request
function ajaxRequest(request, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                callback(xhr.responseText);
            } else {
                callback(null);
            }
        }
    };
    xhr.open(request.method, request.url, true);
    for (var i in request.headers) {
        xhr.setRequestHeader(request.headers[i].header, request.headers[i].value);
    }
    xhr.send(request.data);
}

function onRequest(request, sender, callback) {
    switch (request.action) {
        case 'ajaxGet':
            ajaxRequest({url:request.url, method:'GET'}, callback);
            break;
        case 'ajaxRequest':
            ajaxRequest(request, callback);
            break;
        case 'showPageAction':
            showPageAction(sender.tab);
            callback();
            break;
        case 'addUrlToHistory':
            chrome.history.addUrl({url:request.url});
            break;
        case 'getOptions':
            callback(options);
            break;
        case 'setOption':
            options[request.name] = request.value;
            localStorage.options = JSON.stringify(options);
            sendOptions(request.options);
            break;
        case 'optionsChanged':
            options = request.options;
            break;
        case 'saveOptions':
            localStorage.options = JSON.stringify(request.options);
            sendOptions(request.options);
            break;
        case 'setItem':
            localStorage.setItem(request.id, request.data);
            break;
        case 'getItem':
            callback(localStorage.getItem(request.id));
            break;
        case 'removeItem':
            localStorage.removeItem(request.id);
            break;
        case 'openViewWindow':
            chrome.windows.create(request.createData, function (window) {
                chrome.tabs.executeScript(window.tabs[0].id, {file:'js/viewWindow.js'});
            });
            break;
        case 'openViewTab':
            chrome.tabs.getSelected(null, function (currentTab) {
                request.createData.index = currentTab.index;
                if (!request.createData.active)
                    request.createData.index++;
                chrome.tabs.create(request.createData, function (tab) {
                    chrome.tabs.executeScript(tab.id, {file:'js/viewTab.js'});
                });
            });
            break;
        case 'trackEvent':
            if (options.enableStats && _gaq) {
                _gaq.push(['_trackEvent', request.event.category, request.event.action, request.event.label]);
            }
            break;
    }
}

function showPageAction(tab) {
    if (!tab) {
        return;
    }
    if (!options.extensionEnabled || isExcludedSite(tab.url)) {
        chrome.pageAction.setIcon({tabId:tab.id, path:'../images/icon19d.png'});
    } else {
        chrome.pageAction.setIcon({tabId:tab.id, path:'../images/icon19.png'});
    }
    chrome.pageAction.show(tab.id);
}

// Sets up anonymous stats
function setUpStats() {
    _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-394270-15']);
    _gaq.push(['_trackPageview']);

    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
    })();
}

// Report options stats
// No user data (browser history, etc) is reported
function optionsStats() {
    _gaq.push(['_trackEvent', 'Options', 'extensionEnabled', options.extensionEnabled.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'pageActionEnabled', options.pageActionEnabled.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'updateNotifications', options.updateNotifications.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'mouseUnderlap', options.mouseUnderlap.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'showCaptions', options.showCaptions.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'showHighRes', options.showHighRes.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'addToHistory', options.addToHistory.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'alwaysPreload', options.alwaysPreload.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'enableAds', options.enableAds.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'showWhileLoading', options.showWhileLoading.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'whiteListMode', options.whiteListMode.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'displayDelay', options.displayDelay.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'fadeDuration', options.fadeDuration.toString()]);
    _gaq.push(['_trackEvent', 'Options', 'picturesOpacity', options.picturesOpacity.toString()]);
    /*_gaq.push(['_trackEvent', 'Options', 'actionKey', keyCodeToKeyName(options.actionKey)]);
     _gaq.push(['_trackEvent', 'Options', 'fullZoomKey', keyCodeToKeyName(options.fullZoomKey)]);
     for (var i=0; i<options.excludedSites.length; i++) {
     _gaq.push(['_trackEvent', 'Options', 'excludedSites', options.excludedSites[i]]);
     }*/
}

// Report miscellaneous stats
// No user data (browser history, etc) is reported
function miscStats() {
    _gaq.push(['_trackEvent', 'Misc', 'extensionVersion', chrome.app.getDetails().version]);
    _gaq.push(['_trackEvent', 'Misc', 'downloadedFrom', 'Chrome Web Store']);
}

// Checks if the extension has been updated.
// Displays a notification if necessary.
function checkUpdate() {
    var currVersion = chrome.app.getDetails().version,
        prevVersion = localStorage.hzVersion;
    if (hasReleaseNotes && options.updateNotifications && currVersion != prevVersion && typeof prevVersion != 'undefined') {
        showUpdateNotification();
    }
    localStorage.hzVersion = currVersion;
}

function init() {
    // Load options
    options = loadOptions();

    // Bind events
    chrome.extension.onRequest.addListener(onRequest);

    // Anonymous stats
    if (options.enableStats && navigator.appVersion.indexOf("RockMelt") == -1) {
        setUpStats();
        miscStats();
        optionsStats();
    }

    checkUpdate();
}

init();

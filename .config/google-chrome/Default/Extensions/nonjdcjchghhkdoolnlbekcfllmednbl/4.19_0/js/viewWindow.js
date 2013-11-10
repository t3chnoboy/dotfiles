// Copyright (c) 2012 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var popupBorder = { width:window.outerWidth - window.innerWidth, height:window.outerHeight - window.innerHeight };
chrome.extension.sendRequest({action:'setItem', id:'popupBorder', data:JSON.stringify(popupBorder)});

chrome.extension.sendRequest({action:'getOptions'}, function (options) {
    window.addEventListener('keydown', function (event) {
        if (event.which == options.openImageInWindowKey) {
            window.close();
        }
    });
});
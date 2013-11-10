// Copyright (c) 2010 Romain Vallet
// Licensed under the MIT license, read license.txt
// Contributed by Thomas Efer

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Xing.com',
    version:'0.2',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'a img[src*="_s"]',
            /_s[234]/,
            ''
        );
        callback($(res));
    }
});
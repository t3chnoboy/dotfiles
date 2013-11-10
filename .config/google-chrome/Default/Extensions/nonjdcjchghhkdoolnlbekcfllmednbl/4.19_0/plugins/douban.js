// Copyright (c) 2013 Wilson Xu <imwilsonxu@gmail.com> and Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push( {
    name: 'Douban',
    prepareImgLinks: function(callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'img[src*="/view/"]',
            /(albumicon|thumb)/,
            'photo'
        );
        hoverZoom.urlReplace(res,
            'img[src*="pic/"]',
            /[sm]pic/,
            'lpic'
        );
        hoverZoom.urlReplace(res,
            'img[src*="icon/u"]',
            /u([0-9]+-[0-9])\.jpg/,
            'ul$1.jpg'
        );
        callback($(res));
    }
});
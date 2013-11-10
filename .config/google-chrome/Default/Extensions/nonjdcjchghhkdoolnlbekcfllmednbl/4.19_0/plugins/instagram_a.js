// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Instagram',
    prepareImgLinks:function (callback) {
        var res = [],
            search = /.*(?:instagr\.am|instagram\.com)\/p\/([^\/]+).*/,
            replace = 'http://instagr.am/p/$1/media/?size=l';
        hoverZoom.urlReplace(res, 'a[href*="instagr.am/p/"], a[href*="instagram.com/p/"]', search, replace);
        $('a[data-expanded-url*="instagr.am/p/"], a[data-expanded-url*="instagram.com/p/"]').each(function () {
            var link = $(this);
            link.data().hoverZoomSrc = [this.dataset['expandedUrl'].replace(search, replace)];
            res.push(link);
        });
        if (res.length) {
            callback($(res));
        }
    }
});
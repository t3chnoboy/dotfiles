// Copyright (c) 2011 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Gmail',
    version:'0.1',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'img[src*="disp=thd"]',
            'disp=thd',
            'disp=inline'
        );
        $('img[src*="disp=thd"]').each(function () {
            $(this).data().hoverZoomCaption = this.alt;
        });
        callback($(res));
    }
});

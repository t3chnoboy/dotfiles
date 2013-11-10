// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Twitter',
    version:'0.2',
    prepareImgLinks:function (callback) {
        var res = [];
        hoverZoom.urlReplace(res,
            'img[src*="_mini"]:not([src*="default_profile_"]), img[src*="_normal"]:not([src*="default_profile_"]), img[src*="_bigger"]:not([src*="default_profile_"])',
            /_(mini|normal|bigger)/,
            ''
        );
        hoverZoom.urlReplace(res,
            'img[src*=":thumb"]',
            ':thumb',
            ''
        );
        $('a[data-expanded-url], a[data-full-url], a[data-url]').each(function () {
            var link = $(this),
                url = this.getAttribute('data-expanded-url') || this.getAttribute('data-full-url') || this.getAttribute('data-url');
            if (url.match(/\/[^:]+\.(?:jpe?g|gif|png|svg|webp|bmp|ico|xbm)(?:[\?#].*)?$/i)) {
                link.data().hoverZoomSrc = [url];
                res.push(link);
            }
        });

        /*function getFromAPI(link, photoId) {
            var linkData = link.data(),
                storedUrl = localStorage['HZcache_' + photoId];
            if (storedUrl) {
                linkData.hoverZoomSrc = [storedUrl];
                link.addClass('hoverZoomLink');
            } else {
                link.mouseenter(function () {
                    linkData.hoverZoomMouseOver = true;
                    if (linkData.hoverZoomTwitterApiCalled) {
                        return;
                    }
                    linkData.hoverZoomTwitterApiCalled = true;
                    $.getJSON('https://api.twitter.com/1/statuses/show.json?id=' + photoId + '&include_entities=true&trim_user=true',
                        function (data) {
                            if (data && data.entities && data.entities.media && data.entities.media.length) {
                                var media = data.entities.media[0],
                                    url = (location.protocol == 'https:') ? media.media_url_https : media.media_url;

                                linkData.hoverZoomSrc = [url];
                                link.addClass('hoverZoomLink');

                                // Image is displayed if the cursor is still over the link
                                if (linkData.hoverZoomMouseOver)
                                    hoverZoom.displayPicFromElement(link);

                                // URLs are stored to lessen API calls
                                localStorage['HZcache_' + photoId] = url;
                            }
                        }
                    );
                }).mouseleave(function () {
                        linkData.hoverZoomMouseOver = false;
                    });
            }
        }

        $('a:contains("pic.twitter.com/")').each(function () {
            var link = $(this),
                photoId = link.parents('[data-item-id]').attr('data-item-id');
            if (photoId) {
                getFromAPI(link, photoId);
            }
        });

        $('a[data-expanded-url*="/photo/"], a[data-full-url*="/photo/"]').each(function () {
            var link = $(this),
                expandedUrl = link.attr('data-expanded-url') || link.attr('data-full-url'),
                photoId = expandedUrl.replace(/.*status\/(\d+).*$/, '$1');
            getFromAPI(link, photoId);
        });*/

        $('a:contains("pic.twitter.com/")').one('mouseover', function() {
            hoverZoom.prepareFromDocument($(this), this.href, function(doc) {
                var img = doc.querySelector('img[src*="twimg.com/media/"]');
                return img ? img.src : false;
            });
        });
        

        callback($(res));
    }
});

// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Tumblr',
    prepareImgLinks:function (callback) {
        var res = [];
        $('img[src*="media.tumblr.com/"]').each(function () {
            var img = $(this), link = img.parents('a:eq(0)'),
                link = link.length ? link : img,
                data = link.data();
            if (data.hoverZoomSrc) {
                return;
            }

            var url = img.attr('src'),
                width = img.width(),
                url = url.replace(/_[0-9a-z]*\.(.*)$/, '_maxwidth.$1'),
                urls = [];

            //if (width < 1280) { urls.push(url.replace('maxwidth', '1280')); }
            if (width < 500) {
                urls.push(url.replace('maxwidth', '500'));
            }
            if (width < 400) {
                urls.push(url.replace('maxwidth', '400'));
            }
            if (width < 250) {
                urls.push(url.replace('maxwidth', '250'));
            }
            if (width < 128) {
                urls.push(url.replace('maxwidth', '128'));
            }
            if (width < 100) {
                urls.push(url.replace('maxwidth', '100'));
            }
            if (urls.length) {
                link.data().hoverZoomSrc = urls;
                res.push(link);
            }
        });
        hoverZoom.urlReplace(res,
            'a[href*="tumblr.com/photo/"]',
            '',
            ''
        );
        callback($(res));
        $('a[href*="tumblr.com/post/"]').one('mouseenter', function () {
            var link = $(this), lData = link.data(), aHref = this.href.split('/');
            if (lData.hoverZoomSrc) {
                return;
            }

            $.getJSON('http://api.tumblr.com/v2/blog/' + aHref[2] + '/posts?id=' + aHref[4] + '&api_key=GSgWCc96GxL3x2OlEtMUE56b8gjbFHSV5wf8Zm8Enr1kNcjt3U', function (data) {
                if (data && data.response && data.response.posts && data.response.posts[0]) {
                    var post = data.response.posts[0];
                    if (post.photos && post.photos[0]) {
                        if (post.photos.length > 1) {
                            lData.hoverZoomGallerySrc = [];
                            lData.hoverZoomGalleryCaption = [];
                            post.photos.forEach(function (photo) {
                                lData.hoverZoomGallerySrc.push([photo.alt_sizes[0].url]);
                                lData.hoverZoomGalleryCaption.push(photo.caption);
                            });
                        } else {
                            lData.hoverZoomSrc = [post.photos[0].alt_sizes[0].url];
                        }
                        link.addClass('hoverZoomLink');
                        callback($([link]));
                        hoverZoom.displayPicFromElement(link);
                    }
                }
            });
        });
    }
});
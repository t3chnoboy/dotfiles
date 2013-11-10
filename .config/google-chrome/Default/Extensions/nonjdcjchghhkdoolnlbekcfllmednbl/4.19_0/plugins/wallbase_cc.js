// Copyright (c) 2013 Romain Vallet <romain.vallet@gmail.com>
// Licensed under the MIT license, read license.txt

var hoverZoomPlugins = hoverZoomPlugins || [];
hoverZoomPlugins.push({
    name:'Wallbase.cc',
    prepareImgLinks:function (callback) {
        $('a[href*="/wallpaper/"] > img').filter(function() {
            return this.parentNode.href.match(/wallpaper\/\d+$/);
        }).one('mousemove', function() {
            hoverZoom.prepareFromDocument($(this.parentNode), this.parentNode.href, function(doc) {
                
                // Wallbase url decode function
                function B(a){var b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var c,d,e,f,g,h,i,j,k=0,l=0,m="",n=[];if(!a){return a}a+="";do{f=b.indexOf(a.charAt(k++));g=b.indexOf(a.charAt(k++));h=b.indexOf(a.charAt(k++));i=b.indexOf(a.charAt(k++));j=f<<18|g<<12|h<<6|i;c=j>>16&255;d=j>>8&255;e=j&255;if(h==64){n[l++]=String.fromCharCode(c)}else if(i==64){n[l++]=String.fromCharCode(c,d)}else{n[l++]=String.fromCharCode(c,d,e)}}while(k<a.length);m=n.join("");return m}
                
                var script = doc.querySelector('#bigwall script'),
                    id = script ? script.innerHTML.match(/\+B\('([\w=]+)'/) : false;
                if (id) {
                    return B(id[1]);
                } else {
                    return false;
                }
            });
        });
    }
});
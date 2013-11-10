// declare package:templates.control.wall
templates=templates || {};
templates.control=templates.control || {};
templates.control.wall=templates.control.wall || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.wall;
function $A(_){var a=arguments,x;for(x=1;x<a.length;x++)_.push(a[x])}


// local function to each template class (short versions that refer to full package names)
var s3, $1, $2, $3, jsesc, x2;

try
{
	s3 = function (a) {return devhd.s3( "images/" + a )};         // img resolve
	x2 = function (a) {return devhd.x2( "images/" + a )};         // img resolve
    $1 = devhd.str.toSafeHTML;                                    // called by $( ... )
    $2 = devhd.str.toSafeAttr;                                    // called by $[ ... ]
	$3 = devhd.str.stripTags;                       			  // called by $< ... >
	jsesc = devhd.str.toJsEsc;                                    // jsesc ... needs to be killed
}
catch( ignore )
{
}


$P.layoutWallControl=function(key, home){var _=[];
$A(_,$[0],key,$[1],key,$[2],key,$[3],key,$[4]);
return _.join($E);
}
$P.bio=function(bio){var _=[];
$A(_,templates.page.base.h2Delimiter( "Bio" ));
$A(_,$[5],$2(bio.profile_image_url),$[6],$1(bio.name),$[7],$2(bio.screen_name),$[8],$1("@" + bio.screen_name),$[9],$1(bio.location),$[10],bio.description,$[11],$2(bio.url),$[8],$1(bio.url),$[12]);
return _.join($E);
}
$P.likers=function(likers){var _=[];
$A(_,templates.page.base.h2Delimiter( "Top Recommenders" ));
for( var i = 0 ; i < likers.length; i++ ){
    $A(_,$[13],likers[ i ].displayName + (  likers[ i ].occupation != null ? ", " + likers[ i ].occupation : "" ) + (  likers[ i ].location != null ? ", " + likers[ i ].location : "" ),$[14],likers[ i ].stream,$[15],likers[ i ].photoUrl,$[16]);
}
$A(_,$[17]);
return _.join($E);
}
$P.live=function(anEntry, stats){var _=[];
$A(_,templates.page.base.h2Delimiter( _L(235),_L(236,stats.clicks) ));
$A(_,$[18],anEntry.getId(),$[19]);
return _.join($E);
}
$P.facebook=function(anEntry){var _=[];
$A(_,templates.page.base.h2Delimiter( _L(237) ));
$A(_,$[20],anEntry.getAlternateLink(),$[21]);
return _.join($E);
}
$P.rss2comments=function(anEntry, rss2){var _=[];
 var items=rss2.channel.item || []
$A(_,templates.page.base.h2Delimiter( _L(238) ));
if(items.length == 0){
    $A(_,$[22],$L(239),$[23]);
}else{
    $A(_,$[24],$L(240,items.length),$[25]);
    for(var i=items.length - 1; i >= 0; i--){
        $A(_,$[26],$L(241,('a href="'+items[i].link+'" target="_comment"'), items[i].creator),$[27]);
        var comment = items[i].content || items[i].description
        $A(_,$[28],$3(comment),$[29],templates.page.base.dateAsDuration ( items[i].pubDate ),$[30]);
    }
    $A(_,$[31],$2(anEntry.getAlternateLink()),$[32],$L(242),$[12]);
}
return _.join($E);
}
$P.atom2comments=function(anEntry, feed){var _=[];
 var items=feed.entry || []
$A(_,$[33],templates.page.base.h2Delimiter( _L(238) ),$[34]);
if(items.length == 0){
    $A(_,$[22],$L(239),$[23]);
}else{
    $A(_,$[35],$L(243,items.length),$[36]);
    for(var i = items.length - 1; i >= 0; i--){
        $A(_,$[37],$L(241,'span class="commenterName"', items[i].author),$[38],$1(items[i].author),$[39],$3(items[i].content || items[i].description),$[29],templates.page.base.dateAsDuration( items[i].published ),$[30]);
    }
    $A(_,$[31],$2(anEntry.getAlternateLink()),$[32],$L(242),$[12]);
}
return _.join($E);
}
$P.commentsUnavaiable=function(anEntry){var _=[];
$A(_,templates.page.base.h2Delimiter( _L(238) ));
$A(_,$[40],$L(244),$[41],$2(anEntry.getAlternateLink()),$[42],$L(245),$[12]);
return _.join($E);
}
$P.commentsError=function(code, msg){var _=[];
$A(_,templates.page.base.h2Delimiter( _L(238) ));
$A(_,$[40],$L(244),$[43],code,$[44],msg,$[45]);
return _.join($E);
}
$P.commentsLoading=function(){var _=[];
return _.join($E);
}
$=[
" \n<div id=\"","_bioHolder\" class=\"commentsHolder\"></div> \n<div id=\"","_liveHolder\" class=\"commentsHolder\"></div> \n<div id=\"","_commentsHolder\" class=\"commentsHolder\"></div> \n<div id=\"","_fbHolder\" class=\"commentsHolder\"></div> \n","\n<img class=\"smallportrait\" src=\"","\" style=\"float:left; margin-right: 10px; width:48px; height:48px\" /> \n<div style=\"margin-left: 56px\"> \n<b>","</b> <a href=\"http://www.twitter.com/",
"\" target=\"_blank\" style=\"text-decoration:none\">","</a> <span class=\"metadata\">","</span><br/> \n","<br/> \n<a href=\"","</a> \n</div> \n"," <img title=\"","\" class=\"action\" data-app-action=\"askShowStore\" data-app-action-input=\"","\" src=\"http://www.google.com",
"\" width=\"35\" height=\"35\" style=\"background:#FFFFFF; padding:1px; border: 1px solid #DFDFDF; float:left; margin-right:5px; margin-bottom:5px\" /> \n"," <div style=\"clear:both\"></div> \n","\n<div id=\"","_tweets\" style=\"max-width: 550px\"></div> \n","\n<fb:comments href=\"","\" num_posts=\"3\" width=\"580\"></fb:comments> \n"," <div class=\"content\" style=\"padding-top: 12px\">","</div> \n",
" <div style=\"padding-bottom: 12px;\"> \n<span class=\"action\" onclick=\"document.getElementById('blogComments').style.display='block'; this.parentNode.style.display='none'; return false;\"> \n"," \n</span> \n</div> \n<div id=\"blogComments\" style=\"display:none\"> \n<ol class=\"content\"> \n"," <li><span class=\"commenterName\"> \n","</span> \n<div class=\"rss2comment\"> \n"," "," \n</div> \n<span class=\"commentDate\">","</span> \n</li> \n"," </ol> \n<a href=\"",
"#comments\" target=\"_comments\" style=\"padding-left: 12px\">","\n"," \n"," <div style=\"padding-bottom: 12px;\"> \n<span class=\"action\" onclick=\"document.getElementById('blogComments').style.display='block'; this.parentNode.style.display='none'; return false;\">","</span> \n</div> \n<div id=\"blogComments\" style=\"display:none\"> \n<ol class=\"content\"> \n"," <li>"," \n<li><span class=\"commenterName\">","</span> says: \n<div class=\"rss2comment\"> \n",
"\n<div class=\"content\" style=\"padding-left: 12px; padding-top: 12px\"> \n"," \n<a href=\"","#comments\" target=\"_comments\">"," \n<!-- Oops. Could not fetch comments. It apears that all feedly can say is: "," -- "," --> \n</div> \n"]
})();
// strings=46 characters=2002

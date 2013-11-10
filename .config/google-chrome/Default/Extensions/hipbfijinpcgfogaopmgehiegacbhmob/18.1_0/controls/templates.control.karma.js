// declare package:templates.control.karma
templates=templates || {};
templates.control=templates.control || {};
templates.control.karma=templates.control.karma || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.karma;
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


$P.tweets=function(tweets, twitterId){var _=[];
$A(_,$[0],$L(224),$[1]);
for( var i = 0; i < tweets.length; i++ ){
    $A(_,$P.tweet( tweets[ i ] ));
}
return _.join($E);
}
$P.tweet=function(tweet){var _=[];
$A(_,$[2],tweet.bitly,$[3]);
 var t = new Date( tweet.created_at );
$A(_,$[4],tweet.id,$[5],$2(tweet.profile_image_url),$[6],tweet.bitly,$[7],tweet.bitly,$[8],tweet.safeHTML,$[9]);
$A(_,templates.page.base.dateAsDuration( t ));
$A(_,$[10]);
return _.join($E);
}
$=[
" \n<h2 data-uri=\"karma\" style=\"cursor:pointer\">","</h2> \n"," \n<div id=\"","\" class=\"tweet\"> \n","\n<div class=\"tweet\" id=\"tweet_","\"> \n<div class=\"text\"> \n<img class=\"miniPortrait\" src=\"","\" /> \n<div class=\"message\"> \n<span class=\"kdata\" data-uri=\"karma\"> \n<span id=\"","_clicks\">...</span> \n<span id=\"",
"_rt\"></span> \n</span> \n<span class=\"entry-content\">","</span> \n<span class=\"created\"> \n","\n</span> \n</div> \n<div style=\"clear:both\"></div> \n</div> \n</div> \n</div> \n"]
})();
// strings=11 characters=434

// declare package:templates.control.share
templates=templates || {};
templates.control=templates.control || {};
templates.control.share=templates.control.share || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.share;
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


$P.form=function(screen_name, photoURL){var _=[];
$A(_,$[0],$2(photoURL),$[1],s3('icon-grnotes.png'),$[2],$L(229),$[3],$L(230,screen_name),$[4]);
$A(_,templates.forms.buttonField({label:_L(221),id: "shareCancelAction", secondary: true } ));
$A(_,templates.forms.buttonField({label:_L(222),  id: "shareSendAction",   secondary: false } ));
$A(_,$[5],s3('loading.gif'),$[6],$L(231),$[7]);
return _.join($E);
}
$P.snippet=function(anEntry, markers){var _=[];
 var hilited = false;
if( markers != null ){
    for( var i = 0; i < markers.length; i++ ){
         var aMarker = markers[ i ];
         if( aMarker.kind != "hilite" )
         continue;
        hilited = true;
        if( aMarker.nl != null && aMarker.nl.img != null ){
            $A(_,$[8],$2(aMarker.nl.img[ 0 ].src),$[9],aMarker.note != null && aMarker.note != "" ? devhd.str.toSafeHTML( aMarker.note ) : "",$[10]);
        }else{
            $A(_,$[11],$1(aMarker.text),$[12],aMarker.note != null && aMarker.note != "" ? devhd.str.toSafeHTML( aMarker.note ) : "",$[10]);
        }
    }
}
if( hilited == false ){
    $A(_,$[13],anEntry.getContentOrSummary(),$[10]);
}
$A(_,$[14],$L(232,'a href="'+devhd.str.toSafeAttr(anEntry.getAlternateLink())+'"', anEntry.getTitle(),
	                       (["a href=\"",_L(233),"\""]).join("")),$[7]);
return _.join($E);
}
$=[
" \n<div class=\"inlineFormContainer\" id=\"panelShare\"> \n<div style=\"clear:both\"> \n<img src=\"","\" style=\"float:left; margin-right:10px; width:46px; height:46px\" /> \n<div id=\"title_fieldset\" class=\"fieldset\"> \n<textarea id=\"shareNote\" autocomplete=\"off\" class=\"textareaValue\" style=\"width:480px\" rows=\"4\"></textarea> \n</div> \n</div> \n<div id=\"title_hint\" class=\"fieldHint\" style=\"font-weight: normal; padding-left: 3px; float:left; line-height:27px\"> \n<img width=\"16\" height=\"16\" align=\"absmiddle\" alt=\"google\" src=\"","\" title=\"","\"/> \n"," \n</div> \n<div class=\"actions\"> \n","\n</div> \n</div> \n<div id=\"panelSending\" class=\"panelSending\" style=\"display: none;\"> \n<img src=\"","\" align=\"absmiddle\"/> "," \n</div> \n",
" <blockquote style=\"border-left: 5px solid #CCCCCC; padding-left: 10px; margin-left: 0px; margin-top:17px; margin-bottom:3px\"><img src=\"","\" style=\"max-height:200px\" /></blockquote> \n"," \n"," <blockquote style=\"border-left: 5px solid #CCCCCC; padding-left: 10px; margin-left: 0px; margin-top:17px; margin-bottom:3px\">","</blockquote> \n"," "," \n<div style=\"margin-top: 17px\"> \n"]
})();
// strings=15 characters=1041

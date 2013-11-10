// declare package:templates.control.openSocial
templates=templates || {};
templates.control=templates.control || {};
templates.control.openSocial=templates.control.openSocial || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.openSocial;
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


$P.minimizing=function(){var _=[];
$A(_,$[0],s3('loading.gif'),$[1],$L(225),$[2]);
return _.join($E);
}
$P.form=function(message, screen_name, photoURL){var _=[];
$A(_,$[3],$2(photoURL),$[4],$1(message),$[5],s3('icon-ning.png'),$[6],$L(226),$[7],$L(227,'span id="title_hint" class="fieldHint" style="font-weight: normal; padding-left: 3px"',
			   screen_name),$[8]);
$A(_,templates.forms.buttonField ( { label: _L(221), id: "openSocialCancelAction", secondary: true } ));
$A(_,templates.forms.buttonField ( { label: _L(222),  id: "openSocialSendAction",   secondary: false } ));
$A(_,$[9],s3('loading.gif'),$[10],$L(228),$[2]);
return _.join($E);
}
$=[
" \n<div id=\"panelSending\" class=\"panelSending\"> \n<img src=\"","\" align=\"absmiddle\"/>"," \n</div> \n"," \n<div class=\"inlineFormContainer\" id=\"panelOpenSocial\"> \n<div id=\"msgSize\" style=\"float:right\" class=\"msgSize\"></div> \n<div style=\"clear:both\"> \n<img src=\"","\" style=\"float:left; margin-right:10px; width:46px; height:46px\" /> \n<div id=\"title_fieldset\" class=\"fieldset\"> \n<textarea id=\"openSocialNote\" autocomplete=\"off\" class=\"textareaValue\" style=\"width:480px\" rows=\"4\">","</textarea> \n</div> \n</div> \n<div id=\"title_hint\" class=\"fieldHint\" style=\"font-weight: normal; padding-left: 3px; float:left; line-height:27px\"> \n<img width=\"16\" height=\"16\" align=\"absmiddle\" alt=\"ning\" src=\"","\" title=\"","\"/> \n<span class=\"fieldHint\" style=\"font-weight: normal; padding-left: 3px\"> \n",
" \n</span> \n</div> \n<div class=\"actions\"> \n","\n</div> \n<div style=\"clear:both\"></div> \n</div> \n<div id=\"panelSending\" class=\"panelSending\" style=\"display: none;\"> \n<img src=\"","\" align=\"absmiddle\"/> "]
})();
// strings=11 characters=946

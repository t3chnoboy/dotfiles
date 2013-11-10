// declare package:templates.control.facebook
templates=templates || {};
templates.control=templates.control || {};
templates.control.facebook=templates.control.facebook || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.facebook;
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


$P.login=function(){var _=[];
$A(_,$[0]);
$A(_,templates.modules.facebookLogin());
$A(_,$[1]);
return _.join($E);
}
$P.form=function(name, photoURL, accounts){var _=[];
$A(_,$[2],$2(photoURL),$[3],s3('icon-facebook.png'),$[4],name,$[5]);
if( accounts.length > 1 ){
    $A(_,$[6]);
    for( var i = 0; i < accounts.length; i++ ){
        $A(_,$[7],i,$[8],i == 0 ? "selected" :"",$[9],accounts[ i ].name,$[10]);
        if( accounts[ i ].category != null ){
            $A(_,$[11],accounts[ i ].category,$[10]);
        }
        $A(_,$[12]);
    }
    $A(_,$[13]);
}
$A(_,templates.forms.buttonField( { label: _L(221), id: "facebookCancelAction", secondary: true } ));
$A(_,templates.forms.buttonField( { label: _L(222),  id: "facebookSendAction",   secondary: false } ));
$A(_,$[14],s3('loading.gif'),$[15],$L(223),$[16]);
return _.join($E);
}
$=[
" \n<div style=\"background-color: #EFF3F3; color: #909090; display: block; font-size: 12px; line-height: 24px;\"> \n","\n&nbsp;&nbsp; Please login to facebook first. \n"," \n<div class=\"inlineFormContainer\" id=\"panelFacebook\"> \n<div style=\"clear:both\"> \n<img src=\"","\" style=\"float:left; margin-right:10px; width:46px; height:46px\" /> \n<div id=\"title_fieldset\" class=\"fieldset\"> \n<textarea id=\"facebookMessage\" autocomplete=\"off\" class=\"textareaValue\" style=\"width:480px\" rows=\"3\"></textarea> \n</div> \n</div> \n<div id=\"title_hint\" class=\"fieldHint\" style=\"font-weight: normal; padding-left: 3px; float:left; line-height:27px\"> \n<img width=\"16\" height=\"16\" align=\"absmiddle\" alt=\"facebook\" src=\"","\" title=\"facebook\"/> "," \n</div> \n<div class=\"actions\"> \n"," <span style=\"padding-left: 20px\"> \nwhere \n<select name=\"facebookAccount\" id=\"facebookAccount\"> \n"," <option value=\"",
"\" ","> \n"," \n"," in "," </option> \n"," </select> \n</span> \n","\n</div> \n<div style=\"clear:both\"></div> \n</div> \n<div id=\"panelSending\" class=\"panelSending\" style=\"display: none;\"> \n<img src=\"","\" align=\"absmiddle\"/> ",
" \n</div> \n"]
})();
// strings=17 characters=1049

// declare package:templates.control.sourcesCustomizer
templates=templates || {};
templates.control=templates.control || {};
templates.control.sourcesCustomizer=templates.control.sourcesCustomizer || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.sourcesCustomizer;
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


$P.layout=function(){var _=[];
$A(_,$[0],s3('customizer-checkbox-unchecked.png'),$[1],$L(234),$[2]);
return _.join($E);
}
$=[
" \n<div id=\"sourcesFavoritesOnly\"> \n<span id=\"sourcesFavoritesOnlyToggle\" class=\"checkable\" style=\"padding-right:8px\"> \n<img id=\"sourcesFavoritesOnlyCheck\" \nsrc=\"","\" \nwidth=\"12\" height=\"12\" align=\"absmiddle\" style=\"padding-bottom: 2px\" \n/> \n"," \n</span> \n</div> \n"]
})();
// strings=3 characters=257

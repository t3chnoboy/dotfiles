// declare package:templates.control.adz
templates=templates || {};
templates.control=templates.control || {};
templates.control.adz=templates.control.adz || {};
(function(){
var _L=devhd.i18n.L,$L=devhd.i18n.$L,$=[],$E="",$P=templates.control.adz;
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


$P.layoutProducts=function(products, max, themes, tags, home){var _=[];
$A(_,$[0],( tags || [] ).join( ", "),$[1]);
for( var i = 0; i < products.length && i < max; i++ ){
    var product = products[ i ];
    $A(_,$[2],$2(product.alternateLink),$[3],product.visual,$[4],$1(devhd.utils.StringUtils.ellipcify( devhd.utils.StringUtils.cleanTitle( product.title ), 60 )),$[5]);
    if( product.price ){
        $A(_,$[6],product.price,$[7]);
    }
    if( product.rating ){
        $A(_,$[8],themes == null ? "0px": "-3px",$[9],product.rating,$[10]);
    }
    $A(_,$[11]);
}
$A(_,$[12]);
return _.join($E);
}
$=[
" \n<h2 title=\"","\">On Amazon</h2> \n<div id=\"products\"> \n"," <a class=\"sponsor\" href=\"","\" target=\"amazon\"> \n<div class=\"picture\"> \n<img src=\"","\" border=\"0\" style=\"max-height:68px; min-height:68px; height: 68px\"> \n</div> \n<div class=\"information\"> \n"," \n"," <div class=\"price\"> \n"," \n</div> \n",
" <div class=\"rating\" style=\"margin-left:","\"> \n<img src=\"","\"> \n</div> \n"," </div> \n<div style=\"clear:both\"></div> \n</a> \n"," <div style=\"clear:both\"></div> \n</div> \n"]
})();
// strings=13 characters=424

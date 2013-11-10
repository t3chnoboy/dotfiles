//================================================
/*

Turn Off the Lights
The entire page will be fading to dark, so you can watch the video as if you were in the cinema.
Copyright (C) 2013 Stefan vd
www.stefanvd.net

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


To view a copy of this license, visit http://creativecommons.org/licenses/GPL/2.0/

*/
//================================================


// control
var _0xa940=["\x40\x40\x65\x78\x74\x65\x6E\x73\x69\x6F\x6E\x5F\x69\x64","\x67\x65\x74\x4D\x65\x73\x73\x61\x67\x65","\x69\x31\x38\x6E","\x62\x66\x62\x6D\x6A\x6D\x69\x6F\x64\x62\x6E\x6E\x70\x6C\x6C\x62\x62\x62\x66\x62\x6C\x63\x70\x6C\x66\x6A\x6A\x65\x70\x6A\x64\x6E","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x62\x61\x64\x75\x73\x65\x72\x2E\x68\x74\x6D","\x63\x72\x65\x61\x74\x65","\x74\x61\x62\x73","\x61\x64\x64\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6F\x6E\x43\x6C\x69\x63\x6B\x65\x64","\x70\x61\x67\x65\x41\x63\x74\x69\x6F\x6E","\x63\x6F\x6D\x61\x6E\x64\x6F","\x74\x6F\x74\x6C\x72\x65\x71\x75\x65\x73\x74","\x69\x6E\x74\x65\x72\x76\x61\x6C","\x6C\x69\x67\x68\x74\x63\x6F\x6C\x6F\x72","\x61\x75\x74\x6F\x70\x6C\x61\x79","\x70\x6C\x61\x79\x6C\x69\x73\x74","\x66\x6C\x61\x73\x68","\x68\x65\x61\x64","\x66\x61\x64\x65\x69\x6E","\x66\x61\x64\x65\x6F\x75\x74","\x69\x6E\x66\x6F\x62\x61\x72","\x73\x68\x61\x72\x65\x62\x75\x74\x74\x6F\x6E","\x6C\x69\x6B\x65\x62\x75\x74\x74\x6F\x6E","\x72\x65\x61\x64\x65\x72\x61","\x72\x65\x61\x64\x65\x72\x6E","\x73\x68\x6F\x72\x74\x63\x75\x74\x6C\x69\x67\x68\x74","\x65\x79\x65\x61","\x65\x79\x65\x6E","\x73\x75\x67\x67\x65\x73\x74\x69\x6F\x6E\x73","\x76\x69\x64\x65\x6F\x68\x65\x61\x64\x6C\x69\x6E\x65","\x65\x61\x73\x74\x65\x72\x65\x67\x67\x73","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75\x73","\x72\x65\x61\x64\x65\x72\x6C\x61\x72\x67\x65\x73\x74\x79\x6C\x65","\x76\x69\x65\x77\x63\x6F\x75\x6E\x74","\x6C\x69\x67\x68\x74\x69\x6D\x61\x67\x65","\x6C\x69\x67\x68\x74\x69\x6D\x61\x67\x65\x61","\x6C\x69\x67\x68\x74\x69\x6D\x61\x67\x65\x6E","\x65\x79\x65\x61\x6C\x69\x73\x74","\x65\x78\x63\x6C\x75\x64\x65\x64\x44\x6F\x6D\x61\x69\x6E\x73","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x6F","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x61","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x63","\x6E\x69\x67\x68\x74\x74\x69\x6D\x65","\x62\x65\x67\x69\x6E\x74\x69\x6D\x65","\x65\x6E\x64\x74\x69\x6D\x65","\x61\x64\x64\x76\x69\x64\x65\x6F\x62\x75\x74\x74\x6F\x6E","\x6C\x69\x6B\x65\x62\x61\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x72\x61\x6E\x67\x65\x62\x6C\x75\x72\x72\x61\x64\x69\x75\x73","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x72\x61\x6E\x67\x65\x73\x70\x72\x65\x61\x64\x72\x61\x64\x69\x75\x73","\x6D\x6F\x75\x73\x65\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x74","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x66\x69\x78\x63\x6F\x6C\x6F\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x76\x61\x72\x63\x6F\x6C\x6F\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x34\x63\x6F\x6C\x6F\x72","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x31\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x32\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x33\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x61\x6D\x62\x69\x6C\x69\x67\x68\x74\x34\x63\x6F\x6C\x6F\x72\x68\x65\x78","\x70\x61\x73\x73\x77\x6F\x72\x64","\x65\x6E\x74\x65\x72\x70\x61\x73\x73\x77\x6F\x72\x64","\x6E\x6F\x66\x6C\x61\x73\x68","\x68\x61\x72\x64\x66\x6C\x61\x73\x68","\x65\x63\x6F\x73\x61\x76\x65\x72","\x65\x63\x6F\x73\x61\x76\x65\x72\x74\x69\x6D\x65","\x64\x79\x6E\x61\x6D\x69\x63","\x64\x79\x6E\x61\x6D\x69\x63\x31","\x64\x79\x6E\x61\x6D\x69\x63\x32","\x64\x79\x6E\x61\x6D\x69\x63\x33","\x64\x79\x6E\x61\x6D\x69\x63\x34","\x64\x79\x6E\x61\x6D\x69\x63\x35","\x68\x6F\x76\x65\x72\x6F\x70\x74\x69\x6F\x6E\x64\x79\x6E\x35","\x61\x75\x74\x6F\x70\x6C\x61\x79\x6F\x6E\x6C\x79","\x61\x75\x74\x6F\x70\x6C\x61\x79\x44\x6F\x6D\x61\x69\x6E\x73","\x62\x6C\x75\x72","\x6D\x61\x78\x71\x75\x61\x6C\x69\x74\x79","\x61\x75\x74\x6F\x77\x69\x64\x74\x68\x79\x6F\x75\x74\x75\x62\x65","\x63\x75\x73\x74\x6F\x6D\x71\x75\x61\x6C\x69\x74\x79\x79\x6F\x75\x74\x75\x62\x65","\x63\x69\x6E\x65\x6D\x61\x6F\x6E\x74\x6F\x70","\x61\x6C\x6C\x6C\x69\x67\x68\x74\x73\x6F\x66\x66","\x73\x70\x6F\x74\x6C\x69\x67\x68\x74\x72\x61\x64\x69\x75\x73","\x61\x74\x6D\x6F\x73\x70\x68\x65\x72\x65\x6F\x6E\x6C\x79","\x61\x74\x6D\x6F\x73\x70\x68\x65\x72\x65\x44\x6F\x6D\x61\x69\x6E\x73","\x6E\x61\x6D\x65","\x61\x75\x74\x6F\x6D\x61\x74\x69\x63","\x69\x64","\x74\x61\x62","\x6A\x73\x2F\x6C\x69\x67\x68\x74\x2E\x6A\x73","\x65\x78\x65\x63\x75\x74\x65\x53\x63\x72\x69\x70\x74","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75\x6F\x6E","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75\x6F\x66\x66","\x72\x65\x6D\x6F\x76\x65\x41\x6C\x6C","\x63\x6F\x6E\x74\x65\x78\x74\x4D\x65\x6E\x75\x73","\x72\x65\x61\x64\x65\x72\x73\x61\x76\x65\x6D\x65","\x76\x61\x6C\x75\x65","\x63\x75\x72\x72\x65\x6E\x74\x74\x61\x62\x66\x6F\x72\x62\x6C\x75\x72","\x6A\x70\x65\x67","\x63\x61\x70\x74\x75\x72\x65\x56\x69\x73\x69\x62\x6C\x65\x54\x61\x62","\x65\x6D\x65\x72\x67\x65\x6E\x63\x79\x61\x6C\x66","\x6C\x65\x6E\x67\x74\x68","\x71\x75\x65\x72\x79","\x65\x79\x65\x73\x61\x76\x65\x6D\x65\x4F\x46\x46","\x74\x72\x75\x65","\x66\x61\x6C\x73\x65","\x6A\x73\x2F\x72\x65\x6D\x6F\x76\x65\x6C\x69\x67\x68\x74\x2E\x6A\x73","\x65\x79\x65\x73\x61\x76\x65\x6D\x65\x4F\x4E","\x6A\x73\x2F\x72\x65\x6C\x6F\x61\x64\x6C\x69\x67\x68\x74\x2E\x6A\x73","\x6F\x6E\x4D\x65\x73\x73\x61\x67\x65","\x65\x78\x74\x65\x6E\x73\x69\x6F\x6E","\x66\x69\x72\x73\x74\x52\x75\x6E","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x63\x68\x72\x6F\x6D\x65\x2E\x68\x74\x6D","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x63\x68\x72\x6F\x6D\x65\x67\x75\x69\x64\x65\x2E\x68\x74\x6D","\x76\x65\x72\x73\x69\x6F\x6E","\x32\x2E\x31","\x32\x2E\x30\x2E\x30\x2E\x38\x31","\x68\x74\x74\x70\x3A\x2F\x2F\x77\x77\x77\x2E\x73\x74\x65\x66\x61\x6E\x76\x64\x2E\x6E\x65\x74\x2F\x70\x72\x6F\x6A\x65\x63\x74\x2F\x74\x6F\x74\x6C\x63\x68\x72\x6F\x6D\x65\x75\x70\x67\x72\x61\x64\x65\x2E\x68\x74\x6D"];var a=chrome[_0xa940[2]][_0xa940[1]](_0xa940[0]);var b=_0xa940[3];if(a!=b){chrome[_0xa940[6]][_0xa940[5]]({url:_0xa940[4],selected:true});chrome[_0xa940[9]][_0xa940[8]][_0xa940[7]](function (_0x8bddx3){chrome[_0xa940[6]][_0xa940[5]]({url:_0xa940[4],selected:true});} );} else {chrome[_0xa940[108]][_0xa940[107]][_0xa940[7]](function request(request,_0x8bddx5,_0x8bddx6){if(request[_0xa940[10]]==_0xa940[11]){_0x8bddx6({interval:localStorage[_0xa940[12]],lightcolor:localStorage[_0xa940[13]],autoplay:localStorage[_0xa940[14]],playlist:localStorage[_0xa940[15]],flash:localStorage[_0xa940[16]],head:localStorage[_0xa940[17]],fadein:localStorage[_0xa940[18]],fadeout:localStorage[_0xa940[19]],infobar:localStorage[_0xa940[20]],sharebutton:localStorage[_0xa940[21]],likebutton:localStorage[_0xa940[22]],readera:localStorage[_0xa940[23]],readern:localStorage[_0xa940[24]],shortcutlight:localStorage[_0xa940[25]],eyea:localStorage[_0xa940[26]],eyen:localStorage[_0xa940[27]],suggestions:localStorage[_0xa940[28]],videoheadline:localStorage[_0xa940[29]],eastereggs:localStorage[_0xa940[30]],contextmenus:localStorage[_0xa940[31]],readerlargestyle:localStorage[_0xa940[32]],viewcount:localStorage[_0xa940[33]],lightimage:localStorage[_0xa940[34]],lightimagea:localStorage[_0xa940[35]],lightimagen:localStorage[_0xa940[36]],eyealist:localStorage[_0xa940[37]],excludedDomains:localStorage[_0xa940[38]],mousespotlighto:localStorage[_0xa940[39]],mousespotlighta:localStorage[_0xa940[40]],mousespotlightc:localStorage[_0xa940[41]],nighttime:localStorage[_0xa940[42]],begintime:localStorage[_0xa940[43]],endtime:localStorage[_0xa940[44]],addvideobutton:localStorage[_0xa940[45]],likebar:localStorage[_0xa940[46]],ambilight:localStorage[_0xa940[47]],ambilightrangeblurradius:localStorage[_0xa940[48]],ambilightrangespreadradius:localStorage[_0xa940[49]],mousespotlightt:localStorage[_0xa940[50]],ambilightfixcolor:localStorage[_0xa940[51]],ambilightvarcolor:localStorage[_0xa940[52]],ambilightcolorhex:localStorage[_0xa940[53]],ambilight4color:localStorage[_0xa940[54]],ambilight1colorhex:localStorage[_0xa940[55]],ambilight2colorhex:localStorage[_0xa940[56]],ambilight3colorhex:localStorage[_0xa940[57]],ambilight4colorhex:localStorage[_0xa940[58]],password:localStorage[_0xa940[59]],enterpassword:localStorage[_0xa940[60]],noflash:localStorage[_0xa940[61]],hardflash:localStorage[_0xa940[62]],ecosaver:localStorage[_0xa940[63]],ecosavertime:localStorage[_0xa940[64]],dynamic:localStorage[_0xa940[65]],dynamic1:localStorage[_0xa940[66]],dynamic2:localStorage[_0xa940[67]],dynamic3:localStorage[_0xa940[68]],dynamic4:localStorage[_0xa940[69]],dynamic5:localStorage[_0xa940[70]],hoveroptiondyn5:localStorage[_0xa940[71]],autoplayonly:localStorage[_0xa940[72]],autoplayDomains:localStorage[_0xa940[73]],blur:localStorage[_0xa940[74]],maxquality:localStorage[_0xa940[75]],autowidthyoutube:localStorage[_0xa940[76]],customqualityyoutube:localStorage[_0xa940[77]],cinemaontop:localStorage[_0xa940[78]],alllightsoff:localStorage[_0xa940[79]],spotlightradius:localStorage[_0xa940[80]],atmosphereonly:localStorage[_0xa940[81]],atmosphereDomains:localStorage[_0xa940[82]]});} else {if(request[_0xa940[83]]==_0xa940[84]){chrome[_0xa940[6]][_0xa940[88]](_0x8bddx5[_0xa940[86]][_0xa940[85]],{file:_0xa940[87]});} else {if(request[_0xa940[83]]==_0xa940[89]){checkcontextmenus();} else {if(request[_0xa940[83]]==_0xa940[90]){chrome[_0xa940[92]][_0xa940[91]]();} else {if(request[_0xa940[83]]==_0xa940[93]){localStorage[_0xa940[12]]=request[_0xa940[94]];} else {if(request[_0xa940[83]]==_0xa940[32]){localStorage[_0xa940[32]]=request[_0xa940[94]];} else {if(request[_0xa940[83]]==_0xa940[95]){chrome[_0xa940[6]][_0xa940[97]](null,{format:_0xa940[96],quality:50},function (_0x8bddx7){_0x8bddx6({screenshotUrl:_0x8bddx7});} );} else {if(request[_0xa940[83]]==_0xa940[98]){chrome[_0xa940[6]][_0xa940[100]]({},function (_0x8bddx8){for(var _0x8bddx9=0;_0x8bddx9<_0x8bddx8[_0xa940[99]];_0x8bddx9++){chrome[_0xa940[6]][_0xa940[88]](_0x8bddx8[_0x8bddx9][_0xa940[85]],{file:_0xa940[87]});} ;} );} else {if(request[_0xa940[83]]==_0xa940[101]){if(request[_0xa940[94]]==_0xa940[102]){localStorage[_0xa940[26]]=_0xa940[102];localStorage[_0xa940[27]]=_0xa940[103];} else {localStorage[_0xa940[26]]=_0xa940[103];localStorage[_0xa940[27]]=_0xa940[102];} ;chrome[_0xa940[6]][_0xa940[100]]({},function (_0x8bddx8){for(var _0x8bddx9=0;_0x8bddx9<_0x8bddx8[_0xa940[99]];_0x8bddx9++){chrome[_0xa940[6]][_0xa940[88]](_0x8bddx8[_0x8bddx9][_0xa940[85]],{file:_0xa940[104]});} ;} );} else {if(request[_0xa940[83]]==_0xa940[105]){if(request[_0xa940[94]]==_0xa940[102]){localStorage[_0xa940[26]]=_0xa940[102];localStorage[_0xa940[27]]=_0xa940[103];} else {localStorage[_0xa940[26]]=_0xa940[103];localStorage[_0xa940[27]]=_0xa940[102];} ;chrome[_0xa940[6]][_0xa940[100]]({},function (_0x8bddx8){for(var _0x8bddx9=0;_0x8bddx9<_0x8bddx8[_0xa940[99]];_0x8bddx9++){chrome[_0xa940[6]][_0xa940[88]](_0x8bddx8[_0x8bddx9][_0xa940[85]],{file:_0xa940[106]});} ;} );} ;} ;} ;} ;} ;} ;} ;} ;} ;} ;return true;} );chrome[_0xa940[9]][_0xa940[8]][_0xa940[7]](function (_0x8bddx8){if((localStorage[_0xa940[79]]!=_0xa940[102])&&(localStorage[_0xa940[79]]!=true)){chrome[_0xa940[6]][_0xa940[88]](_0x8bddx8[_0xa940[85]],{file:_0xa940[87]});} else {chrome[_0xa940[6]][_0xa940[100]]({},function (_0x8bddx8){for(var _0x8bddx9=0;_0x8bddx9<_0x8bddx8[_0xa940[99]];_0x8bddx9++){chrome[_0xa940[6]][_0xa940[88]](_0x8bddx8[_0x8bddx9][_0xa940[85]],{file:_0xa940[87]});} ;} );} ;} );if((localStorage[_0xa940[109]]!=_0xa940[103])&&(localStorage[_0xa940[109]]!=false)){chrome[_0xa940[6]][_0xa940[5]]({url:_0xa940[110],selected:true});chrome[_0xa940[6]][_0xa940[5]]({url:_0xa940[111],selected:false});localStorage[_0xa940[109]]=false;localStorage[_0xa940[112]]=_0xa940[113];} ;if((localStorage[_0xa940[112]]==_0xa940[114])){chrome[_0xa940[6]][_0xa940[5]]({url:_0xa940[115],selected:true});localStorage[_0xa940[112]]=_0xa940[113];} ;} ;

function init() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if ((tab.url.match(/^http/i)) && (localStorage["pageaction"] != "true") && (localStorage["pageaction"] != true)) {
			chrome.pageAction.show(tabId);
		}
	});
}

checkcontextmenus();

function checkcontextmenus() {
// Clean contextmenus
chrome.contextMenus.removeAll();

// contextMenus
function onClickHandler(info, tab) {
if (info.menuItemId == "totlvideo" || info.menuItemId == "totlpage") {chrome.tabs.executeScript(tab.id, {file: "js/light.js"});}
}

// video
var contexts = ["video"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var videotitle = chrome.i18n.getMessage("videotitle");
  chrome.contextMenus.create({"title": videotitle, "id": "totlvideo", "contexts":[context]});
}

// page
var contexts = ["page"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var pagetitle = chrome.i18n.getMessage("pagetitle");
  chrome.contextMenus.create({"title": pagetitle, "id": "totlpage", "contexts":[context]});
}
chrome.contextMenus.onClicked.addListener(onClickHandler);
}

// Read current value settings
//window.addEventListener('load', function() {
init();
//});

try{ chrome.runtime.setUninstallUrl("http://www.stefanvd.net/browserextension/turnoffthelights/uninstalled.html"); }
catch(e){}
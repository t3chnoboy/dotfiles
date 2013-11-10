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

function $(id) { return document.getElementById(id); }
var default_opacity = 80;
var default_arangeblur = 70;
var default_arangespread = 5;

// Option to save current value to window.localStorage
function save_options(){
	window.localStorage['interval'] = $('interval').value;	
	window.localStorage['lightcolor'] = $('lightcolor').value;
	if($('pageaction').checked)window.localStorage['pageaction'] = 'true';
	else window.localStorage['pageaction'] = 'false';
	if($('autoplay').checked)window.localStorage['autoplay'] = 'true';
	else window.localStorage['autoplay'] = 'false';
	if($('playlist').checked)window.localStorage['playlist'] = 'true';
	else window.localStorage['playlist'] = 'false';
	if($('flash').checked)window.localStorage['flash'] = 'true';
	else window.localStorage['flash'] = 'false';
	if($('head').checked)window.localStorage['head'] = 'true';
	else window.localStorage['head'] = 'false';
	if($('fadein').checked)window.localStorage['fadein'] = 'true';
	else window.localStorage['fadein'] = 'false';
	if($('fadeout').checked)window.localStorage['fadeout'] = 'true';
	else window.localStorage['fadeout'] = 'false';
	if($('infobar').checked)window.localStorage['infobar'] = 'true';
	else window.localStorage['infobar'] = 'false';
	if($('sharebutton').checked)window.localStorage['sharebutton'] = 'true';
	else window.localStorage['sharebutton'] = 'false';
	if($('likebutton').checked)window.localStorage['likebutton'] = 'true';
	else window.localStorage['likebutton'] = 'false';
	if($('readera').checked)window.localStorage['readera'] = 'true';
	else window.localStorage['readera'] = 'false';
	if($('readern').checked)window.localStorage['readern'] = 'true';
	else window.localStorage['readern'] = 'false';
	if($('shortcutlight').checked)window.localStorage['shortcutlight'] = 'true';
	else window.localStorage['shortcutlight'] = 'false';
	if($('eyea').checked)window.localStorage['eyea'] = 'true';
	else window.localStorage['eyea'] = 'false';
	if($('eyen').checked)window.localStorage['eyen'] = 'true';
	else window.localStorage['eyen'] = 'false';
	if($('suggestions').checked)window.localStorage['suggestions'] = 'true';
	else window.localStorage['suggestions'] = 'false';
	if($('videoheadline').checked)window.localStorage['videoheadline'] = 'true';
	else window.localStorage['videoheadline'] = 'false';
	if($('eastereggs').checked)window.localStorage['eastereggs'] = 'true';
	else window.localStorage['eastereggs'] = 'false';
	if($('contextmenus').checked)window.localStorage['contextmenus'] = 'true';
	else window.localStorage['contextmenus'] = 'false';
	if($('viewcount').checked)window.localStorage['viewcount'] = 'true';
	else window.localStorage['viewcount'] = 'false';
	window.localStorage['lightimage'] = $('lightimage').value;	
	if($('lightimagea').checked)window.localStorage['lightimagea'] = 'true';
	else window.localStorage['lightimagea'] = 'false';
	if($('lightimagen').checked)window.localStorage['lightimagen'] = 'true';
	else window.localStorage['lightimagen'] = 'false';
	if($('eyealist').checked)window.localStorage['eyealist'] = 'true';
	else window.localStorage['eyealist'] = 'false';
	if($('mousespotlighto').checked)window.localStorage['mousespotlighto'] = 'true';
	else window.localStorage['mousespotlighto'] = 'false';
	if($('mousespotlighta').checked)window.localStorage['mousespotlighta'] = 'true';
	else window.localStorage['mousespotlighta'] = 'false';
	if($('mousespotlightc').checked)window.localStorage['mousespotlightc'] = 'true';
	else window.localStorage['mousespotlightc'] = 'false';
	if($('nighttime').checked)window.localStorage['nighttime'] = 'true';
	else window.localStorage['nighttime'] = 'false';
	window.localStorage['begintime'] = $('begintime').value;
	window.localStorage['endtime'] = $('endtime').value;
	if($('addvideobutton').checked)window.localStorage['addvideobutton'] = 'true';
	else window.localStorage['addvideobutton'] = 'false';
	if($('likebar').checked)window.localStorage['likebar'] = 'true';
	else window.localStorage['likebar'] = 'false';
	if($('ambilight').checked)window.localStorage['ambilight'] = 'true';
	else window.localStorage['ambilight'] = 'false';
	window.localStorage['ambilightrangeblurradius'] = $('ambilightrangeblurradius').value;	
	window.localStorage['ambilightrangespreadradius'] = $('ambilightrangespreadradius').value;
	if($('mousespotlightt').checked)window.localStorage['mousespotlightt'] = 'true';
	else window.localStorage['mousespotlightt'] = 'false';
	if($('ambilightfixcolor').checked)window.localStorage['ambilightfixcolor'] = 'true';
	else window.localStorage['ambilightfixcolor'] = 'false';
	if($('ambilightvarcolor').checked)window.localStorage['ambilightvarcolor'] = 'true';
	else window.localStorage['ambilightvarcolor'] = 'false';
	window.localStorage['ambilightcolorhex'] = $('ambilightcolorhex').value;
	if($('ambilight4color').checked)window.localStorage['ambilight4color'] = 'true';
	else window.localStorage['ambilight4color'] = 'false';
	window.localStorage['ambilight1colorhex'] = $('ambilight1colorhex').value;
	window.localStorage['ambilight2colorhex'] = $('ambilight2colorhex').value;
	window.localStorage['ambilight3colorhex'] = $('ambilight3colorhex').value;
	window.localStorage['ambilight4colorhex'] = $('ambilight4colorhex').value;
	if($('password').checked)window.localStorage['password'] = 'true';
	else window.localStorage['password'] = 'false';
	window.localStorage['enterpassword'] = $('enterpassword').value;
	if($('noflash').checked)window.localStorage['noflash'] = 'true';
	else window.localStorage['noflash'] = 'false';
	if($('hardflash').checked)window.localStorage['hardflash'] = 'true';
	else window.localStorage['hardflash'] = 'false';
	if($('ecosaver').checked)window.localStorage['ecosaver'] = 'true';
	else window.localStorage['ecosaver'] = 'false';
	window.localStorage['ecosavertime'] = $('ecosavertime').value;
	if($('dynamic').checked)window.localStorage['dynamic'] = 'true';
	else window.localStorage['dynamic'] = 'false';
	if($('dynamic1').checked)window.localStorage['dynamic1'] = 'true';
	else window.localStorage['dynamic1'] = 'false';
	if($('dynamic2').checked)window.localStorage['dynamic2'] = 'true';
	else window.localStorage['dynamic2'] = 'false';
	if($('dynamic3').checked)window.localStorage['dynamic3'] = 'true';
	else window.localStorage['dynamic3'] = 'false';
	if($('dynamic4').checked)window.localStorage['dynamic4'] = 'true';
	else window.localStorage['dynamic4'] = 'false';
	if($('dynamic5').checked)window.localStorage['dynamic5'] = 'true';
	else window.localStorage['dynamic5'] = 'false';
	if($('hoveroptiondyn5').checked)window.localStorage['hoveroptiondyn5'] = 'true';
	else window.localStorage['hoveroptiondyn5'] = 'false';
	if($('autoplayonly').checked)window.localStorage['autoplayonly'] = 'true';
	else window.localStorage['autoplayonly'] = 'false';	
	if($('blur').checked)window.localStorage['blur'] = 'true';
	else window.localStorage['blur'] = 'false';
	var ytselq = document.getElementById("youtubequality");
	window.localStorage['maxquality'] = ytselq.options[ytselq.selectedIndex].value;
	if($('autowidthyoutube').checked)window.localStorage['autowidthyoutube'] = 'true';
	else window.localStorage['autowidthyoutube'] = 'false';
	if($('customqualityyoutube').checked)window.localStorage['customqualityyoutube'] = 'true';
	else window.localStorage['customqualityyoutube'] = 'false';
	if($('cinemaontop').checked)window.localStorage['cinemaontop'] = 'true';
	else window.localStorage['cinemaontop'] = 'false';
	if($('alllightsoff').checked)window.localStorage['alllightsoff'] = 'true';
	else window.localStorage['alllightsoff'] = 'false';
	window.localStorage['spotlightradius'] = $('spotlightradius').value;
	if($('atmosphereonly').checked)window.localStorage['atmosphereonly'] = 'true';
	else window.localStorage['atmosphereonly'] = 'false';
	if($('optionskipremember').checked){window.localStorage['optionskipremember'] = 'true';}
	else{window.localStorage['optionskipremember'] = 'false';}
	
// Excluded domains
var excludedDomainsBox = $("excludedDomainsBox");
var excludedDomains = {};
for (var i = 0; i < excludedDomainsBox.length; i++)
	excludedDomains[excludedDomainsBox.options[i].value] = true;
    localStorage["excludedDomains"] = JSON.stringify(excludedDomains);

// autoplay Excluded domains
var autoplayDomainsBox = $("autoplayDomainsBox");
var autoplayDomains = {};
for (var i = 0; i < autoplayDomainsBox.length; i++)
	autoplayDomains[autoplayDomainsBox.options[i].value] = true;
    localStorage["autoplayDomains"] = JSON.stringify(autoplayDomains);
	
// atmosphere Excluded domains
var atmosphereDomainsBox = $("atmosphereDomainsBox");
var atmosphereDomains = {};
for (var i = 0; i < atmosphereDomainsBox.length; i++)
	atmosphereDomains[atmosphereDomainsBox.options[i].value] = true;
    localStorage["atmosphereDomains"] = JSON.stringify(atmosphereDomains);
}

// Option to read current value from window.localStorage
if(!window.localStorage['fadein']) // find no localstore fadein
	window.localStorage['fadein'] = 'true'; // then default true

if(!window.localStorage['fadeout']) // find no localstore fadein
	window.localStorage['fadeout'] = 'true'; // then default true

if(!window.localStorage['readera']&&!window.localStorage['readern']) // find no localstore reader
{	window.localStorage['readern'] = 'true'; // then default true
	window.localStorage['readera'] = 'false'; // then default false
}

if(!window.localStorage['lightimagea']&&!window.localStorage['lightimagen']) // find no localstore reader
{	window.localStorage['lightimagen'] = 'true'; // then default true
	window.localStorage['lightimagea'] = 'false'; // then default false
}

if(!window.localStorage['mousespotlighta']&&!window.localStorage['mousespotlightc']&&!window.localStorage['mousespotlighto']&&!window.localStorage['mousespotlightt']) // find no localstore reader
{	window.localStorage['mousespotlighto'] = 'true'; // then default true, off
	window.localStorage['mousespotlightc'] = 'false'; // then default false, custom
	window.localStorage['mousespotlighta'] = 'false'; // then default false, auto
	window.localStorage['mousespotlightt'] = 'false'; // then default false, auto
}

if(!window.localStorage['eyea']&&!window.localStorage['eyen']&&!window.localStorage['eyealist']) // find no localstore reader
{	window.localStorage['eyen'] = 'true'; // then default true
	window.localStorage['eyea'] = 'false'; // then default false
	window.localStorage['eyealist'] = 'false'; // then default false
}

if(window.localStorage['interval'])
	default_opacity = window.localStorage['interval'];

if(window.localStorage['ambilightrangeblurradius'])
	default_arangeblur = window.localStorage['ambilightrangeblurradius'];
	
if(window.localStorage['ambilightrangespreadradius'])
	default_arangespread = window.localStorage['ambilightrangespreadradius'];	

if(!window.localStorage['ambilightvarcolor']&&!window.localStorage['ambilightfixcolor']&&!window.localStorage['ambilight4color']) // find no localstore reader
{	window.localStorage['ambilightfixcolor'] = 'true'; // then default true
	window.localStorage['ambilightvarcolor'] = 'false'; // then default false
	window.localStorage['ambilight4color'] = 'false'; // then default false
}

if(!window.localStorage['flash']&&!window.localStorage['noflash']&&!window.localStorage['hardflash']) // find no localstore reader
{	window.localStorage['noflash'] = 'true'; // then default true
	window.localStorage['flash'] = 'false'; // then default false
	window.localStorage['hardflash'] = 'false'; // then default false
}

if(!window.localStorage['dynamic1']&&!window.localStorage['dynamic2']&&!window.localStorage['dynamic3']&&!window.localStorage['dynamic4']&&!window.localStorage['dynamic5']) // find no localstore reader
{	window.localStorage['dynamic1'] = 'true'; // then default true
	window.localStorage['dynamic2'] = 'false'; // then default false
	window.localStorage['dynamic3'] = 'false'; // then default false
	window.localStorage['dynamic4'] = 'false'; // then default false
	window.localStorage['dynamic5'] = 'false'; // then default false
}

if(!window.localStorage['hoveroptiondyn5']) // find no localstore reader
{	window.localStorage['hoveroptiondyn5'] = 'true'; // then default true
}
	
if(!window.localStorage['maxquality']) // find no localstore reader
{	window.localStorage['maxquality'] = 'hd1080'; // then default hd1080	
}

function read_options(){
	if(window.localStorage['interval'])$('interval').value = window.localStorage['interval'];
	else $('interval').value = 80;
	if(window.localStorage['lightcolor']){$('lightcolor').value = window.localStorage['lightcolor'];}
	else {$('lightcolor').value = '#000000';}
	if(window.localStorage['lightimage']){$('lightimage').value = window.localStorage['lightimage'];}
	else {$('lightimage').value = "http://turnoffthelights.googlecode.com/files/theater.jpg";}
	if(window.localStorage['lightimagea'] == 'true'){$('lightimagea').checked = true;$('example1').style.background = 'url(' + $('lightimage').value + ')';$('example1').style.backgroundSize = "100% 100%";$('example2').style.background = 'url(' + $('lightimage').value + ')';$('example2').style.backgroundSize = "100% 100%";$('mousespotlighta').disabled = true;$('mousespotlightc').disabled = true;}
	if(window.localStorage['lightimagen'] == 'true'){$('lightimagen').checked = true;$('example1').style.background = $('lightcolor').value;$('example2').style.background = $('lightcolor').value;$('mousespotlighta').disabled = false;$('mousespotlightc').disabled = false;}
	if(window.localStorage['pageaction'] == 'true')$('pageaction').checked = true;
	if(window.localStorage['autoplay'] == 'true'){$('autoplay').checked = true;$('eyen').checked = true;$('excludedDomainsBox').disabled = true;$('websiteurl').disabled = true;}
	if(window.localStorage['playlist'] == 'true')$('playlist').checked = true;
	if(window.localStorage['flash'] == 'true')$('flash').checked = true;
	if(window.localStorage['head'] == 'true')$('head').checked = true;
	if(window.localStorage['fadein'] == 'true')$('fadein').checked = true;
	if(window.localStorage['fadeout'] == 'true')$('fadeout').checked = true;
	if(window.localStorage['infobar'] == 'true')$('infobar').checked = true;
	if(window.localStorage['sharebutton'] == 'true')$('sharebutton').checked = true;
	if(window.localStorage['likebutton'] == 'true')$('likebutton').checked = true;
	if(window.localStorage['readera'] == 'true')$('readera').checked = true;
	if(window.localStorage['readern'] == 'true')$('readern').checked = true;
	if(window.localStorage['shortcutlight'] == 'true')$('shortcutlight').checked = true;
	if(window.localStorage['eyea'] == 'true'){$('eyea').checked = true;$('excludedDomainsBox').disabled = true;$('websiteurl').disabled = true;$('autoplay').checked = false;$('autoplay').disabled = true;$('addbutton').disabled = true;$('removebutton').disabled = true;$('nighttime').disabled = false;$('begintime').disabled = false;$('endtime').disabled = false;$('confirmtime').disabled = false;$('helpautoplay').style.display = "";$('helpeyeprotection').style.display = "";$('ecosaver').disabled = false;$('ecosavertime').disabled = false;$('confirmtimesaver').disabled = false;}
	if(window.localStorage['eyen'] == 'true'){$('eyen').checked = true;$('excludedDomainsBox').disabled = true;$('websiteurl').disabled = true;$('autoplay').disabled = false;$('addbutton').disabled = true;$('removebutton').disabled = true;$('nighttime').disabled = true;$('begintime').disabled = true;$('endtime').disabled = true;$('confirmtime').disabled = true;$('helpautoplay').style.display = "";$('helpeyeprotection').style.display = "";$('ecosaver').disabled = true;$('ecosavertime').disabled = true;$('confirmtimesaver').disabled = true;}
	if(window.localStorage['suggestions'] == 'true')$('suggestions').checked = true;
	if(window.localStorage['videoheadline'] == 'true')$('videoheadline').checked = true;
	if(window.localStorage['eastereggs'] == 'true')$('eastereggs').checked = true;
	if(window.localStorage['contextmenus'] == 'true')$('contextmenus').checked = true;
	if(window.localStorage['viewcount'] == 'true')$('viewcount').checked = true;
	if(window.localStorage['eyealist'] == 'true'){$('eyealist').checked = true;$('excludedDomainsBox').disabled = false;$('websiteurl').disabled = false;$('autoplay').disabled = true;$('addbutton').disabled = false;$('removebutton').disabled = false;$('nighttime').disabled = false;$('begintime').disabled = false;$('endtime').disabled = false;$('confirmtime').disabled = false;$('helpautoplay').style.display = "";$('helpeyeprotection').style.display = "";$('ecosaver').disabled = false;$('ecosavertime').disabled = false;$('confirmtimesaver').disabled = false;}
	if(window.localStorage['mousespotlighto'] == 'true')$('mousespotlighto').checked = true;
	if(window.localStorage['mousespotlightc'] == 'true')$('mousespotlightc').checked = true;
	if(window.localStorage['mousespotlighta'] == 'true')$('mousespotlighta').checked = true;
	if(window.localStorage['nighttime'] == 'true')$('nighttime').checked = true;
	if(window.localStorage['begintime']){$('begintime').value = window.localStorage['begintime'];}
	else {$('begintime').value = "21:00";}
	if(window.localStorage['endtime']){$('endtime').value = window.localStorage['endtime'];}
	else {$('endtime').value = "23:45";}
	if(window.localStorage['addvideobutton'] == 'true')$('addvideobutton').checked = true;
	if(window.localStorage['likebar'] == 'true')$('likebar').checked = true;
	if(window.localStorage['ambilight'] == 'true'){$('ambilight').checked = true;}
	else {$('arangespread').disabled = true;$('ambilightrangespreadradius').disabled = true;$('arangeblur').disabled = true;$('ambilightrangeblurradius').disabled = true;$('ambilightfixcolor').disabled = true;$('ambilightvarcolor').disabled = true;$('ambilightcolorhex').disabled = true;$('ambilight4color').disabled = true;$('ambilight1colorhex').disabled = true;$('ambilight2colorhex').disabled = true;$('ambilight3colorhex').disabled = true;$('ambilight4colorhex').disabled = true;}
	if(window.localStorage['ambilightrangeblurradius'])$('ambilightrangeblurradius').value = window.localStorage['ambilightrangeblurradius'];
	else $('ambilightrangeblurradius').value = 70;
	if(window.localStorage['ambilightrangespreadradius'])$('ambilightrangespreadradius').value = window.localStorage['ambilightrangespreadradius'];
	else $('ambilightrangespreadradius').value = 5;
	if(window.localStorage['mousespotlightt'] == 'true')$('mousespotlightt').checked = true;
	if(window.localStorage['ambilightfixcolor'] == 'true')$('ambilightfixcolor').checked = true;
	if(window.localStorage['ambilightvarcolor'] == 'true'){$('ambilightvarcolor').checked = true;$('showwarningambilight').style.display = '';}
	else{$('showwarningambilight').style.display = "none";}
	if(window.localStorage['ambilightcolorhex'])$('ambilightcolorhex').value = window.localStorage['ambilightcolorhex'];
	else $('ambilightcolorhex').value = '#47C2FF';
	if(window.localStorage['ambilight4color'] == 'true')$('ambilight4color').checked = true;
	if(window.localStorage['ambilight1colorhex'])$('ambilight1colorhex').value = window.localStorage['ambilight1colorhex'];
	else $('ambilight1colorhex').value = '#FF0000';
	if(window.localStorage['ambilight2colorhex'])$('ambilight2colorhex').value = window.localStorage['ambilight2colorhex'];
	else $('ambilight2colorhex').value = '#FFEE00';
	if(window.localStorage['ambilight3colorhex'])$('ambilight3colorhex').value = window.localStorage['ambilight3colorhex'];
	else $('ambilight3colorhex').value = '#00FF00';
	if(window.localStorage['ambilight4colorhex'])$('ambilight4colorhex').value = window.localStorage['ambilight4colorhex'];
	else $('ambilight4colorhex').value = '#0000FF';
	if(window.localStorage['password'] == 'true'){$('password').checked = true;$('enterpassword').disabled = false;$('confirmpassword').disabled = false;}
	else {$('enterpassword').disabled = true;$('confirmpassword').disabled = true;}
	if(window.localStorage['enterpassword'])$('enterpassword').value = window.localStorage['enterpassword'];
	if(window.localStorage['noflash'] == 'true')$('noflash').checked = true;
	if(window.localStorage['hardflash'] == 'true')$('hardflash').checked = true;
	if(window.localStorage['ecosaver'] == 'true')$('ecosaver').checked = true;
	if(window.localStorage['ecosavertime'])$('ecosavertime').value = window.localStorage['ecosavertime'];
	else $('ecosavertime').value = '60';
	if(window.localStorage['dynamic'] == 'true')$('dynamic').checked = true;
	else $('lightdynamic').disabled = true;
	if(window.localStorage['dynamic1'] == 'true'){$('dynamic1').checked = true;$("lightdynamic").value = chrome.i18n.getMessage('desdynamicfishtank');}
	if(window.localStorage['dynamic2'] == 'true'){$('dynamic2').checked = true;$("lightdynamic").value = chrome.i18n.getMessage('desdynamicblocks');}
	if(window.localStorage['dynamic3'] == 'true'){$('dynamic3').checked = true;$("lightdynamic").value = chrome.i18n.getMessage('desdynamicraindrops');}
	if(window.localStorage['dynamic4'] == 'true'){$('dynamic4').checked = true;$("lightdynamic").value = chrome.i18n.getMessage('desdynamiccloud');}
	if(window.localStorage['dynamic5'] == 'true'){$('dynamic5').checked = true;$("lightdynamic").value = chrome.i18n.getMessage('desdynamicspace');}
	if(window.localStorage['hoveroptiondyn5'] == 'true'){$('hoveroptiondyn5').checked = true;}
	if(window.localStorage['autoplayonly'] == 'true'){$('autoplayonly').checked = true;$('autoplayDomainsBox').disabled = false;$('autoplaywebsiteurl').disabled = false;$('autoplayaddbutton').disabled = false;$('autoplayremovebutton').disabled = false;}
	else{$('autoplayonly').checked = false;$('autoplayDomainsBox').disabled = true;$('autoplaywebsiteurl').disabled = true;$('autoplayaddbutton').disabled = true;$('autoplayremovebutton').disabled = true;}
	if(window.localStorage['blur'] == 'true'){$('blur').checked = true;}
	if(window.localStorage['maxquality'])$('youtubequality').value = window.localStorage['maxquality'];
	if(window.localStorage['autowidthyoutube'] == 'true'){$('autowidthyoutube').checked = true;}
	if(window.localStorage['customqualityyoutube'] == 'true'){$('customqualityyoutube').checked = true;}
	if(window.localStorage['cinemaontop'] == 'true'){$('cinemaontop').checked = true;}
	if(window.localStorage['alllightsoff'] == 'true'){$('alllightsoff').checked = true;}
	if(window.localStorage['spotlightradius'])$('spotlightradius').value = window.localStorage['spotlightradius'];
	else $('spotlightradius').value = 50;
	if(window.localStorage['atmosphereonly'] == 'true'){$('atmosphereonly').checked = true;$('atmosphereDomainsBox').disabled = false;$('atmospherewebsiteurl').disabled = false;$('atmosphereaddbutton').disabled = false;$('atmosphereremovebutton').disabled = false;}
	else{$('atmosphereonly').checked = false;$('atmosphereDomainsBox').disabled = true;$('atmospherewebsiteurl').disabled = true;$('atmosphereaddbutton').disabled = true;$('atmosphereremovebutton').disabled = true;}
	if(window.localStorage['optionskipremember'] == 'true'){$('optionskipremember').checked = true;$('firstcheckboxskipremember').checked = true;}
	
// show remember page
var countremember = window.localStorage['countremember'];
if(!countremember){countremember = 0;}
countremember = parseInt(countremember) + 1;

if($('optionskipremember').checked != true){
	if(countremember >= 10) {$('remembershare').style.display = "";countremember = 0;}
	else {$('remembershare').style.display = "none";}
} else {$('remembershare').style.display = "none";}

window.localStorage['countremember'] = countremember;	
	
	// load tab div
	var tabListItems = $('navbar').childNodes;
	for ( var i = 0; i < tabListItems.length; i++ ) {
		if ( tabListItems[i].nodeName == 'LI' ) {
		var tabLink = getFirstChildWithTagName( tabListItems[i], 'A' );
		var id = getHash( tabLink.getAttribute('data-tab') );
		tabLinks[id] = tabLink;
		contentDivs[id] = $( id );
        }
    }
    
    // Assign onclick events to the tab links, and
    // highlight the first tab
    var i = 0;
 
    for ( var id in tabLinks ) {
    	tabLinks[id].onclick = showTab;
		tabLinks[id].onfocus = function() { this.blur() };
		if ( i == 0 ) tabLinks[id].className = 'navbar-item-selected';
		i++;
    }
    
    // Hide all content divs except the first
    var i = 0;
 
    for ( var id in contentDivs ) {
    	if ( i != 0 ) contentDivs[id].className = 'page hidden';
        i++;
    }

    // display version number
    function displayVersionNumber() {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", chrome.extension.getURL('manifest.json'), false);
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              var theManifest = JSON.parse(this.responseText);
              $("version_number").innerText = theManifest.version;
            }
          };
          xhr.send();
        } catch (ex) {} // silently fail
    }
    displayVersionNumber();

// Excluded domains - sort these alphabetically
var excludedDomains = window.localStorage["excludedDomains"];
if(typeof excludedDomains == "undefined")
excludedDomains = JSON.stringify({'http://www.nytimes.com': true, 'http://www.blogger.com': true});
		
if(typeof excludedDomains == "string") {
	excludedDomains = JSON.parse(excludedDomains);
	var buf = [];
	for(var domain in excludedDomains)
		buf.push(domain);
        buf.sort();
	for(var i = 0; i < buf.length; i++)
		appendToListBox("excludedDomainsBox", buf[i]);
    }

// ambilight play detect
		var startambilight = setInterval(function () {
		try {
		var htmlplayer = document.getElementsByTagName("video") || null;
		var playerid = null, item = null;
		for(var j=0; j<htmlplayer.length; j++) {
			if (htmlplayer[j].play){playerid = htmlplayer[j]; item = j + 1; drawImage(playerid, item);}
		}
		}
		catch(err) {} // i see nothing, that is good
		},20); // 20 refreshing it

// default example2 is not display
example2.style.opacity = 0;example2.style.display = 'none';
// default hide this buttons
wallpapershow.style.display = 'none';dynamicshow.style.display = 'none';

// autoplay - Excluded domains - sort these alphabetically
var autoplayDomains = window.localStorage["autoplayDomains"];
if(typeof autoplayDomains == "undefined")
autoplayDomains = JSON.stringify({'http://www.youtube.com': true, 'http://www.vimeo.com': true});

if(typeof autoplayDomains == "string") {
	autoplayDomains = JSON.parse(autoplayDomains);
	var abuf = [];
	for(var domain in autoplayDomains)
		abuf.push(domain);
        abuf.sort();
	for(var i = 0; i < abuf.length; i++)
		appendToListBox("autoplayDomainsBox", abuf[i]);
    }

// atmosphere - Excluded domains - sort these alphabetically
var atmosphereDomains = window.localStorage["atmosphereDomains"];
if(typeof atmosphereDomains == "undefined")
atmosphereDomains = JSON.stringify({'http://www.youtube.com': true, 'http://www.vimeo.com': true});
		
if(typeof atmosphereDomains == "string") {
	atmosphereDomains = JSON.parse(atmosphereDomains);
	var albuf = [];
	for(var domain in atmosphereDomains)
		albuf.push(domain);
        albuf.sort();
	for(var i = 0; i < albuf.length; i++)
		appendToListBox("atmosphereDomainsBox", albuf[i]);
    }
}

// animation browser engine
window.requestAnimFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(/* function */ callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();

var countA = 0, countB = 0, countC = 0; // start from zero (blur spread) and size (left right top under) position

// ambilight draw code
function drawImage(){
	var v = $("beeld");
	if(v.paused || v.ended){
	// v.style.webkitBoxShadow = "";

	// animation go out
	countA=countA-1;if (countA <= 0){countA=0;}
	countB=countB-1;if (countB <= 0){countB=0;}
	countC=countC-1;if (countC <= 0){countC=0;}
	var textcountA = countA + "px";
	var textcountB = countB + "px";

var canvas = $("totlCanvas1");
if(canvas){
	var context = canvas.getContext('2d');
	var imageData = context.getImageData(0, 0, 1, 1);
	var data = imageData.data;

	function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
	}

	var p1 = context.getImageData(0 , 0, 1, 1).data;
	var p2 = context.getImageData(1 , 0, 1, 1).data;
	var p3 = context.getImageData(2 , 0, 1, 1).data;
	var p4 = context.getImageData(3 , 0, 1, 1).data;
	var hex1 = "#" + ("000000" + rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
	var hex2 = "#" + ("000000" + rgbToHex(p2[0], p2[1], p2[2])).slice(-6);
	var hex3 = "#" + ("000000" + rgbToHex(p3[0], p3[1], p3[2])).slice(-6);
	var hex4 = "#" + ("000000" + rgbToHex(p4[0], p4[1], p4[2])).slice(-6);
}
var downhex1 = hex1; if(!hex1){ hex1 = "#000000"; } // previous value
var downhex2 = hex2; if(!hex2){ hex2 = "#000000"; } // previous value
var downhex3 = hex3; if(!hex3){ hex3 = "#000000"; } // previous value
var downhex4 = hex4; if(!hex4){ hex4 = "#000000"; } // previous value

	if(ambilightvarcolor.checked == true){
	v.style.webkitBoxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + downhex3 + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + downhex1 + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + downhex2 + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + downhex4 + ""; 
	}
	else if(ambilightfixcolor.checked == true){
	v.style.webkitBoxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + $("ambilightcolorhex").value + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + $("ambilightcolorhex").value + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + $("ambilightcolorhex").value + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + $("ambilightcolorhex").value + "";
	}
	else if(ambilight4color.checked == true){
	v.style.webkitBoxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + $("ambilight1colorhex").value + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + $("ambilight2colorhex").value + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + $("ambilight3colorhex").value + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + $("ambilight4colorhex").value + "";
	}
	// ----
	
	return false;
	}
	if(ambilight.checked == true){
    var showtime = $("beeld");
	var getblur = $('ambilightrangeblurradius').value + "px";
	var getspread = $('ambilightrangespreadradius').value + "px";
	
	// animate out and in
	if (countA < $('ambilightrangespreadradius').value){countA=countA+1;}
	if (countB < $('ambilightrangeblurradius').value){countB=countB+1;}
	if (countC < 20){countC=countC+.5;}
	var textcountA = countA + "px";
	var textcountB = countB + "px";
	
	if(ambilightvarcolor.checked == true){
    var sourceWidth = showtime.videoWidth;
    var sourceHeight = showtime.videoHeight;
    
var totlcheckcanvas = $("totlCanvas1");
if(totlcheckcanvas){}else{
 	var totlnewcanvas = document.createElement("canvas");
	totlnewcanvas.setAttribute('id','totlCanvas1');
	totlnewcanvas.width = "4";
	totlnewcanvas.height = "1";
	totlnewcanvas.style.display = "none";
	document.body.appendChild(totlnewcanvas);
	}

var canvas = $("totlCanvas1");
var context = canvas.getContext("2d");
var colorlamp1X = (sourceWidth * 50) /100; // up midden
var colorlamp1Y = (sourceHeight * 95) /100;
var colorlamp2X = (sourceWidth * 95) /100; // right midden
var colorlamp2Y = (sourceHeight * 50) /100;
var colorlamp3X = (sourceWidth * 50) /100; // down midden
var colorlamp3Y = (sourceHeight * 5) /100;
var colorlamp4X = (sourceWidth * 5) /100; // left midden
var colorlamp4Y = (sourceHeight * 50) /100;
	
	context.drawImage(showtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
	context.drawImage(showtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
	context.drawImage(showtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
	context.drawImage(showtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);
	
    var imageData = context.getImageData(0, 0, 1, 1);
    var data = imageData.data;

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

    var p1 = context.getImageData(0 , 0, 1, 1).data; 
    var p2 = context.getImageData(1 , 0, 1, 1).data; 
    var p3 = context.getImageData(2 , 0, 1, 1).data; 
    var p4 = context.getImageData(3 , 0, 1, 1).data; 
    var hex1 = "#" + ("000000" + rgbToHex(p1[0], p1[1], p1[2])).slice(-6);
    var hex2 = "#" + ("000000" + rgbToHex(p2[0], p2[1], p2[2])).slice(-6);
    var hex3 = "#" + ("000000" + rgbToHex(p3[0], p3[1], p3[2])).slice(-6);
    var hex4 = "#" + ("000000" + rgbToHex(p4[0], p4[1], p4[2])).slice(-6);

	v.style.webkitBoxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + hex3 + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + hex1 + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + hex2 + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + hex4 + "";
	} else if(ambilightfixcolor.checked == true){
	var fixhex = $("ambilightcolorhex").value;
	if(fixhex)fixhex = fixhex;else fixhex = '#000000';
	v.style.webkitBoxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + fixhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + fixhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + fixhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + fixhex + "";
	} else if(ambilight4color.checked == true){
	var fix1hex = $("ambilight1colorhex").value;
	var fix2hex = $("ambilight2colorhex").value;
	var fix3hex = $("ambilight3colorhex").value;
	var fix4hex = $("ambilight4colorhex").value;
	if(fix1hex)fix1hex = fix1hex;else fix1hex = '#FF0000';
	if(fix2hex)fix2hex = fix2hex;else fix2hex = '#FFEE00';
	if(fix3hex)fix3hex = fix3hex;else fix3hex = '#00FF00';
	if(fix4hex)fix4hex = fix4hex;else fix4hex = '#0000FF';
	v.style.webkitBoxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + fix1hex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + fix2hex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + fix3hex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + fix4hex + "";
	}
	
	window.requestAnimFrame(drawImage);	
}else{v.style.webkitBoxShadow = "";}
}

// Fade engine
//  Variable for the fade in and out effect
var opacity = 0;

var ReducingFinished = true;
var OpacityLevelIncrement = 10;   //  Percentage value: 1-100

//  Function determines whether we show or hide the item referenced by ElementID
function fader(ActionToTake)
{
  DIVElementById = $('example2');
  if (ActionToTake == 'hide')
  { opacity = default_opacity; reduceOpacity(); }
  else if (ActionToTake == 'show')
  { increaseOpacity(); }
}

//  Makes div increase
function increaseOpacity()
{
DIVElementById.style.display = '';
  //  If opacity level is less than default_opacity, we can still increase the opacity
  if ((opacity < default_opacity) && (ReducingFinished == true))
  {
	if ((opacity > (default_opacity-10)) && (ReducingFinished == true)){
    ReducingFinished = true;
    opacity  += (default_opacity - opacity);
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(increaseOpacity);
	}
	else {
    ReducingFinished = true;
    opacity  += OpacityLevelIncrement;
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(increaseOpacity);
	}
  }
  else
  {
    ReducingFinished = false;
  }
}

//  Makes div reduce
function reduceOpacity() 
{
  //  If opacity level is greater than 0, we can still reduce the opacity
  if ((opacity > 0) && (ReducingFinished == false))
  {
    ReducingFinished = false;
    opacity  -= OpacityLevelIncrement;
    DIVElementById.style.opacity = opacity/100;
	window.requestAnimFrame(reduceOpacity);
  }
  else
  {
    ReducingFinished = true;

    //  When finished, make sure the DIVElementById is set to remove element
    if (DIVElementById.style.opacity = '0')
    {DIVElementById.style.display = 'none';}
  }
}

// Add a filter string to the list box.
function appendToListBox(boxId, text) { var elt = document.createElement("option"); elt.text = text; elt.value = text; $(boxId).add(elt, null); }

// tabel script
    var tabLinks = new Array();
    var contentDivs = new Array();
 
    function showTab() {
      var selectedId = getHash( this.getAttribute('data-tab') );
 
      // Highlight the selected tab, and dim all others.
      // Also show the selected content div, and hide all others.
      for ( var id in contentDivs ) {
        if ( id == selectedId ) {
          tabLinks[id].className = 'navbar-item-selected';
          contentDivs[id].className = 'page';
        } else {
          tabLinks[id].className = 'navbar-item';
          contentDivs[id].className = 'page hidden';
        }
      }
 
      // Stop the browser following the link
      return false;
    }
 
    function getFirstChildWithTagName( element, tagName ) {
      for ( var i = 0; i < element.childNodes.length; i++ ) {
        if ( element.childNodes[i].nodeName == tagName ) return element.childNodes[i];
      }
    }
 
    function getHash( url ) {
      var hashPos = url.lastIndexOf ( '#' );
      return url.substring( hashPos + 1 );
    }

// whitelist eye domain
function addWhitelistDomain() {
    var domain = $("websiteurl").value;
    appendToListBox("excludedDomainsBox", domain);
    save_options();
}

function removeSelectedExcludedDomain() {
    var excludedDomainsBox = $("excludedDomainsBox");
    for (var i = excludedDomainsBox.length-1; i >= 0; i--) {
        if (excludedDomainsBox.options[i].selected)
            excludedDomainsBox.remove(i);
    }
    save_options();
}

// whitelist autoplay domain
function autoplayaddWhitelistDomain() {
    var domain = $("autoplaywebsiteurl").value;
    appendToListBox("autoplayDomainsBox", domain);
    save_options();
}

function autoplayremoveSelectedExcludedDomain() {
    var autoplayDomainsBox = $("autoplayDomainsBox");
    for (var i = autoplayDomainsBox.length-1; i >= 0; i--) {
        if (autoplayDomainsBox.options[i].selected)
            autoplayDomainsBox.remove(i);
    }
    save_options();
}

// whitelist autoplay domain
function atmosphereaddWhitelistDomain() {
    var domain = $("atmospherewebsiteurl").value;
    appendToListBox("atmosphereDomainsBox", domain);
    save_options();
}

function atmosphereremoveSelectedExcludedDomain() {
    var atmosphereDomainsBox = $("atmosphereDomainsBox");
    for (var i = atmosphereDomainsBox.length-1; i >= 0; i--) {
        if (atmosphereDomainsBox.options[i].selected)
            atmosphereDomainsBox.remove(i);
    }
    save_options();
}

// fade effects control -> not when loaded page
function lightscontrol() {
var jump = $('interval').value;
default_opacity = jump;
if(onoffrange.value == 0)
{
if(fadeout.checked == true){ReducingFinished = false;fader('hide');}else{example2.style.opacity = 0;example2.style.display = 'none';}
}
else{
if(fadein.checked == true){ReducingFinished = true;fader('show');}else{example2.style.opacity = jump/100;example2.style.display = '';}
}
}

// remove dynamic elements
function removedynamic(){
var newdynmaster = $("stefanvddynamicbackground");
var fishtanks = $('fishtanks');
if(fishtanks) {newdynmaster.removeChild(fishtanks);}
var blocks = $('blocks');
if(blocks) {newdynmaster.removeChild(blocks);}
var raindrops = $('raindrops');
if(raindrops) {newdynmaster.removeChild(raindrops);}
var clouds = $('clouds');
if(clouds) {newdynmaster.removeChild(clouds);}
var space = $('space');
if(space) {newdynmaster.removeChild(space);}
}

// test general
function test() {
if(ambilight.checked == true){
drawImage();
}
// show alert warning
if(ambilightvarcolor.checked == true)
{$('showwarningambilight').style.display = '';}
else{$('showwarningambilight').style.display = 'none';}

// YouTube preview sample
if(head.checked == true)
{$('samplechannel').style.zIndex = 100;$('samplechannel').style.position = 'relative';$('videochannel').style.zIndex = 100;$('videochannel').style.position = 'relative';}
else{$('samplechannel').style.zIndex = 1;$('samplechannel').style.position = 'relative';$('videochannel').style.zIndex = 1;$('videochannel').style.position = 'relative';}

if(playlist.checked == true){} // not visible in the preview
else{}

if(infobar.checked == true)
{$('sampleinforbar').style.zIndex = 100;$('sampleinforbar').style.position = 'relative';}
else{$('sampleinforbar').style.zIndex = 1;$('sampleinforbar').style.position = 'relative';}

if(likebutton.checked == true)
{$('sampledislikebutton').style.zIndex = 100;$('sampledislikebutton').style.position = 'relative';}
else{$('sampledislikebutton').style.zIndex = 1;$('sampledislikebutton').style.position = 'relative';}

if(sharebutton.checked == true)
{$('samplesharebutton').style.zIndex = 100;$('samplesharebutton').style.position = 'relative';}
else{$('samplesharebutton').style.zIndex = 1;$('samplesharebutton').style.position = 'relative';}

if(suggestions.checked == true)
{$('samplesug').style.zIndex = 100;$('samplesug').style.position = 'relative';}
else {$('samplesug').style.zIndex = 1;$('samplesug').style.position = 'relative';}

if(videoheadline.checked == true){$('sampletitle').style.zIndex = 100;$('sampletitle').style.position = 'relative';$('sampletitle').style.color = '#FFFFFF';}
else {$('sampletitle').style.zIndex = 1;$('sampletitle').style.position = 'relative';$('sampletitle').style.color = '#000000';}

if(viewcount.checked == true)
{$('sampleview').style.zIndex = 100;$('sampleview').style.color = 'white';$('sampleview').style.position = 'relative';}
else{$('sampleview').style.zIndex = 1;$('sampleview').style.color = 'black';$('sampleview').style.position = 'relative';}

if(addvideobutton.checked == true)
{$('sampleaddbutton').style.zIndex = 100;$('sampleaddbutton').style.position = 'relative';}
else{$('sampleaddbutton').style.zIndex = 1;$('sampleaddbutton').style.position = 'relative';}

if(likebar.checked == true)
{$('samplelikebar').style.zIndex = 101;$('samplelikebar').style.position = 'relative';}
else{$('samplelikebar').style.zIndex = 2;$('samplelikebar').style.position = 'relative';}

/* --- end YouTube preview --- */
if(ambilight.checked == true)
{$('arangespread').disabled = false;$('ambilightrangespreadradius').disabled = false;$('arangeblur').disabled = false;$('ambilightrangeblurradius').disabled = false;$('ambilightfixcolor').disabled = false;$('ambilightvarcolor').disabled = false;$('ambilightcolorhex').disabled = false;$('ambilight4color').disabled = false;$('ambilight1colorhex').disabled = false;$('ambilight2colorhex').disabled = false;$('ambilight3colorhex').disabled = false;$('ambilight4colorhex').disabled = false;}
else {$('arangespread').disabled = true;$('ambilightrangespreadradius').disabled = true;$('arangeblur').disabled = true;$('ambilightrangeblurradius').disabled = true;$('ambilightfixcolor').disabled = true;$('ambilightvarcolor').disabled = true;$('ambilightcolorhex').disabled = true;$('ambilight4color').disabled = true;$('ambilight1colorhex').disabled = true;$('ambilight2colorhex').disabled = true;$('ambilight3colorhex').disabled = true;$('ambilight4colorhex').disabled = true;}

if(lightimagea.checked == true)
{$('lightimagen').checked = false;$('example1').style.background = 'url(' + $('lightimage').value + ')';$('example1').style.backgroundSize = "100% 100%";$('example2').style.background = 'url(' + $('lightimage').value + ')';$('example2').style.backgroundSize = "100% 100%";$('lightimage').disabled = false;$('lightcolor').disabled = true;
$('mousespotlighta').disabled = true;$('mousespotlightc').disabled = true;$('mousespotlighto').checked = true;}
else{$('lightimagen').checked = true;$('example1').style.background = $('lightcolor').value;$('example2').style.background = $('lightcolor').value;$('lightimage').disabled = true;$('lightcolor').disabled = false;
$('mousespotlighta').disabled = false;$('mousespotlightc').disabled = false;}

if(eyen.checked == true){$('ecosaver').disabled = true;$('ecosavertime').disabled = true;$('confirmtimesaver').disabled = true;$('helpautoplay').style.display = "none";$('helpeyeprotection').style.display = "none";$('excludedDomainsBox').disabled = true;$('websiteurl').disabled = true;$('autoplay').disabled = false;$('addbutton').disabled = true;$('removebutton').disabled = true;$('nighttime').disabled = true;$('begintime').disabled = true;$('endtime').disabled = true;$('confirmtime').disabled = true;}
else if(eyea.checked == true){$('ecosaver').disabled = false;$('ecosavertime').disabled = false;$('confirmtimesaver').disabled = false;$('helpautoplay').style.display = "";$('helpeyeprotection').style.display = "";$('excludedDomainsBox').disabled = true;$('websiteurl').disabled = true;$('autoplay').checked = false;$('autoplay').disabled = true;$('addbutton').disabled = true;$('removebutton').disabled = true;$('nighttime').disabled = false;$('begintime').disabled = false;$('endtime').disabled = false;$('confirmtime').disabled = false;}
else if(eyealist.checked == true){$('ecosaver').disabled = false;$('ecosavertime').disabled = false;$('confirmtimesaver').disabled = false;$('helpautoplay').style.display = "";$('helpeyeprotection').style.display = "";$('excludedDomainsBox').disabled = false;$('websiteurl').disabled = false;$('autoplay').checked = false;$('autoplay').disabled = true;$('addbutton').disabled = false;$('removebutton').disabled = false;$('nighttime').disabled = false;$('begintime').disabled = false;$('endtime').disabled = false;$('confirmtime').disabled = false;}

if(mousespotlighto.checked == true)
{$('eastereggs').disabled = false;} // eastereggs OFF
else{$('eastereggs').disabled = true;$('eastereggs').checked = false;} // active box eastereggs

if(nighttime.checked == true)
{}
else{$('begintime').disabled = true;$('endtime').disabled = true;$('confirmtime').disabled = true;}

if(password.checked == true)
{$('enterpassword').disabled = false;$('confirmpassword').disabled = false;}
else{$('enterpassword').disabled = true;$('confirmpassword').disabled = true;}

if(ecosaver.checked == true)
{}
else{$('ecosavertime').disabled = true;$('confirmtimesaver').disabled = true;}

if(autoplayonly.checked == true)
{$('autoplayonly').checked = true;$('autoplayDomainsBox').disabled = false;$('autoplaywebsiteurl').disabled = false;$('autoplayaddbutton').disabled = false;$('autoplayremovebutton').disabled = false;}
else{$('autoplayonly').checked = false;$('autoplayDomainsBox').disabled = true;$('autoplaywebsiteurl').disabled = true;$('autoplayaddbutton').disabled = true;$('autoplayremovebutton').disabled = true;}

if(atmosphereonly.checked == true)
{$('atmosphereonly').checked = true;$('atmosphereDomainsBox').disabled = false;$('atmospherewebsiteurl').disabled = false;$('atmosphereaddbutton').disabled = false;$('atmosphereremovebutton').disabled = false;}
else{$('atmosphereonly').checked = false;$('atmosphereDomainsBox').disabled = true;$('atmospherewebsiteurl').disabled = true;$('atmosphereaddbutton').disabled = true;$('atmosphereremovebutton').disabled = true;}

}

function dynamictest(){
var newdynmaster = $("stefanvddynamicbackground");
if(dynamic.checked == true){
if(dynamic1.checked == true){
removedynamic();
	var fishtanks = document.createElement("div");fishtanks.setAttribute('id','fishtanks');newdynmaster.appendChild(fishtanks);

	var newdynleft = document.createElement("div");newdynleft.setAttribute('class','stefanvddynamicbackgroundbubbleleft');fishtanks.appendChild(newdynleft);
	for(var i = 0; i < 5; i++ ){var newdyn = document.createElement("div");newdyn.setAttribute('class','stefanvddynamicbackgroundbubbles stefanvddynamicbubbles'+i+'');newdynleft.appendChild(newdyn);}
	var newdynmid = document.createElement("div");newdynmid.setAttribute('class','stefanvddynamicbackgroundbubblemid');fishtanks.appendChild(newdynmid);
	for(var i = 6; i < 10; i++ ){var newdyn = document.createElement("div");newdyn.setAttribute('class','stefanvddynamicbackgroundbubbles stefanvddynamicbubbles'+i+'');newdynmid.appendChild(newdyn);}			
	var newdynright = document.createElement("div");newdynright.setAttribute('class','stefanvddynamicbackgroundbubbleright');fishtanks.appendChild(newdynright);	
	for(var i = 11; i < 16; i++ ){var newdyn = document.createElement("div");newdyn.setAttribute('class','stefanvddynamicbackgroundbubbles stefanvddynamicbubbles'+i+'');newdynright.appendChild(newdyn);}					
}
else if(dynamic2.checked == true){
removedynamic();
	var blocks = document.createElement("div");blocks.setAttribute('id','blocks');newdynmaster.appendChild(blocks);

	var newdynleft = document.createElement("div");newdynleft.setAttribute('class','stefanvddynamicbackgroundblockleft');blocks.appendChild(newdynleft);
	for(var i = 1; i < 21; i++ ){var newdyn = document.createElement("div");newdyn.setAttribute('class','stefanvddynamicbackgroundblocks stefanvddynamicblocks'+i+'');newdynleft.appendChild(newdyn);}
}
else if(dynamic3.checked == true){
removedynamic();
	var raindrops = document.createElement("div");raindrops.setAttribute('id','raindrops');newdynmaster.appendChild(raindrops);

	var newdynleft = document.createElement("div");newdynleft.setAttribute('class','stefanvddynamicbackgroundblockleft');raindrops.appendChild(newdynleft);
	for(var i = 0; i < 15; i++ ){var newdyn = document.createElement("div");newdyn.setAttribute('class','stefanvddynamicbackgroundraindrups b'+i+'');newdynleft.appendChild(newdyn);}
}
else if(dynamic4.checked == true){
removedynamic();
	var clouds = document.createElement("div");clouds.setAttribute('id','clouds');newdynmaster.appendChild(clouds);
	var newdynworld = document.createElement("div");newdynworld.setAttribute('id','stefanvdworld');clouds.appendChild(newdynworld);			
(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x]+'CancelRequestAnimationFrame'];
		}
		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)window.cancelAnimationFrame = function(id) {clearTimeout(id);};
	}())

	var layers = [],objects = [],world = document.getElementById('stefanvdworld'),viewport = document.getElementById('stefanvddynamicbackground'),	
	d = 0,p = 400,worldXAngle = 0,worldYAngle = 0;
	
	viewport.style.webkitPerspective = p;viewport.style.MozPerspective = p;viewport.style.oPerspective = p;
	generate();
	
	function createCloud() {
		var div = document.createElement( 'div'  );
		div.className = 'stefanvdcloudBase';
		var x = 256 - ( Math.random() * 512 );
		var y = 256 - ( Math.random() * 512 );
		var z = 256 - ( Math.random() * 512 );
		var t = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(' + z + 'px)';
		div.style.webkitTransform = t;div.style.MozTransform = t;div.style.oTransform = t;
		world.appendChild(div);
		
		for( var j = 0; j < 5 + Math.round( Math.random() * 10 ); j++ ) {
			var cloud = document.createElement('div');
			cloud.style.opacity = 0;
			cloud.style.opacity = .8;
			cloud.className = 'stefanvdcloudLayer';
			var x = 256 - ( Math.random() * 512 );
			var y = 256 - ( Math.random() * 512 );
			var z = 100 - ( Math.random() * 200 );
			var a = Math.random() * 360;;
			var s = .25 + Math.random();
			x *= .2; y *= .2;
			cloud.data = {x: x,y: y,z: z,a: a,s: s,speed: .1 * Math.random()};
			var t = 'translateX(' + x + 'px) translateY(' + y + 'px) translateZ(' + z + 'px) rotateZ(' + a + 'deg) scale(' + s + ')';
			cloud.style.webkitTransform = t;cloud.style.MozTransform = t;cloud.style.oTransform = t;
			div.appendChild(cloud);
			layers.push(cloud);
		}
		return div;
	}
	
	function generate() {
		objects = [];
		if (world.hasChildNodes()) {
			while ( world.childNodes.length >= 1 ) {world.removeChild(world.firstChild);} 
		}
		for(var j = 0; j < 5; j++) {objects.push(createCloud());}
	}
	
	function updateView(){
		var t = 'translateZ( ' + d + 'px ) rotateX( ' + worldXAngle + 'deg) rotateY( ' + worldYAngle + 'deg)';
		world.style.webkitTransform = t;world.style.MozTransform = t;world.style.oTransform = t;}
	
	function update (){
		for( var j = 0; j < layers.length; j++ ) {
			var layer = layers[ j ];
			layer.data.a += layer.data.speed;
			var t = 'translateX(' + layer.data.x + 'px) translateY(' + layer.data.y + 'px) translateZ(' + layer.data.z + 'px) rotateY(' + ( - worldYAngle ) + 'deg) rotateX(' + ( - worldXAngle ) + 'deg) rotateZ(' + layer.data.a + 'deg) scale(' + layer.data.s + ')';
			layer.style.webkitTransform = t;layer.style.MozTransform = t;layer.style.oTransform = t;
		}
		requestAnimationFrame(update);
	}
	update();


}
else if(dynamic5.checked == true){

removedynamic();
if(hoveroptiondyn5.checked == true){
	var space = document.createElement("div");space.setAttribute('id','space');newdynmaster.appendChild(space);

	var newdynspaceworld = document.createElement("div");newdynspaceworld.setAttribute('id','stefanvddynamicspace');space.appendChild(newdynspaceworld);			
	for(var j = 1; j < 17; j++ ){
	if(j<=9){j="0"+j}
		var newdynpart1 = document.createElement("div");
		newdynpart1.setAttribute('id','p'+ j);newdynspaceworld.appendChild(newdynpart1);
		for(var i = 1; i < 31; i++ ){
		if(i<=9){i="0"+i}
		var newdynlow = document.createElement("b");newdynlow.setAttribute('class','s0'+i+'');newdynpart1.appendChild(newdynlow);
		}
	}
}else{
	var space = document.createElement("div");space.setAttribute('id','space');newdynmaster.appendChild(space);

	var newdynspaceworld = document.createElement("div");newdynspaceworld.setAttribute('id','stefanvddynamicspacenoflying');space.appendChild(newdynspaceworld);			
	for(var j = 1; j < 17; j++ ){
	if(j<=9){j="0"+j}
		var newdynpart1 = document.createElement("div");
		newdynpart1.setAttribute('id','np'+ j);newdynspaceworld.appendChild(newdynpart1);
		for(var i = 1; i < 31; i++ ){
		if(i<=9){i="0"+i}
		var newdynlow = document.createElement("b");newdynlow.setAttribute('class','ns0'+i+'');newdynpart1.appendChild(newdynlow);
		}
	}
}
	
}
}
}

// Current year
function yearnow() {
var today = new Date(); var y0 = today.getFullYear();$("yearnow").innerText = y0;
}


/* Option page body action */
// Read current value settings
window.addEventListener('load', function() {
read_options();
test();
dynamictest();
yearnow();
// Add the YouTube player
$("dont-turn-off-the-lights").src = "http://www.youtube.com/embed/?listType=playlist&list=PLF155F53B3D8D07CB";
// remove loading screen
$('loading').style.display = "none";
});

document.addEventListener('DOMContentLoaded', function () {
// Remove remember
$("skipremember").addEventListener('click', function() {$('remembershare').style.display = "none";});
$("firstcheckboxskipremember").addEventListener('click', function() {if(firstcheckboxskipremember.checked == true){$('optionskipremember').checked = true;}save_options();});
var sharetext = "I Highly recommended Turn Off the Lights";
var stefanvdurl = "https://chrome.google.com/webstore/detail/bfbmjmiodbnnpllbbbfblcplfjjepjdn";var stefanvdaacodeurl = encodeURIComponent(stefanvdurl);
$("rememberboxgoogle").addEventListener("click", function() {window.open('https://plus.google.com/share?ur\l=' + stefanvdaacodeurl + '', 'Share to Google+','width=600,height=460,menubar=no,location=no,status=no');});
$("rememberboxfacebook").addEventListener("click", function() {window.open("https://www.facebook.com/sharer.php?u="+ stefanvdurl + "[URL]&t=" + sharetext + "", "_blank");});
$("rememberboxtwitter").addEventListener("click", function() {window.open("https://twitter.com/share?url=" + stefanvdaacodeurl + "&text=" + sharetext + "", 'Share to Twitter','width=600,height=460,menubar=no,location=no,status=no');});

// Detect click / change to save the page and test it.
var inputs = document.querySelectorAll('input');
for (var i = 0; i < inputs.length; i++) {inputs[i].addEventListener('change', test);inputs[i].addEventListener('change', save_options);}

// Detect lightcolor change
$("lightcolor").addEventListener('change', function() {$('lightimagen').checked = true;$('example1').style.background = this.value;$('example2').style.background = this.value;save_options();});

// Detect image change
$("lightimage").addEventListener('change', function() {
function getImage(url) {
    var bkimage = new Image();
    bkimage.onload = function() {
	$('lightimagea').checked = true;
	$('example1').style.background = 'url(' + this.value + ')';
	$('example2').style.background = 'url(' + this.value + ')';
	save_options();
	};
    bkimage.onerror = function() {
	var optionwrongimg = chrome.i18n.getMessage('optionwrongimg');alert(optionwrongimg);
	$('lightimagea').checked = true;
	$('lightimage').value = 'http://turnoffthelights.googlecode.com/files/theater.jpg';
	$('example1').style.background = 'url(http://turnoffthelights.googlecode.com/files/theater.jpg)';
	$('example2').style.background = 'url(http://turnoffthelights.googlecode.com/files/theater.jpg)';
	save_options();	
	};
	bkimage.src = url;
}
getImage(this.value);
});

// Close yellow bar
$("managed-prefs-text-close").addEventListener('click', function() {$("managed-prefs-banner").style.display = "none";});

// Slider
$("slider").addEventListener('change', function() {showValue(this.value);save_options();});

// Interval
$("interval").addEventListener('change', function() {showValue(this.value);save_options();});

// Light switch
$("onoffrange").addEventListener('change', function() {lightscontrol();});

// Arangeblur
$("arangeblur").addEventListener('change', function() {showambilightblurValue(this.value);save_options();});
$("ambilightrangeblurradius").addEventListener('change', function() {showambilightblurValue(this.value);save_options();});

// Arangespread
$("arangespread").addEventListener('change', function() {showambilightspreadValue(this.value);save_options();});
$("ambilightrangespreadradius").addEventListener('change', function() {showambilightspreadValue(this.value);save_options();});

// Add website
$("addbutton").addEventListener('click', function() {addWhitelistDomain();});

// Remove website
$("removebutton").addEventListener('click', function() {removeSelectedExcludedDomain();});

// Save time
$("confirmtime").addEventListener('click', function() {save_options();var optiontimetemp = chrome.i18n.getMessage('optiontimesaved');alert(optiontimetemp);});

// Save password
$("confirmpassword").addEventListener('click', function() {save_options();var optionpastemp = chrome.i18n.getMessage('optionpasswordsaved');alert(optionpastemp);});

// Save KB download
$("tabbasic").addEventListener('click', function() {OFFworkaroundbugfromsafari();$('welcomeguide').src = "";});
$("tabvisual").addEventListener('click', function() {ONworkaroundbugfromsafari();$('welcomeguide').src = "";});
$("tabadvan").addEventListener('click', function() {ONworkaroundbugfromsafari();$('welcomeguide').src = "";});
$("tabguide").addEventListener('click', function() {ONworkaroundbugfromsafari();$('welcomeguide').src = "http://www.stefanvd.net/project/totlchromeguide.htm";$("managed-prefs-banner").style.display = "none";});

function ONworkaroundbugfromsafari(){$("dont-turn-off-the-lights").src = "";}
function OFFworkaroundbugfromsafari(){$("dont-turn-off-the-lights").src = "http://www.youtube.com/embed/?listType=playlist&list=PLF155F53B3D8D07CB";}

// Download Upgrade
$("aadownload").addEventListener('click', function() {window.open("https://chrome.google.com/webstore/detail/pkaglmndhfgdaiaccjglghcbnfinfffa");});

// Save password
$("confirmtimesaver").addEventListener('click', function() {save_options();var optionpastemp = chrome.i18n.getMessage('optionecosaversaved');alert(optionpastemp);});

// Check screenshot
$("wallpaperhide").addEventListener('click', function() {$("imagegallery").style.display = "";$("wallpapershow").style.display = "";$("wallpaperhide").style.display = "none";});
$("wallpapershow").addEventListener('click', function() {$("imagegallery").style.display = "none";$("wallpapershow").style.display = "none";$("wallpaperhide").style.display = "";});
$("totlswallpaper5").addEventListener('click', function() {$("lightimage").value = "http://turnoffthelights.googlecode.com/files/totls5.jpg";test();save_options();});
$("totlswallpaper4").addEventListener('click', function() {$("lightimage").value = "http://turnoffthelights.googlecode.com/files/totls4.jpg";test();save_options();});
$("totlswallpaper3").addEventListener('click', function() {$("lightimage").value = "http://turnoffthelights.googlecode.com/files/totls3.jpg";test();save_options();});
$("totlswallpaper2").addEventListener('click', function() {$("lightimage").value = "http://turnoffthelights.googlecode.com/files/totls2.jpg";test();save_options();});
$("totlswallpaper1").addEventListener('click', function() {$("lightimage").value = "http://turnoffthelights.googlecode.com/files/theater.jpg";test();save_options();});

// dynamic test
$("dynamic").addEventListener('click', function() {if(dynamic.checked == true){dynamictest();$('lightdynamic').disabled = false;}else{removedynamic();$('lightdynamic').disabled = true;}});

// Check dynamic
$("dynamichide").addEventListener('click', function() {$("dynamicgallery").style.display = "";$("dynamicshow").style.display = "";$("dynamichide").style.display = "none";});
$("dynamicshow").addEventListener('click', function() {$("dynamicgallery").style.display = "none";$("dynamicshow").style.display = "none";$("dynamichide").style.display = "";});
$("totldynpaper5").addEventListener('click', function() {$("lightdynamic").value = chrome.i18n.getMessage('desdynamicspace');$('dynamic5').checked = true;dynamictest();save_options();});
$("totldynpaper4").addEventListener('click', function() {$("lightdynamic").value = chrome.i18n.getMessage('desdynamiccloud');$('dynamic4').checked = true;dynamictest();save_options();});
$("totldynpaper3").addEventListener('click', function() {$("lightdynamic").value = chrome.i18n.getMessage('desdynamicraindrops');$('dynamic3').checked = true;dynamictest();save_options();});
$("totldynpaper2").addEventListener('click', function() {$("lightdynamic").value = chrome.i18n.getMessage('desdynamicblocks');$('dynamic2').checked = true;dynamictest();save_options();});
$("totldynpaper1").addEventListener('click', function() {$("lightdynamic").value = chrome.i18n.getMessage('desdynamicfishtank');$('dynamic1').checked = true;dynamictest();save_options();});
$("hoveroptiondyn5").addEventListener('click', function() {$('dynamic5').checked = true;dynamictest();save_options();});

// Share button
$("productsharebutton").addEventListener('click', function() {
ONworkaroundbugfromsafari();$('sharebuttonspopup').src = "http://www.stefanvd.net/project/totlchromeshare.htm";$("sharepopup").style.display = "";
});

$("productsharebuttonclose").addEventListener('click', function() {
OFFworkaroundbugfromsafari();$('sharebuttonspopup').src = "";$("sharepopup").style.display = "none";
});

// autoplay Add website
$("autoplayaddbutton").addEventListener('click', function() {autoplayaddWhitelistDomain();});

// autoplay Remove website
$("autoplayremovebutton").addEventListener('click', function() {autoplayremoveSelectedExcludedDomain();});

// YouTube quality
$("youtubequality").addEventListener('click', function() {
save_options();
});

// atmosphere Add website
$("atmosphereaddbutton").addEventListener('click', function() {atmosphereaddWhitelistDomain();});

// atmosphere Remove website
$("atmosphereremovebutton").addEventListener('click', function() {atmosphereremoveSelectedExcludedDomain();});

// retina check
if(window.devicePixelRatio >= 2) {
$("productwelcomeimageload").src = "images/turnoffthelightswelcome@2x.png";$("productwelcomeimageload").style.width = "190px"; $("productwelcomeimageload").style.height = "40px";
$("productwelcomeimage").src = "images/turnoffthelightswelcome@2x.png";$("productwelcomeimage").style.width = "190px"; $("productwelcomeimage").style.height = "40px";
$("productrememberimage").src = "images/turnoffthelightswelcome@2x.png";$("productrememberimage").style.width = "190px"; $("productrememberimage").style.height = "40px";
}

});
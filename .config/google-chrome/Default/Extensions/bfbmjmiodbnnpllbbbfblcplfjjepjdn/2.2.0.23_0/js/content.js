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

/* inject script for autoplay */
try {
var script = document.createElement("script");script.type = "text/javascript";script.src = chrome.extension.getURL("/js/injected.js");document.getElementsByTagName("head")[0].appendChild(script);
} catch(e) {}

function $(id) { return document.getElementById(id); }
// settings
var autoplay = null, eastereggs = null, shortcutlight = null, eyea = null, eyealist = null, contextmenus = null, excludedDomains = null, nighttime = null, begintime = null, endtime = null, ambilight = null, ambilightrangeblurradius = null, ambilightrangespreadradius = null, ambilightfixcolor = null, ambilightvarcolor = null, ambilightcolorhex = null, ambilight4color = null, ambilight1colorhex = null, ambilight2colorhex = null, ambilight3colorhex = null, ambilight4colorhex = null, ecosavertime = null, ecosavertime = null, autoplayonly = null, autoplayDomains = null, interval = null, autowidthyoutube = null, customqualityyoutube = null, maxquality = null, atmosphereonly = null, atmosphereDomains = null;

// Install on www.stefanvd.net
if (window.location.href.match(/http:\/\/(.*stefanvd\.net\/.*|www\.stefanvd\.net\/.*\/.*)/i)){
	if ($('turnoffthelights-chrome-install-button')) {
		$('turnoffthelights-chrome-install-button').style.display = 'none';
		$('turnoffthelights-chrome-thanks-button').style.display = '';
	}
}
/* -------------------------------------------------- */

chrome.extension.sendMessage({comando:'totlrequest'}, function(response){
autoplay = response.autoplay;
eastereggs = response.eastereggs;
shortcutlight = response.shortcutlight;
eyea = response.eyea;
eyealist = response.eyealist;
contextmenus = response.contextmenus;
excludedDomains = response.excludedDomains;
nighttime = response.nighttime;
begintime = response.begintime;
endtime = response.endtime;
ambilight = response.ambilight;
ambilightrangeblurradius = response.ambilightrangeblurradius;
ambilightrangespreadradius = response.ambilightrangespreadradius;
ambilightfixcolor = response.ambilightfixcolor;
ambilightvarcolor = response.ambilightvarcolor;
ambilightcolorhex = response.ambilightcolorhex;if(!ambilightcolorhex)ambilightcolorhex = '#47C2FF';
ambilight4color = response.ambilight4color;
ambilight1colorhex = response.ambilight1colorhex;if(!ambilight1colorhex)ambilight1colorhex = '#FF0000';
ambilight2colorhex = response.ambilight2colorhex;if(!ambilight2colorhex)ambilight2colorhex = '#FFEE00';
ambilight3colorhex = response.ambilight3colorhex;if(!ambilight3colorhex)ambilight3colorhex = '#00FF00';
ambilight4colorhex = response.ambilight4colorhex;if(!ambilight4colorhex)ambilight4colorhex = '#0000FF';
ecosaver = response.ecosaver;
ecosavertime = response.ecosavertime;
autoplayonly = response.autoplayonly;
autoplayDomains = response.autoplayDomains;
interval = response.interval;
maxquality = response.maxquality;
autowidthyoutube = response.autowidthyoutube;
customqualityyoutube = response.customqualityyoutube;
atmosphereonly = response.atmosphereonly;
atmosphereDomains = response.atmosphereDomains;

// Shortcutlight
window.addEventListener('keydown', function(e) {
		if (e.which == 76 && e.ctrlKey && e.shiftKey && !e.altKey) {
		// Run code for CTRL+SHIFT+L
			// Shortcutlight
			if(shortcutlight == 'true'){
				chrome.extension.sendMessage({name: 'automatic'});
			}
		}

		if (e.which == 119 && !e.ctrlKey && !e.shiftKey && e.altKey) {
		// Run code for Alt+F8
			// Shortcutlight
			if(shortcutlight == 'true'){
			if($('stefanvdlightareoff1')){
			//control opacity for all <div>
				var div = document.querySelectorAll('div.stefanvdlightareoff');
				for(var i = 0; i < div.length; i++ ){div[i].style.opacity = interval/100;}
			}
			}
		}
		
		if (e.which == 120 && !e.ctrlKey && !e.shiftKey && e.altKey) {
		// Run code for Alt+F9
			// Shortcutlight
			if(shortcutlight == 'true'){
			if($('stefanvdlightareoff1')){
				var F9saving = Math.round(($('stefanvdlightareoff1').style.opacity)*100);
				chrome.extension.sendMessage({'name' : 'readersaveme', 'value' : F9saving});
			}
			}
		}
		
		if (e.which == 38 && !e.ctrlKey && !e.shiftKey && e.altKey) {
		// Run code for Alt+arrow up
			// Shortcutlight
			if(shortcutlight == 'true'){
			if($('stefanvdlightareoff1')){
				var shorcutcurrentopacity = $('stefanvdlightareoff1').style.opacity;
				shorcutcurrentopacity = (shorcutcurrentopacity*100 + 1)/100;
				// if higher then 1, stay 1
				if(shorcutcurrentopacity >= 1) { shorcutcurrentopacity = 1; }
				//control opacity for all <div>
				var div = document.querySelectorAll('div.stefanvdlightareoff');
				for(var i = 0; i < div.length; i++ ){div[i].style.opacity = shorcutcurrentopacity;}
			}
			}
		}

		if (e.which == 40 && !e.ctrlKey && !e.shiftKey && e.altKey) {
		// Run code for Alt+arrow down
			// Shortcutlight
			if(shortcutlight == 'true'){
			if($('stefanvdlightareoff1')){
				var shorcutcurrentopacity = $('stefanvdlightareoff1').style.opacity;
				shorcutcurrentopacity -= 0.01;
				// if zero
				if(shorcutcurrentopacity <= 0) {
					var stefanvdlightareoff1 = $('stefanvdlightareoff1');
					var stefanvdlightareoff2 = $('stefanvdlightareoff2');
					var stefanvdlightareoff3 = $('stefanvdlightareoff3');
					var stefanvdlightareoff4 = $('stefanvdlightareoff4');
					if(stefanvdlightareoff1) {document.body.removeChild(stefanvdlightareoff1);}
					if(stefanvdlightareoff2) {document.body.removeChild(stefanvdlightareoff2);}
					if(stefanvdlightareoff3) {document.body.removeChild(stefanvdlightareoff3);}
					if(stefanvdlightareoff4) {document.body.removeChild(stefanvdlightareoff4);}				
				} else {
				//control opacity for all <div>
				var div = document.querySelectorAll('div.stefanvdlightareoff');
				for(var i = 0; i < div.length; i++ ){div[i].style.opacity = shorcutcurrentopacity;}
				}
			}
			}
		}

		if (e.which == 106 && !e.ctrlKey && !e.shiftKey && e.altKey) {
		// Run code for Alt+*
			// Shortcutlight
			if(shortcutlight == 'true'){
			// all tabs lights off
			chrome.extension.sendMessage({name: 'emergencyalf'});
			}
		}
		
		if (e.which == 121 && !e.ctrlKey && !e.shiftKey && e.altKey) {
		// Run code for Alt+F10
			// Shortcutlight
			if(shortcutlight == 'true'){
				var i18neyedivoff = chrome.i18n.getMessage("eyedivoff");
				var i18neyedivon = chrome.i18n.getMessage("eyedivon");
				var i18ntiteleye = chrome.i18n.getMessage("titeleye");
			
			// enable/disable the "Eye Protection" feature
			if(eyea == 'true'){var eyeoptionvalue = 'false';
			var stefanvdlightseye = $('stefanvdlightseye');
			if(stefanvdlightseye) {document.body.removeChild(stefanvdlightseye);} // remove it
			// create div on top page, and say this is OFF
				var neweyediv = document.createElement('div');
				neweyediv.setAttribute('id','stefanvdlightseye');
				neweyediv.innerHTML = "" + i18ntiteleye + " " + i18neyedivoff + "";
				document.body.appendChild(neweyediv);
				chrome.extension.sendMessage({'name' : 'eyesavemeOFF', 'value' : eyeoptionvalue});
			}
			else{var eyeoptionvalue = 'true';	
			var stefanvdlightseye = $('stefanvdlightseye');
			if(stefanvdlightseye) {document.body.removeChild(stefanvdlightseye);} // remove it
			// create div on top page, and say this is ON
				var neweyediv = document.createElement('div');
				neweyediv.setAttribute('id','stefanvdlightseye');
				neweyediv.innerHTML = "" + i18ntiteleye + " " + i18neyedivon + "";
				document.body.appendChild(neweyediv);
				chrome.extension.sendMessage({'name' : 'eyesavemeON', 'value' : eyeoptionvalue});
			}
			
			// remove div after 3s
			var myVar=setInterval(function(){
				var stefanvdlightseye = $('stefanvdlightseye');
				if(stefanvdlightseye) {document.body.removeChild(stefanvdlightseye);} // remove it
				clearInterval(myVar);
				document.location.reload(true); // reload current web page
			},3000);
			}
		}
		
}, false);
window.addEventListener('keypress', function(e) {
		if (e.which == 116) {
		gogotheater();
		}	
}, false);

if(autoplay == 'true'){

if(autoplayonly == 'true'){
var currenturl = location.protocol + '//' + location.host;
if(typeof autoplayDomains == "string") {
	autoplayDomains = JSON.parse(autoplayDomains);
	var abuf = [];
	for(var domain in autoplayDomains)
		abuf.push(domain);
        abuf.sort();
	for(var i = 0; i < abuf.length; i++)
		if(currenturl == abuf[i]){autoplayfunction();}
    }
} else {autoplayfunction();}

function autoplayfunction(){
var gracePeriod = 250, lastEvent = null, timeout = null;

			function trigger (data) {
				var that = this;
				if (gracePeriod > 0 && (lastEvent === null || String(lastEvent).split(":")[0] === String(data).split(":")[0])) {
					clearTimeout(timeout);
					timeout = setTimeout(function () {dispatch(data);}, gracePeriod);
				} else {
					dispatch(data);
				}
			}
			
			function dispatch (data) {
				if (data !== lastEvent) {
					lastEvent = data;
					data = String(data).split(":");
					switch (data[0]) {
						case "playerStateChange":
							//console.log("received playerStateChange", data[1]);
							if (data[1] === "2" || data[1] === "0" || data[1] === "-1") {
								shadesOff(this.player);
								if (data[1] === "0") {
									try {
									//playerReset(this.player);
									//playerStop(this.player);
									playerPause(this.player);
									} catch(e){};
								}
							} else {
								shadesOn(this.player);
							}
							break;
						default:
							console.log("unknown event", data);
							break;
					}
				}
			}

	function playerPause(player) {
		if (player !== null) {
			if (typeof(player.pauseVideo) === "function") {
				player.pauseVideo();
			} else if (typeof(player.pause) === "function") {
				player.pause();
			}
		}
	}
	function playerReady(player) {
		this.player = player;
		//this.playerPause(player);
		//this.playerReset(player);
	}
	function playerReset(player) {
		if (player !== null) {
			if (typeof(player.seekTo) === "function") {
				player.seekTo(0, false);
			} else if (typeof(player.currentTime) !== "undefined") {
				player.currentTime = 0;
			}
		}
	}
	function playerStop(player) {
		if (player !== null) {
			if (typeof(player.stopVideo) === "function") {
				player.stopVideo();
			} else if (typeof(player.pause) === "function") {
				player.pause();
			}
		}
	}
	function shadesOff(player) {
		if (player !== null) {
		var blackon = $('stefanvdlightareoff1');
			if (blackon) {chrome.extension.sendMessage({name: 'automatic'});}
			else {} // do nothing
		}
	}
	function shadesOn(player) {
		if (player !== null) {
		var blackon = $('stefanvdlightareoff1');
			if (blackon) {} // do nothing
			else {chrome.extension.sendMessage({name: 'automatic'});}			
		}
	}

		// player ready check
		var startautoplay = setInterval(function () {
		try {
			var youtubeplayer = $("movie_player") || null
			var htmlplayer = document.getElementsByTagName("video") || null;
			if (youtubeplayer !== null) { // youtube video element
	   				if (youtubeplayer.pauseVideo) {playerReady(youtubeplayer);}
			} else if (htmlplayer !== null) { // html5 video elements
				for(var j=0; j<htmlplayer.length; j++) {
	   				if (htmlplayer[j].pause) {playerReady(htmlplayer[j]);}
				}
			}
		}
		catch(err) {} // i see nothing, that is good
		},1000); // 1000 refreshing it

		// injected code messaging
		var bodytag = document.getElementsByTagName("body")[0], message = document.createElement("div");
		message.setAttribute("id", "ytCinemaMessage");
		message.style.display = "none";
		bodytag.appendChild(message);
		$(message.id).addEventListener(message.id, function () {
			var eventData = $(message.id).innerText;
			trigger(eventData);
  		});
}

} // option autoplay on end

// easter eggs
function gogotheater(){
if(eastereggs == 'true'){
// here the easter egg => movie theater
	var lightareoff = $('stefanvdlightareoff1');
	if (lightareoff != null) {
		// shortcut key T
		if ($('stefanvdtheater')){}
		else {
		alert(chrome.i18n.getMessage("eastereggsquestion"));
		var newimg = document.createElement('img');
		newimg.setAttribute('id','stefanvdtheater');
		newimg.src = chrome.extension.getURL('/images/theater.jpg');
		newimg.onclick = function() { document.body.removeChild(newimg); };
		document.body.appendChild(newimg);
		}
	}
} // end easter eggs
}

// eye protection
function eyedojob(){

if(ecosaver == 'true'){

document.onmousemove = (function() {
  var onmousestop = function() {
	var blackon = $('stefanvdlightareoff1');
	if(blackon){}else{eyeprotection();}
  }, thread;

  return function() {
    clearTimeout(thread);
    thread = setTimeout(onmousestop, ecosavertime * 1000);
  };
})();

} else {
eyeprotection();
///////
function eyeprotection(){
if(eyea == 'true'){chrome.extension.sendMessage({name: 'automatic'});}
else if(eyealist == 'true'){
var currenturl = location.protocol + '//' + location.host;
if(typeof excludedDomains == "string") {
	excludedDomains = JSON.parse(excludedDomains);
	var buf = [];
	for(var domain in excludedDomains)
		buf.push(domain);
        buf.sort();
	for(var i = 0; i < buf.length; i++)
		if(currenturl == buf[i]){chrome.extension.sendMessage({name: 'automatic'});}
    }
}
}
///////
}

}

// night time
if(nighttime == 'true'){ // yes night time
var now = new Date();var hours = now.getHours();var minutes = now.getMinutes();var gettime = hours + ":" + minutes;
var gettimesecond = gettime.split(":")[0] * 3600 + gettime.split(":")[1] * 60;

var time1 = begintime;var time2 = endtime;
var seconds1 = time1.split(":")[0] * 3600 + time1.split(":")[1] * 60;
var seconds2 = time2.split(":")[0] * 3600 + time2.split(":")[1] * 60;

// example
// if begintime set 10:00 but endtime is 18:00
// then do this
if(seconds1 <= seconds2){ // default for user
if((seconds1 <= gettimesecond) && (gettimesecond <= seconds2)){eyedojob();}
}
// example
else if (seconds1 > seconds2){
var getotherdaypart = 86400; // ... to 24:00 end
var getothernightpart = 0; // start from 0:00 to seconds2 (example 11:00) 

if((seconds1 <= gettimesecond) && (gettimesecond <= getotherdaypart)){ // 13 -> 24
eyedojob();
} else if((getothernightpart <= gettimesecond) && (gettimesecond <= seconds2)){ // 0 -> 11
eyedojob();
}
}


}
else{eyedojob();} // no night time

// context menu
if(contextmenus == 'true'){chrome.extension.sendMessage({name: 'contextmenuon'});}
else {chrome.extension.sendMessage({name: 'contextmenuoff'});}

// ambilight time
if(ambilight == 'true'){

if(atmosphereonly == 'true'){
var currenturl = location.protocol + '//' + location.host;
if(typeof atmosphereDomains == "string") {
	atmosphereDomains = JSON.parse(atmosphereDomains);
	var albuf = [];
	for(var domain in atmosphereDomains)
		albuf.push(domain);
        albuf.sort();
	for(var i = 0; i < albuf.length; i++)
		if(currenturl == albuf[i]){ambilightfunction();}
    }
} else {ambilightfunction();}

function ambilightfunction(){
		// yes show time
		var startambilight = setInterval(function () {
		try {
		var htmlplayer = document.getElementsByTagName("video") || null;
		var playerid = null, item = null;
		for(var j=0; j<htmlplayer.length; j++) {
			if (htmlplayer[j].play){playerid = htmlplayer[j]; item = j + 1; drawImage(playerid, item);}
		}
		
		// YouTube flash detect play
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		var yttest = $("movie_player"); item = 1;
		
		/* temp fix watch7-video */
		var watch7video = $('watch7-video');
		if(watch7video)$('watch7-video').style.zIndex = 'auto';
		
		var playerapi = $('player-api');
		if(playerapi){$('player-api').style.overflow = 'visible';$('player-api').style.zIndex = 1000;$('player-api').style.visibility = 'visible';$('player-api').style.position = 'relative';}

		div = document.getElementsByTagName('div'); 
		for(var i = 0; i < div.length; i++ )
		{if(div[i].className == ('html5-video-player')) {div[i].style.overflow = 'visible';}}
		
		// fix 16 augustus 2013
		var playerapilegacy = $('player-api-legacy');
		if(playerapilegacy)$('player-api-legacy').style.overflow = 'visible';

		
		var youtubewatchplayershadow = $("watch-player"); // YouTube video page
		if(youtubewatchplayershadow){ youtubewatchplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubevideoplayershadow = $("video-player"); // YouTube video page
		if(youtubevideoplayershadow){ youtubevideoplayershadow.style.overflow = "visible"; } // show the overflow out the video element
		var youtubewatchvideoshadow = $("watch-video"); // YouTube video page
		if(youtubewatchvideoshadow){ youtubewatchvideoshadow.style.overflow = "visible"; } // show the overflow out the video element	
		var youtubewindow = $("watch-player") || $("watch7-player") || $("player-api");
		if(youtubewindow){youtubewindow.style.zIndex = 1000;}
		var youtubemovieplayer = $("movie_player"); // YouTube video page
		if(youtubemovieplayer){ youtubemovieplayer.style.overflow = "visible"; youtubemovieplayer.style.zIndex = 1000; } // show the overflow out the video element
		
		if(yttest){
		if ($("movie_player").getPlayerState() == 1) {drawImage(youtubewindow, item);}
		else { drawImage(youtubewindow, item); }
		}
		}
		
		}
		catch(err) {} // i see nothing, that is good
		},20); // 20 refreshing it

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
function drawImage(playerid, item){
try {
	if(playerid.paused || playerid.ended || $("movie_player").getPlayerState() == 0 || $("movie_player").getPlayerState() == 2){
	// animation go out
	countA=countA-1;if (countA <= 0){countA=0;}
	countB=countB-1;if (countB <= 0){countB=0;}
	countC=countC-1;if (countC <= 0){countC=0;}
	var textcountA = countA + "px";
	var textcountB = countB + "px";
	
var k = item;
	if(typeof k == "undefined") {
	return
	}
var canvas = $("totlCanvas" + k + "");
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
	// ----

	if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){
		// var youtubewindow = $("watch-player") || $("watch7-player") || $("player-api");
		var youtubewindow = $("movie_player");
		if(ambilightvarcolor == 'true'){
			if(typeof downhex1 != "undefined" || typeof downhex2 != "undefined" || typeof downhex3 != "undefined" || typeof downhex4 != "undefined"){
				try{
				youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + downhex3 + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + downhex1 + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + downhex2 + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + downhex4 + "";
				}catch(e){}
			}
			else{
				youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + "";
			}
		}
		else if(ambilightfixcolor == 'true'){
		youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + "";
		}
		else if(ambilight4color == 'true'){
		youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilight1colorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilight2colorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight3colorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight4colorhex + "";
		}
	}else{
		if(ambilightvarcolor == 'true'){
		playerid.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + downhex3 + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + downhex1 + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + downhex2 + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + downhex4 + ""; 
		}
		else if(ambilightfixcolor == 'true'){
		playerid.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + "";
		}
		else if(ambilight4color == 'true'){
		playerid.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilight1colorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilight2colorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight3colorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight4colorhex + "";
		}
	}
	
	return false;}
}catch(err) {}

try {
	var k = item;
	if(typeof k == "undefined") {
	return
	}
}catch(err) {}

    var totlshowtime = playerid;
	// var youtubewindow = $("watch-player") || $("watch7-player") || $("player-api");
	var youtubewindow = $("movie_player");
	var getblur = ambilightrangeblurradius + "px";
	var getspread = ambilightrangespreadradius + "px";
	
	// animate out and in
	if (countA < ambilightrangespreadradius){countA=countA+1;}
	if (countB < ambilightrangeblurradius){countB=countB+1;}
	if (countC < 20){countC=countC+.5;}
	var textcountA = countA + "px";
	var textcountB = countB + "px";
	
	if(ambilightvarcolor == 'true'){
	// Cross detection
	// if url is the same as the video source
	// then posible to play real ambilight
	var cross = null;
	
	// check for the current page URL
	var pageurl = location.protocol + '//' + location.host; // http://www.stefanvd.net
	var pageurllengt = pageurl.length; // lengte url

	function subDomain(url) {
	// IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
	url = url.replace(new RegExp(/^\s+/),""); // START
	url = url.replace(new RegExp(/\s+$/),""); // END
	// IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
	url = url.replace(new RegExp(/\\/g),"/");
	// IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
	url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i),"");
	// IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
	url = url.replace(new RegExp(/^www\./i),"");
	// REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
	url = url.replace(new RegExp(/\/(.*)/),"");
	// REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
	if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
		url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i),"");
	// REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
	} else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
		url = url.replace(new RegExp(/\.[a-z]{2,4}$/i),"");
	} 
	// CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
	var subDomain = (url.match(new RegExp(/\./g))) ? true : false;

	return(subDomain);
	}
	var yesornosubdomain = subDomain(pageurl);

	if (totlshowtime != typeof HTMLVideoElement !== "undefined" && totlshowtime instanceof HTMLVideoElement) {
		var insideitem = totlshowtime.src;
		var insideitemlengt = 0;
		if(insideitem){	var insideitemlengt = insideitem.length; } // lengte url
	} else { var insideitemlengt = "undefined"; }

	// mission controll
	if((insideitemlengt == 0) && (yesornosubdomain == false)){
		// check for video -> source URL
		var items = totlshowtime.getElementsByTagName("source");
		for(var i= 0; i < 1; i++){ // 1 source needed
			cross = items[i].getAttribute('src');
		}
		if(cross.substring(0, pageurllengt) == pageurl) {runreal();}
		else if(cross.substring(0, 2) == './') {runreal();}
		else if(cross.substring(0, 3) == '../') {runreal();}
		else if((cross.substring(0, 4) != 'http') && (cross.substring(0, 5) != 'https') && (cross.substring(0, 3) != 'ftp')) {runreal();}
		else {rundefault();}
	} else if ((insideitemlengt > 0) && (yesornosubdomain == false)) {
		if(insideitem.substring(0, pageurllengt) == pageurl) {runreal();}
		else if(insideitem.substring(0, 2) == './') {runreal();}
		else if(insideitem.substring(0, 3) == '../') {runreal();}
		else if((insideitem.substring(0, 4) != 'http') && (insideitem.substring(0, 5) != 'https') && (insideitem.substring(0, 3) != 'ftp')) {runreal();}
		else {rundefault();}
	} else {rundefault();}

function runreal(){
    var sourceWidth = totlshowtime.videoWidth;
    var sourceHeight = totlshowtime.videoHeight;
	
	var totlcheckcanvas = $("totlCanvas" + k + "");
	if(totlcheckcanvas){} else{
 	var totlnewcanvas = document.createElement("canvas");
	totlnewcanvas.setAttribute('id','totlCanvas' + k + '');
	totlnewcanvas.width = "4";
	totlnewcanvas.height = "1";
	totlnewcanvas.style.display = "none";
	document.body.appendChild(totlnewcanvas);
	}
	
var canvas = $("totlCanvas" + k + "");
var context = canvas.getContext('2d');

var colorlamp1X = (sourceWidth * 50) /100; // up midden
var colorlamp1Y = (sourceHeight * 95) /100;
var colorlamp2X = (sourceWidth * 95) /100; // right midden
var colorlamp2Y = (sourceHeight * 50) /100;
var colorlamp3X = (sourceWidth * 50) /100; // down midden
var colorlamp3Y = (sourceHeight * 5) /100;
var colorlamp4X = (sourceWidth * 5) /100; // left midden
var colorlamp4Y = (sourceHeight * 50) /100;

	context.drawImage(totlshowtime, colorlamp1X, colorlamp1Y, 1, 1, 0, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp2X, colorlamp2Y, 1, 1, 1, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp3X, colorlamp3Y, 1, 1, 2, 0, 1, 1);
	context.drawImage(totlshowtime, colorlamp4X, colorlamp4Y, 1, 1, 3, 0, 1, 1);

try{
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

	if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){ youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + hex3 + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + hex1 + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + hex2 + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + hex4 + ""; }
	else { totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + hex3 + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + hex1 + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + hex2 + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + hex4 + ""; }
}catch(e) {rundefault();}
}

		// if catch error in URL
		function rundefault(){
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){ youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ""; }
		else { totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ""; }
		}
	} else if(ambilightfixcolor == 'true'){
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){ youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ""; }
		else { totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilightcolorhex + ""; }
	} else if (ambilight4color == 'true'){
		if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){ youtubewindow.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilight1colorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilight2colorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight3colorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight4colorhex + ""; }
		else { totlshowtime.style.boxShadow = "0px 0px 5px black , 0px -" + countC + "px " + textcountB + " " + textcountA + " " + ambilight1colorhex + ", 0px " + countC + "px " + textcountB + " " + textcountA + " " + ambilight2colorhex + ", " + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight3colorhex + ", -" + countC + "px 0px " + textcountB + " " + textcountA + " " + ambilight4colorhex + ""; }
	}
	
	window.requestAnimFrame(drawImage);	
}
}


}

// YouTube auto width the video player content
// URL control for YouTube only
if (window.location.href.match(/((http:\/\/(.*youtube\.com\/.*))|(https:\/\/(.*youtube\.com\/.*)))/i)){

if (autowidthyoutube == 'true'){
var yt = yt;
yt = yt || {};
yt.playerConfig = {"player_wide": 1};
document.cookie = "wide=1; domain=.youtube.com";
function $(a) {return document.getElementById(a);}
// $("watch7-container").className = "watch-wide";
// with playlist hide
$("watch7-container").className = "watch-wide watch-playlist-collapsed";
}

if (customqualityyoutube == 'true') {
var mplayer = undefined; //see http://code.google.com/apis/youtube/flash_api_reference.html#setPlaybackQuality
//one of "highres", "hd1080", "hd720", "large", "medium", "small" or "default" to let youtube pick
var count = 0;
mplayer = document.getElementById('movie_player') ||
                    document.getElementById('movie_player-flash') ||
                    document.getElementById('movie_player-html5') ||
                    document.getElementById('movie_player-html5-flash');
function waitForYT() {
    count++;
    if( count > 10 ) { return; }
    if( !mplayer ) {
        count++;
        window.setTimeout(waitForYT, 100 );
        return;
    }
    if( typeof mplayer.getPlaybackQuality == "function" )
    {
        changeQuality();
    }
    else
    {
        window.setTimeout(waitForYT, 100 );
    }
}
function changeQuality() { mplayer.setPlaybackQuality(maxquality); }
waitForYT();
}

} // end check youtube.com website
});
/*
YouTube(TM) Ratings Preview
Copyright (C) 2013 Cristian Perez - cpr@cpr.name - http://cpr.name

YouTube(TM) Ratings Preview is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or at your option any later version.

YouTube(TM) Ratings Preview is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with YouTube(TM) Ratings Preview. If not, see <http://www.gnu.org/licenses/>.
*/

// NOTIFY INJECTION //////////////////////////////////////////////////////////////////////////////

chrome.extension.sendMessage({name:"injectionDone"});

// STYLESHEET ////////////////////////////////////////////////////////////////////////////////////

// Retrieve the thickness of the bars and apply it
chrome.extension.sendMessage({name:"storage_get_thickness"}, function(value)
{
	if (value != 4)
	{
		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		var css = document.createTextNode(getBarThicknessCSS(value));
		style.appendChild(css);
		document.getElementsByTagName('head')[0].appendChild(style);
	}
});

// MAIN SCRIPT ///////////////////////////////////////////////////////////////////////////////////

// Variable indicating if the first successful retrieval of the videos has been done
var firstRetrievalDone = false;

// Timer used for setting and clearing timeouts, and current timeout in ms
var timer;
var timeout = 100;

// Hashtable holding for every video id, an array of:
// An array of the html clip or clips [0], views [1], likes [2], dislikes [3], totalScore [4], highlight [5]
// Note that [0] is also an array, because sometimes the same video appears in two html clips
var hashtable = {};

// Retrieve the maximum videos that will be highlighted for future use
var highlightedVideos = 0; 
chrome.extension.sendMessage({name:"storage_get_highlighted"}, function(value)
{
	highlightedVideos = value;
});

// ENTRY POINT
showMainBar();
showBars();

// Re-start detecting bars, for use in case new videos could have appeared on the page
function reShowBars()
{
	clearTimeout(timer);
	timeout = 100;
	timer = setTimeout(function() { showBars(); }, timeout);
};

// reShowBars() after a click event, when new content could be loaded
document.onclick = reShowBars;

// reShowBars() when new content could be loaded due to scrolling down to the bottom of the page
var lastScrollHeight = undefined;
window.onscroll = function()
{
	if (lastScrollHeight != undefined && document.documentElement.scrollHeight > lastScrollHeight)
	{
		reShowBars(); // Page height has increased, reShowBars()
		window.onscroll = null; // Do it only once (new content due to scrolling down is only loaded once)
	}
	else
	{
		lastScrollHeight = document.documentElement.scrollHeight;
	}
}

// But avoid reShowBars() when we are leaving the page
window.onbeforeunload = function()
{
	clearTimeout(timer);
};

// Show the main video bar
function showMainBar()
{
	try
	{
		var views = parseInt(document.getElementsByClassName("watch-view-count")[0].textContent.replace(/\D/g, ""));
		var likes = parseInt(document.getElementsByClassName("likes-count")[0].textContent.replace(/\D/g, ""));
		var dislikes = parseInt(document.getElementsByClassName("dislikes-count")[0].textContent.replace(/\D/g, ""));
		var total = likes + dislikes;
		if (total > 0)
		{
			var score = totalScore(views, likes, dislikes);
			var sparkbars = document.getElementsByClassName("video-extras-sparkbars");
			for (var i = 0; i < sparkbars.length; i++)
			{
				sparkbars[i].setAttribute("title", (Math.round((likes / total) * 10000) / 100) + "% likes (" + ts(total) + " ratings)\x0AYTRP score: " + (Math.round(score * 100) / 100));
			}
			if (dislikes == 0)
			{
				var sparkbarlikes = document.getElementsByClassName("video-extras-sparkbar-likes");
				for (var i = 0; i < sparkbarlikes.length; i++)
				{
					sparkbarlikes[i].setAttribute("style", sparkbarlikes[i].getAttribute("style") + "; margin-left: 0 !important;");
				}
			}
		}
		else
		{
			var sparkbars = document.getElementsByClassName("video-extras-sparkbars");
			for (var i = 0; i < sparkbars.length; i++)
			{
				sparkbars[i].setAttribute("title", "No ratings");
			}
		}
	}
	catch (err)
	{
		// Not on a video page or could not retrieve current video data
	}
}

// Show all the bars that need to be shown
function showBars()
{
	// Save current hashtable length in order to only ask data for the new ones in the future
	var previousHashtableLength = Object.keys(hashtable).length;

	// Fill the hashtable with the videos found in the page, checking only for previous bars if not the first time
	var retrievedCount = retrievePageVideos(firstRetrievalDone);
	
	// If there were retrieved videos, make request
	if (retrievedCount > 0)
	{
		// Mark first successful retrieval as done
		firstRetrievalDone = true;
		
		// Get just the ids of the new videos of the hashtable
		var _ids = Object.keys(hashtable);
		var ids = [];
		for (var i = previousHashtableLength; i < _ids.length; i++)
		{
			ids.push(_ids[i]);
		}
	
		// Send a message to fetch videos info from YouTube's API to the background script
		chrome.extension.sendMessage({name:"getVideosData", message:ids}, onMessageResponse);
	}
	else
	{
		// Retry after the timeout (and increment timeout for next time) if less than 20 secs retrying
		if (timeout < 2000) // 2000 millisecond timeout results in about 20 seconds (see Algorithms.xlsx)
		{
			clearTimeout(timer);
			timer = setTimeout(function() { showBars(); }, timeout *= 1.1);
			//DEBUG: Insert a dot in the title per retrieval retry
			//document.title = "." + document.title;
		}
	}
}

// Receive the videos info
function onMessageResponse(ht)
{
	// Fill the hashtable with the ht data (which is another hashtable with just views, likes and dislikes) and the computed score, plus highlight initially set to false
	var ids = Object.keys(ht);
	for (var i = 0; i < ids.length; i++)
	{
		if (ids[i] in hashtable)
		{
			var score = totalScore(ht[ids[i]][0], ht[ids[i]][1], ht[ids[i]][2]);
			hashtable[ids[i]] = [hashtable[ids[i]][0], ht[ids[i]][0], ht[ids[i]][1], ht[ids[i]][2], score, false];
		}
	}
	
	// Mark videos to be highlighted
	markHighlighted();

	// Try to attach all retrieved bars
	var success = attachBars(ids);
	
	// If successful, notify the background script about it
	if (success)
	{	
		chrome.extension.sendMessage({name:"wasSuccessful"});
	}
	else
	{
		// Could be overlapping requests or exceeded API quota, don't do anything
	}
}

// Find all html clips and their video id and save the correct ones in the hashtable. If check == true, check if the rating bar is currently attached and only retrieve that video if not. It returns the amout of html clips returned, which can be more than the hashtable keys due to video duplicities in page.
function retrievePageVideos(check)
{
	// Save current hashtable length in order to calculate the new clips in the future
	var previousHashtableLength = Object.keys(hashtable).length;

	// Get all the html clips
	clips = document.getElementsByClassName("video-thumb");
	
	// For each one, check if the rating bar is not currently attached, and get the related video id
	var anchor;
	var href;
	var params;
	var found;
	var id;
	for (var i = 0; i < clips.length; i++)
	{
		try
		{
			// Check if the rating bar is not currently attached
			if (check)
			{
				var childDivs = clips[i].getElementsByTagName("div");
				for (var j = 0; j < childDivs.length; j++)
				{
					if (childDivs[j].getAttribute("class").indexOf("ytrp_rb_bg") != -1)
					{
						throw "Video has the rating bar currently attached, video omitted";
					}
				}
			}
			
			// Check if the clip is not visible (in that case for some reason the rating bar cannot be attached)
			if (!isVisible(clips[i]))
			{
				throw "Video is not visible, video omitted";
			}
			
			// Check if the clip is too small in size (like the tiny thumbnails for playlists)
			if (clips[i].offsetWidth && clips[i].offsetWidth < 80)
			{
				throw "Video is too small in size, video omitted";
			}
			
			// Find link to video
			if (clips[i].parentNode.parentNode.tagName.toLowerCase() == "a") // Link to video is in parent^2 node (most probable)
			{
				anchor = clips[i].parentNode.parentNode;
			}
			else if (clips[i].parentNode.tagName.toLowerCase() == "a") // Link to video is in parent node (very probable)
			{
				anchor = clips[i].parentNode;
			}
			else if (clips[i].tagName.toLowerCase() == "a") // Link to video is in current node
			{
				anchor = clips[i];
			}
			else if (clips[i].parentNode.parentNode.parentNode.tagName.toLowerCase() == "a") // Link to video is in parent^3 node
			{
				anchor = clips[i].parentNode.parentNode.parentNode;
			}
			else if (clips[i].parentNode.parentNode.parentNode.parentNode.tagName.toLowerCase() == "a") // Link to video is in parent^4 node
			{
				anchor = clips[i].parentNode.parentNode.parentNode.parentNode;
			}
			else if (clips[i].parentNode.parentNode.parentNode.parentNode.parentNode.tagName.toLowerCase() == "a") // Link to video is in parent^5 node
			{
				anchor = clips[i].parentNode.parentNode.parentNode.parentNode.parentNode;
			}
			else // Link to video not found in parents, maybe we are in a playlist, try in all the node tree after the clip
			{
				var node = clips[i];
				var maxSteps = 50;
				while ((!node.tagName || node.tagName.toLowerCase() != "a") && maxSteps > 0)
				{
					if (node.firstChild)
					{
						node = node.firstChild;
					}
					else if (node.nextSibling)
					{
						node = node.nextSibling;
					}
					else
					{
						node = node.parentNode;
						// Avoid current or previously analyzed parents to avoid infinite loops
						while (!node.nextSibling)
						{
							node = node.parentNode; 
						}
						node = node.nextSibling;
					}
					maxSteps--;
				}
				if (node.tagName && node.tagName.toLowerCase() == "a")
				{
					anchor = node;
				}
				else
				{
					throw "Could not retrieve link of the video in order to search video id, video omitted";
				}
			}
			
			// Extract video id from link
			href = anchor.getAttribute("href");
			params = (href.split("?")[1]).split("&");
			found = false;
			for (var j = 0; j < params.length; j++)
			{
				if (params[j].substr(0, 2).toLowerCase() == "v=")
				{
					id = params[j].substr(2);
					if (id.length == 11) // ids must be 11 chars length
					{
						found = true;
					}
				}
			}
			
			if (found)
			{
				// Video correctly retrieved, save it in the hashtable if it does not currently exist or add it
				if (!(id in hashtable))
				{
					hashtable[id] = [[clips[i]]];
				}
				else
				{
					hashtable[id][0].push(clips[i]);
					// If the added clip corresponds to a video whose data was previously retrieved, show the bar directly
					if (hashtable[id].length == 6)
					{
						try
						{
							attachBar(clips[i], hashtable[id][1], hashtable[id][2], hashtable[id][3], hashtable[id][4], hashtable[id][5])
						}
						catch (_err)
						{
							throw "Could not add bar to a repited video whose data was previously retrieved";
						}
					}
				}
			}
			else
			{				
				throw "Could not retrieve video id from the retrieved link of the video, video omitted";
			}
		}
		catch (err)
		{
			// Video omitted, try next video
		}
	}
	
	// Count clips and return value
	var clipCount = 0;
	var ids = Object.keys(hashtable);
	for (var i = previousHashtableLength; i < ids.length; i++)
	{
		clipCount += hashtable[ids[i]][0].length;
	}
	return clipCount;
}

// Attaches the rating bar to all the clips with the given ids. Returns true if at least one bar was attached.
function attachBars(ids)
{
	var success = false;
	for (var i = 0; i < ids.length; i++)
	{
		try
		{
			if (ids[i] in hashtable && hashtable[ids[i]].length == 6)
			{
				for (var j = 0; j < hashtable[ids[i]][0].length; j++)
				{
					try
					{
						attachBar(hashtable[ids[i]][0][j], hashtable[ids[i]][1], hashtable[ids[i]][2], hashtable[ids[i]][3], hashtable[ids[i]][4], hashtable[ids[i]][5]);
						success = true;
					}
					catch (_err)
					{
						// Could not attach bar to video
					}
				}
			}
			else
			{
				// Could not attach bar to video or videos due to data lack
			}
		}
		catch (err)
		{
			// Could not attach bar to video or videos
		}
	}
	return success;
}

// Attaches the rating bar to the clip
function attachBar(clip, views, likes, dislikes, score, hl)
{
	var total = likes + dislikes;
	var totalWidth = clip.offsetWidth;
	
	if (totalWidth > 0)
	{
		if (hl)
		{
			// If the video should BE highlighted, add highlight bars
			
			var ratingDiv1 = document.createElement("div");
			var ratingDiv2 = document.createElement("div");
			var ratingDiv3 = document.createElement("div");
			var ratingDiv4 = document.createElement("div");
			ratingDiv1.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_bottom");
			if (total > 0)
			{
				ratingDiv1.setAttribute("title", (Math.round((likes / total) * 10000) / 100) + "% likes (" + ts(total) + " ratings)\x0AYTRP score: " + (Math.round(score * 100) / 100));
			}
			else
			{
				ratingDiv1.setAttribute("title", "No ratings");
			}
			ratingDiv2.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_top");
			ratingDiv3.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_left");
			ratingDiv4.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_right");
			
			innerDiv1 = document.createElement("div");
			innerDiv2 = document.createElement("div");
			innerDiv3 = document.createElement("div");
			innerDiv4 = document.createElement("div");
			innerDiv1.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_bottom");
			innerDiv2.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_top");
			innerDiv3.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_left");
			innerDiv4.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_hl ytrp_rb_fg_hl_right");
			ratingDiv1.appendChild(innerDiv1);
			ratingDiv2.appendChild(innerDiv2);
			ratingDiv3.appendChild(innerDiv3);
			ratingDiv4.appendChild(innerDiv4);
			
			clip.appendChild(ratingDiv1);
			clip.appendChild(ratingDiv2);
			clip.appendChild(ratingDiv3);
			clip.appendChild(ratingDiv4);
		}
		else
		{
			// If the video should NOT be highlighted, add normal bars
			
			var likesWidth = 0;
			var dislikesWidth = 0;
			if (total > 0)
			{
				if (likes >= dislikes)
				{
					likesWidth = Math.floor((likes / total) * totalWidth);
					dislikesWidth = Math.ceil((dislikes / total) * totalWidth);
				}
				else
				{
					likesWidth = Math.ceil((likes / total) * totalWidth);
					dislikesWidth = Math.floor((dislikes / total) * totalWidth);
				}
			}

			// Keep spacing between bars
			if (likesWidth > 0 && dislikesWidth > 0)
			{
				if (likesWidth >= dislikesWidth)
				{
					likesWidth -= 1;
				}
				else
				{
					dislikesWidth -= 1;
				}
			}
			
			var ratingDiv = document.createElement("div");
			ratingDiv.setAttribute("class", "ytrp_rb_bg ytrp_rb_bg_bottom");
			if (total > 0)
			{
				ratingDiv.setAttribute("title", (Math.round((likes / total) * 10000) / 100) + "% likes (" + ts(total) + " ratings)\x0AYTRP score: " + (Math.round(score * 100) / 100));
			}
			else
			{
				ratingDiv.setAttribute("title", "No ratings");
			}

			if (total > 0)
			{
				if (likesWidth > 0)
				{
					var likesDiv = document.createElement("div");
					likesDiv.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_like");
					likesDiv.setAttribute("style", "width: " + likesWidth + "px;");
					ratingDiv.appendChild(likesDiv);
				}
				if (dislikesWidth > 0)
				{
					var dislikesDiv = document.createElement("div");
					dislikesDiv.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_dislike");
					dislikesDiv.setAttribute("style", "width: " + dislikesWidth + "px;");
					ratingDiv.appendChild(dislikesDiv);
				}
			}
			else
			{
				var noRatingsDiv = document.createElement("div");
				noRatingsDiv.setAttribute("class", "ytrp_rb_fg ytrp_rb_fg_norating");
				ratingDiv.appendChild(noRatingsDiv);
			}
			
			clip.appendChild(ratingDiv);
		}
	}
	else
	{
		throw "Could not attach bar to video because of undefined html element width"
	}
}

// Sets the highlight boolean variable to true to the required videos in the hashtable
function markHighlighted()
{
	if (highlightedVideos > 0)
	{
		// Get all the scores into an array and sort it (descending)
		var allScores = [];
		var ids = Object.keys(hashtable);
		for (var i = 0; i < ids.length; i++)
		{
			if (hashtable[ids[i]].length == 6)
			{
				allScores.push({id : ids[i], score : hashtable[ids[i]][4]}); 
			}
		}
		allScores.sort(function(a, b) {
			return b.score - a.score;
		});
		
		// Take the first "highlightedVideos" scores and set those videos to be highlighted
		for (var i = 0; i < highlightedVideos && i < allScores.length; i++)
		{
			hashtable[allScores[i].id][5] = true;
		}
	}
}

// UTILS FUNCTIONS ///////////////////////////////////////////////////////////////////////////////

// Formats the number with thousand separators
function ts(v)
{
	var val = v.toString();
	var result = "";
	var len = val.length;
	while (len > 3)
	{
		result = "," + val.substr(len - 3, 3) + result;
		len -= 3;
	}
	return val.substr(0, len) + result;
}

// Returns if an html element is visible, checking a variety of things
function isVisible(obj)
{
	if (obj == document) return true;
	
	if (!obj) return false;
	if (!obj.parentNode) return false;
	if (obj.style)
	{
		if (obj.style.display == 'none') return false;
		if (obj.style.visibility == 'hidden') return false;
	}
	
	if (window.getComputedStyle)
	{
		var style = window.getComputedStyle(obj, "");
		if (style.display == 'none') return false;
		if (style.visibility == 'hidden') return false;
	}
	
	return isVisible(obj.parentNode);
}

// Computes the total score of a video based on an inteligent algorithm
function totalScore(views, likes, dislikes)
{
	var votes = likes + dislikes;
	
	if (votes > 0 && views > 0)
	{
		var likesPer1 = (likes / votes);
		
		var likesScore = likesPer1 * 10 * Math.min(Math.log(votes) / Math.log(100), 1) + 5 * (1 - Math.min(Math.log(votes) / Math.log(100), 1));
	
		var viewsScore = Math.min(Math.log(views) / Math.log(1000000000), 1) * 10;
		
		var votesScore = Math.max(10 - (votes / views) * 100, 0);
		
		var totalScore = Math.min(likesScore * 0.8 + viewsScore * 0.125 + votesScore * 0.125, 10);
		
		return totalScore;
	}
	else
	{
		return 0;
	}
}

// Gets the CSS text corresponding to the new bar thickness
function getBarThicknessCSS(newValue)
{
    function addRuleToCSS(_class, _element, _value, _css)
    {
        return _css + "\n" + _class + " { " + _element + ": " + _value + "; }\n";
    }

    var css = "";
    newValue = parseInt(newValue); //otherwise is considered a string
    css = addRuleToCSS(".ytrp_rb_bg_bottom", "height", newValue + "px", css);
    css = addRuleToCSS(".ytrp_rb_bg_top", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_left", "top", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_left", "bottom", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_left", "width", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_right", "top", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_right", "bottom", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_bg_right", "width", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_like", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_dislike", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_norating", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_bottom", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_top", "height", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_left", "width", newValue + "px", css);
	css = addRuleToCSS(".ytrp_rb_fg_hl_right", "width", newValue + "px", css);
	css = addRuleToCSS(".video-extras-sparkbars", "height", newValue + "px !important", css);
	css = addRuleToCSS(".video-extras-sparkbar-likes", "height", newValue + "px !important", css);
	css = addRuleToCSS(".video-extras-sparkbar-dislikes", "height", newValue + "px !important", css);
	css = addRuleToCSS(".video-time", "bottom", (newValue+2) + "px !important", css);
	css = addRuleToCSS(".video-actions", "bottom", (newValue+2) + "px !important", css);
	return css;
}

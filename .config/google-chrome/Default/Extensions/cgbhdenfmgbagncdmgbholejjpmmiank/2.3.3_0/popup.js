/*
YouTube(TM) Ratings Preview
Copyright (C) 2013 Cristian Perez - cpr@cpr.name - http://cpr.name

YouTube(TM) Ratings Preview is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or at your option any later version.

YouTube(TM) Ratings Preview is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with YouTube(TM) Ratings Preview. If not, see <http://www.gnu.org/licenses/>.
*/

function updateThickness()
{
	var newValue = document.getElementById('range_thickness').value;
	document.getElementById('label_thickness').textContent = newValue + ' pixels';
	updateBarThickness(newValue);
	chrome.extension.sendMessage({name:"storage_set_thickness", message:newValue});
}

function updateHighlighted()
{
	var newValue = document.getElementById('range_highlighted').value;
	if (newValue == 0)
	{
		document.getElementById('label_highlighted').textContent = 'Disabled';
	}
	else if (newValue == 1)
	{
		document.getElementById('label_highlighted').textContent = '1 video';
	}
	else
	{
		document.getElementById('label_highlighted').textContent = newValue + ' videos';
	}
	chrome.extension.sendMessage({name:"storage_set_highlighted", message:newValue});
}

function updateCaching()
{
	var newValue = document.getElementById('range_caching').value;
	var text = "Disabled";
	if (newValue == 1)
	{
		text = "5 minutes";
	}
	else if (newValue == 2)
	{
		text = "30 minutes";
	}
	else if (newValue == 3)
	{
		text = "1 hour";
	}
	else if (newValue == 4)
	{
		text = "2 hours";
	}
	else if (newValue == 5)
	{
		text = "6 hours";
	}
	else if (newValue == 6)
	{
		text = "12 hours";
	}
	else if (newValue == 7)
	{
		text = "24 hours";
	}
	document.getElementById('label_caching').textContent = text;
	chrome.extension.sendMessage({name:"storage_set_caching", message:newValue});
}

function updateShowPageIcon()
{
	var newValue = document.getElementById('checkbox_showpageicon').checked;
	chrome.extension.sendMessage({name:"storage_set_showpageicon", message:newValue});
}

document.addEventListener('DOMContentLoaded', function()
{
	document.getElementById('range_thickness').addEventListener('change', updateThickness);
	document.getElementById('range_highlighted').addEventListener('change', updateHighlighted);
	document.getElementById('range_caching').addEventListener('change', updateCaching);
	document.getElementById('checkbox_showpageicon').addEventListener('change', updateShowPageIcon);
	
	chrome.extension.sendMessage({name:"storage_get_thickness"}, function(value)
	{
		document.getElementById('range_thickness').value = value;
		updateThickness();
	});
	chrome.extension.sendMessage({name:"storage_get_highlighted"}, function(value)
	{
		document.getElementById('range_highlighted').value = value;
		updateHighlighted();
	});
	chrome.extension.sendMessage({name:"storage_get_caching"}, function(value)
	{
		document.getElementById('range_caching').value = value;
		updateCaching();
	});
	chrome.extension.sendMessage({name:"storage_get_showpageicon"}, function(value)
	{
		if (value == "true")
		{
			document.getElementById('checkbox_showpageicon').checked = true;
		}
		else
		{
			document.getElementById('checkbox_showpageicon').checked = false;
		}
		updateShowPageIcon();
	});
	
	document.getElementById('label_donate').addEventListener('mouseover', function()
	{
		this.style.textDecoration = 'underline';
	});
	document.getElementById('label_donate').addEventListener('mouseout', function()
	{
		this.style.textDecoration = 'none';
	});
	document.getElementById('label_donate').addEventListener('click', function()
	{
		chrome.extension.sendMessage({name:"clickedSupportLink"});
	});
});

var css = undefined;

function updateBarThickness(newValue)
{
    if (css == undefined)
    {
    	var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        css = document.createTextNode(getBarThicknessCSS(newValue));
        style.appendChild(css);
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    else
    {
        css.textContent = getBarThicknessCSS(newValue);
    }
}

function getBarThicknessCSS(newValue)
{
    function addRuleToCSS(_class, _element, _value, _css)
    {
        return _css + "\n" + _class + " { " + _element + ": " + _value + "; }\n";
    }

    var css = "";
    newValue = parseInt(newValue); //otherwise it is considered a string
    css = addRuleToCSS(".ytrp_rb_bg_bottom", "height", newValue + "px", css);
    css = addRuleToCSS(".ytrp_rb_fg_like", "height", newValue + "px", css);
    css = addRuleToCSS(".ytrp_rb_fg_dislike", "height", newValue + "px", css);
	return css;
}

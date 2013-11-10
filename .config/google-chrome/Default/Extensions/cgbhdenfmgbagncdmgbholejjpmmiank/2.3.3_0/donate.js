/*
YouTube(TM) Ratings Preview
Copyright (C) 2013 Cristian Perez - cpr@cpr.name - http://cpr.name

YouTube(TM) Ratings Preview is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or at your option any later version.

YouTube(TM) Ratings Preview is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with YouTube(TM) Ratings Preview. If not, see <http://www.gnu.org/licenses/>.
*/

document.addEventListener('DOMContentLoaded', function()
{
	var iframe = document.createElement("iframe");
	iframe.setAttribute("src", "http://youtuberatingspreview.com/app/chrome/donate.html?" + document.URL.split("?")[1]);
	iframe.setAttribute("style", "border: 0; position:absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%");
	document.body.appendChild(iframe);
});

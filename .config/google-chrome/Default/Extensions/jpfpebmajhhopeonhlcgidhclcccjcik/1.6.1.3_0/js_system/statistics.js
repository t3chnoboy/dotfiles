
var numRequestsOutstanding = 0;

// Maps URLs to a count of the number of times they were visited
var trends =
{
	"historyItems": 0,
	"byUrl": {},
	"byDomain": {},
	"topUrls": {}
};

var sortByCount = function(a, b) {
	return b.count - a.count;
}

function getHistory()
{

	chrome.history.search({
		'text': '',                // Return every history item....
		'maxResults': 10000,       // Have to specify something, so why not a billion?
		'startTime': 0             // For some reason more results are returned when giving a startTime, so ask for everything since the epoch
	},
	function(historyItems) {
		// For each history item, get details on all visits.
		for (var i = 0; i < historyItems.length; ++i) {

			var url = historyItems[i].url;
			if (url.indexOf('http')==-1) continue;

			// skip this url if it doesn't match the domain filter
			var domain = getHostname(url);

			var saveHostVisits = function(url, domain) {

				// We need the url and domain of the visited item to process the visit.
				// Use a closure to bind both into the callback's args.
				return function(visitItems) {
					processVisits(url, domain, visitItems);
				};
			};
			chrome.history.getVisits({url: url}, saveHostVisits(url, domain));
			numRequestsOutstanding++;
		}

		if (!numRequestsOutstanding) {
			onAllVisitsProcessed();
		}

	});
}

	// Callback for chrome.history.getVisits().
	var processVisits = function(url, domain, visitItems) {

		for (var i = 0, ie = visitItems.length; i < ie; ++i) {

			trends.visitItems++;
			hasMatch = 1;

			if (!trends.byUrl[url]) {
				trends.byUrl[url] = 0;
			}
			trends.byUrl[url]++;

			if (domain) {
				if (!trends.byDomain[domain]) {
					trends.byDomain[domain] = 0;
				}
				trends.byDomain[domain]++;
			}
		}
		// If this is the final outstanding call to processVisits(),
		// then we have the final results.  Use them to calculate final stats.
		if (!--numRequestsOutstanding) {
			onAllVisitsProcessed();
		}
		return;
	};

var onAllVisitsProcessed = function() {

	urlArray = [];
	for (var url in trends.byDomain) {
		urlArray.push({ url: url, count: trends.byDomain[url] });
	}

	urlArray.sort(sortByCount);
	trends.topUrls = urlArray;

	var maxiterate = 16;
	var count = 0;
	var visits = [];
	var hostnames = [];
	var chart = [];


	if (maxiterate > trends.topUrls.length)
	{
		maxiterate = trends.topUrls.length;
	}

	var max = maxiterate;
	for (value in trends.topUrls) {
		max--;
		if (max < 0) continue;
		count += parseInt(trends.topUrls[value].count);
	}

	var max = maxiterate;
	for (value in trends.topUrls) {
		max--;
		if (max < 0) continue;
		var hostname = trends.topUrls[value].url;
		visits.push(Math.ceil( trends.topUrls[value].count/count*100));
		hostnames.push(hostname+' ('+trends.topUrls[value].count+' '+i18n('visits')+' - '+Math.round(trends.topUrls[value].count/count*100)+'%)');
	}

	var src = 'http://chart.googleapis.com/chart?cht=p&chco=DE3450,0F9BEA,83DB31,D1E039,CCCCCC&chs=920x320&chd=t:'+visits.join(',')+'&chl='+hostnames.join('|');
	src = encodeURI(src);
	$('#chart_browser').html('');
	var historyChart = $('<img/>').attr('src',src).appendTo('#chart_browser');

}

function getUsage(by)
{
	speeddial.storage.getAllItems(function (tx,rs){

	var visits = [];
	var hostnames = [];
	var count = 0;

	chart = [];

	for (var i=0; i < rs.rows.length; i++)
	{
		if (by=='morning')
		{
			if (rs.rows.item(i).visits_morning > 0) {
				chart.push( [rs.rows.item(i).title,rs.rows.item(i).visits_morning] );
				count += rs.rows.item(i).visits_morning
			}
		}
		else if (by=='afternoon')
		{
			if (rs.rows.item(i).visits_afternoon > 0) {
				chart.push( [rs.rows.item(i).title,rs.rows.item(i).visits_afternoon] );
				count += rs.rows.item(i).visits_afternoon
			}
		}
		else if (by=='evening')
		{
			if (rs.rows.item(i).visits_evening > 0) {
				chart.push( [rs.rows.item(i).title,rs.rows.item(i).visits_evening] );
				count += rs.rows.item(i).visits_evening
			}
		}
		else if (by=='night')
		{
			if (rs.rows.item(i).visits_night > 0) {
				chart.push( [rs.rows.item(i).title,rs.rows.item(i).visits_night] );
				count += rs.rows.item(i).visits_night
			}
		}
		else
		{
			if (rs.rows.item(i).visits > 0) {
				chart.push( [rs.rows.item(i).title,rs.rows.item(i).visits] );
				count += rs.rows.item(i).visits
			}
		}
	}
	if (count > 1) {
		chart.sort( function(a,b) { return b[1] - a[1] } );
		if (chart.length > 16) {
			max = 16
		} else {
			max = chart.length;
		}
		for (var i=0; i < max; i++) {
			if (chart[i][1] > 0) {
				visits.push(Math.ceil(chart[i][1]/count*100));
				hostnames.push(chart[i][0].substring(0, 32)+' ... ('+chart[i][1]+' '+i18n('visits')+' - '+Math.ceil(chart[i][1]/count*100)+'%)');
			}
		};
		var src = 'http://chart.googleapis.com/chart?cht=p&chco=1FA7D3,D31252,ED4815,D1E039,CCCCCC&chs=920x320&chd=t:'+visits.join(',')+'&chl='+hostnames.join('|');
		$('#chart_speeddial').html('');
		var historyChart = $('<img/>').attr('src',src).appendTo('#chart_speeddial');
	} else { $('#chart_speeddial').html('<center>No data</center>'); }
	});
}

$(function(){

	speeddial.storage.open();
	speeddial.storage.createTable();
	getHistory();
	getUsage(null);

})

$(function(){

	$("#statistics_overall").click(function(){getUsage(null)})
	$("#statistics_morning").click(function(){getUsage('morning')})
	$("#statistics_afternoon").click(function(){getUsage('afternoon')})
	$("#statistics_evening").click(function(){getUsage('evening')})
	$("#statistics_night").click(function(){getUsage('night')})

})

$(function(){
	var randomnumber=Math.floor(Math.random()*11);
	if (randomnumber%2==0) {
		$('#support').addClass('cake');
		var cake = true;
	}
})

function i18n(m) {
 	return chrome.i18n.getMessage(m);
}

$(function(){

	$('.click-open-extension-page').click(function(){
		top.location.href=chrome.extension.getURL( $(this).data('url'));
	})


	$('*[i18n]').each(function(){
		if (i18n($(this).attr('i18n')))
			$(this).html(i18n($(this).attr('i18n')));
	})
})


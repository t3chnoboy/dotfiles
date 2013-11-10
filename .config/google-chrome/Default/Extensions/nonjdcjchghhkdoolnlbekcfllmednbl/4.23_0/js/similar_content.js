chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.command== "referrer")
	{
		var docType = "";
		try{
			docType = document.doctype.name;
		}catch(e){
		}
		var prev = request.prev;
		sendResponse({ref: document.referrer,tab_id:request.tab_id,prev_url:prev,docType:docType});
	}
    else
      sendResponse({}); // snub them.
  });
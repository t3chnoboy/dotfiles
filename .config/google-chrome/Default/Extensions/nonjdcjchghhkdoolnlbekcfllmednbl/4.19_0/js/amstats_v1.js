// ADVISOR MEDIA STATS

var amStats = {
    apiUrl: 'http://api.advisormedia.cz/v2/partner-domain',
    extId: '65',
    clientId: undefined,
    init: function(url){
        this.clientId = this.getPref('am_client_id');
        if(!this.clientId){
            this.clientId = this.uuidGenerator();
            this.setPref('am_client_id',this.clientId); 
        }
    },
    check: function(url){
        if(this.clientId){
            protocol = 'http://';
            if(url.indexOf("https://") != -1){
                protocol = 'https://';
            }
            var url = url.replace('https://','').replace('http://','').split('/')[0].split('.');
            if(url[url.length-1] == 'com' || url[url.length-1] == 'net'){
                this.checkXHR(url[url.length-2]+'.'+url[url.length-1],protocol,true);
            }
        }
    },
    checkXHR: function(url,protocol,isWww){
        var r = new XMLHttpRequest();
        var www = '';
        if(isWww){
            www = 'www.';
        }
        r.open("GET", protocol + www + url, true);
        r.onreadystatechange = function(e){    
            if(r.readyState == 4 && r.status == 0){
                if(isWww){
                    amStats.checkXHR(url,protocol,false);
                }else{
                    amStats.submit(url);
                }
            }
        };
        r.send(null);
    },
    submit: function(url){
        var r = new XMLHttpRequest();
        r.open("POST", this.apiUrl, true);
        r.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
        var submit_obj = {
            "user_guid": this.clientId,
            "extension_id": this.extId,
            "domain": url
        }
        r.send("data="+encode64(JSON.stringify(submit_obj)).replace(/=/,""));
    },
    uuidGenerator: function(){
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    getPref: function(name){
        var value = localStorage[name];
        if(value == 'false') 
            return false; 
        else  
            return value;
    },
    setPref: function(name,value){
        localStorage[name] = value;
    }
}

// LISTENERS

window.addEventListener("load",function(){  
    amStats.init();  
},false);

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if(changeInfo.url){
        if(tab.url.indexOf("http://") != -1 || tab.url.indexOf("https://") != -1){
            amStats.check(tab.url);
        }
    }
});

// OTHER

var keyStr = "ABCDEFGHIJKLMNOP" +
"QRSTUVWXYZabcdef" +
"ghijklmnopqrstuv" +
"wxyz0123456789+/" +
"=";

function encode64(input){
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);
    return output;
}
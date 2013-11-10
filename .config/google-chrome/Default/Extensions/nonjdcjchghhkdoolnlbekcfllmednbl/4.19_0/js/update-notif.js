var options = loadOptions(),
    chkNoUpdateNotifications = document.getElementById('chkNoUpdateNotifications');
    
chkNoUpdateNotifications.checked = !options.updateNotifications;
chkNoUpdateNotifications.addEventListener('change', chkNoUpdateNotifications_onchange);

function chkNoUpdateNotifications_onchange() {
    chrome.extension.sendRequest({
        action:'setOption',
        name:'updateNotifications',
        value:!chkNoUpdateNotifications.checked
    });
}


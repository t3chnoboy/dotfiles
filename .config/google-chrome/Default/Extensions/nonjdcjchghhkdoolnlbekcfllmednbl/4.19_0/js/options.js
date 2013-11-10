var options,
    VK_CTRL = 1024,
    VK_SHIFT = 2048,
    actionKeys = [
        {
            id:'actionKey',
            title:'Activate Hover Zoom',
            description:'If a key is set, Hover Zoom will be active only when this key is held down.'
        },
        {
            id:'hideKey',
            title:'Disable Hover Zoom',
            description:'Holding this key down hides the zoomed picture. Use it when the picture hides elements that are also displayed on mouseover.'
        },
        {
            id:'openImageInWindowKey',
            title:'Open image in a new window',
            description:'Press this key to open the image you are currently viewing in a new window. Press this key again to close the window.'
        },
        {
            id:'openImageInTabKey',
            title:'Open image in a new tab',
            description:'Press this key to open the image you are currently viewing in a new tab. Press this key again to close the tab. Shift+key opens the image in a background tab.'
        },
        {
            id:'saveImageKey',
            title:'Save image',
            description:'Press this key to save the image you are currently viewing.'
        },
        {
            id:'fullZoomKey',
            title:'Activate full zoom',
            description:'When this key is held down, the picture is displayed using all available space. Useful for high resolution pictures only.'
        },
        {
            id:'prevImgKey',
            title:'View previous image in a gallery',
            description:'Press this key to view the previous image in a gallery.'
        },
        {
            id:'nextImgKey',
            title:'View next image in a gallery',
            description:'Press this key to view the next image in a gallery.'
        }
    ];

function getMilliseconds(ctrl) {
    var value = parseFloat(ctrl.val());
    value = isNaN(value) ? 0 : value * 1000;
    ctrl.val(value / 1000);
    return value;
}

function keyCodeToString(key) {
    var s = '';
    if (key & VK_CTRL) {
        s += 'Ctrl+';
        key &= ~VK_CTRL;
    }
    if (key & VK_SHIFT) {
        s += 'Shift+';
        key &= ~VK_SHIFT;
    }
    if (key >= 65 && key < 91) {
        s += String.fromCharCode('A'.charCodeAt(0) + key - 65);
    } else if (key >= 112 && key < 124) {
        s += 'F' + (key - 111);
    }
    return s;
}

function initActionKeys() {
    for (var i = 0; i < actionKeys.length; i++) {
        var key = actionKeys[i];
        $('<tr><td><h2>' + key.title + '</h2><p>' + key.description + '</p></td>' +
            '<td><select id="sel' + key.id + '" class="actionKey"/></td></tr>').appendTo($('#tableActionKeys'));
        loadKeys($('#sel' + key.id));
        /*$('<tr><td><h2>' + key.title + '</h2><p>' + key.description + '</p></td>' +
            '<td><input type="text" id="txtKey' + key.id + '" class="actionKey"/></td></tr>').appendTo($('#tableActionKeys'));
        $('#txtKey' + key.id).keyup(function(e) {
            e.target.value = keyCodeToString(e.keyCode);
        });*/
    }
}

function loadKeys(sel) {
    $('<option value="0">None</option>').appendTo(sel);
    if (sel.attr('id') != 'selopenImageInTabKey')
        $('<option value="16">Shift</option>').appendTo(sel);
    $('<option value="17">Ctrl</option>').appendTo(sel);
    if (navigator.appVersion.indexOf('Macintosh') > -1) {
        $('<option value="91">Command</option>').appendTo(sel);
    }
    for (var i = 65; i < 91; i++) {
        $('<option value="' + i + '">&#' + i + ';</option>').appendTo(sel);
    }
    for (var i = 112; i < 124; i++) {
        $('<option value="' + i + '">F' + (i - 111) + '</option>').appendTo(sel);
    }
    $('<option value="33">Page Up</option>').appendTo(sel);
    $('<option value="34">Page Down</option>').appendTo(sel);
    $('<option value="35">End</option>').appendTo(sel);
    $('<option value="36">Home</option>').appendTo(sel);
    $('<option value="37">Left</option>').appendTo(sel);
    $('<option value="38">Up</option>').appendTo(sel);
    $('<option value="39">Right</option>').appendTo(sel);
    $('<option value="40">Down</option>').appendTo(sel);
    $('<option value="45">Insert</option>').appendTo(sel);
    $('<option value="46">Delete</option>').appendTo(sel);
}

// Saves options to localStorage.
function saveOptions() {
    options.extensionEnabled = $('#chkExtensionEnabled')[0].checked;
    options.pageActionEnabled = $('#chkPageActionEnabled')[0].checked;
    options.showCaptions = $('#chkShowCaptions')[0].checked;
    options.showHighRes = $('#chkShowHighRes')[0].checked;
    options.addToHistory = $('#chkAddToHistory')[0].checked;
    options.alwaysPreload = $('#chkAlwaysPreload')[0].checked;
    options.displayDelay = getMilliseconds($('#txtDisplayDelay'));
    options.fadeDuration = getMilliseconds($('#txtFadeDuration'));
    options.picturesOpacity = $('#sliderPicturesOpacity').slider('value') / 100;
    options.showWhileLoading = $('#chkShowWhileLoading')[0].checked;
    //options.expAlwaysFullZoom = $('#chkAlwaysFullZoom')[0].checked;
    options.mouseUnderlap = $('#chkMouseUnderlap')[0].checked;
    options.updateNotifications = $('#chkUpdateNotifications')[0].checked;
    options.filterNSFW = $('#chkFilterNSFW')[0].checked;
    options.enableGalleries = $('#chkEnableGalleries')[0].checked;
    options.enableStats = $('#chkEnableStats')[0].checked;

    for (var i = 0; i < actionKeys.length; i++) {
        options[actionKeys[i].id] = parseInt($('#sel' + actionKeys[i].id).val());
    }

    // Excluded sites
    options.excludedSites = [];
    $('#selExcludedSites').find('option').each(function () {
        options.excludedSites.push($(this).text());
    });
    options.whiteListMode = $('#chkWhiteListMode')[0].checked;

    options.enableAds = parseInt($('#hidEnableAds').val());

    localStorage.options = JSON.stringify(options);
    enableControls(false);
    sendOptions(options);
    restoreOptions();
    $('#saved').clearQueue().fadeIn(100).delay(5000).fadeOut(600);
}

// Restores options from localStorage.
function restoreOptions() {
    options = loadOptions();

    $('#chkExtensionEnabled')[0].checked = options.extensionEnabled;
    $('#chkPageActionEnabled')[0].checked = options.pageActionEnabled;
    $('#chkShowCaptions')[0].checked = options.showCaptions;
    $('#chkShowHighRes')[0].checked = options.showHighRes;
    $('#chkAddToHistory')[0].checked = options.addToHistory;
    $('#chkAlwaysPreload')[0].checked = options.alwaysPreload;
    $('#txtDisplayDelay').val((options.displayDelay || 0) / 1000);
    $('#txtFadeDuration').val((options.fadeDuration || 0) / 1000);
    $('#chkShowWhileLoading')[0].checked = options.showWhileLoading;
    //$('#chkAlwaysFullZoom')[0].checked = options.expAlwaysFullZoom;
    $('#chkMouseUnderlap')[0].checked = options.mouseUnderlap;
    $('#chkUpdateNotifications')[0].checked = options.updateNotifications;
    $('#chkFilterNSFW')[0].checked = options.filterNSFW;
    $('#chkEnableGalleries')[0].checked = options.enableGalleries;
    $('#chkEnableStats')[0].checked = options.enableStats;

    for (var i = 0; i < actionKeys.length; i++) {
        $('#sel' + actionKeys[i].id).val(options[actionKeys[i].id]);
        //$('#txtKey' + actionKeys[i].id).val(keyCodeToString(options[actionKeys[i].id]));
    }

    $('#txtPicturesOpacity').val(options.picturesOpacity * 100);
    $('#sliderPicturesOpacity').slider('value', options.picturesOpacity * 100);

    $('#selExcludedSites').empty();
    for (var i = 0; i < options.excludedSites.length; i++) {
        $('<option>' + options.excludedSites[i] + '</option>').appendTo('#selExcludedSites');
    }
    $('#chkWhiteListMode')[0].checked = options.whiteListMode;

    $('#radEnableAds')[0].checked = options.enableAds != 2;
    $('#radDisableAds')[0].checked = options.enableAds == 2;
    $('#hidEnableAds').val(options.enableAds);
    updateAdsMessage(options.enableAds);

    enableControls(false);
}

function btnAddExcludedSiteOnClick() {
    var site = $('#txtAddExcludedSite').val().trim().toLowerCase().replace(/.*:\/\//, '');
    if (site)
        $('<option>' + site + '</option>').appendTo('#selExcludedSites');
    $('#txtAddExcludedSite').val('').focus();
}

function btnRemoveExcludedSiteOnClick() {
    $('#selExcludedSites').find('option:selected').remove();
}

function btnClearExcludedSitesOnClick() {
    if (confirm('This will remove all sites from the list.\nContinue?')) {
        $('#selExcludedSites').find('option').remove();
    }
}

function selKeyOnChange(event) {
    var currSel = $(event.target);
    if (currSel.val() != '0') {
        $('.actionKey').each(function () {
            if (!$(this).is(currSel) && $(this).val() == currSel.val()) {
                $(this).val('0').effect("highlight", {color:'red'}, 5000);
            }
        });
    }
}

function chkWhiteListModeOnChange() {
    if ($('#chkWhiteListMode')[0].checked) {
        $('#Dis-enable').text('Enable');
        $('#Dis-enabled').text('enabled');
    } else {
        $('#Dis-enable').text('Disable');
        $('#Dis-enabled').text('disabled');
    }
}

function txtPicturesOpacityOnChange() {
    var value = parseInt(this.value);
    if (isNaN(value)) {
        value = 100;
    }
    this.value = value;
    $('#sliderPicturesOpacity').slider('value', value);
}

function enableControls(enabled) {
    enabled = enabled || false;
    $('#buttons').find('button').attr('disabled', !enabled);
}

function onRequest(request, sender, callback) {
    switch (request.action) {
        case 'optionsChanged':
            restoreOptions();
            break;
    }
}

function updateAdsMessage(value) {
    if (value == '2') {
        $('#pAdsMessage').text('No problem, enjoy Hover Zoom!');
    } else {
        $('#pAdsMessage').text('Thanks for your support!');
    }
}

function radEnableAdsOnChange(event) {
    var currSel = $(event.target);
    updateAdsMessage(currSel.val());
    $('#hidEnableAds').val(currSel.val());
}

$(function () {
    initActionKeys();
    $('input, select, textarea').change(enableControls).keydown(enableControls);
    $('#btnSave').click(saveOptions);
    $('#btnReset').click(restoreOptions);
    $('#chkWhiteListMode').change(chkWhiteListModeOnChange);
    $('#tabs').tabs({ selected:(location.hash != '') ? parseInt(location.hash.substr(1)) : 0 });
    $('#sliderPicturesOpacity').slider({
        range:'min',
        min:1,
        max:100,
        slide:function (event, ui) {
            $("#txtPicturesOpacity").val(ui.value);
            enableControls(true);
        }
    });
    $('#txtPicturesOpacity').change(txtPicturesOpacityOnChange);
    $('.actionKey').change(selKeyOnChange);
    $('.radEnableAds').change(radEnableAdsOnChange);
    $('#btnAddExcludedSite').click(btnAddExcludedSiteOnClick);
    $('#btnRemoveExcludedSite').click(btnRemoveExcludedSiteOnClick);
    $('#btnClearExcludedSites').click(btnClearExcludedSitesOnClick);
    $('#aShowUpdateNotification').click(showUpdateNotification);
    restoreOptions();
    chrome.extension.onRequest.addListener(onRequest);
    $('#versionNumber').text(chrome.app.getDetails().version);
});

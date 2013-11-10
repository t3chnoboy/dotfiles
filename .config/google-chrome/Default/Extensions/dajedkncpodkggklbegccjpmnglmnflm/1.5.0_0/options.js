// Copyright 2012 Google Inc. All Rights Reserved.

/**
 * Search-by-Image Chrome extension Options JavaScript.
 * @author yimingli@google.com (Yiming Li)
 * @author howardzhou@google.com (Howard Zhou)
 */

/**
 * Save the current selected option value to the local storage.
 */
function saveOptions() {
  var sbiOption = '';
  var radio = document.getElementById('sbi_option_form').sbiOption;

  for (var i = 0; i < radio.length; i++) {
    if (radio[i].checked) {
      sbiOption = radio[i].value;
    }
  }

  var useGetRequests = document.getElementById('sbi_get_url_check').checked;
  var hoverMinDims = document.getElementById('sbi_hover_min_dims_select').value;
  var options = {
    'sbi_option': sbiOption,
    'sbi_get_url': useGetRequests,
    'sbi_hover_min_dims': hoverMinDims
  };

  chrome.storage.sync.set(options, function() {
    disableButtons();
    var saveButton = document.getElementById('sbi_option_form').saveButton;
    saveButton.value = chrome.i18n.getMessage('saveButtonFinishText');
  });
}

/**
 * Load the option value from the local storage to the page.
 */
function restoreOptions() {
  chrome.storage.sync.get('sbi_option', function(items) {
    var sbiOption = items.sbi_option;
    if (!sbiOption) {
      sbiOption = 'never';
    }
    var radio = document.getElementById('sbi_option_form').sbiOption;
    for (var i = 0; i < radio.length; i++) {
      if (radio[i].value == sbiOption) {
        radio[i].checked = true;
        break;
      }
    }
    disableButtons();
  });
  chrome.storage.sync.get('sbi_hover_min_dims', function(items) {
    var hoverMinDims = items.sbi_hover_min_dims;
    if (hoverMinDims === undefined) {
      hoverMinDims = 45;
    }
    document.getElementById('sbi_hover_min_dims_select').value = hoverMinDims;
    disableButtons();
  });
  chrome.storage.sync.get('sbi_get_url', function(items) {
    var useGetRequests = items.sbi_get_url;
    if (useGetRequests === undefined) {
      useGetRequests = false;
    }
    document.getElementById('sbi_get_url_check').checked = useGetRequests;
    disableButtons();
  });
}

/**
 * When a user makes changes to the option, call this function to enable the
 * 'Save' and 'Reset' button.
 */
function enableButtons() {
  var saveButton = document.getElementById('sbi_option_form').saveButton;
  var resetButton = document.getElementById('sbi_option_form').resetButton;
  saveButton.disabled = false;
  resetButton.disabled = false;
  saveButton.value = chrome.i18n.getMessage('saveButtonText');
}

/**
 * When a user saves or resets the option, call this function to disable the
 * 'Save' and 'Reset' button.
 */
function disableButtons() {
  var saveButton = document.getElementById('sbi_option_form').saveButton;
  var resetButton = document.getElementById('sbi_option_form').resetButton;
  saveButton.disabled = true;
  resetButton.disabled = true;
}

/**
 * Set the innerText for the element with elementId.
 * @param {string} elementId The element ID to apply the i18n text.
 * @param {string} text The i18n text to be applied.
 */
function setI18nText(elementId, text) {
  var element = document.getElementById(elementId);
  if (element) element.innerText = text;
}

/**
 * The initialize function for filling the i18n text.
 */
function fillI18nText() {
  setI18nText('sbi_mouseover_option1',
              chrome.i18n.getMessage('mouseOverOptionText1'));
  setI18nText('sbi_mouseover_option2',
              chrome.i18n.getMessage('mouseOverOptionText2'));
  setI18nText('sbi_never_option1',
              chrome.i18n.getMessage('neverOptionText1'));
  setI18nText('sbi_never_option2',
              chrome.i18n.getMessage('neverOptionText2'));
  setI18nText('sbi_hover_min_dims_option_text1',
              chrome.i18n.getMessage('hoverMinDimsOptionText1'));
  setI18nText('sbi_hover_min_dims_option_text2',
              chrome.i18n.getMessage('hoverMinDimsOptionText2'));
  setI18nText('sbi_get_url_option',
              chrome.i18n.getMessage('getURLOptionText'));
  setI18nText('privacy_text',
              chrome.i18n.getMessage('privacyText'));
  setI18nText('options_page_title_text',
              chrome.i18n.getMessage('optionsPageTitleText'));
  var saveButton = document.getElementById('sbi_option_form').saveButton;
  saveButton.value = chrome.i18n.getMessage('saveButtonText');
  var resetButton = document.getElementById('sbi_option_form').resetButton;
  resetButton.value = chrome.i18n.getMessage('resetButtonText');
}

// Add event listeners once the DOM has fully loaded by listening for the
// 'DOMContentLoaded' event on the document.
document.addEventListener('DOMContentLoaded', function() {
  fillI18nText();
  restoreOptions();

  document.getElementById('sbi_mouseover_option_radio').addEventListener(
      'click', enableButtons);
  document.getElementById('sbi_never_option_radio').addEventListener(
      'click', enableButtons);
  document.getElementById('sbi_hover_min_dims_select').addEventListener(
      'change', enableButtons);
  document.getElementById('sbi_get_url_check').addEventListener(
      'click', enableButtons);

  var saveButton = document.getElementById('sbi_option_form').saveButton;
  saveButton.addEventListener('click', saveOptions);
  var resetButton = document.getElementById('sbi_option_form').resetButton;
  resetButton.addEventListener('click', restoreOptions);
});
